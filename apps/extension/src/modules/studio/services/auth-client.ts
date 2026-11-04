import { useCallback, useEffect, useState } from 'react';
import type { AccountProvider, AccountUser } from './account-controller';

async function request(action: 'get' | 'login' | 'logout', provider?: AccountProvider): Promise<AccountUser | null> {
  const response = await chrome.runtime.sendMessage({ type: 'exts:account', action, provider });
  if (!response?.ok) throw new Error(response?.error || '账户请求失败');
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
    catch (error) { setError(error instanceof Error ? error : new Error('无法读取账户')); }
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
