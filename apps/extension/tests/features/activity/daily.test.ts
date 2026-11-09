import { beforeEach, expect, it, vi } from 'vitest';
import { ApiRequestError } from '../../../src/api/client';
import { requestActivity } from '../../../src/features/activity/requests';
import { dailyActivityRequest, queryDailyRecords } from '../../../src/features/activity/daily/query';

vi.mock('../../../src/features/activity/requests', () => ({ requestActivity: vi.fn() }));
beforeEach(() => vi.mocked(requestActivity).mockReset());
const request = { pageIndex: 0, pageSize: 20, sort: [{ field: 'readingHours', order: 'asc' as const }],
  filters: { date: { from: '2026-11-01', to: '2026-11-09' } } };

it('资源适配仅映射业务日期和已标准化排序，不再持有查询状态', () => {
  expect(dailyActivityRequest(request)).toEqual({ pageIndex: 0, pageSize: 20, sort: request.sort,
    startDate: '2026-11-01', endDate: '2026-11-09' });
  expect(dailyActivityRequest({ ...request, sort: [], filters: {} })).toEqual({ pageIndex: 0, pageSize: 20, sort: [] });
  expect(() => dailyActivityRequest({ ...request, sort: [{ field: 'invalid', order: 'asc' }] })).toThrow();
});

it('通过已有消息请求转交取消信号，校验后统一返回 rows 和 total', async () => {
  const day = { id: '00000000-0000-4000-8000-000000000010', userId: 'user-1', date: '2026-11-02', exerciseHours: null, readingHours: 0,
    learningHours: 1, creationHours: null, sleepHours: null,
    createdAt: '2026-11-02T00:00:00+08:00', updatedAt: '2026-11-02T09:00:00+08:00' };
  vi.mocked(requestActivity).mockResolvedValue({ days: [day], total: 1, pageIndex: 0, pageSize: 20 });
  const signal = new AbortController().signal;
  await expect(queryDailyRecords(request, 'user-1', signal)).resolves.toEqual({ rows: [day], total: 1 });
  expect(requestActivity).toHaveBeenCalledWith(dailyActivityRequest(request), 'user-1', signal);
});

it('保留接口安全错误，拒绝不完整响应', async () => {
  const signal = new AbortController().signal;
  vi.mocked(requestActivity).mockRejectedValueOnce(new ApiRequestError('UNAUTHENTICATED', 'Please sign in'));
  await expect(queryDailyRecords(request, 'user-1', signal)).rejects.toMatchObject({ name: 'DataTableQueryError', message: 'Please sign in' });
  vi.mocked(requestActivity).mockResolvedValueOnce({ days: [], total: 1, pageIndex: 0, pageSize: 20 });
  await expect(queryDailyRecords(request, 'user-1', signal)).rejects.toMatchObject({ name: 'DataTableQueryError', message: '活动数据格式无效' });
});
