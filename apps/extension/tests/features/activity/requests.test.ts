import { afterEach, expect, it, vi } from 'vitest';
import { requestActivity } from '../../../src/features/activity/requests';

const period = { startDate: '2026-11-01', endDate: '2026-11-06' };
afterEach(() => vi.unstubAllGlobals());

it('后台没有响应或消息发送失败时报告消息通道故障，不冒充 HTTP 错误', async () => {
  const sendMessage = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('private bridge failure'));
  vi.stubGlobal('chrome', { runtime: { sendMessage } });
  for (let index = 0; index < 2; index++) {
    await expect(requestActivity(period, 'user-1', new AbortController().signal)).rejects.toMatchObject({ code: 'BACKGROUND_UNAVAILABLE' });
  }
});

it('保留后台已分类的认证错误，正常响应直接交给数据适配', async () => {
  const sendMessage = vi.fn().mockResolvedValueOnce({ ok: false, error: { code: 'SESSION_EXPIRED', message: '登录已失效', status: 401 } })
    .mockResolvedValueOnce({ ok: true, data: { days: [] } });
  vi.stubGlobal('chrome', { runtime: { sendMessage } });
  await expect(requestActivity(period, 'user-1', new AbortController().signal)).rejects.toMatchObject({ code: 'SESSION_EXPIRED', status: 401 });
  await expect(requestActivity(period, 'user-1', new AbortController().signal)).resolves.toEqual({ days: [] });
});
