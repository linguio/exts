import { useEffect, useMemo, useRef, useState } from 'react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type Updater } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '../../ui/table';
import { Checkbox } from '../../ui/checkbox';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '../../ui/empty';
import { Spinner } from '../../ui/spinner';
import { ScrollArea } from '../../ui/scroll-area';
import { cn } from '../../../lib/utils';
import { DataTableColumnHeader } from './column-header';
import { DataTableToolbar } from './toolbar';
import { DataTablePagination } from './pagination';
import { dateFilter, initialQuery, optionsFilter, resolveUpdate, updateQuery } from './state';
import type { DataTableProps, DataTableQuery, RowSelectionState } from './types';

export function DataTable<T>({ toolbar, columns, data, getRowId, caption, showCaption = true, filters = [], search = true, multiSort = true,
  columnVisibility = true, pageSizes = [20, 50, 100], selection = false, selectionKey, onSelectionChange, bulkActions,
  loading = false, hasPreviousResult = false, remote, showPagination = true, emptyContent, fillRecords = false }: DataTableProps<T>) {
  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const query = remote?.query ?? localQuery;
  const queryChange = remote?.onQueryChange ?? setLocalQuery;
  function change<K extends keyof DataTableQuery>(key: K, update: Updater<DataTableQuery[K]>) {
    queryChange(previous => updateQuery(previous, key, update));
  }
  // 远端换页只保留当前响应内的选择；本地数据变化、筛选变化和账号作用域变化清理旧选择。
  const selectionScope = JSON.stringify([query.columnFilters, query.globalFilter, selectionKey, selection, remote ? query.pagination : null]);
  useEffect(() => { setRowSelection({}); }, [data, selectionScope]);
  const selectionCallback = useRef(onSelectionChange);
  useEffect(() => { selectionCallback.current = onSelectionChange; }, [onSelectionChange]);
  useEffect(() => { selectionCallback.current?.(Object.keys(rowSelection).filter(id => rowSelection[id])); }, [rowSelection]);
  const resolvedColumns = useMemo(() => {
    const configure = (items: ColumnDef<T, any>[]): ColumnDef<T, any>[] => items.map(column => {
      if ('columns' in column && column.columns) return { ...column, columns: configure(column.columns) };
      const id = column.id ?? ('accessorKey' in column ? String(column.accessorKey) : undefined);
      const filter = filters.find(item => item.columnId === id);
      return { ...column, ...(filter ? { filterFn: filter.type === 'options' ? optionsFilter : filter.type === 'date' ? dateFilter : 'includesString' as const } : {}) };
    });
    const result = configure(columns);
    if (selection) result.unshift({ id: '__selection', enableHiding: false, enableSorting: false, enableGlobalFilter: false,
      header: ({ table }) => <Checkbox aria-label="选择当前页全部记录" checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false} disabled={loading || !table.getRowModel().rows.length} onCheckedChange={value => table.toggleAllPageRowsSelected(value === true)} />,
      cell: ({ row }) => <Checkbox aria-label={`选择记录 ${row.id}`} checked={row.getIsSelected()} disabled={loading} onCheckedChange={value => row.toggleSelected(value === true)} />,
    });
    return result;
  }, [columns, filters, selection, loading]);
  const table = useReactTable({ data, columns: resolvedColumns, getRowId,
    state: { ...query, rowSelection }, onPaginationChange: update => change('pagination', update),
    onSortingChange: update => change('sorting', update), onColumnFiltersChange: update => change('columnFilters', update),
    onGlobalFilterChange: update => change('globalFilter', update),
    onRowSelectionChange: update => setRowSelection(previous => resolveUpdate(update, previous)),
    enableRowSelection: selection, enableMultiSort: multiSort, autoResetPageIndex: false,
    manualPagination: !!remote, manualSorting: !!remote, manualFiltering: !!remote, rowCount: remote?.rowCount,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
  });
  const pages = table.getPageCount();
  useEffect(() => {
    if (!loading && query.pagination.pageIndex > Math.max(0, pages - 1)) {
      queryChange(previous => ({ ...previous, pagination: { ...previous.pagination, pageIndex: Math.max(0, pages - 1) } }));
    }
  }, [pages, query.pagination.pageIndex, loading, queryChange]);
  const selected = Object.keys(rowSelection).filter(id => rowSelection[id]);
  const filtered = !!query.globalFilter || query.columnFilters.length > 0;
  const busy = loading;
  const columnCount = Math.max(1, table.getVisibleLeafColumns().length);
  const stickyEndClass = 'sticky right-0 z-10 bg-background';
  function headClass(columnId: string) {
    return cn('text-center', columnId === '__actions' && stickyEndClass);
  }
  function cellClass(columnId: string) {
    return cn('text-center', columnId === '__actions' && stickyEndClass);
  }
  const headerClassName = fillRecords ? 'sticky top-0 z-10 bg-background [&_th]:bg-background' : undefined;
  const rows = table.getRowModel().rows;
  const initialLoading = loading && (!hasPreviousResult || !rows.length);
  const fillPlaceholder = fillRecords && (initialLoading || !rows.length);
  const tableHeader = <TableHeader className={headerClassName}>{table.getHeaderGroups().map(group => <TableRow key={group.id}>{group.headers.map(header => <TableHead className={headClass(header.column.id)} key={header.id} colSpan={header.colSpan} aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : undefined}>{header.isPlaceholder ? null : typeof header.column.columnDef.header === 'string' ? <DataTableColumnHeader column={header.column} title={header.column.columnDef.header} disabled={busy} /> : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>)}</TableRow>)}</TableHeader>;
  const emptyState = emptyContent ?? <Empty className="flex-none border-0 p-0"><EmptyHeader><EmptyTitle>{filtered ? '没有符合条件的记录' : '暂无记录'}</EmptyTitle><EmptyDescription>{filtered ? '请调整筛选条件后重试。' : '数据记录将在此显示。'}</EmptyDescription></EmptyHeader></Empty>;
  const tableContent = fillPlaceholder
    ? <div className="flex h-full min-h-0 flex-1 flex-col"><Table aria-label={caption} containerClassName="shrink-0 overflow-visible">{showCaption && <TableCaption>{caption}</TableCaption>}{tableHeader}</Table><div className="flex flex-1 items-center justify-center p-6" aria-busy={loading}>{initialLoading ? <Spinner aria-label="Loading records" /> : emptyState}</div></div>
    : <Table aria-label={caption} containerClassName={fillRecords ? 'overflow-visible' : undefined}>{showCaption && <TableCaption>{caption}</TableCaption>}
    {tableHeader}
    <TableBody className="relative" aria-busy={loading}>
      {initialLoading
        ? <TableRow aria-hidden="true"><TableCell colSpan={columnCount} className="h-48" /></TableRow>
        : rows.length ? rows.map(row => <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>{row.getVisibleCells().map(cell => <TableCell className={cellClass(cell.column.id)} key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>) : <TableRow><TableCell colSpan={columnCount} className="h-24 text-center">{emptyState}</TableCell></TableRow>}
      {loading && <TableRow className="pointer-events-none absolute inset-0 z-10 border-0 hover:bg-transparent"><TableCell colSpan={columnCount} className="flex h-full items-center justify-center p-0"><Spinner aria-label="Loading records" /></TableCell></TableRow>}
    </TableBody>
  </Table>;
  const tableBlock = fillRecords
    ? <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
      {fillPlaceholder
        ? tableContent
        : <ScrollArea className="min-h-0 flex-1" horizontal viewportClassName="[&>div]:flex [&>div]:h-full [&>div]:min-h-0 [&>div]:flex-col">{tableContent}</ScrollArea>}
    </div>
    : <div className="overflow-hidden rounded-md border">{tableContent}</div>;
  const defaultToolbar = <DataTableToolbar table={table} filters={filters} search={search} visibility={columnVisibility} disabled={busy} />;
  const toolbarNode = toolbar ? toolbar(table, busy) : defaultToolbar;
  const toolbarBlock = fillRecords
    ? <div className="shrink-0 overflow-x-auto">{toolbarNode}</div>
    : toolbarNode;
  return <section className={cn(fillRecords ? 'flex min-h-0 flex-1 flex-col gap-4' : 'space-y-4')} aria-label={caption} aria-busy={loading}>
    {toolbarBlock}
    {selection && selected.length > 0 && <div className={cn('flex flex-wrap items-center gap-2', fillRecords && 'shrink-0')}><span>已选择 {selected.length} 条</span>{!busy && bulkActions?.(selected, () => setRowSelection({}))}</div>}
    {tableBlock}
    {showPagination && <div className={cn(fillRecords && 'shrink-0')}><DataTablePagination table={table} pageSizes={pageSizes} disabled={busy} /></div>}
  </section>;
}
