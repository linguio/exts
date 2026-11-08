import { activitySortFields, type ActivityQuery } from '../../../api/activity';
import { validActivityDate } from './date';

/** 后台仅接收业务参数；不允许页面指定请求地址、头部或其他 HTTP 选项。 */
export function validActivityQuery(query: ActivityQuery): boolean {
  if (query.startDate !== undefined && !validActivityDate(query.startDate)) return false;
  if (query.endDate !== undefined && !validActivityDate(query.endDate)) return false;
  if (query.startDate && query.endDate && query.startDate > query.endDate) return false;
  if ((query.pageIndex === undefined) !== (query.pageSize === undefined)) return false;
  if (query.pageIndex !== undefined) {
    if (!Number.isSafeInteger(query.pageIndex) || query.pageIndex < 0
      || !Number.isSafeInteger(query.pageSize) || query.pageSize! < 1 || query.pageSize! > 100) return false;
  } else if (!query.startDate || !query.endDate) return false;
  if (query.sort !== undefined && (!Array.isArray(query.sort) || query.sort.length > activitySortFields.length
    || query.sort.some(item => !item || !activitySortFields.includes(item.field) || !['asc', 'desc'].includes(item.order))
    || new Set(query.sort.map(item => item.field)).size !== query.sort.length)) return false;
  return true;
}
