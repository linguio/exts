import { expect, it } from 'vitest';
import { createQueryTableState, queryTableReducer, toQueryTableRequest, updateQuery } from '../../src/components/custom/data-table/state';

import { type DataTableFilter } from '../../src/components/custom/data-table/types';

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
