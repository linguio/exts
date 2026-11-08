import { parseActivityDays } from './response';
import type { ActivityPeriod } from '../../../api/activity';
import { localDateKey, activityToday } from './date';
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
  const response = parseActivityDays(data, userId, period);
  const records: Record<string, { growth: GrowthMinutes; sleepMinutes?: number }> = {};
  for (const day of response.days) {
    const growth: GrowthMinutes = {};
    for (const [field, key] of growthFields) if (day[field] !== null) growth[key] = day[field];
    records[day.date] = { growth, ...(day.sleepMinutes !== null ? { sleepMinutes: day.sleepMinutes } : {}) };
  }
  return records;
}
