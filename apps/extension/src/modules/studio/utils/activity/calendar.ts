import type { ActivityDay, ActivityRecords } from '../../types/activity';

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'] as const;

function localDateKey(date: Date) {
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
    const minutes = isFuture ? 0 : (records[key] ?? 0);
    const level = minutes === 0 ? 0 : minutes <= 30 ? 1 : minutes <= 60 ? 2 : 3;

    return {
      date: key,
      label: `${key.slice(5)} · ${weekdays[date.getDay()]}`,
      weekday: date.getDay(),
      minutes,
      level,
      isFuture,
    };
  });
}

export function formatActivityDuration(minutes: number) {
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}小时${remainder ? `${remainder}分钟` : ''}`;
}
