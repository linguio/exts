import { test } from 'vitest';
import assert from 'node:assert/strict';
import { createActivityCalendar } from '../../../src/features/activity/data/calendar';
import { formatActivityDuration, formatActivityProgress } from '../../../src/features/activity/data/format';
import { createActivityTrend, createActivityWeek, sleepLevel } from '../../../src/features/activity/data/summary';

test('日历保留本地24周、周日开始与未来留白，按完成项数分档', () => {
  const days = createActivityCalendar({
    '2026-10-18': { growth: { exercise: 0.25 } },
    '2026-10-19': { growth: { exercise: 0.5 } },
    '2026-10-20': { growth: { exercise: 0.5, reading: 0.5 } },
    '2026-10-21': { growth: { exercise: 0.5, reading: 0.5, learning: 0.5, creation: 0 } },
    '2026-10-22': { growth: { exercise: 0.5, reading: 0.5, learning: 0.5, creation: 3 } },
    '2026-10-23': { growth: { creation: 1.5 } },
  }, new Date(2026, 9, 22, 0, 15));
  assert.equal(days.length, 168);
  assert.equal(days[0]?.date, '2026-05-10');
  assert.deepEqual(days.slice(-7).map(day => day.weekday), [0, 1, 2, 3, 4, 5, 6]);
  assert.deepEqual(days.slice(-7).map(day => day.level), [0, 1, 2, 3, 4, 0, 0]);
  assert.equal(days.at(-2)?.isFuture, true);
  assert.equal(days.at(-2)?.hours, 0);
  assert.equal(days.at(-3)?.hours, 4.5);
});

test('本地日历跨年与闰日连续，缺失记录保留空日历', () => {
  const newYear = createActivityCalendar({}, new Date(2027, 0, 1));
  assert.deepEqual(newYear.slice(-7).map(day => day.date), [
    '2026-12-27', '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02',
  ]);
  assert.ok(newYear.every(day => day.hours === 0 && day.level === 0));
  const leapDay = createActivityCalendar({ '2024-02-29': { growth: { reading: 1 } } }, new Date(2024, 2, 2)).find(day => day.date === '2024-02-29');
  assert.equal(leapDay?.label, '02-29 · 星期四');
  assert.equal(leapDay?.hours, 1);
});

test('时长使用小写h，最多一位小数，零和整数不保留小数点', () => {
  for (const [hours, expected] of [[0, '0h'], [0.5, '0.5h'], [1, '1h'], [1.3, '1.3h'], [2, '2h']] as const) {
    assert.equal(formatActivityDuration(hours), expected);
  }
});

test('周投入显示百分比和投入时长，周计划显示完成率和目标时长', () => {
  assert.equal(formatActivityProgress(5, 100), '100% / 5h');
  assert.equal(formatActivityProgress(12, 120, 10), '120% / 10h');
  assert.equal(formatActivityProgress(0, 0), '0% / 0h');
  assert.equal(formatActivityProgress(0, 0, 5), '0% / 5h');
  assert.equal(formatActivityProgress(1.25, 25, 5), '25% / 5h');
});

test('趋势保留截至昨天的14个自然日及日号，缺失睡眠留空，零散投入不丢失', () => {
  const trend = createActivityTrend({
    '2026-10-19': { growth: { creation: 16.5 }, sleepHours: 15 },
    '2026-10-20': { sleepHours: 6 },
    '2026-11-02': { growth: { reading: 0.5 }, sleepHours: 8 },
    '2026-11-03': { growth: { creation: 8.5 }, sleepHours: 16.5 },
    '2026-11-04': { sleepHours: 16.5 },
  }, new Date(2026, 10, 3));
  assert.equal(trend.days.length, 14);
  assert.equal(trend.days[0]?.date, '2026-10-20');
  assert.equal(trend.days.at(-1)?.date, '2026-11-02');
  assert.equal(trend.days.at(-2)?.sleepHours, undefined);
  assert.equal(trend.days.at(-1)?.reading, 0.5);
  assert.deepEqual(trend.days.slice(-4).map(day => day.label), ['30', '31', '1', '2']);
  assert.equal(trend.averageGrowth, 0.5 / 14);
  assert.equal(createActivityTrend({}, new Date()).averageGrowth, 0);
  assert.deepEqual([5.9, 6, 6.9, 7, 9, 9.1].map(sleepLevel), [1, 2, 2, 3, 3, 4]);
});

test('周统计按周日至周六，保留实际超额比例，仅截断进度环', () => {
  const records = {
    '2026-10-31': { growth: { reading: 16.5 } },
    '2026-11-01': { growth: { exercise: 0.5, reading: 2 } },
    '2026-11-03': { growth: { reading: 4, creation: 1 } },
    '2026-11-04': { growth: { learning: 16.5 } },
  };
  const week = createActivityWeek(records, new Date(2026, 10, 3));
  assert.equal(week.start, '2026-11-01');
  assert.equal(week.end, '2026-11-07');
  assert.equal(week.total, 7.5);
  assert.deepEqual(week.items.map(item => item.key), ['exercise', 'reading', 'learning', 'creation']);
  assert.equal(week.items[1]?.hours, 6);
  assert.equal(week.items[1]?.percent, 120);
  assert.equal(week.items[1]?.progress, 100);
  assert.equal(week.items[2]?.hours, 0);
  assert.equal(createActivityWeek(records, new Date(2026, 10, 1)).total, 2.5);
  assert.equal(createActivityWeek({}, new Date(2026, 10, 3)).total, 0);
});

test('周号以周日开始且含元旦的周为第一周，和周统计范围一致', () => {
  for (const [year, month, day, expected] of [
    [2026, 10, 3, 45],
    [2026, 10, 7, 45],
    [2026, 10, 8, 46],
    [2027, 0, 1, 1],
    [2027, 0, 2, 1],
    [2027, 0, 3, 2],
  ] as const) {
    assert.equal(createActivityWeek({}, new Date(year, month, day)).weekNumber, expected);
  }
});

test('周计划环按每25%分档，与项目配色分离，超额保持最高档', () => {
  const fills = [0, 1.25, 1.3, 2.5, 2.6, 3.75, 3.8, 5, 6].map(hours => {
    const week = createActivityWeek({ '2026-11-01': { growth: { reading: hours } } }, new Date(2026, 10, 3));
    assert.equal(week.items[1]?.fill, 'var(--chart-2)');
    return week.items[1]?.progressFill;
  });
  assert.deepEqual(fills, ['var(--muted)', ...[1, 2, 2, 3, 3, 4, 4, 4].map(level => `var(--chart-${level})`)]);
});
