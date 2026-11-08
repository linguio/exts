import { ApiRequestError } from '../../../api/client';
import type { ActivityPeriod } from '../../../api/activity';
import { localDateKey, activityToday, validActivityDate } from './date';
import type { ActivityRecords, GrowthMinutes } from './types';

export type ActivityView = 'calendar' | 'chart' | 'pie';

export function activityPeriod(view: ActivityView, today = activityToday()): ActivityPeriod {
  const dateAt = (offset: number) => localDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset));
  if (view === 'chart') return { startDate: dateAt(-14), endDate: dateAt(-1) };
  return { startDate: dateAt(-today.getDay() - (view === 'calendar' ? 23 * 7 : 0)), endDate: dateAt(0) };
}

const growthFields = [
  ['exerciseMinutes', 'exercise'], ['readingMinutes', 'reading'],
  ['learningMinutes', 'learning'], ['creationMinutes', 'creation'],
] as const;

export function activityRecords(data: unknown, userId: string, period: ActivityPeriod): ActivityRecords {
  const invalid = () => new ApiRequestError('INVALID_RESPONSE', '活动数据格式无效');
  if (!data || typeof data !== 'object' || !('days' in data) || !Array.isArray(data.days)) throw invalid();
  const records: Record<string, { growth: GrowthMinutes; sleepMinutes?: number }> = {};
  for (const day of data.days) {
    if (!day || typeof day !== 'object' || day.userId !== userId || !validActivityDate(day.date)
      || day.date < period.startDate || day.date > period.endDate || Object.hasOwn(records, day.date)) throw invalid();
    for (const field of [...growthFields.map(([field]) => field), 'sleepMinutes']) {
      const value = day[field];
      if (value !== null && (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0)) throw invalid();
    }
    if (typeof day.createdAt !== 'string' || !Number.isFinite(Date.parse(day.createdAt))
      || typeof day.updatedAt !== 'string' || !Number.isFinite(Date.parse(day.updatedAt))) throw invalid();
    const growth: GrowthMinutes = {};
    for (const [field, key] of growthFields) if (day[field] !== null) growth[key] = day[field];
    records[day.date] = { growth, ...(day.sleepMinutes !== null ? { sleepMinutes: day.sleepMinutes } : {}) };
  }
  return records;
}
