import type { ActivityDay, ActivityRecords } from '../../types/activity';

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'] as const;

export function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

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
    const minutes = values.reduce((sum, value) => sum + value, 0);
    const level = values.filter(value => value >= 30).length as ActivityDay['level'];

    return {
      date: key,
      label: `${key.slice(5)} · ${weekdays[date.getDay()]}`,
      weekday: date.getDay(),
      minutes,
      growth,
      level,
      isFuture,
    };
  });
}

function activityHours(minutes: number) {
  return String(Number((minutes / 60).toFixed(1)));
}

export function formatActivityDuration(minutes: number) {
  return `${activityHours(minutes)}h`;
}

export function formatActivityProgress(minutes: number, percent: number, goal?: number) {
  return `${Math.round(percent)}% / ${formatActivityDuration(goal ?? minutes)}`;
}
