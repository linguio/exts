import { useCallback, useEffect, useState } from 'react';
import type { AccountProvider, AccountUser } from './account-controller';

async function request(action: 'get' | 'login' | 'logout', provider?: AccountProvider): Promise<AccountUser | null> {
  const response = await chrome.runtime.sendMessage({ type: 'exts:account', action, provider });
  if (!response?.ok) {
    const error = new Error(response?.error || '账户请求失败') as Error & { code?: string };
    error.code = response?.code;
    throw error;
  }
  return response.user;
}
export const loginAccount = (provider: AccountProvider) => request('login', provider);
export const logoutAccount = () => request('logout');

export function useAccount() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const refetch = useCallback(async () => {
    try { setUser(await request('get')); setError(null); }
    catch (error) {
      const next = error instanceof Error ? error : new Error('暂时无法确认账户状态，请重试');
      if ('code' in next && next.code === 'session-expired') setUser(null);
      setError(previous => previous?.message === next.message ? previous : next);
    }
    finally { setPending(false); }
  }, []);
  useEffect(() => {
    void refetch();
    const changed = (message: { type?: string }) => { if (message.type === 'exts:account:changed') void refetch(); };
    const focused = () => { void refetch(); };
    chrome.runtime.onMessage.addListener(changed);
    window.addEventListener('focus', focused);
    return () => { chrome.runtime.onMessage.removeListener(changed); window.removeEventListener('focus', focused); };
  }, [refetch]);
  return { user, isPending, error, refetch };
}
