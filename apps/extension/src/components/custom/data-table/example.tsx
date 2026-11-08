import { useMemo, useState } from 'react';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Button } from '../../ui/button';
import { DataTable } from './data-table';
import { initialQuery, optionsFilter, dateFilter } from './state';
import type { DataTableFilter } from './types';

type ExampleRow = { id: string; name: string; status: string; date: string; amount: number };
const rows: ExampleRow[] = Array.from({ length: 87 }, (_, index) => ({ id: `sample-${index}`, name: `示例 ${index + 1}`, status: index % 2 ? 'done' : 'pending', date: `2026-11-${String(index % 28 + 1).padStart(2, '0')}`, amount: index * 7 }));
const columns: ColumnDef<ExampleRow>[] = [
  { accessorKey: 'name', header: '名称', enableHiding: false },
  { accessorKey: 'status', header: '状态', filterFn: optionsFilter },
  { accessorKey: 'date', header: '日期', filterFn: dateFilter },
  { accessorKey: 'amount', header: '数值' },
];
const filters: DataTableFilter[] = [{ columnId: 'name', label: '名称', type: 'text' },
  { columnId: 'status', label: '状态', type: 'options', options: [{ label: '完成', value: 'done' }, { label: '待处理', value: 'pending' }] },
  { columnId: 'date', label: '日期', type: 'date' }];
const getRowId = (row: ExampleRow) => row.id;
const noRows: ExampleRow[] = [];

/** 仅通过开发模式查询参数进入，服务端模式使用内存数据模拟响应，不发 HTTP。 */
export default function DataTableExample() {
  const [remote, setRemote] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [state, setState] = useState<'normal' | 'loading' | 'refresh' | 'empty' | 'error'>('normal');
  const [action, setAction] = useState('');
  const source = state === 'empty' ? noRows : rows;
  const simulatedServer = useReactTable({ columns, data: source, state: query, getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() });
  const response = useMemo(() => simulatedServer.getRowModel().rows.map(row => row.original), [simulatedServer, query, source]);
  return <main className="space-y-6 p-6"><h1 className="text-xl font-semibold">通用 DataTable 开发示例</h1>
    <p>服务端模式在内存中模拟分页响应，用于检查组件状态契约，不验证真实 API。</p>
    <div className="flex flex-wrap gap-2"><Button onClick={() => { setRemote(value => !value); setQuery(initialQuery()); }}>切换模式（当前：{remote ? '服务端' : '前端'}）</Button>
      {(['normal', 'loading', 'refresh', 'empty', 'error'] as const).map(value => <Button key={value} variant="outline" onClick={() => setState(value)}>{value}</Button>)}
    </div>
    <DataTable key={String(remote)} columns={columns} data={remote ? response : source} getRowId={getRowId} caption="通用表格示例数据"
      filters={filters} selection loading={state === 'loading' || state === 'refresh'} hasPreviousResult={state === 'refresh'}
      error={state === 'error' ? '示例查询失败' : undefined} onRetry={() => setState('normal')}
      remote={remote ? { query, onQueryChange: setQuery, rowCount: simulatedServer.getFilteredRowModel().rows.length } : undefined}
      bulkActions={(ids, clear) => <Button onClick={() => { setAction(`已接收 ${ids.length} 个记录 ID`); clear(); }}>示例批量操作</Button>} />
    <p role="status">{action}</p>
    {remote && <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(query, null, 2)}</pre>}
  </main>;
}
