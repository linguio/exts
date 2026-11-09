import { useCallback, useEffect, useState } from 'react';
import type { AccountProvider, AccountUser } from './account-controller';
import { resetTheme } from '../settings/theme';
import { refreshSettings } from '../settings';
import { captureSessionGeneration, rememberSessionGeneration } from './session-client';

let resetVersion = 0;
const resetListeners = new Set<() => void>();
const accountListeners = new Set<(user: AccountUser | null | undefined) => void>();
let listening = false;

/** 每个 Newtab 只处理一次后台账号消息，不导航或重建页面。 */
function ensureListening(): void {
  if (!listening) {
    listening = true;
    chrome.runtime.onMessage.addListener((message: { type?: string; reset?: boolean; resetDelayMs?: number;
      generation?: string; user?: AccountUser | null },
      _sender, respond) => {
      if (message.type === 'exts:session:clear-theme') {
        try { resetTheme(); respond({ ok: true }); }
        catch { respond({ ok: false }); }
      }
      if (message.type === 'exts:account:changed' && message.reset) {
        rememberSessionGeneration(message.generation);
        window.setTimeout(() => {
          resetVersion++;
          for (const subscriber of resetListeners) subscriber();
          for (const subscriber of accountListeners) subscriber('user' in message ? message.user : undefined);
        }, message.resetDelayMs ?? 0);
      }
    });
  }
}

export function subscribeSessionReset(listener: () => void): () => void {
  ensureListening();
  resetListeners.add(listener);
  return () => { resetListeners.delete(listener); };
}

export const readSessionResetVersion = () => resetVersion;

async function request(action: 'get' | 'login' | 'logout', provider?: AccountProvider): Promise<AccountUser | null> {
  const before = resetVersion;
  const generation = action === 'get' ? undefined : await captureSessionGeneration();
  const response = await chrome.runtime.sendMessage({ type: 'exts:account', action, provider, generation });
  if (!response?.ok) {
    const error = new Error(response?.error || 'Account request failed.') as Error & { code?: string };
    error.code = response?.code;
    throw error;
  }
  if (before === resetVersion) rememberSessionGeneration(response.generation);
  return response.user;
}
export async function loginAccount(provider: AccountProvider) {
  const user = await request('login', provider);
  if (user) void refreshSettings().catch(() => {});
  return user;
}
export const logoutAccount = () => request('logout');

export function useAccount() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const refetch = useCallback(async () => {
    const before = resetVersion;
    try {
      const next = await request('get');
      if (before !== resetVersion) return;
      setUser(next);
      setError(null);
    }
    catch (error) {
      if (before !== resetVersion) return;
      const next = error instanceof Error ? error : new Error('Unable to verify account status. Please try again.');
      if ('code' in next && next.code === 'session-expired') setUser(null);
      setError(previous => previous?.message === next.message ? previous : next);
    }
    finally { if (before === resetVersion) setPending(false); }
  }, []);
  useEffect(() => {
    ensureListening();
    const changed = (next: AccountUser | null | undefined) => {
      if (next === undefined) { void refetch(); return; }
      setUser(next);
      setError(null);
      setPending(false);
    };
    accountListeners.add(changed);
    void refetch();
    const focused = () => { void refetch(); };
    window.addEventListener('focus', focused);
    return () => { accountListeners.delete(changed); window.removeEventListener('focus', focused); };
  }, [refetch]);
  return { user, isPending, error, refetch };
}
