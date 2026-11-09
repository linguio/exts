import { expect, test } from 'vitest';
import { parseActivityDayUpdate } from '../../../src/features/activity/data/update-validation';

const recordId = '00000000-0000-4000-8000-000000000010';

test('accepts valid hour fields and all-zero updates', () => {
  expect(parseActivityDayUpdate({ id: recordId, exerciseHours: 0.5 })).toEqual({
    ok: true, update: { id: recordId, exerciseHours: 0.5 },
  });
  expect(parseActivityDayUpdate({
    id: recordId,
    exerciseHours: 0, readingHours: 0, learningHours: 0, creationHours: 0, sleepHours: 0,
  })).toEqual({
    ok: true,
    update: { id: recordId, exerciseHours: 0, readingHours: 0, learningHours: 0, creationHours: 0, sleepHours: 0 },
  });
});

test('rejects bad id, non-half-hour values and unknown fields', () => {
  expect(parseActivityDayUpdate({ id: 'bad', exerciseHours: 1 })).toMatchObject({
    ok: false, message: 'Activity record id is missing or invalid.',
  });
  expect(parseActivityDayUpdate({ id: recordId })).toMatchObject({
    ok: false, message: 'Activity update must include at least one hour field.',
  });
  expect(parseActivityDayUpdate({ id: recordId, exerciseHours: 0.25 })).toMatchObject({
    ok: false, message: 'exerciseHours must be a non-negative number in 0.5-hour steps.',
  });
  expect(parseActivityDayUpdate({ id: recordId, typo: 1 })).toMatchObject({
    ok: false, message: 'Unknown activity field: typo.',
  });
});
