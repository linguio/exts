import { expect, it, vi } from 'vitest';
import { createSessionReset } from '../../../src/features/account/session-reset';

const fixture = vi.hoisted(() => {
  const order: string[] = [];
  const manager = {
    getUser: vi.fn(async () => null),
    signinPopup: vi.fn(async () => {
      order.push('authenticate');
      return { expired: false, profile: { sub: 'same-user', name: 'User' } };
    }),
  };
  const authStorage = { clear: vi.fn(async () => { order.push('clear-auth'); }) };
  return { order, manager, authStorage };
});

vi.mock('oidc-client-ts', () => ({
  UserManager: class { constructor() { return fixture.manager; } },
  WebStorageStateStore: class {},
}));
vi.mock('../../../src/features/account/auth-storage', () => ({ createAuthStorage: () => fixture.authStorage }));
vi.mock('../../../src/features/media-download/telegram/reset-background', () => ({
  withTelegramReset: async (operation: () => Promise<unknown>) => {
    fixture.order.push('clear-telegram');
    return operation();
  },
}));

it('主动登录先清理旧本地状态，再建立新会话；恢复状态不清理', async () => {
  vi.stubEnv('VITE_OIDC_CLIENT_ID', 'test-public-client');
  const { registerAccount } = await import('../../../src/features/account/account-background');
  const listeners: ((message: any, sender: any, respond: (value: any) => void) => void)[] = [];
  const api = {
    runtime: { id: 'exts', getURL: (path: string) => `chrome-extension://exts/${path}`,
      onMessage: { addListener: (listener: typeof listeners[number]) => listeners.push(listener) },
      sendMessage: vi.fn(async (message: { type: string }) => {
        if (message.type === 'exts:session:clear-theme') fixture.order.push('clear-theme');
        return { ok: true };
      }) },
    identity: { getRedirectURL: () => 'https://exts.chromiumapp.org/auth' },
    storage: { local: { clear: vi.fn(async () => { fixture.order.push('clear-local'); }) } },
  };
  const session = createSessionReset();
  const oldGeneration = session.generation;
  registerAccount(api as unknown as typeof chrome, session);
  const listener = listeners[0]!;
  const sender = { id: 'exts', url: 'chrome-extension://exts/newtab.html', documentId: 'old-document' };
  const ask = (action: string) => new Promise<any>(resolve => listener({ type: 'exts:account', action,
    generation: session.generation }, sender, resolve));
  expect(await ask('get')).toMatchObject({ ok: true, user: null });
  expect(fixture.order).toEqual([]);
  expect(await ask('login')).toMatchObject({ ok: true, user: { id: 'same-user' } });
  expect(fixture.order).toEqual(['clear-telegram', 'clear-local', 'clear-theme', 'clear-auth', 'authenticate']);
  expect(session.accepts(oldGeneration)).toBe(false);

  const attempts = fixture.manager.signinPopup.mock.calls.length;
  api.storage.local.clear.mockRejectedValueOnce(new Error('storage unavailable'));
  const nextSender = { ...sender, documentId: 'new-document' };
  const failed = await new Promise<any>(resolve => listener({ type: 'exts:account', action: 'login',
    generation: session.generation }, nextSender, resolve));
  expect(failed).toEqual({ ok: false, error: '本地状态清理失败，请重试' });
  expect(fixture.manager.signinPopup).toHaveBeenCalledTimes(attempts);

  fixture.authStorage.clear.mockClear();
  fixture.manager.signinPopup.mockRejectedValueOnce(new Error('cancelled'));
  const cancelled = await new Promise<any>(resolve => listener({ type: 'exts:account', action: 'login', generation: session.generation },
    { ...sender, documentId: 'third-document' }, resolve));
  expect(cancelled).toEqual({ ok: false, error: '已取消登录' });
  expect(fixture.authStorage.clear).toHaveBeenCalledTimes(2);
});
