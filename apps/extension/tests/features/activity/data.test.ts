import { expect, it } from 'vitest';
import { activityPeriod, activityRecords } from '../../../src/features/activity/data/chart-data';
import { activityToday, nextActivityMidnight } from '../../../src/features/activity/data/date';
import { localDateKey } from '../../../src/features/activity/data/date';
import { createActivityTrend } from '../../../src/features/activity/data/summary';

const period = { startDate: '2026-11-01', endDate: '2026-11-06' };
const day = { userId: 'user-1', date: '2026-11-02', exerciseMinutes: null, readingMinutes: 0,
  learningMinutes: 60, creationMinutes: null, sleepMinutes: null,
  createdAt: '2026-11-02T00:00:00+08:00', updatedAt: '2026-11-02T09:00:00+08:00' };

it('平铺响应映射为图表组合，保留零与缺失，不复制元数据参与统计', () => {
  const records = activityRecords({ days: [day] }, 'user-1', period);
  expect(records).toEqual({ '2026-11-02': { growth: { reading: 0, learning: 60 } } });
  const trend = createActivityTrend(records, new Date(2026, 10, 3));
  expect(trend.averageGrowth).toBe(60 / 14);
  expect(trend.days.at(-1)?.sleepMinutes).toBeUndefined();
  expect(activityRecords({ days: [] }, 'user-1', period)).toEqual({});
});

it('拒绝其他用户、重复日期、非法时长和越界数据，不静默当作空数据', () => {
  const cases = [
    { days: [{ ...day, userId: 'other' }] }, { days: [day, day] },
    { days: [{ ...day, exerciseMinutes: -1 }] }, { days: [{ ...day, sleepMinutes: undefined }] },
    { days: [{ ...day, date: '2026-11-31' }] }, { days: [{ ...day, date: '2026-10-31' }] },
  ];
  for (const data of cases) expect(() => activityRecords(data, 'user-1', period)).toThrow('活动数据格式无效');
});

it('日历含今天、趋势仅至昨天、周汇总到今天，上海跨日不随设备时区', () => {
  const today = new Date(2026, 10, 6);
  expect(activityPeriod('calendar', today)).toEqual({ startDate: '2026-05-24', endDate: '2026-11-06' });
  expect(activityPeriod('chart', today)).toEqual({ startDate: '2026-10-23', endDate: '2026-11-05' });
  expect(activityPeriod('pie', today)).toEqual({ startDate: '2026-11-01', endDate: '2026-11-06' });
  expect(localDateKey(activityToday(new Date('2026-11-06T15:59:00Z')))).toBe('2026-11-06');
  expect(localDateKey(activityToday(new Date('2026-11-06T16:00:00Z')))).toBe('2026-11-07');
  expect(nextActivityMidnight(new Date('2026-11-06T16:05:00Z'))).toBe(Date.parse('2026-11-07T16:00:00Z'));
});
