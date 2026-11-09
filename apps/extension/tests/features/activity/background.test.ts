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
  expect(respond).toHaveBeenCalledWith({ ok: false, error: { code: 'FORBIDDEN', message: 'Activity requests must come from the extension new tab.' } });
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
    error: { code: 'SESSION_CHANGED', message: 'Account changed. Try again.' } }));
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

it('更新请求只转发扁平 id 与时长字段，非法参数不请求 HTTP', async () => {
  const { listener, sender, fetcher } = setup();
  const respond = vi.fn();
  listener({ type: 'exts:activity', action: 'update', requestId: 'update-1', userId: 'user-1',
    id: '00000000-0000-4000-8000-000000000010', exerciseHours: 0.5 }, sender, respond);
  await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
  expect(fetcher.mock.calls[0]![0]).toMatchObject({ url: 'http://127.0.0.1:8000/api/activity/days/update', method: 'POST' });
  expect(await (fetcher.mock.calls[0]![0] as Request).clone().json()).toEqual({
    id: '00000000-0000-4000-8000-000000000010', exerciseHours: 0.5,
  });
  listener({ type: 'exts:activity', action: 'update', requestId: 'update-2', userId: 'user-1', id: 'bad' }, sender, respond);
  expect(respond).toHaveBeenLastCalledWith({ ok: false, error: { code: 'INVALID_REQUEST', message: 'Activity record id is missing or invalid.' } });
  listener({ type: 'exts:activity', action: 'update', requestId: 'update-3', userId: 'user-1',
    id: '00000000-0000-4000-8000-000000000011', exerciseHours: 0, readingHours: 0, learningHours: 0, creationHours: 0, sleepHours: 0 }, sender, respond);
  await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
  expect(await (fetcher.mock.calls[1]![0] as Request).clone().json()).toEqual({
    id: '00000000-0000-4000-8000-000000000011',
    exerciseHours: 0, readingHours: 0, learningHours: 0, creationHours: 0, sleepHours: 0,
  });
  expect(fetcher).toHaveBeenCalledTimes(2);
});

it('分页与多字段排序只转发白名单业务参数，非法参数不请求 HTTP', async () => {
  const { listener, sender, fetcher } = setup();
  const respond = vi.fn();
  listener({ ...request, startDate: undefined, endDate: undefined, pageIndex: 1, pageSize: 20,
    sort: [{ field: 'exerciseHours', order: 'desc' }, { field: 'date', order: 'asc' }] }, sender, respond);
  await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
  expect(await (fetcher.mock.calls[0]![0] as Request).clone().json()).toEqual({ pageIndex: 1, pageSize: 20,
    sort: [{ field: 'exerciseHours', order: 'desc' }, { field: 'date', order: 'asc' }] });
  for (const invalid of [{ pageIndex: 0 }, { pageIndex: 0, pageSize: 101 },
    { sort: [{ field: 'userId', order: 'asc' }] }, { sort: [{ field: 'date', order: 'asc' }, { field: 'date', order: 'desc' }] }]) {
    listener({ ...request, requestId: 'invalid', ...invalid }, sender, respond);
    expect(respond).toHaveBeenLastCalledWith(expect.objectContaining({ ok: false }));
  }
  expect(fetcher).toHaveBeenCalledTimes(1);
});
