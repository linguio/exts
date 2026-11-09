import { localDateKey } from './date';
import type { ActivityDay, ActivityRecords } from './types';

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'] as const;

/** 日期运算使用本地日历，避免 UTC 截日与夏令时导致日期偏移。 */
export function createActivityCalendar(records: ActivityRecords, today: Date): ActivityDay[] {
  const todayKey = localDateKey(today);
  const firstDay = today.getDate() - today.getDay() - 23 * 7;

  return Array.from({ length: 24 * 7 }, (_, offset) => {
    const date = new Date(today.getFullYear(), today.getMonth(), firstDay + offset);
    const key = localDateKey(date);
    const isFuture = key > todayKey;
    const growth = isFuture ? {} : (records[key]?.growth ?? {});
    const values = Object.values(growth);
    const hours = values.reduce((sum, value) => sum + value, 0);
    const level = values.filter(value => value >= 0.5).length as ActivityDay['level'];

    return {
      date: key,
      label: `${key.slice(5)} · ${weekdays[date.getDay()]}`,
      weekday: date.getDay(),
      hours,
      growth,
      level,
      isFuture,
    };
  });
}
