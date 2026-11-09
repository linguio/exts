import { expect, it, vi } from 'vitest';
import { preserveQueryTotal, runTableQuery } from '../../../../src/components/custom/data-table/query-request';
import { DataTableQueryError, type DataTableQueryRequest } from '../../../../src/components/custom/data-table/types';

const request: DataTableQueryRequest = { pageIndex: 2, pageSize: 20, sort: [], filters: {} };

it('失败占位保留上次 total，避免分页归零触发额外查询', () => {
  expect(preserveQueryTotal({ rows: [{ id: '1' } as never], total: 87 })).toBe(87);
  expect(preserveQueryTotal(undefined)).toBe(0);
});

it('取消在途查询不触发 onError', async () => {
  const onSuccess = vi.fn();
  const onError = vi.fn();
  const cancel = runTableQuery(async (_request, signal) => {
    await new Promise<void>(resolve => {
      signal.addEventListener('abort', () => resolve(), { once: true });
    });
    return { rows: [], total: 0 };
  }, request, onSuccess, onError);
  cancel();
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(onError).not.toHaveBeenCalled();
  expect(onSuccess).not.toHaveBeenCalled();
});

it('无效响应走 onError 且使用 DataTableQueryError', async () => {
  const onError = vi.fn();
  const firstPage: DataTableQueryRequest = { pageIndex: 0, pageSize: 20, sort: [], filters: {} };
  await new Promise<void>(resolve => {
    runTableQuery(async () => ({ rows: [{ id: 'row-1' }], total: 10 }), firstPage, vi.fn(), error => {
      onError(error);
      resolve();
    });
  });
  expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid table response' }));
});
