import { ApiRequestError, createApiClient, type ApiSession } from '../../api/client';
import { resolveApiBaseUrl } from '../../api/config';
import { getDictionaryGroups, getDictionaryItems, type DictionaryQuery } from '../../api/dictionaries';
import type { SessionReset } from '../account/session-reset';

function readQuery(message: Record<string, unknown>): DictionaryQuery | undefined {
  const { action, pageIndex, pageSize, groupId } = message;
  if (action === 'groups' && typeof pageIndex === 'number' && Number.isSafeInteger(pageIndex) && pageIndex >= 0
    && typeof pageSize === 'number' && Number.isSafeInteger(pageSize) && pageSize >= 1 && pageSize <= 100) {
    return { action, pageIndex, pageSize };
  }
  if (action === 'items' && typeof groupId === 'string'
    && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(groupId)) {
    return { action, groupId };
  }
}

export function registerDictionaries(getSession: () => Promise<ApiSession>, api: typeof chrome, session: SessionReset) {
  const client = createApiClient({
    baseUrl: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.DEV), getSession,
  });
  const pending = new Map<string, AbortController>();
  session.onCancel(() => { for (const controller of pending.values()) controller.abort(); });

  api.runtime.onMessage.addListener((message, sender, respond) => {
    if (message?.type !== 'exts:dictionaries') return;
    if (sender.id !== api.runtime.id || sender.url?.split(/[?#]/)[0] !== api.runtime.getURL('newtab.html')) {
      respond({ ok: false, error: { code: 'FORBIDDEN' } });
      return;
    }
    if (typeof message.requestId !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(message.requestId)) {
      respond({ ok: false, error: { code: 'INVALID_REQUEST' } });
      return;
    }
    const key = `${sender.documentId ?? sender.tab?.id ?? 'page'}:${message.requestId}`;
    if (message.action === 'cancel') {
      pending.get(key)?.abort();
      respond({ ok: true });
      return;
    }
    const query = readQuery(message);
    if (!query || pending.has(key) || typeof message.userId !== 'string') {
      respond({ ok: false, error: { code: 'INVALID_REQUEST' } });
      return;
    }
    if (!session.accepts(message.generation)) {
      respond({ ok: false, error: { code: 'SESSION_CHANGED' } });
      return;
    }

    const generation = session.generation;
    const controller = new AbortController();
    pending.set(key, controller);
    const request = query.action === 'groups'
      ? getDictionaryGroups(client, query.pageIndex, query.pageSize, message.userId, controller.signal)
      : getDictionaryItems(client, query.groupId, message.userId, controller.signal);

    void request.then(data => {
      respond(session.isCurrent(generation) ? { ok: true, data } : { ok: false, error: { code: 'SESSION_CHANGED' } });
    }, error => {
      const code = !session.isCurrent(generation) ? 'SESSION_CHANGED'
        : error instanceof ApiRequestError ? error.code : 'REQUEST_FAILED';
      respond({ ok: false, error: { code } });
    }).finally(() => pending.delete(key));
    return true;
  });
}
