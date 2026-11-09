import { ApiRequestError, createApiClient, type ApiSession } from '../../api/client';
import { resolveApiBaseUrl } from '../../api/config';
import { getActivityDays, updateActivityDay } from '../../api/activity';
import { validActivityQuery } from './data/query';
import { parseActivityDayUpdate } from './data/update-validation';
import type { SessionReset } from '../account/session-reset';

export function registerActivity(getSession: () => Promise<ApiSession>, api: typeof chrome = chrome, session?: SessionReset) {
  const client = createApiClient({
    baseUrl: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.DEV), getSession,
  });
  const pending = new Map<string, AbortController>();
  session?.onCancel(() => { for (const controller of pending.values()) controller.abort(); });
  api.runtime.onMessage.addListener((message, sender, respond) => {
    if (message?.type !== 'exts:activity') return;
    if (sender.id !== api.runtime.id || sender.url?.split(/[?#]/)[0] !== api.runtime.getURL('newtab.html')) {
      respond({ ok: false, error: { code: 'FORBIDDEN', message: 'Activity requests must come from the extension new tab.' } });
      return;
    }
    if (typeof message.requestId !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(message.requestId)) {
      respond({ ok: false, error: { code: 'INVALID_REQUEST', message: 'Activity request id is invalid.' } });
      return;
    }
    const key = `${sender.documentId ?? sender.tab?.id ?? 'page'}:${message.requestId}`;
    if (message.action === 'cancel') {
      pending.get(key)?.abort();
      respond({ ok: true });
      return;
    }
    if (message.action === 'update') {
      if (pending.has(key)) {
        respond({ ok: false, error: { code: 'INVALID_REQUEST', message: 'An activity update is already in progress.' } });
        return;
      }
      if (typeof message.userId !== 'string') {
        respond({ ok: false, error: { code: 'INVALID_REQUEST', message: 'Activity update requires a signed-in user.' } });
        return;
      }
      const parsed = parseActivityDayUpdate(message as Record<string, unknown>);
      if (!parsed.ok) {
        respond({ ok: false, error: { code: 'INVALID_REQUEST', message: parsed.message } });
        return;
      }
      if (session && !session.accepts(message.generation)) {
        respond({ ok: false, error: { code: 'SESSION_CHANGED', message: 'Account changed. Try again.' } });
        return;
      }
      const generation = session?.generation;
      const controller = new AbortController();
      pending.set(key, controller);
      void updateActivityDay(client, parsed.update, message.userId, controller.signal).then(
        () => respond(generation && !session?.isCurrent(generation)
          ? { ok: false, error: { code: 'SESSION_CHANGED', message: 'Account changed. Try again.' } } : { ok: true }),
        error => {
          if (generation && !session?.isCurrent(generation)) {
            respond({ ok: false, error: { code: 'SESSION_CHANGED', message: 'Account changed. Try again.' } });
            return;
          }
          const safe = error instanceof ApiRequestError ? error : new ApiRequestError('REQUEST_FAILED', 'Activity request failed.');
          if (safe.code !== 'CANCELLED') console.error('Activity 更新失败', { code: safe.code, status: safe.status, requestId: safe.requestId });
          respond({ ok: false, error: { code: safe.code, message: safe.message, status: safe.status, requestId: safe.requestId } });
        }).finally(() => pending.delete(key));
      return true;
    }
    if (message.action !== 'get' || !validActivityQuery(message) || typeof message.userId !== 'string' || pending.has(key)) {
      respond({ ok: false, error: { code: 'INVALID_REQUEST', message: 'Activity query parameters are invalid.' } });
      return;
    }
    if (session && !session.accepts(message.generation)) {
      respond({ ok: false, error: { code: 'SESSION_CHANGED', message: 'Account changed. Try again.' } });
      return;
    }
    const generation = session?.generation;
    const controller = new AbortController();
    pending.set(key, controller);
    void getActivityDays(client, { startDate: message.startDate, endDate: message.endDate, pageIndex: message.pageIndex, pageSize: message.pageSize, sort: message.sort }, message.userId, controller.signal).then(data => respond(generation && !session?.isCurrent(generation)
      ? { ok: false, error: { code: 'SESSION_CHANGED', message: 'Account changed. Try again.' } } : { ok: true, data }), error => {
      if (generation && !session?.isCurrent(generation)) {
        respond({ ok: false, error: { code: 'SESSION_CHANGED', message: 'Account changed. Try again.' } });
        return;
      }
      const safe = error instanceof ApiRequestError ? error : new ApiRequestError('REQUEST_FAILED', 'Activity request failed.');
      if (safe.code !== 'CANCELLED') console.error('Activity 请求失败', { code: safe.code, status: safe.status, requestId: safe.requestId });
      respond({ ok: false, error: { code: safe.code, message: safe.message, status: safe.status, requestId: safe.requestId } });
    }).finally(() => pending.delete(key));
    return true;
  });
}
