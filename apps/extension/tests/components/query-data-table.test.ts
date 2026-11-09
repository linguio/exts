import { expect, it, vi } from 'vitest';
import { createQueryTableState, queryTableReducer, toQueryTableRequest, updateQuery } from '../../src/components/custom/data-table/state';
import { runTableQuery } from '../../src/components/custom/data-table/query-request';
import { DataTableQueryError, type DataTableFilter } from '../../src/components/custom/data-table/types';

const filters: DataTableFilter[] = [
  { columnId: 'status', label: 'Status', type: 'options', options: [], defaultValue: ['active'] },
  { columnId: 'date', label: 'Date', type: 'date' },
];

it('草稿不影响当前查询，排序和翻页只使用已生效条件，Query 才应用草稿', () => {
  let state = createQueryTableState(filters);
  expect(toQueryTableRequest(state.query)).toEqual({ pageIndex: 0, pageSize: 20, sort: [], filters: { status: ['active'] } });
  state = queryTableReducer(state, { type: 'draft', id: 'date', value: { from: '2026-11-01', to: '2026-11-09' } });
  state = queryTableReducer(state, { type: 'table', update: previous => updateQuery(previous, 'sorting', [{ id: 'readingHours', desc: true }]) });
  state = queryTableReducer(state, { type: 'table', update: previous => updateQuery(previous, 'pagination', { pageIndex: 2, pageSize: 20 }) });
  expect(toQueryTableRequest(state.query)).toEqual({ pageIndex: 2, pageSize: 20, sort: [{ field: 'readingHours', order: 'desc' }], filters: { status: ['active'] } });
  state = queryTableReducer(state, { type: 'query' });
  expect(toQueryTableRequest(state.query)).toMatchObject({ pageIndex: 0, filters: { status: ['active'], date: { from: '2026-11-01', to: '2026-11-09' } } });
});

it('Reset 一次恢复默认值并清空排序，保留每页条数；默认配置不被草稿修改', () => {
  let state = createQueryTableState(filters);
  (state.draft.status as string[]).push('changed');
  expect(filters[0]!.defaultValue).toEqual(['active']);
  state = queryTableReducer(state, { type: 'table', update: previous => ({ ...previous, pagination: { pageIndex: 3, pageSize: 50 }, sorting: [{ id: 'date', desc: false }] }) });
  state = queryTableReducer(state, { type: 'reset', defaults: { status: ['active'] } });
  expect(toQueryTableRequest(state.query)).toEqual({ pageIndex: 0, pageSize: 50, sort: [], filters: { status: ['active'] } });
  expect(state.revision).toBe(1);
  expect(state.draft).toEqual({ status: ['active'] });
});

it('空筛选不会被当成有效过滤，重复 Query/Retry 可重新请求且不提交草稿', () => {
  let state = createQueryTableState([]);
  for (const [id, value] of Object.entries({ text: '', options: [], date: {} })) {
    state = queryTableReducer(state, { type: 'draft', id, value });
  }
  state = queryTableReducer(state, { type: 'query' });
  expect(state.query.columnFilters).toEqual([]);
  state = queryTableReducer(state, { type: 'draft', id: 'text', value: 'not applied' });
  state = queryTableReducer(state, { type: 'retry' });
  expect(state.revision).toBe(2);
  expect(toQueryTableRequest(state.query).filters).toEqual({});
  expect(state.draft.text).toBe('not applied');
});

it('请求取消后，即使接口忽略 signal，迟到的成功或失败也不写回', async () => {
  const request = toQueryTableRequest(createQueryTableState([]).query);
  let resolve!: (value: { rows: { id: string }[]; total: number }) => void;
  const success = vi.fn(); const failure = vi.fn();
  const queryFn = vi.fn((_request, _signal) => new Promise<{ rows: { id: string }[]; total: number }>(complete => { resolve = complete; }));
  const cancel = runTableQuery(queryFn, request, success, failure);
  cancel();
  expect(queryFn.mock.calls[0]![1].aborted).toBe(true);
  resolve({ rows: [{ id: 'old' }], total: 1 });
  await Promise.resolve();
  expect(success).not.toHaveBeenCalled(); expect(failure).not.toHaveBeenCalled();
  let reject!: (error: Error) => void;
  const stop = runTableQuery(() => new Promise<{ rows: never[]; total: number }>((_resolve, fail) => { reject = fail; }), request, success, failure);
  stop(); reject(new Error('old error'));
  await Promise.resolve();
  expect(failure).not.toHaveBeenCalled();
});

it('新请求可成功，旧请求迟到不能覆盖；空结果与非法元数据区分', async () => {
  const request = toQueryTableRequest(createQueryTableState([]).query);
  const success = vi.fn(); const failure = vi.fn();
  let oldResolve!: (value: { rows: never[]; total: number }) => void;
  const stop = runTableQuery(() => new Promise<{ rows: never[]; total: number }>(complete => { oldResolve = complete; }), request, success, failure);
  stop();
  runTableQuery(async () => ({ rows: [], total: 0 }), request, success, failure);
  await Promise.resolve();
  oldResolve({ rows: [], total: 0 }); await Promise.resolve();
  expect(success).toHaveBeenCalledTimes(1);
  expect(success).toHaveBeenCalledWith({ rows: [], total: 0 });
  runTableQuery(async () => ({ rows: [], total: -1 }), request, success, failure);
  await Promise.resolve();
  expect(failure).toHaveBeenCalledWith(expect.any(DataTableQueryError));
});

it('同步抛错和异步失败统一交给错误分支，允许后续重试成功', async () => {
  const request = toQueryTableRequest(createQueryTableState([]).query);
  const success = vi.fn(); const failure = vi.fn();
  const error = new DataTableQueryError('Please retry');
  runTableQuery(() => { throw error; }, request, success, failure);
  expect(failure).toHaveBeenCalledWith(error);
  runTableQuery(async () => { throw error; }, request, success, failure);
  await Promise.resolve();
  expect(failure).toHaveBeenCalledTimes(2);
  runTableQuery(async () => ({ rows: [], total: 0 }), request, success, failure);
  await Promise.resolve();
  expect(success).toHaveBeenCalledTimes(1);
});

it('未知异常不泄漏原始文案，明确的业务安全错误才展示', async () => {
  const request = toQueryTableRequest(createQueryTableState([]).query);
  const failure = vi.fn();
  runTableQuery(async () => { throw new Error('private database token'); }, request, vi.fn(), failure);
  await Promise.resolve();
  expect(failure).toHaveBeenCalledWith(expect.objectContaining({ message: 'Query failed. Please try again.' }));
});
