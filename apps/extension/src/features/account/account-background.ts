import { UserManager, WebStorageStateStore, type INavigator } from 'oidc-client-ts';
import { AccountSessionExpiredError, createAccountController, type AccountProvider } from './account-controller';
import { createAuthStorage } from './auth-storage';
import { revokeOAuthToken } from './revoke-oauth-token';
import { mergeUserInfo, readUserInfo } from './user-info';
import { removeNeonSessionCookie } from './remove-session-cookie';
import type { SessionReset } from './session-reset';
import { withTelegramReset } from '../media-download/telegram/reset-background';

const authority = 'https://ep-patient-grass-ak8aymgi.neonauth.c-3.us-west-2.aws.neon.tech/neondb/auth';
const clientId = import.meta.env.VITE_OIDC_CLIENT_ID?.trim();

/** 仅用片段传递本次登录选择，不修改标准库创建的授权请求。 */
export function createLoginStartUrl(authorize: string, provider: AccountProvider) {
  const url = new URL('https://exts.linguio.dev/auth/sign-in/');
  url.hash = new URLSearchParams({ provider, authorize }).toString();
  return url.href;
}

/** 退出页只接收固定插件回跳，不传递令牌或会话 Cookie。 */
export function createLogoutStartUrl(redirect: string) {
  const url = new URL('https://exts.linguio.dev/auth/sign-out/');
  url.hash = new URLSearchParams({ return: redirect }).toString();
  return url.href;
}

export function registerAccount(api: typeof chrome = chrome, session?: SessionReset) {
  const storage = createAuthStorage();
  let loginProvider: AccountProvider = 'github';
  const navigator: INavigator = {
    prepare: async () => ({
      navigate: async ({ url }) => {
        const response = await api.identity.launchWebAuthFlow({ url: createLoginStartUrl(url, loginProvider), interactive: true });
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
    signinPopup: async ({ provider, ...args }) => {
      // 控制器串行执行登录，在授权窗口完成前不切换提供方。
      loginProvider = provider;
      try {
        const user = await manager.signinPopup(args);
        await withProfile(user);
        return user;
      } finally { loginProvider = 'github'; }
    },
    signinSilent: () => manager.signinSilent().then(withProfile),
    removeUser: () => manager.removeUser(),
    endSession: async () => {
      const expected = new URL(api.identity.getRedirectURL('logout'));
      const response = await api.identity.launchWebAuthFlow({ url: createLogoutStartUrl(expected.href), interactive: true });
      if (!response) throw new Error('退出未完成');
      const returned = new URL(response);
      if (returned.origin !== expected.origin || returned.pathname !== expected.pathname || returned.search || returned.hash) throw new Error('退出回跳地址不匹配');
      await removeNeonSessionCookie(api.cookies, authority);
    },
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
    if (message?.type !== 'exts:account' && message?.type !== 'exts:session:generation') return;
    if (sender.id !== api.runtime.id || sender.url?.split('?')[0] !== api.runtime.getURL('newtab.html')) { respond({ ok: false, error: '账户请求来源无效' }); return; }
    if (message.type === 'exts:session:generation') { respond({ ok: true, generation: session?.generation }); return; }
    const action = message.action;
    if (!['get', 'login', 'logout'].includes(action)) { respond({ ok: false, error: '未知账户操作' }); return; }
    if (session && action !== 'get' && !session.accepts(message.generation)) {
      respond({ ok: false, error: '会话已变更，请重试' }); return;
    }
    const provider = message.provider ?? 'github';
    if (action === 'login' && provider !== 'github' && provider !== 'google') { respond({ ok: false, error: '未知登录提供方' }); return; }
    if (!controller) { respond(action === 'get' ? { ok: true, user: null, generation: session?.generation } : { ok: false, error: '尚未配置 OIDC Client ID，请先完成 Neon 配置并重新构建' }); return; }
    if (action === 'get' && session?.resetting) { respond({ ok: true, user: null, generation: session.generation }); return; }
    let resetStarted = false;
    let resetStage: 'cleanup' | 'auth' = 'cleanup';
    const resetOperation = async (kind: 'login' | 'logout') => {
      if (kind === 'login') {
        try { if (await controller.get()) throw new Error('请先退出当前账户'); }
        catch (error) { if (!(error instanceof AccountSessionExpiredError)) throw error; }
      }
      await session?.begin();
      resetStarted = true;
      try {
        return await withTelegramReset(async () => {
          await api.storage.local.clear();
          const cleared = await api.runtime.sendMessage({ type: 'exts:session:clear-theme' });
          if (!cleared?.ok) throw new Error('主题偏好清理失败');
          if (kind === 'login') {
            await storage.clear();
            resetStage = 'auth';
            try { return await controller.login(provider); }
            catch (error) { await storage.clear(); throw error; }
          }
          resetStage = 'auth';
          const result = await controller.logout();
          await storage.clear();
          return result;
        }, api);
      } finally { session?.finish(); }
    };
    const operation = action === 'get' ? controller.get : action === 'login' ? () => resetOperation('login') : () => resetOperation('logout');
    void operation().then(user => {
      respond({ ok: true, user, generation: session?.generation });
      if (action !== 'get') void api.runtime.sendMessage({ type: 'exts:account:changed', reset: true, user, generation: session?.generation }).catch(() => {});
    }, error => {
      // 原始认证错误可能包含授权码或令牌，仅返回固定提示。
      if (action === 'get') {
        const expired = error instanceof AccountSessionExpiredError;
        console.error('Studio 账户状态读取失败', { category: expired ? 'session-expired' : 'request-failed' });
        respond({ ok: false, code: expired ? 'session-expired' : 'state-unavailable', error: expired ? '登录已失效，请重新登录' : '暂时无法确认账户状态，请重试' });
        return;
      }
      if (resetStarted) void api.runtime.sendMessage({ type: 'exts:account:changed', reset: true, resetDelayMs: 1500,
        generation: session?.generation }).catch(() => {});
      const cancelled = error instanceof Error && /cancel|closed|did not approve/i.test(error.message);
      console.error('Studio OIDC 操作失败', { action, category: cancelled ? 'cancelled' : 'request-failed' });
      respond({ ok: false, error: action === 'logout'
        ? '退出未完成，请重试'
        : (resetStage === 'cleanup' ? '本地状态清理失败，请重试' : cancelled ? '已取消登录' : '认证请求失败，请重试并检查 OAuth Provider 配置') });
    });
    return true;
  });
  return controller;
}
