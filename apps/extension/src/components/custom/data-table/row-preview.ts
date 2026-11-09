import type { DataTableQueryResult } from './types';

/** 预览编辑目标无效，供提交入口捕获。 */
export class RowPreviewError extends Error {
  override name = 'RowPreviewError';
}

/** 当前响应是否允许行预览补丁（与在途查询、作用域 key 对齐）。 */
export function canApplyRowPreview(
  snapshot: { key: string; status: string; data?: DataTableQueryResult<unknown> } | undefined,
  activeKey: string,
  inFlight: boolean,
): snapshot is { key: string; status: 'success'; data: DataTableQueryResult<unknown> } {
  return !inFlight
    && !!snapshot
    && snapshot.status === 'success'
    && snapshot.key === activeKey
    && !!snapshot.data;
}

/** 在当前查询响应内浅合并一行字段；不改 total、不重排、不触碰其他行。 */
export function applyRowPreviewPatch<T>(
  result: DataTableQueryResult<T>,
  rowId: string,
  values: Record<string, unknown>,
  getRowId: (row: T) => string,
): DataTableQueryResult<T> {
  let found = false;
  const rows = result.rows.map(row => {
    if (getRowId(row) !== rowId) return row;
    found = true;
    return { ...row, ...values };
  });
  if (!found) throw new RowPreviewError('Record not found.');
  return { total: result.total, rows };
}
