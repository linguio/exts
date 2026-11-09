import { ApiRequestError } from '../../../api/client';
import type { ActivityQuery } from '../../../api/activity';
import type { DailyActivityRow } from './types';
import { validActivityDate } from './date';
import { isActivityHourValue } from './hours';

const recordIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validRecordId(value: unknown): value is string {
  return typeof value === 'string' && recordIdPattern.test(value);
}

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
  const rows: DailyActivityRow[] = [];
  for (const item of value.days) {
    const day = item as Record<string, unknown>;
    if (!day || typeof day !== 'object' || !validRecordId(day.id) || day.userId !== userId || !validActivityDate(day.date)
      || (query.startDate && (day.date as string) < query.startDate) || (query.endDate && (day.date as string) > query.endDate)
      || dates.has(day.date as string)) throw invalid();
    dates.add(day.date as string);
    for (const field of ['exerciseHours', 'readingHours', 'learningHours', 'creationHours', 'sleepHours']) {
      const hours = day[field];
      if (hours !== null && (typeof hours !== 'number' || !isActivityHourValue(hours))) throw invalid();
    }
    if (typeof day.createdAt !== 'string' || !Number.isFinite(Date.parse(day.createdAt))
      || typeof day.updatedAt !== 'string' || !Number.isFinite(Date.parse(day.updatedAt))) throw invalid();
    rows.push({
      id: day.id as string,
      userId: day.userId as string,
      date: day.date as string,
      exerciseHours: day.exerciseHours as number | null,
      readingHours: day.readingHours as number | null,
      learningHours: day.learningHours as number | null,
      creationHours: day.creationHours as number | null,
      sleepHours: day.sleepHours as number | null,
      createdAt: day.createdAt as string,
      updatedAt: day.updatedAt as string,
    });
  }
  return { days: rows, total, pageIndex: value.pageIndex as number | null, pageSize: value.pageSize as number | null };
}
