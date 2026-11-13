import { expect, it, vi } from 'vitest';
import { preserveQueryTotal, runTableQuery } from '../../../../src/components/custom/data-table/query-request';
import { DataTableQueryError, type DataTableQueryRequest } from '../../../../src/components/custom/data-table/types';

const request: DataTableQueryRequest = { pageIndex: 0, pageSize: 20, sort: [], filters: {} };

it('失败占位保留上次 total，避免分页归零触发额外查询', () => {
  expect(preserveQueryTotal({ rows: [{ id: '1' }], total: 87 })).toBe(87);
  expect(preserveQueryTotal(undefined)).toBe(0);
});

it('接口响应取消信号时不回写结果或报告错误', async () => {
  const success = vi.fn(); const failure = vi.fn();
  const cancel = runTableQuery(async (_request, signal) => {
    await new Promise<void>(resolve => signal.addEventListener('abort', () => resolve(), { once: true }));
    return { rows: [], total: 0 };
  }, request, success, failure);
  cancel();
  await Promise.resolve();
  await Promise.resolve();
  expect(success).not.toHaveBeenCalled();
  expect(failure).not.toHaveBeenCalled();
});

it.each(['success', 'failure'] as const)('接口忽略取消信号时，旧请求迟到的%s不覆盖新请求', async outcome => {
  let resolve!: (value: { rows: { id: string }[]; total: number }) => void;
  let reject!: (error: Error) => void;
  const success = vi.fn(); const failure = vi.fn();
  const cancel = runTableQuery(() => new Promise<{ rows: { id: string }[]; total: number }>((done, fail) => {
    resolve = done; reject = fail;
  }), request, success, failure);
  cancel();
  runTableQuery(async () => ({ rows: [], total: 0 }), request, success, failure);
  await Promise.resolve();
  if (outcome === 'success') resolve({ rows: [{ id: 'old' }], total: 1 });
  else reject(new Error('old error'));
  await Promise.resolve();
  expect(success).toHaveBeenCalledExactlyOnceWith({ rows: [], total: 0 });
  expect(failure).not.toHaveBeenCalled();
});

it.each([
  { rows: [], total: -1 },
  { rows: [{ id: 'one' }], total: 10 },
])('非法响应或分页数量不一致走安全错误分支：%j', async result => {
  const success = vi.fn(); const failure = vi.fn();
  runTableQuery(async () => result, request, success, failure);
  await Promise.resolve();
  expect(success).not.toHaveBeenCalled();
  expect(failure).toHaveBeenCalledWith(expect.any(DataTableQueryError));
  expect(failure).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid table response' }));
});

it('同步抛错和异步失败统一交给错误分支，允许后续重试成功', async () => {
  const success = vi.fn(); const failure = vi.fn();
  const error = new DataTableQueryError('Please retry');
  runTableQuery(() => { throw error; }, request, success, failure);
  expect(failure).toHaveBeenCalledWith(error);
  runTableQuery(async () => { throw error; }, request, success, failure);
  await Promise.resolve();
  expect(failure).toHaveBeenCalledTimes(2);
  runTableQuery(async () => ({ rows: [], total: 0 }), request, success, failure);
  await Promise.resolve();
  expect(success).toHaveBeenCalledOnce();
});

it('未知异常不泄漏原始文案', async () => {
  const failure = vi.fn();
  runTableQuery(async () => { throw new Error('private database token'); }, request, vi.fn(), failure);
  await Promise.resolve();
  expect(failure).toHaveBeenCalledWith(expect.objectContaining({ message: 'Query failed. Please try again.' }));
});
