import type { DataTableQuery } from '../../../components/custom/data-table';
import type { DateFilterRange } from '../../../components/custom/data-table/state';
import type { ActivityQuery, ActivitySort } from '../../../api/activity';

export function defaultDailyQuery(): DataTableQuery {
  return { pagination: { pageIndex: 0, pageSize: 20 }, sorting: [], columnFilters: [], globalFilter: '' };
}
export function dailyRequest(query: DataTableQuery): ActivityQuery {
  const range = query.columnFilters.find(filter => filter.id === 'date')?.value as DateFilterRange | undefined;
  return { ...(range?.from ? { startDate: range.from } : {}), ...(range?.to ? { endDate: range.to } : {}),
    ...query.pagination, sort: query.sorting.map(item => ({ field: item.id as ActivitySort['field'], order: item.desc ? 'desc' : 'asc' })) };
}
export function applyDailyDates(query: DataTableQuery, range: DateFilterRange): DataTableQuery {
  return { ...query, columnFilters: range.from || range.to ? [{ id: 'date', value: range }] : [], pagination: { ...query.pagination, pageIndex: 0 } };
}
export function resetDailyQuery(query: DataTableQuery): DataTableQuery {
  return { ...defaultDailyQuery(), pagination: { ...query.pagination, pageIndex: 0 } };
}
