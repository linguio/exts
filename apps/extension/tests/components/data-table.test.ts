import { expect, it } from 'vitest';
import { createTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { dateFilter, optionsFilter, initialQuery, updateQuery, formatFilterDate, parseFilterDate, paginationItems } from '../../src/components/custom/data-table/state';

it('initialQuery 默认每页 20 条', () => {
  expect(initialQuery().pagination).toEqual({ pageIndex: 0, pageSize: 20 });
});

it('筛选、排序及每页条数变化回到首页，普通翻页保持页码', () => {
  const query = { ...initialQuery(), pagination: { pageIndex: 3, pageSize: 20 } };
  expect(updateQuery(query, 'globalFilter', 'sample').pagination.pageIndex).toBe(0);
  expect(updateQuery(query, 'columnFilters', [{ id: 'status', value: ['done'] }]).pagination.pageIndex).toBe(0);
  expect(updateQuery(query, 'sorting', previous => [...previous, { id: 'date', desc: true }]).pagination.pageIndex).toBe(0);
  expect(updateQuery(query, 'pagination', { pageIndex: 3, pageSize: 50 }).pagination).toEqual({ pageIndex: 0, pageSize: 50 });
  expect(updateQuery(query, 'pagination', { pageIndex: 3, pageSize: 10 }).pagination).toEqual({ pageIndex: 0, pageSize: 10 });
  expect(updateQuery(query, 'pagination', previous => ({ ...previous, pageIndex: 4 })).pagination.pageIndex).toBe(4);
});

const data = [
  { id: 'a', name: 'alpha', status: 'done', date: '2026-11-01', amount: 1 },
  { id: 'b', name: 'beta', status: 'pending', date: '2026-11-02', amount: 9 },
  { id: 'c', name: 'gamma', status: 'done', date: '2026-11-03', amount: 3 },
];
function setup(remote = false) {
  return createTable({ data, columns: [{ accessorKey: 'name' }, { accessorKey: 'status', filterFn: optionsFilter }, { accessorKey: 'date', filterFn: dateFilter }, { accessorKey: 'amount' }],
    state: { ...initialQuery(), columnFilters: [{ id: 'status', value: ['done'] }, { id: 'date', value: { from: '2026-11-01', to: '2026-11-03' } }], sorting: [{ id: 'amount', desc: true }], pagination: { pageIndex: 0, pageSize: 1 } },
    onStateChange: () => {}, renderFallbackValue: null, getRowId: row => row.id,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
    manualPagination: remote, manualFiltering: remote, manualSorting: remote, rowCount: remote ? 99 : undefined });
}
it('前端模式先组合筛选与排序，再分页，保留稳定记录标识', () => {
  const table = setup();
  expect(table.getRowCount()).toBe(2);
  expect(table.getPageCount()).toBe(2);
  expect(table.getRowModel().rows.map(row => row.id)).toEqual(['c']);
  table.setOptions(previous => ({ ...previous, state: { ...previous.state, columnFilters: [{ id: 'date', value: { from: '2026-11-03', to: '2026-11-03' } }] } }));
  expect(table.getRowModel().rows.map(row => row.id)).toEqual(['c']);
});
it('服务端模式保留响应顺序和全部当前页数据，不再次本地筛选、排序或分页', () => {
  const table = setup(true);
  expect(table.getRowModel().rows.map(row => row.id)).toEqual(['a', 'b', 'c']);
  expect(table.getRowCount()).toBe(99);
  expect(table.getPageCount()).toBe(99);
});
it('空数据页数为零，不能翻到下一页', () => {
  const table = setup();
  table.setOptions(previous => ({ ...previous, data: [] }));
  expect(table.getPageCount()).toBe(0);
  expect(table.getCanNextPage()).toBe(false);
  expect(table.getCanPreviousPage()).toBe(false);
});

it('日历日期往返保持年月日，拒绝无效日期及时间戳', () => {
  for (const day of ['2026-11-08', '2024-02-29', '0099-01-01']) {
    expect(formatFilterDate(parseFilterDate(day)!)).toBe(day);
  }
  expect(parseFilterDate('2026-02-29')).toBeUndefined();
  expect(parseFilterDate('2026-11-08T00:00:00Z')).toBeUndefined();
  expect(parseFilterDate('')).toBeUndefined();
});
it('大量页码保持有界，首页末页和空结果不产生无效页码', () => {
  expect(paginationItems(0, 0)).toEqual([]);
  expect(paginationItems(0, 1)).toEqual([0]);
  expect(paginationItems(0, 5)).toEqual([0, 1, 'ellipsis', 4]);
  expect(paginationItems(999999, 1000000)).toEqual([0, 'ellipsis', 999998, 999999]);
  expect(paginationItems(8, 3)).toEqual([0, 1, 2]);
});
