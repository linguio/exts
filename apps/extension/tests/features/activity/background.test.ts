import { afterEach, expect, it, vi } from 'vitest';
import { registerActivity } from '../../../src/features/activity/background';
import { createSessionReset } from '../../../src/features/account/session-reset';

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

function setup(session?: ReturnType<typeof createSessionReset>) {
  vi.stubEnv('VITE_API_BASE_URL', 'http://127.0.0.1:8000');
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ data: { days: [] } }));
  vi.stubGlobal('fetch', fetcher);
  const addListener = vi.fn();
  const getSession = vi.fn(async () => ({ userId: 'user-1', accessToken: 'fixture-access' }));
  registerActivity(getSession, { runtime: {
    id: 'exts', getURL: (path: string) => `chrome-extension://exts/${path}`, onMessage: { addListener },
  } } as unknown as typeof chrome, session);
  const listener = addListener.mock.calls[0]![0];
  const sender = { id: 'exts', url: 'chrome-extension://exts/newtab.html', documentId: 'document-1' };
  return { fetcher, getSession, listener, sender };
}

const request = { type: 'exts:activity', action: 'get', requestId: 'request-1',
  userId: 'user-1', startDate: '2026-11-01', endDate: '2026-11-06' };

it('内容脚本不能代理认证请求，页面无法指定任意 URL 或读取令牌', async () => {
  const { listener, sender, fetcher } = setup();
  const respond = vi.fn();
  listener(request, { ...sender, url: 'https://attacker.example' }, respond);
  expect(respond).toHaveBeenCalledWith({ ok: false, error: { code: 'FORBIDDEN', message: '活动请求来源无效' } });
  expect(fetcher).not.toHaveBeenCalled();
  listener({ ...request, url: 'https://attacker.example' }, sender, respond);
  await vi.waitFor(() => expect(respond).toHaveBeenLastCalledWith({ ok: true, data: { days: [] } }));
  const httpRequest = fetcher.mock.calls[0]![0] as Request;
  expect(httpRequest.url).toBe('http://127.0.0.1:8000/api/activity/days');
  expect(httpRequest.method).toBe('POST');
  expect(await httpRequest.clone().json()).toEqual({ startDate: request.startDate, endDate: request.endDate });
  expect(httpRequest.headers.get('Content-Type')).toBe('application/json');
  expect(JSON.stringify(respond.mock.calls)).not.toContain('fixture-access');
});

it('同一用户重新登录后旧 Activity 请求不能返回成功', async () => {
  const session = createSessionReset();
  const { listener, sender, fetcher } = setup(session);
  let complete!: (response: Response) => void;
  fetcher.mockImplementationOnce(async () => new Promise<Response>(resolve => { complete = resolve; }));
  const respond = vi.fn();
  listener({ ...request, generation: session.generation }, sender, respond);
  await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
  await session.begin();
  session.finish();
  complete(Response.json({ data: { days: [] } }));
  await vi.waitFor(() => expect(respond).toHaveBeenCalledWith({ ok: false,
    error: { code: 'SESSION_CHANGED', message: '账号已变更' } }));
});

it('拒绝非法日期，取消仅影响同一发送页面的在途请求', async () => {
  const { listener, sender, fetcher } = setup();
  const respond = vi.fn();
  listener({ ...request, startDate: '2026-11-31' }, sender, respond);
  expect(respond).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
  expect(fetcher).not.toHaveBeenCalled();
  fetcher.mockImplementationOnce(async (input) => new Promise((_resolve, reject) => {
    (input as Request).signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true });
  }));
  listener(request, sender, respond);
  await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
  const signal = (fetcher.mock.calls[0]![0] as Request).signal;
  listener({ type: 'exts:activity', action: 'cancel', requestId: 'request-1' }, { ...sender, documentId: 'other' }, vi.fn());
  expect(signal.aborted).toBe(false);
  listener({ type: 'exts:activity', action: 'cancel', requestId: 'request-1' }, sender, vi.fn());
  await vi.waitFor(() => expect(respond).toHaveBeenLastCalledWith(expect.objectContaining({ ok: false, error: expect.objectContaining({ code: 'CANCELLED' }) })));
});
