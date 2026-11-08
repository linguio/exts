export function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const shanghai = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
});

/** 返回上海业务年月日的日历表示，后续仅使用年月日进行日期运算。 */
export function activityToday(instant = new Date()) {
  const parts = Object.fromEntries(shanghai.formatToParts(instant).map(part => [part.type, part.value]));
  return new Date(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
}

export function nextActivityMidnight(instant: Date) {
  const today = activityToday(instant);
  return Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1) - 8 * 60 * 60 * 1000;
}

export function validActivityDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

