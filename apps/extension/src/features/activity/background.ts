import { ApiRequestError, createApiClient, type ApiSession } from '../../api/client';
import { resolveApiBaseUrl } from '../../api/config';
import { getActivityDays } from '../../api/activity';
import { validActivityDate } from './data/date';
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
      respond({ ok: false, error: { code: 'FORBIDDEN', message: '活动请求来源无效' } });
      return;
    }
    if (typeof message.requestId !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(message.requestId)) {
      respond({ ok: false, error: { code: 'INVALID_REQUEST', message: '活动请求无效' } });
      return;
    }
    const key = `${sender.documentId ?? sender.tab?.id ?? 'page'}:${message.requestId}`;
    if (message.action === 'cancel') {
      pending.get(key)?.abort();
      respond({ ok: true });
      return;
    }
    if (message.action !== 'get' || !validActivityDate(message.startDate) || !validActivityDate(message.endDate)
      || message.startDate > message.endDate || typeof message.userId !== 'string' || pending.has(key)) {
      respond({ ok: false, error: { code: 'INVALID_REQUEST', message: '活动请求参数无效' } });
      return;
    }
    if (session && !session.accepts(message.generation)) {
      respond({ ok: false, error: { code: 'SESSION_CHANGED', message: '账号已变更' } });
      return;
    }
    const generation = session?.generation;
    const controller = new AbortController();
    pending.set(key, controller);
    void getActivityDays(client, { startDate: message.startDate, endDate: message.endDate }, message.userId, controller.signal).then(data => respond(generation && !session?.isCurrent(generation)
      ? { ok: false, error: { code: 'SESSION_CHANGED', message: '账号已变更' } } : { ok: true, data }), error => {
      if (generation && !session?.isCurrent(generation)) {
        respond({ ok: false, error: { code: 'SESSION_CHANGED', message: '账号已变更' } });
        return;
      }
      const safe = error instanceof ApiRequestError ? error : new ApiRequestError('REQUEST_FAILED', '活动请求失败');
      if (safe.code !== 'CANCELLED') console.error('Activity 请求失败', { code: safe.code, status: safe.status, requestId: safe.requestId });
      respond({ ok: false, error: { code: safe.code, message: safe.message, status: safe.status, requestId: safe.requestId } });
    }).finally(() => pending.delete(key));
    return true;
  });
}
