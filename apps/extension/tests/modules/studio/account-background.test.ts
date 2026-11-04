import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

async function setup(clientId: string) {
  vi.stubEnv('VITE_OIDC_CLIENT_ID', clientId);
  const { registerAccount } = await import('../../../src/modules/studio/services/account-background');
  const addListener = vi.fn();
  const api = {
    runtime: { id: 'exts', getURL: (path: string) => `chrome-extension://exts/${path}`, onMessage: { addListener } },
    identity: { getRedirectURL: () => 'https://exts.chromiumapp.org/auth' },
  };
  registerAccount(api as unknown as typeof chrome);
  return addListener.mock.calls[0]![0];
}

it('未配置客户端时保持访客可用，登录明确提示缺少配置', async () => {
  const listener = await setup('');
  const sender = { id: 'exts', url: 'chrome-extension://exts/newtab.html' };
  const respond = vi.fn();
  listener({ type: 'exts:account', action: 'get' }, sender, respond);
  expect(respond).toHaveBeenLastCalledWith({ ok: true, user: null });
  listener({ type: 'exts:account', action: 'login' }, sender, respond);
  expect(respond.mock.lastCall?.[0]).toMatchObject({ ok: false });
});

it('真实 OIDC 客户端可在无 DOM 后台初始化，内容脚本无法调用账户操作', async () => {
  const listener = await setup('test-public-client');
  const respond = vi.fn();
  listener({ type: 'exts:account', action: 'get' }, { id: 'exts', url: 'https://example.com' }, respond);
  expect(respond).toHaveBeenCalledWith({ ok: false, error: '账户请求来源无效' });
});
