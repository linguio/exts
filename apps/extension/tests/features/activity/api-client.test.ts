import { afterEach, expect, it, vi } from 'vitest';
import { createApiClient } from '../../../src/api/client';
import { resolveApiBaseUrl } from '../../../src/api/config';

const session = { userId: 'user-1', accessToken: 'fixture-access' };
const options = { expectedUserId: 'user-1' };
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

it('取会话失败时不发 HTTP，区分认证不可用与网络失败', async () => {
  const fetcher = vi.fn<typeof fetch>();
  vi.stubGlobal('fetch', fetcher);
  const client = createApiClient({ baseUrl: 'http://127.0.0.1:8000',
    getSession: async () => { throw new Error('private auth failure'); } });
  await expect(client.request('/api/activity/days', options)).rejects.toMatchObject({ code: 'AUTH_UNAVAILABLE' });
  expect(fetcher).not.toHaveBeenCalled();
});

it('只允许已知 API，业务统一 POST，后台设置认证头并禁用缓存', async () => {
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ data: { days: [] } }));
  vi.stubGlobal('fetch', fetcher);
  const client = createApiClient({ baseUrl: resolveApiBaseUrl(undefined, true), getSession: async () => session });
  await expect(client.request('/api/activity/days', options)).resolves.toEqual({ days: [] });
  await client.request('/api/activity/days', options);
  expect(fetcher).toHaveBeenCalledTimes(2);
  const request = fetcher.mock.calls[0]![0] as Request;
  expect(request.url).toBe('http://127.0.0.1:8000/api/activity/days');
  expect(request.method).toBe('POST');
  expect(request.headers.get('Authorization')).toBe('Bearer fixture-access');
  expect(request.headers.get('Content-Type')).toBe('application/json');
  expect(request.cache).toBe('no-store');
  expect(request.credentials).toBe('omit');
  expect(request.redirect).toBe('error');
  expect(await request.clone().json()).toEqual({});
  expect(() => resolveApiBaseUrl('https://attacker.example')).toThrow();
  expect(() => resolveApiBaseUrl('http://127.0.0.1:9000')).toThrow();
  await expect(client.request('https://attacker.example', options)).rejects.toMatchObject({ code: 'INVALID_REQUEST' });
});

it('Axios 序列化 JSON，统一解析后端错误和排错标识', async () => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ data: {} }))
    .mockResolvedValueOnce(Response.json({ error: { code: 'DATABASE_UNAVAILABLE', message: 'private upstream' } },
      { status: 503, headers: { 'X-Request-ID': 'test-request' } }));
  vi.stubGlobal('fetch', fetcher);
  const client = createApiClient({ baseUrl: 'http://127.0.0.1:8000', getSession: async () => session });
  await client.request('/fixture', { ...options, method: 'POST', json: { value: 1 } });
  expect(await (fetcher.mock.calls[0]![0] as Request).clone().json()).toEqual({ value: 1 });
  await expect(client.request('/fixture', options)).rejects.toMatchObject({
    code: 'DATABASE_UNAVAILABLE', status: 503, requestId: 'test-request', message: '数据加载失败，请稍后重试',
  });
});

it('拒绝账号变更与旧响应，不复用刷新前身份', async () => {
  const getSession = vi.fn().mockResolvedValue({ ...session, userId: 'other' }).mockResolvedValueOnce(session);
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ data: { days: [] } }));
  vi.stubGlobal('fetch', fetcher);
  const client = createApiClient({ baseUrl: 'http://127.0.0.1:8000', getSession });
  await expect(client.request('/fixture', options)).rejects.toMatchObject({ code: 'SESSION_CHANGED' });
  await expect(client.request('/fixture', options)).rejects.toMatchObject({ code: 'SESSION_CHANGED' });
  expect(fetcher).toHaveBeenCalledTimes(1);
});

it('区分网络失败、无效响应、调用方取消与请求超时', async () => {
  const fetcher = vi.fn<typeof fetch>().mockRejectedValueOnce(new Error('private network details'))
    .mockResolvedValueOnce(new Response('not json'));
  vi.stubGlobal('fetch', fetcher);
  const client = createApiClient({ baseUrl: 'http://127.0.0.1:8000', getSession: async () => session });
  await expect(client.request('/fixture', options)).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  await expect(client.request('/fixture', options)).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  const cancelled = new AbortController();
  cancelled.abort();
  await expect(client.request('/fixture', { ...options, signal: cancelled.signal })).rejects.toMatchObject({ code: 'CANCELLED' });
  vi.useFakeTimers();
  const waitForAbort: typeof fetch = async (input) => new Promise((_resolve, reject) => {
    const signal = (input as Request).signal;
    signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true });
  });
  vi.stubGlobal('fetch', waitForAbort);
  const slow = createApiClient({ baseUrl: 'http://127.0.0.1:8000', getSession: async () => session, timeoutMs: 100 });
  const result = expect(slow.request('/fixture', options)).rejects.toMatchObject({ code: 'TIMEOUT' });
  await vi.advanceTimersByTimeAsync(101);
  await result;
});
