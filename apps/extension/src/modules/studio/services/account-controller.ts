export interface AccountUser { id: string; name: string; email: string; image: string | null }
export type AccountProvider = 'github' | 'google';
interface StoredUser { expired?: boolean; refresh_token?: string; profile: { sub: string; name?: unknown; email?: unknown; picture?: unknown } }
interface Manager {
  getUser(): Promise<StoredUser | null>;
  signinPopup(args: { nonce: string; prompt: 'consent'; provider: AccountProvider }): Promise<StoredUser>;
  signinSilent(): Promise<StoredUser | null>;
  revokeTokens(types: ('refresh_token' | 'access_token')[]): Promise<void>;
  endSession(): Promise<void>;
  removeUser(): Promise<void>;
}
export class AccountSessionExpiredError extends Error {
  readonly code = 'session-expired';
  constructor() { super('登录已失效，请重新登录'); }
}
/** 后台串行协调旋转刷新令牌，页面只接收展示资料。 */
export function createAccountController(manager: Manager) {
  let tail: Promise<unknown> = Promise.resolve();
  let pendingLogin: Promise<AccountUser> | null = null;
  function enqueue<T>(operation: () => Promise<T>) {
    const result = tail.then(operation); tail = result.catch(() => {}); return result;
  }
  function display(user: StoredUser | null): AccountUser | null {
    if (!user || user.expired) return null;
    const { sub, name, email, picture } = user.profile;
    return { id: sub, name: typeof name === 'string' ? name : '', email: typeof email === 'string' ? email : '', image: typeof picture === 'string' && picture.startsWith('https://') ? picture : null };
  }
  return {
    get: () => enqueue(async () => {
      let user = await manager.getUser();
      if (user?.expired) {
        if (!user.refresh_token) { await manager.removeUser(); throw new AccountSessionExpiredError(); }
        try { user = await manager.signinSilent(); }
        catch (error) {
          if (typeof error === 'object' && error !== null && 'error' in error && error.error === 'invalid_grant') { await manager.removeUser(); throw new AccountSessionExpiredError(); }
          throw error;
        }
      }
      return display(user);
    }),
    login: (provider: AccountProvider = 'github') => pendingLogin ??= enqueue(async () => {
      const user = display(await manager.signinPopup({ nonce: crypto.randomUUID(), prompt: 'consent', provider }));
      if (!user) throw new Error('未取得有效登录身份');
      return user;
    }).finally(() => { pendingLogin = null; }),
    logout: () => enqueue(async () => {
      const user = await manager.getUser();
      if (user?.refresh_token) await manager.revokeTokens(['refresh_token']);
      await manager.endSession();
      await manager.removeUser();
      return null;
    }),
  };
}
