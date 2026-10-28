import { test } from 'vitest';
import assert from 'node:assert/strict';

import { createActivityCalendar, formatActivityDuration } from '../../../src/modules/studio/utils/activity/calendar';

test('日历显示本地当前周与前 23 周，周日开始，未来日期不计记录', () => {
  const days = createActivityCalendar({ '2026-10-21': 30, '2026-10-23': 90 }, new Date(2026, 9, 22, 0, 15));

  assert.equal(days.length, 168);
  assert.equal(days[0]?.date, '2026-05-10');
  assert.equal(days.at(-7)?.date, '2026-10-18');
  assert.equal(days.at(-1)?.date, '2026-10-24');
  assert.deepEqual(days.slice(-7).map((day) => day.weekday), [0, 1, 2, 3, 4, 5, 6]);
  assert.equal(days.find((day) => day.date === '2026-10-21')?.minutes, 30);
  assert.equal(days.find((day) => day.date === '2026-10-22')?.minutes, 0);
  assert.equal(days.find((day) => day.date === '2026-10-22')?.isFuture, false);
  assert.equal(days.find((day) => day.date === '2026-10-23')?.isFuture, true);
  assert.equal(days.find((day) => day.date === '2026-10-23')?.minutes, 0);
});

test('日历按 0、1–30、31–60、>60 分钟确定四档灰阶', () => {
  const days = createActivityCalendar({
    '2026-10-18': 0,
    '2026-10-19': 1,
    '2026-10-20': 30,
    '2026-10-21': 31,
    '2026-10-22': 60,
    '2026-10-23': 61,
    '2026-10-24': 90,
  }, new Date(2026, 9, 24));

  assert.deepEqual(days.slice(-7).map((day) => day.level), [0, 1, 1, 2, 2, 3, 3]);
});

test('本地日历在跨年和闰日时保留连续日期与正确的星期文案', () => {
  const newYear = createActivityCalendar({}, new Date(2027, 0, 1, 0, 15));
  assert.deepEqual(newYear.slice(-7).map((day) => day.date), [
    '2026-12-27', '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02',
  ]);

  const leapDay = createActivityCalendar({ '2024-02-29': 60 }, new Date(2024, 2, 2)).find((day) => day.date === '2024-02-29');
  assert.equal(leapDay?.label, '02-29 · 星期四');
  assert.equal(leapDay?.minutes, 60);
});

test('学习时长仅在需要时展示小时和剩余分钟', () => {
  for (const [minutes, expected] of [
    [0, '0分钟'], [30, '30分钟'], [59, '59分钟'], [60, '1小时'], [75, '1小时15分钟'], [90, '1小时30分钟'], [120, '2小时'],
  ] as const) {
    assert.equal(formatActivityDuration(minutes), expected);
  }
});

test('空活动记录仍生成完整日历，所有日期无记录且未来日期保留留白标记', () => {
  const days = createActivityCalendar({}, new Date(2026, 9, 28));
  assert.equal(days.length, 168);
  assert.ok(days.every(day => day.minutes === 0 && day.level === 0));
  assert.equal(days.filter(day => day.isFuture).length, 3);
  assert.equal(days.find(day => day.date === '2026-10-28')?.isFuture, false);
});
