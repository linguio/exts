import { ApiRequestError } from '../../../api/client';
import type { ActivityQuery } from '../../../api/activity';
import type { DailyActivityRow } from './types';
import { validActivityDate } from './date';

export interface ActivityDaysResponse {
  days: DailyActivityRow[];
  total: number;
  pageIndex: number | null;
  pageSize: number | null;
}

/** 校验记录归属及完整性，避免把部分范围数据用于图表统计。 */
export function parseActivityDays(data: unknown, userId: string, query: ActivityQuery): ActivityDaysResponse {
  const invalid = () => new ApiRequestError('INVALID_RESPONSE', '活动数据格式无效');
  if (!data || typeof data !== 'object') throw invalid();
  const value = data as Record<string, unknown>;
  if (!Array.isArray(value.days) || !Number.isSafeInteger(value.total) || (value.total as number) < 0
    || value.pageIndex !== (query.pageIndex ?? null) || value.pageSize !== (query.pageSize ?? null)) throw invalid();
  const total = value.total as number;
  const count = query.pageSize === undefined ? total : Math.min(query.pageSize, Math.max(0, total - query.pageIndex! * query.pageSize));
  if (value.days.length !== count || (query.pageSize === undefined && total > 500)) throw invalid();
  const dates = new Set<string>();
  for (const day of value.days) {
    if (!day || typeof day !== 'object' || day.userId !== userId || !validActivityDate(day.date)
      || (query.startDate && day.date < query.startDate) || (query.endDate && day.date > query.endDate) || dates.has(day.date)) throw invalid();
    dates.add(day.date);
    for (const field of ['exerciseMinutes', 'readingMinutes', 'learningMinutes', 'creationMinutes', 'sleepMinutes']) {
      const minutes = day[field];
      if (minutes !== null && (typeof minutes !== 'number' || !Number.isSafeInteger(minutes) || minutes < 0)) throw invalid();
    }
    if (typeof day.createdAt !== 'string' || !Number.isFinite(Date.parse(day.createdAt))
      || typeof day.updatedAt !== 'string' || !Number.isFinite(Date.parse(day.updatedAt))) throw invalid();
  }
  return { days: value.days, total, pageIndex: value.pageIndex as number | null, pageSize: value.pageSize as number | null };
}
