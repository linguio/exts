import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { Updater } from '@tanstack/react-table';
import { createQueryTableState, defaultFilterValues, queryTableReducer, toQueryTableRequest } from './state';
import { QUERY_FAILED_TOAST, preserveQueryTotal, runTableQuery } from './query-request';
import { RowPreviewError, applyRowPreviewPatch, canApplyRowPreview } from './row-preview';
import { toast } from '../../ui/sonner';
import type { DataTableFilter, DataTableFilterValue, DataTableQuery, DataTableQueryFn, DataTableQueryResult } from './types';

interface QueryResult<T> {
  key: string;
  status: 'loading' | 'success' | 'error';
  data?: DataTableQueryResult<T>;
}

/** 只管理查询生命周期，不获取账号、令牌或业务接口地址。 */
export function useDataTableQuery<T>(filters: DataTableFilter[], queryFn: DataTableQueryFn<T>, enabled: boolean) {
  const [state, dispatch] = useReducer(queryTableReducer, filters, createQueryTableState);
  const [result, setResult] = useState<QueryResult<T>>();
  const resultRef = useRef(result);
  useEffect(() => { resultRef.current = result; }, [result]);
  const latestQuery = useRef(queryFn);
  useEffect(() => { latestQuery.current = queryFn; }, [queryFn]);
  const request = useMemo(() => toQueryTableRequest(state.query), [state.query]);
  const key = JSON.stringify([request, state.revision]);

  useEffect(() => {
    if (!enabled) return;
    setResult(previous => ({
      key,
      status: 'loading',
      data: previous?.status === 'success'
        ? previous.data
        : { rows: [], total: preserveQueryTotal(previous?.data) },
    }));
    return runTableQuery(latestQuery.current, request,
      data => setResult({ key, status: 'success', data }),
      () => {
        console.error('DataTable 查询失败', { code: 'QUERY_ERROR' });
        setResult(previous => ({
          key,
          status: 'error',
          data: { rows: [], total: preserveQueryTotal(previous?.data) },
        }));
        toast.error(QUERY_FAILED_TOAST);
      });
  }, [enabled, key, request]);

  const onQueryChange = useCallback((update: Updater<DataTableQuery>) => dispatch({ type: 'table', update }), []);
  const onFilterChange = useCallback((id: string, value: DataTableFilterValue) => dispatch({ type: 'draft', id, value }), []);
  const onQuery = useCallback(() => dispatch({ type: 'query' }), []);
  const onReset = () => dispatch({ type: 'reset', defaults: defaultFilterValues(filters) });
  const refresh = useCallback(() => dispatch({ type: 'retry' }), []);
  const loading = enabled && (result?.key !== key || result?.status === 'loading');
  const hasPreviousResult = (result?.data?.rows.length ?? 0) > 0;
  const applyRowPreview = useCallback((rowId: string, values: Record<string, unknown>, getRowId: (row: T) => string) => {
    const snapshot = resultRef.current;
    if (!canApplyRowPreview(snapshot, key, loading)) {
      throw new RowPreviewError('Cannot apply preview to the current query result.');
    }
    const data = applyRowPreviewPatch(snapshot.data, rowId, values, getRowId);
    setResult({ ...snapshot, data });
  }, [key, loading]);
  return { query: state.query, draft: state.draft, data: result?.data,
    loading, hasPreviousResult,
    idle: !enabled && result?.data === undefined,
    onQueryChange, onFilterChange, onQuery, onReset, refresh, applyRowPreview };
}
