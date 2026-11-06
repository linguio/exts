import { ApiRequestError, createApiClient, type ApiSession } from '../../lib/api/client';
import { resolveApiBaseUrl } from '../../lib/api/config';
import { validActivityDate } from './data';

export function registerActivity(getSession: () => Promise<ApiSession>, api: typeof chrome = chrome) {
  const client = createApiClient({
    baseUrl: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.DEV), getSession,
  });
  const pending = new Map<string, AbortController>();
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
    const controller = new AbortController();
    pending.set(key, controller);
    void client.request('/api/activity/days', {
      method: 'POST', json: { startDate: message.startDate, endDate: message.endDate },
      expectedUserId: message.userId, signal: controller.signal,
    }).then(data => respond({ ok: true, data }), error => {
      const safe = error instanceof ApiRequestError ? error : new ApiRequestError('REQUEST_FAILED', '活动请求失败');
      if (safe.code !== 'CANCELLED') console.error('Activity 请求失败', { code: safe.code, status: safe.status, requestId: safe.requestId });
      respond({ ok: false, error: { code: safe.code, message: safe.message, status: safe.status, requestId: safe.requestId } });
    }).finally(() => pending.delete(key));
    return true;
  });
}
