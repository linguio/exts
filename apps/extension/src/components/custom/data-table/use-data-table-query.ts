import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { Updater } from '@tanstack/react-table';
import { createQueryTableState, defaultFilterValues, queryTableReducer, toQueryTableRequest } from './state';
import { runTableQuery } from './query-request';
import type { DataTableFilter, DataTableFilterValue, DataTableQuery, DataTableQueryFn, DataTableQueryResult } from './types';

interface QueryResult<T> {
  key: string;
  status: 'loading' | 'success' | 'error';
  data?: DataTableQueryResult<T>;
  error?: string;
}

/** 只管理查询生命周期，不获取账号、令牌或业务接口地址。 */
export function useDataTableQuery<T>(filters: DataTableFilter[], queryFn: DataTableQueryFn<T>, enabled: boolean) {
  const [state, dispatch] = useReducer(queryTableReducer, filters, createQueryTableState);
  const [result, setResult] = useState<QueryResult<T>>();
  const latestQuery = useRef(queryFn);
  useEffect(() => { latestQuery.current = queryFn; }, [queryFn]);
  const request = useMemo(() => toQueryTableRequest(state.query), [state.query]);
  const key = JSON.stringify([request, state.revision]);

  useEffect(() => {
    if (!enabled) return;
    setResult(previous => ({ key, status: 'loading', data: previous?.data }));
    return runTableQuery(latestQuery.current, request,
      data => setResult({ key, status: 'success', data }),
      error => {
        console.error('DataTable 查询失败', { code: 'QUERY_ERROR' });
        setResult(previous => ({ key, status: 'error', data: previous?.data,
          error: error.message }));
      });
  }, [enabled, key, request]);

  const onQueryChange = useCallback((update: Updater<DataTableQuery>) => dispatch({ type: 'table', update }), []);
  const onFilterChange = useCallback((id: string, value: DataTableFilterValue) => dispatch({ type: 'draft', id, value }), []);
  const onQuery = useCallback(() => dispatch({ type: 'query' }), []);
  const onReset = () => dispatch({ type: 'reset', defaults: defaultFilterValues(filters) });
  const onRetry = useCallback(() => dispatch({ type: 'retry' }), []);
  return { query: state.query, draft: state.draft, data: result?.data,
    loading: enabled && (result?.key !== key || result.status === 'loading'),
    error: enabled && result?.key === key ? result.error : undefined,
    idle: !enabled && result?.data === undefined,
    onQueryChange, onFilterChange, onQuery, onReset, onRetry };
}
