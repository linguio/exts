import { DataTableQueryError, type DataTableQueryFn, type DataTableQueryRequest, type DataTableQueryResult } from './types';

/** 查询失败 Toast 固定文案，不暴露连接细节或环境提示。 */
export const QUERY_FAILED_TOAST = '查询失败，请重试';

export function preserveQueryTotal<T>(previous: DataTableQueryResult<T> | undefined): number {
  return previous?.total ?? 0;
}

/** 每个实例独立管理当前请求；取消标记也阻止忽略 signal 的接口写回迟到结果。 */
export function runTableQuery<T>(queryFn: DataTableQueryFn<T>, request: DataTableQueryRequest,
  onSuccess: (result: DataTableQueryResult<T>) => void, onError: (error: DataTableQueryError) => void): () => void {
  const controller = new AbortController();
  void (async () => {
    try {
      const result = await queryFn(request, controller.signal);
      if (controller.signal.aborted) return;
      if (!result || !Array.isArray(result.rows) || !Number.isSafeInteger(result.total) || result.total < 0
        || result.rows.length !== Math.min(request.pageSize, Math.max(0, result.total - request.pageIndex * request.pageSize))) {
        throw new DataTableQueryError('Invalid table response');
      }
      onSuccess(result);
    } catch (error) {
      if (!controller.signal.aborted) onError(error instanceof DataTableQueryError ? error : new DataTableQueryError(QUERY_FAILED_TOAST));
    }
  })();
  return () => controller.abort();
}
