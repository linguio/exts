import { expect, test } from 'vitest';
import { activityRecords } from '../../../src/features/activity/data/chart-data';
import { createActivityTrend } from '../../../src/features/activity/data/summary';

const userId = 'user-1';
const period = { startDate: '2026-11-01', endDate: '2026-11-02' };
const day = { id: '00000000-0000-4000-8000-000000000010', userId: 'user-1', date: '2026-11-02', exerciseHours: null, readingHours: 0,
  learningHours: 1, creationHours: null, sleepHours: null,
  createdAt: '2026-11-02T08:00:00+08:00', updatedAt: '2026-11-02T09:00:00+08:00' };

test('records map rows to chart keys and reject malformed hours', () => {
  const records = activityRecords({ days: [day], total: 1, pageIndex: null, pageSize: null }, userId, period);
  expect(records['2026-11-02']?.growth).toEqual({ reading: 0, learning: 1 });
  const trend = createActivityTrend(records, new Date('2026-11-02'));
  expect(trend.days.at(-1)?.sleepHours).toBeUndefined();
  expect(() => activityRecords({ days: [{ ...day, exerciseHours: -1 }], total: 1, pageIndex: null, pageSize: null }, userId, period)).toThrow();
  expect(() => activityRecords({ days: [{ ...day, sleepHours: undefined }], total: 1, pageIndex: null, pageSize: null }, userId, period)).toThrow();
});
