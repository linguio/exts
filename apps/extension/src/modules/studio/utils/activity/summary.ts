import type { ActivityRecords, GrowthKey, GrowthMinutes } from '../../types/activity';
import { localDateKey } from './calendar';

/** 分类、顺序、目标与灰阶在三个视图共用。 */
export const growthCategories = [
  { key: 'exercise', label: 'Exercise', goal: 180, color: 'var(--chart-1)' },
  { key: 'reading', label: 'Reading', goal: 300, color: 'var(--chart-2)' },
  { key: 'learning', label: 'Learning', goal: 1200, color: 'var(--chart-3)' },
  { key: 'creation', label: 'Creation', goal: 180, color: 'var(--chart-4)' },
] as const satisfies ReadonlyArray<{ key: GrowthKey; label: string; goal: number; color: string }>;

export function sleepLevel(minutes: number) {
  return minutes < 360 ? 1 : minutes < 420 ? 2 : minutes <= 540 ? 3 : 4;
}

export function growthTotal(growth: GrowthMinutes = {}) {
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
      sleepMinutes: record?.sleepMinutes,
      sleepColor: record?.sleepMinutes === undefined ? undefined : `var(--chart-${sleepLevel(record.sleepMinutes)})`,
    };
  });
  return { days, averageGrowth: days.reduce((sum, day) => sum + day.total, 0) / days.length };
}

export function createActivityWeek(records: ActivityRecords, today: Date) {
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const start = localDateKey(startDate);
  const end = localDateKey(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6));
  const todayKey = localDateKey(today);
  // 以本地年月日映射 UTC 天数，避免夏令时影响；周日开始，含元旦的周为第1周。
  const dayIndex = (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(today.getFullYear(), 0, 1)) / 86400000;
  const weekNumber = Math.floor((dayIndex + new Date(today.getFullYear(), 0, 1).getDay()) / 7) + 1;
  const entries = Object.entries(records).filter(([date]) => date >= start && date <= end && date <= todayKey);
  const items = growthCategories.map(item => {
    const minutes = entries.reduce((sum, [, record]) => sum + (record.growth?.[item.key] ?? 0), 0);
    const percent = minutes / item.goal * 100;
    const progressLevel = Math.min(Math.ceil(percent / 25), 4);
    const progressFill = progressLevel === 0 ? 'var(--muted)' : `var(--chart-${progressLevel})`;
    return { ...item, minutes, percent, progress: Math.min(percent, 100), fill: item.color, progressFill };
  });
  return { start, end, weekNumber, items, total: items.reduce((sum, item) => sum + item.minutes, 0) };
}
