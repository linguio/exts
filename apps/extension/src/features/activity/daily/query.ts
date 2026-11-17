import { ApiRequestError } from '../../../api/client';
import { activitySortFields, type ActivityQuery } from '../../../api/activity';
import { DataTableQueryError, type DataTableQueryRequest, type DataTableQueryResult } from '../../../components/custom/data-table';
import { requestActivity } from '../requests';
import { parseActivityDays } from '../data/response';
import type { DailyActivityRow } from '../data/types';

/** 快捷入口固定读取最新已有记录，不继承表格临时查询条件。 */
export async function queryLatestDailyRecord(userId: string, signal: AbortSignal): Promise<DailyActivityRow | null> {
  const result = await queryDailyRecords({ pageIndex: 0, pageSize: 1, filters: {}, sort: [{ field: 'date', order: 'desc' }] }, userId, signal);
  return result.rows[0] ?? null;
}

/** 资源适配只映射业务参数；分页、排序优先级及请求生命周期由共用查询表格维护。 */
export function dailyActivityRequest(request: DataTableQueryRequest): ActivityQuery {
  const range = request.filters.date;
  if (range !== undefined && (!range || typeof range !== 'object' || Array.isArray(range))) {
    throw new DataTableQueryError('Invalid date filter');
  }
  return { pageIndex: request.pageIndex, pageSize: request.pageSize,
    ...(range?.from ? { startDate: range.from } : {}), ...(range?.to ? { endDate: range.to } : {}),
    sort: request.sort.map(item => {
      const field = activitySortFields.find(field => field === item.field);
      if (!field) throw new DataTableQueryError('Invalid sort field');
      return { field, order: item.order };
    }) };
}

export async function queryDailyRecords(request: DataTableQueryRequest, userId: string, signal: AbortSignal): Promise<DataTableQueryResult<DailyActivityRow>> {
  try {
    const query = dailyActivityRequest(request);
    const data = await requestActivity(query, userId, signal);
    const response = parseActivityDays(data, userId, query);
    return { rows: response.days, total: response.total };
  } catch (error) {
    if (error instanceof ApiRequestError) throw new DataTableQueryError(error.message);
    throw error;
  }
}
