import type { FilterFn, Updater } from '@tanstack/react-table';
import type { DataTableQuery, DataTableFilter, DataTableFilterValue, DataTableFilterValues, DataTableQueryRequest } from './types';

export const initialQuery = (): DataTableQuery => ({ pagination: { pageIndex: 0, pageSize: 20 }, sorting: [], columnFilters: [], globalFilter: '' });
export const resolveUpdate = <T,>(update: Updater<T>, previous: T): T => typeof update === 'function' ? (update as (value: T) => T)(previous) : update;
export function updateQuery<K extends keyof DataTableQuery>(previous: DataTableQuery, key: K, update: Updater<DataTableQuery[K]>): DataTableQuery {
  const next = { ...previous, [key]: resolveUpdate(update, previous[key]) };
  if (key !== 'pagination' || next.pagination.pageSize !== previous.pagination.pageSize) next.pagination = { ...next.pagination, pageIndex: 0 };
  return next;
}
export const optionsFilter: FilterFn<any> = (row, id, values: string[]) => !values.length || values.includes(String(row.getValue(id)));
optionsFilter.autoRemove = (value: string[]) => !value?.length;
export const dateFilter: FilterFn<any> = (row, id, range: { from?: string; to?: string }) => {
  const value = String(row.getValue(id) ?? '').slice(0, 10);
  return !!value && (!range.from || value >= range.from) && (!range.to || value <= range.to);
};
dateFilter.autoRemove = (value: { from?: string; to?: string }) => !value?.from && !value?.to;

export interface DateFilterRange { from?: string; to?: string }

/** 日期筛选只保存日历日期，避免 UTC 序列化造成日期偏移。 */
export function formatFilterDate(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function parseFilterDate(value?: string): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(year!, month! - 1, day!);
  date.setHours(0, 0, 0, 0);
  return formatFilterDate(date) === value ? date : undefined;
}

/** 大量页数只列出首尾和当前相邻页，避免为总页数分配等长数组。 */
export function paginationItems(pageIndex: number, pageCount: number): (number | 'ellipsis')[] {
  if (pageCount <= 0) return [];
  const current = Math.min(Math.max(0, pageIndex), pageCount - 1);
  const visible = [...new Set([0, current - 1, current, current + 1, pageCount - 1])]
    .filter(page => page >= 0 && page < pageCount).sort((a, b) => a - b);
  const result: (number | 'ellipsis')[] = [];
  for (let index = 0; index < visible.length; index++) {
    if (index && visible[index]! - visible[index - 1]! > 1) result.push('ellipsis');
    result.push(visible[index]!);
  }
  return result;
}

export interface QueryTableState { query: DataTableQuery; draft: DataTableFilterValues; revision: number }
export type QueryTableAction =
  | { type: 'draft'; id: string; value: DataTableFilterValue }
  | { type: 'query' } | { type: 'retry' }
  | { type: 'reset'; defaults: DataTableFilterValues }
  | { type: 'table'; update: Updater<DataTableQuery> };

function copyFilterValues(values: DataTableFilterValues): DataTableFilterValues {
  return Object.fromEntries(Object.entries(values).map(([id, value]) => [id,
    Array.isArray(value) ? [...value] : value && typeof value === 'object' ? { ...value } : value]));
}
export function defaultFilterValues(filters: DataTableFilter[]): DataTableFilterValues {
  return copyFilterValues(Object.fromEntries(filters.filter(filter => filter.defaultValue !== undefined)
    .map(filter => [filter.columnId, filter.defaultValue])));
}
function appliedFilters(values: DataTableFilterValues): DataTableQuery['columnFilters'] {
  return Object.entries(copyFilterValues(values)).filter(([, value]) => {
    if (typeof value === 'string' || Array.isArray(value)) return value.length > 0;
    return !!value && !!(value.from || value.to);
  }).map(([id, value]) => ({ id, value }));
}
export function createQueryTableState(filters: DataTableFilter[]): QueryTableState {
  const draft = defaultFilterValues(filters);
  return { query: { ...initialQuery(), columnFilters: appliedFilters(draft) }, draft, revision: 0 };
}
export function queryTableReducer(state: QueryTableState, action: QueryTableAction): QueryTableState {
  switch (action.type) {
    case 'draft': return { ...state, draft: { ...state.draft, [action.id]: action.value } };
    case 'table': return { ...state, query: resolveUpdate(action.update, state.query) };
    case 'retry': return { ...state, revision: state.revision + 1 };
    case 'query': return { ...state, query: { ...state.query, columnFilters: appliedFilters(state.draft),
      pagination: { ...state.query.pagination, pageIndex: 0 } }, revision: state.revision + 1 };
    case 'reset': {
      const draft = copyFilterValues(action.defaults);
      return { draft, revision: state.revision + 1, query: { ...initialQuery(), columnFilters: appliedFilters(draft),
        pagination: { pageIndex: 0, pageSize: state.query.pagination.pageSize } } };
    }
  }
}
export function toQueryTableRequest(query: DataTableQuery): DataTableQueryRequest {
  return { ...query.pagination, sort: query.sorting.map(item => ({ field: item.id, order: item.desc ? 'desc' : 'asc' })),
    filters: copyFilterValues(Object.fromEntries(query.columnFilters.map(filter => [filter.id, filter.value as DataTableFilterValue]))) };
}
