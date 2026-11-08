import { DataTable } from './data-table';
import { DataTableToolbar } from './toolbar';
import { useDataTableQuery } from './use-data-table-query';
import type { DataTableFilter, QueryDataTableProps } from './types';

const noFilters: DataTableFilter[] = [];
const noRows: never[] = [];

/** 作用域变化同步重建整份查询状态，首帧也不会展示旧账号或旧资源结果。 */
export function QueryDataTable<T>(props: QueryDataTableProps<T>) {
  return <QueryDataTableContent key={`${typeof props.scopeKey}:${props.scopeKey ?? ''}`} {...props} />;
}

function QueryDataTableContent<T>({ columns, filters = noFilters, queryFn, getRowId, caption,
  enabled = true, showCaption = true, emptyContent }: QueryDataTableProps<T>) {
  const state = useDataTableQuery(filters, queryFn, enabled);
  return <DataTable columns={columns} data={state.data?.rows ?? noRows} getRowId={getRowId}
    caption={caption} showCaption={showCaption} search={false}
    loading={state.loading} hasPreviousResult={state.data !== undefined} error={state.error} onRetry={state.onRetry}
    emptyContent={state.idle ? <span className="sr-only">Query is not enabled</span> : emptyContent}
    remote={{ query: state.query, onQueryChange: state.onQueryChange, rowCount: state.data?.total ?? 0 }}
    toolbar={table => <DataTableToolbar table={table} filters={filters} search={false} visibility disabled={!enabled}
      queryControls={{ draft: state.draft, onFilterChange: state.onFilterChange, onQuery: state.onQuery, onReset: state.onReset }} />} />;
}
