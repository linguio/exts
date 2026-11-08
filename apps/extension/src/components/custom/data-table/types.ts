import type { ReactNode } from 'react';
import type { ColumnDef, ColumnFiltersState, PaginationState, SortingState, RowSelectionState, OnChangeFn } from '@tanstack/react-table';

export interface DataTableQuery {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
}
export type DataTableFilter = {
  columnId: string;
  label: string;
} & ({ type: 'text' } | { type: 'options'; options: { label: string; value: string }[] } | { type: 'date' });
export interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  getRowId: (row: T) => string;
  caption: string;
  filters?: DataTableFilter[];
  search?: boolean;
  multiSort?: boolean;
  columnVisibility?: boolean;
  pageSizes?: number[];
  selection?: boolean;
  selectionKey?: string;
  onSelectionChange?: (ids: string[]) => void;
  bulkActions?: (ids: string[], clear: () => void) => ReactNode;
  loading?: boolean;
  hasPreviousResult?: boolean;
  error?: string;
  onRetry?: () => void;
  remote?: { query: DataTableQuery; onQueryChange: OnChangeFn<DataTableQuery>; rowCount: number };
}
export type { RowSelectionState };
