import type { DateFilterRange } from './state';
import type { ReactNode } from 'react';
import type { Table, ColumnDef, ColumnFiltersState, PaginationState, SortingState, RowSelectionState, OnChangeFn } from '@tanstack/react-table';

export interface DataTableQuery {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
}
export type DataTableFilter = {
  columnId: string;
  label: string;
} & ({ type: 'text'; defaultValue?: string } | { type: 'options'; options: { label: string; value: string }[]; defaultValue?: string[] } | { type: 'date'; defaultValue?: DateFilterRange });
export interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  toolbar?: (table: Table<T>, disabled: boolean) => ReactNode;
  data: T[];
  getRowId: (row: T) => string;
  caption: string;
  showCaption?: boolean;
  filters?: DataTableFilter[];
  search?: boolean;
  multiSort?: boolean;
  columnVisibility?: boolean;
  pageSizes?: number[];
  showPagination?: boolean;
  emptyContent?: ReactNode;
  selection?: boolean;
  selectionKey?: string;
  onSelectionChange?: (ids: string[]) => void;
  bulkActions?: (ids: string[], clear: () => void) => ReactNode;
  loading?: boolean;
  hasPreviousResult?: boolean;
  remote?: { query: DataTableQuery; onQueryChange: OnChangeFn<DataTableQuery>; rowCount: number };
  /** Daily 等页面：在父级 flex 高度链内占满剩余空间，记录区 ScrollArea 纵向滚动，分页保持可见。 */
  fillRecords?: boolean;
}
export type { RowSelectionState };

export type DataTableFilterValue = string | string[] | DateFilterRange | undefined;
export type DataTableFilterValues = Record<string, DataTableFilterValue>;
export interface DataTableQueryRequest {
  pageIndex: number;
  pageSize: number;
  sort: { field: string; order: 'asc' | 'desc' }[];
  filters: DataTableFilterValues;
}
export interface DataTableQueryResult<T> { rows: T[]; total: number }
export type DataTableQueryFn<T> = (request: DataTableQueryRequest, signal: AbortSignal) => Promise<DataTableQueryResult<T>>;
export type DataTableUpdateFn<T> = (rowId: string, values: Record<string, unknown>, signal: AbortSignal) => Promise<void>;

/** 仅用于资源适配层已确认可展示的安全文案；未知异常使用通用提示。 */
export class DataTableQueryError extends Error {
  override name = 'DataTableQueryError';
}

export interface DataTableQueryControls {
  draft: DataTableFilterValues;
  onFilterChange: (id: string, value: DataTableFilterValue) => void;
  onQuery: () => void;
  onReset: () => void;
}

export interface QueryDataTableProps<T> {
  columns: ColumnDef<T, any>[];
  filters?: DataTableFilter[];
  queryFn: DataTableQueryFn<T>;
  updateFn?: DataTableUpdateFn<T>;
  /** 保存时仅提交相对打开时草稿发生变化的字段。 */
  partialUpdates?: boolean;
  /** 显式启用当前响应行预览编辑；默认 false，不与 updateFn 隐式混用。 */
  previewEdits?: boolean;
  getRowId: (row: T) => string;
  caption: string;
  scopeKey?: string | number;
  enabled?: boolean;
  showCaption?: boolean;
  emptyContent?: ReactNode;
  editDescription?: string;
  headerNote?: ReactNode;
  /** 与 fillRecords 搭配：筛选工具栏单行，窄屏横向滚动。 */
  fillRecords?: boolean;
  pageSizes?: number[];
}
