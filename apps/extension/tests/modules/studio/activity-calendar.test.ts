import { test } from 'vitest';
import assert from 'node:assert/strict';
import { createActivityCalendar, formatActivityDuration, formatActivityProgress } from '../../../src/modules/studio/utils/activity/calendar';
import { createActivityTrend, createActivityWeek, sleepLevel } from '../../../src/modules/studio/utils/activity/summary';

test('日历保留本地24周、周日开始与未来留白，按完成项数分档', () => {
  const days = createActivityCalendar({
    '2026-10-18': { growth: { exercise: 29 } },
    '2026-10-19': { growth: { exercise: 30 } },
    '2026-10-20': { growth: { exercise: 30, reading: 30 } },
    '2026-10-21': { growth: { exercise: 30, reading: 30, learning: 30, creation: 20 } },
    '2026-10-22': { growth: { exercise: 30, reading: 30, learning: 30, creation: 180 } },
    '2026-10-23': { growth: { creation: 90 } },
  }, new Date(2026, 9, 22, 0, 15));
  assert.equal(days.length, 168);
  assert.equal(days[0]?.date, '2026-05-10');
  assert.deepEqual(days.slice(-7).map(day => day.weekday), [0, 1, 2, 3, 4, 5, 6]);
  assert.deepEqual(days.slice(-7).map(day => day.level), [0, 1, 2, 3, 4, 0, 0]);
  assert.equal(days.at(-2)?.isFuture, true);
  assert.equal(days.at(-2)?.minutes, 0);
  assert.equal(days.at(-3)?.minutes, 270);
});

test('本地日历跨年与闰日连续，缺失记录保留空日历', () => {
  const newYear = createActivityCalendar({}, new Date(2027, 0, 1));
  assert.deepEqual(newYear.slice(-7).map(day => day.date), [
    '2026-12-27', '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02',
  ]);
  assert.ok(newYear.every(day => day.minutes === 0 && day.level === 0));
  const leapDay = createActivityCalendar({ '2024-02-29': { growth: { reading: 60 } } }, new Date(2024, 2, 2)).find(day => day.date === '2024-02-29');
  assert.equal(leapDay?.label, '02-29 · 星期四');
  assert.equal(leapDay?.minutes, 60);
});

test('时长使用小写h，最多一位小数，零和整数不保留小数点', () => {
  for (const [minutes, expected] of [[0, '0h'], [20, '0.3h'], [30, '0.5h'], [59, '1h'], [60, '1h'], [75, '1.3h'], [80, '1.3h'], [90, '1.5h'], [120, '2h']] as const) {
    assert.equal(formatActivityDuration(minutes), expected);
  }
});

test('周投入显示百分比和投入时长，周计划显示完成率和目标时长', () => {
  assert.equal(formatActivityProgress(300, 30), '30% / 5h');
  assert.equal(formatActivityProgress(720, 120, 600), '120% / 10h');
  assert.equal(formatActivityProgress(0, 0), '0% / 0h');
  assert.equal(formatActivityProgress(0, 0, 300), '0% / 5h');
  assert.equal(formatActivityProgress(75, 25, 300), '25% / 5h');
});

test('趋势保留截至昨天的14个自然日及日号，缺失睡眠留空，零散投入不丢失', () => {
  const trend = createActivityTrend({
    '2026-10-19': { growth: { creation: 1000 }, sleepMinutes: 900 },
    '2026-10-20': { sleepMinutes: 360 },
    '2026-11-02': { growth: { reading: 20 }, sleepMinutes: 480 },
    '2026-11-03': { growth: { creation: 500 }, sleepMinutes: 1000 },
    '2026-11-04': { sleepMinutes: 1000 },
  }, new Date(2026, 10, 3));
  assert.equal(trend.days.length, 14);
  assert.equal(trend.days[0]?.date, '2026-10-20');
  assert.equal(trend.days.at(-1)?.date, '2026-11-02');
  assert.equal(trend.days.at(-2)?.sleepMinutes, undefined);
  assert.equal(trend.days.at(-1)?.reading, 20);
  assert.deepEqual(trend.days.slice(-4).map(day => day.label), ['30', '31', '1', '2']);
  assert.equal(trend.averageGrowth, 20 / 14);
  assert.equal(createActivityTrend({}, new Date()).averageGrowth, 0);
  assert.deepEqual([359, 360, 419, 420, 540, 541].map(sleepLevel), [1, 2, 2, 3, 3, 4]);
});

test('周统计按周日至周六，保留实际超额比例，仅截断进度环', () => {
  const records = {
    '2026-10-31': { growth: { reading: 999 } },
    '2026-11-01': { growth: { exercise: 20, reading: 120 } },
    '2026-11-03': { growth: { reading: 240, creation: 60 } },
    '2026-11-04': { growth: { learning: 999 } },
  };
  const week = createActivityWeek(records, new Date(2026, 10, 3));
  assert.equal(week.start, '2026-11-01');
  assert.equal(week.end, '2026-11-07');
  assert.equal(week.total, 440);
  assert.deepEqual(week.items.map(item => item.key), ['exercise', 'reading', 'learning', 'creation']);
  assert.equal(week.items[1]?.minutes, 360);
  assert.equal(week.items[1]?.percent, 120);
  assert.equal(week.items[1]?.progress, 100);
  assert.equal(week.items[2]?.minutes, 0);
  assert.equal(createActivityWeek(records, new Date(2026, 10, 1)).total, 140);
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
  const fills = [0, 75, 76, 150, 151, 225, 226, 300, 360].map(minutes => {
    const week = createActivityWeek({ '2026-11-01': { growth: { reading: minutes } } }, new Date(2026, 10, 3));
    assert.equal(week.items[1]?.fill, 'var(--chart-2)');
    return week.items[1]?.progressFill;
  });
  assert.deepEqual(fills, ['var(--muted)', ...[1, 2, 2, 3, 3, 4, 4, 4].map(level => `var(--chart-${level})`)]);
});
