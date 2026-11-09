import type { ActivityRecords, GrowthKey, GrowthHours } from './types';
import { localDateKey } from './date';

/** 分类、顺序、目标与灰阶在三个视图共用（小时）。 */
export const growthCategories = [
  { key: 'exercise', label: 'Exercise', goal: 3, color: 'var(--chart-1)' },
  { key: 'reading', label: 'Reading', goal: 5, color: 'var(--chart-2)' },
  { key: 'learning', label: 'Learning', goal: 20, color: 'var(--chart-3)' },
  { key: 'creation', label: 'Creation', goal: 3, color: 'var(--chart-4)' },
] as const satisfies ReadonlyArray<{ key: GrowthKey; label: string; goal: number; color: string }>;

export function sleepLevel(hours: number) {
  return hours < 6 ? 1 : hours < 7 ? 2 : hours <= 9 ? 3 : 4;
}

export function growthTotal(growth: GrowthHours = {}) {
  return growthCategories.reduce((sum, item) => sum + (growth[item.key] ?? 0), 0);
}

export function createActivityTrend(records: ActivityRecords, today: Date) {
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = localDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14 + index));
    const record = records[date];
    return {
      date,
      label: String(Number(date.slice(-2))),
      ...Object.fromEntries(growthCategories.map(item => [item.key, record?.growth?.[item.key] ?? 0])) as Record<GrowthKey, number>,
      total: growthTotal(record?.growth),
      sleepHours: record?.sleepHours,
      sleepColor: record?.sleepHours === undefined ? undefined : `var(--chart-${sleepLevel(record.sleepHours)})`,
    };
  });
  return { days, averageGrowth: days.reduce((sum, day) => sum + day.total, 0) / days.length };
}

export function createActivityWeek(records: ActivityRecords, today: Date) {
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const start = localDateKey(startDate);
  const end = localDateKey(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6));
  const todayKey = localDateKey(today);
  const dayIndex = (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(today.getFullYear(), 0, 1)) / 86400000;
  const weekNumber = Math.floor((dayIndex + new Date(today.getFullYear(), 0, 1).getDay()) / 7) + 1;
  const entries = Object.entries(records).filter(([date]) => date >= start && date <= end && date <= todayKey);
  const items = growthCategories.map(item => {
    const hours = entries.reduce((sum, [, record]) => sum + (record.growth?.[item.key] ?? 0), 0);
    const percent = hours / item.goal * 100;
    const progressLevel = Math.min(Math.ceil(percent / 25), 4);
    const progressFill = progressLevel === 0 ? 'var(--muted)' : `var(--chart-${progressLevel})`;
    return { ...item, hours, percent, progress: Math.min(percent, 100), fill: item.color, progressFill };
  });
  return { start, end, weekNumber, items, total: items.reduce((sum, item) => sum + item.hours, 0) };
}
