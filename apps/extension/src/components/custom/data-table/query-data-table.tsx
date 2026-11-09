import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '../../ui/button';
import { DataTable } from './data-table';
import { DataTableToolbar } from './toolbar';
import { useDataTableQuery } from './use-data-table-query';
import { filtersFromColumns, hasWritableEditFields } from './column-meta';
import { DataTableEditSheet } from './data-table-edit-sheet';
import type { DataTableFilter, QueryDataTableProps } from './types';

const noRows: never[] = [];

/** 作用域变化同步重建整份查询状态，首帧也不会展示旧账号或旧资源结果。 */
export function QueryDataTable<T>(props: QueryDataTableProps<T>) {
  return <QueryDataTableContent key={`${typeof props.scopeKey}:${props.scopeKey ?? ''}`} {...props} />;
}

function resolveFilters<T>(columns: ColumnDef<T, any>[], filterOverride: DataTableFilter[] | undefined): DataTableFilter[] {
  if (filterOverride !== undefined) return filterOverride;
  return filtersFromColumns(columns);
}

function QueryDataTableContent<T>({ columns, filters: filterOverride, queryFn, updateFn, previewEdits = false, getRowId, caption,
  enabled = true, showCaption = true, emptyContent, editDescription, headerNote, fillRecords = false, pageSizes }: QueryDataTableProps<T>) {
  const filters = useMemo(() => resolveFilters(columns, filterOverride), [columns, filterOverride]);
  const { applyRowPreview, refresh, ...queryState } = useDataTableQuery(filters, queryFn, enabled);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  const showEdit = hasWritableEditFields(columns) && (!!updateFn || previewEdits);
  const commitRowUpdate = useCallback(async (rowId: string, values: Record<string, unknown>, signal: AbortSignal) => {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    if (updateFn) await updateFn(rowId, values, signal);
    else if (previewEdits) applyRowPreview(rowId, values, getRowId);
    else throw new Error('Row edit is not configured.');
  }, [applyRowPreview, getRowId, previewEdits, updateFn]);
  const handleSaved = useCallback(() => {
    setEditingRow(null);
    if (updateFn) refresh();
  }, [refresh, updateFn]);
  const tableColumns = useMemo((): ColumnDef<T, any>[] => {
    if (!showEdit) return columns;
    return [...columns, { id: '__actions', header: 'Actions', enableHiding: false, enableSorting: false, enableGlobalFilter: false,
      cell: ({ row }) => <Button type="button" variant="outline" size="sm" disabled={queryState.loading || !!queryState.error}
        onClick={() => setEditingRow(row.original)}>Edit</Button> }];
  }, [columns, queryState.error, queryState.loading, showEdit]);

  const content = <>
    {headerNote
      ? (typeof headerNote === 'string'
        ? <p className="mb-3 text-sm text-muted-foreground">{headerNote}</p>
        : <div className="mb-3">{headerNote}</div>)
      : null}
    {showEdit && <DataTableEditSheet open={!!editingRow} row={editingRow} columns={columns} getRowId={getRowId}
      updateFn={commitRowUpdate} editDescription={editDescription}
      onOpenChange={open => { if (!open) setEditingRow(null); }}
      onSaved={handleSaved} />}
    <DataTable columns={tableColumns} data={queryState.data?.rows ?? noRows} getRowId={getRowId}
      caption={caption} showCaption={showCaption} search={false} fillRecords={fillRecords} pageSizes={pageSizes}
      loading={queryState.loading} hasPreviousResult={queryState.data !== undefined} error={queryState.error} onRetry={queryState.onRetry}
      emptyContent={queryState.idle ? <span className="sr-only">Query is not enabled</span> : emptyContent}
      remote={{ query: queryState.query, onQueryChange: queryState.onQueryChange, rowCount: queryState.data?.total ?? 0 }}
      toolbar={table => <DataTableToolbar table={table} filters={filters} search={false} visibility disabled={!enabled} singleRow={fillRecords}
        queryControls={{ draft: queryState.draft, onFilterChange: queryState.onFilterChange, onQuery: queryState.onQuery, onReset: queryState.onReset }} />} />
  </>;
  return fillRecords ? <div className="flex min-h-0 flex-1 flex-col">{content}</div> : content;
}
