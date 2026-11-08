import { createTable, getCoreRowModel } from '@tanstack/react-table';
import { resolveUpdate, updateQuery } from '../../../src/components/custom/data-table/state';
import { expect, it } from 'vitest';
import { dailyRequest, defaultDailyQuery, applyDailyDates, resetDailyQuery } from '../../../src/features/activity/daily/state';
import { parseActivityDays } from '../../../src/features/activity/data/response';

it('排序只使用已查询日期，查询应用日期，重置恢复默认但保留每页条数', () => {
  const initial = defaultDailyQuery();
  const applied = applyDailyDates(initial, { from: '2026-11-01', to: '2026-11-08' });
  const sorted = resolveUpdate(previous => ({ ...previous, sorting: [{ id: 'readingMinutes', desc: false }], pagination: { ...previous.pagination, pageIndex: 0 } }), { ...applied, pagination: { pageIndex: 3, pageSize: 50 } });
  expect(dailyRequest(sorted)).toEqual({ startDate: '2026-11-01', endDate: '2026-11-08', pageIndex: 0, pageSize: 50,
    sort: [{ field: 'readingMinutes', order: 'asc' }] });
  expect(dailyRequest(resetDailyQuery(sorted))).toEqual({ pageIndex: 0, pageSize: 50, sort: [] });
});

it('拒绝截断的非分页图表响应与不匹配的分页元数据', () => {
  expect(() => parseActivityDays({ days: [], total: 1, pageIndex: null, pageSize: null }, 'user-1',
    { startDate: '2026-11-01', endDate: '2026-11-08' })).toThrow();
  expect(() => parseActivityDays({ days: [], total: 0, pageIndex: 1, pageSize: 20 }, 'user-1',
    { pageIndex: 0, pageSize: 20 })).toThrow();
});

it('默认日期仅由后端兜底，首个时长排序不会落在唯一日期之后', () => {
  let query = defaultDailyQuery();
  expect(dailyRequest(query).sort).toEqual([]);
  const table = createTable({ data: [], columns: [{ accessorKey: 'date' }, { accessorKey: 'exerciseMinutes' }, { accessorKey: 'readingMinutes' }],
    state: query, onStateChange: () => {}, renderFallbackValue: null,
    manualSorting: true, enableMultiSort: true, getCoreRowModel: getCoreRowModel(),
    onSortingChange: update => {
      query = updateQuery(query, 'sorting', update);
      table.setOptions(previous => ({ ...previous, state: query }));
    } });
  table.getColumn('exerciseMinutes')!.toggleSorting(true, true);
  table.getColumn('readingMinutes')!.toggleSorting(false, true);
  expect(dailyRequest(query).sort).toEqual([
    { field: 'exerciseMinutes', order: 'desc' }, { field: 'readingMinutes', order: 'asc' },
  ]);
  table.resetSorting(true);
  expect(dailyRequest(query).sort).toEqual([]);
  expect(dailyRequest(resetDailyQuery(query)).sort).toEqual([]);
});
