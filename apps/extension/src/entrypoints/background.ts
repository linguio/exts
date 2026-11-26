import { defineBackground } from 'wxt/utils/define-background';
import { getAccounts } from '../api/accounts';
import { ApiRequestError, createApiClient } from '../api/client';
import { resolveApiBaseUrl } from '../api/config';

import { registerHistoryCleaner } from '../features/history-cleaner/background';
import { registerSettings } from '../features/settings/background';
import { registerDownloads } from '../features/media-download/records/background';
import { registerAccount } from '../features/account/background';
import { AccountSessionExpiredError } from '../features/account/account-controller';
import { registerDictionaries } from '../features/dictionaries/background';
import { registerActivity } from '../features/activity/background';
import { createSessionReset } from '../features/account/session-reset';

export default defineBackground(() => {
  const session = createSessionReset();
  const account = registerAccount(chrome, session);
  const getSession = () => account ? account.getSession() : Promise.reject(new AccountSessionExpiredError());
  const settings = registerSettings(getSession, () => account ? account.getStoredUserId() : Promise.resolve(null), chrome, session);
  registerActivity(getSession, chrome, session);
  registerDictionaries(getSession, chrome, session);
  registerDownloads(chrome, session);
  registerHistoryCleaner(chrome, settings);

  const accountsClient = createApiClient({
    baseUrl: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.DEV), getSession,
  });
  const pendingAccounts = new Map<string, AbortController>();
  session.onCancel(() => { for (const controller of pendingAccounts.values()) controller.abort(); });

  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (message?.type !== 'exts:accounts') return;
    if (sender.id !== chrome.runtime.id || sender.url?.split(/[?#]/)[0] !== chrome.runtime.getURL('newtab.html')) {
      respond({ ok: false, code: 'FORBIDDEN' });
      return;
    }
    const { requestId, action, pageIndex, pageSize, email, name, startDate, endDate, userId, generation } = message;
    if (typeof requestId !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(requestId)) {
      respond({ ok: false, code: 'INVALID_REQUEST' });
      return;
    }
    const key = `${sender.documentId ?? sender.tab?.id ?? 'page'}:${requestId}`;
    if (action === 'cancel') {
      pendingAccounts.get(key)?.abort();
      respond({ ok: true });
      return;
    }
    if (action !== 'list' || pendingAccounts.has(key) || typeof userId !== 'string'
      || !Number.isSafeInteger(pageIndex) || pageIndex < 0
      || !Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100
      || [email, name].some(value => typeof value !== 'string' || value.length > 254 || value.includes('\0'))
      || [startDate, endDate].some(value => value !== undefined && (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)))) {
      respond({ ok: false, code: 'INVALID_REQUEST' });
      return;
    }
    if (!session.accepts(generation)) {
      respond({ ok: false, code: 'SESSION_CHANGED' });
      return;
    }
    const currentGeneration = session.generation;
    const controller = new AbortController();
    pendingAccounts.set(key, controller);
    void getAccounts(accountsClient, { pageIndex, pageSize, email, name, startDate, endDate }, userId, controller.signal).then(data => {
      respond(session.isCurrent(currentGeneration) ? { ok: true, data } : { ok: false, code: 'SESSION_CHANGED' });
    }, error => {
      const code = !session.isCurrent(currentGeneration) ? 'SESSION_CHANGED'
        : error instanceof ApiRequestError ? error.code : 'REQUEST_FAILED';
      respond({ ok: false, code });
    }).finally(() => pendingAccounts.delete(key));
    return true;
  });
});
