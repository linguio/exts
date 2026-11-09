import { expect, test } from 'vitest';
import { toActivityDayDurationValues, toActivityDayUpdate } from '../../../src/features/activity/daily/update';

test('maps validated hour fields to flat update payload', () => {
  expect(toActivityDayDurationValues({ exerciseHours: 1, sleepHours: 0 })).toEqual({ exerciseHours: 1, sleepHours: 0 });
  expect(toActivityDayUpdate('00000000-0000-4000-8000-000000000010', {
    exerciseHours: 0, readingHours: 0, learningHours: 0, creationHours: 0, sleepHours: 0,
  })).toEqual({
    id: '00000000-0000-4000-8000-000000000010',
    exerciseHours: 0, readingHours: 0, learningHours: 0, creationHours: 0, sleepHours: 0,
  });
  expect(() => toActivityDayDurationValues({ exerciseHours: 0.25 })).toThrow();
  expect(() => toActivityDayDurationValues({})).toThrow();
});
