import { UserManager, WebStorageStateStore, type INavigator } from 'oidc-client-ts';
import { createAccountController } from './account-controller';
import { createAuthStorage } from './auth-storage';
import { revokeOAuthToken } from './revoke-oauth-token';
import { mergeUserInfo, readUserInfo } from './user-info';
import { removeNeonSessionCookie } from './remove-session-cookie';

const authority = 'https://ep-patient-grass-ak8aymgi.neonauth.c-3.us-west-2.aws.neon.tech/neondb/auth';
const clientId = import.meta.env.VITE_OIDC_CLIENT_ID?.trim();

export function registerAccount(api: typeof chrome = chrome) {
  const storage = createAuthStorage();
  const navigator: INavigator = {
    prepare: async () => ({
      navigate: async ({ url }) => {
        const response = await api.identity.launchWebAuthFlow({ url, interactive: true });
        if (!response) throw new Error('登录已取消');
        const returned = new URL(response), expected = new URL(api.identity.getRedirectURL('auth'));
        if (returned.origin !== expected.origin || returned.pathname !== expected.pathname) throw new Error('登录回跳地址不匹配');
        return { url: response };
      },
      close: () => {},
    }),
    callback: async () => {},
  };
  // 未配置时不发出认证请求，不使用占位 Client ID。
  const manager = clientId ? new UserManager({
    authority, client_id: clientId, redirect_uri: api.identity.getRedirectURL('auth'),
    response_type: 'code', scope: 'openid profile email offline_access',
    resource: 'https://api.exts.linguio.dev', fetchRequestCredentials: 'omit',
    automaticSilentRenew: false, monitorSession: false, requestTimeoutInSeconds: 15,
    userStore: new WebStorageStateStore({ store: storage, prefix: 'user:' }),
    stateStore: new WebStorageStateStore({ store: storage, prefix: 'state:' }),
  }, undefined, navigator) : null;
  async function withProfile<T extends { access_token?: string; profile: { sub?: string; name?: unknown; email?: unknown; picture?: unknown } }>(user: T | null) {
    const hasProfile = [user?.profile?.name, user?.profile?.email, user?.profile?.picture].some(value => typeof value === 'string' && value);
    if (!user?.access_token || hasProfile) return user;
    const endpoint = await manager!.metadataService.getUserInfoEndpoint();
    if (!endpoint) return user;
    try {
      user.profile = mergeUserInfo(user.profile, await readUserInfo(endpoint, user.access_token));
      await manager!.storeUser(user as never);
    } catch (error) {
      console.error('Studio 用户信息读取失败', { category: error instanceof Error ? 'request-failed' : 'invalid-response' });
    }
    return user;
  }
  const controller = manager && clientId ? createAccountController({
    getUser: () => manager.getUser().then(withProfile),
    signinPopup: async args => {
      const user = await manager.signinPopup(args);
      await withProfile(user);
      return user;
    },
    signinSilent: () => manager.signinSilent().then(withProfile),
    removeUser: () => manager.removeUser(),
    endSession: () => removeNeonSessionCookie(api.cookies, authority),
    revokeTokens: async types => {
      const user = await manager.getUser();
      const endpoint = await manager.metadataService.getRevocationEndpoint();
      if (!endpoint) throw new Error('撤销刷新令牌失败');
      for (const tokenType of types) {
        const token = user?.[tokenType];
        if (typeof token !== 'string' || !token) continue;
        await revokeOAuthToken({ endpoint, clientId, token, tokenType });
      }
    },
  }) : null;
  api.runtime.onMessage.addListener((message, sender, respond) => {
    if (message?.type !== 'exts:account') return;
    if (sender.id !== api.runtime.id || sender.url?.split('?')[0] !== api.runtime.getURL('newtab.html')) { respond({ ok: false, error: '账户请求来源无效' }); return; }
    const action = message.action;
    if (!['get', 'login', 'logout'].includes(action)) { respond({ ok: false, error: '未知账户操作' }); return; }
    if (!controller) { respond(action === 'get' ? { ok: true, user: null } : { ok: false, error: '尚未配置 OIDC Client ID，请先完成 Neon 配置并重新构建' }); return; }
    const operation = action === 'get' ? controller.get : action === 'login' ? controller.login : controller.logout;
    void operation().then(user => {
      respond({ ok: true, user });
      if (action !== 'get') void api.runtime.sendMessage({ type: 'exts:account:changed' }).catch(() => {});
    }, error => {
      // 原始认证错误可能包含授权码或令牌，仅返回固定提示。
      const cancelled = error instanceof Error && /cancel|closed|did not approve/i.test(error.message);
      console.error('Studio OIDC 操作失败', { action, category: cancelled ? 'cancelled' : 'request-failed' });
      respond({ ok: false, error: action === 'logout'
        ? '退出未完成，请重试'
        : (cancelled ? '已取消登录' : '认证请求失败，请重试并检查 OAuth Provider 配置') });
    });
    return true;
  });
}
