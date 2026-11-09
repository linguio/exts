import { expect, it } from 'vitest';
import { validActivityDayUpdate } from '../../../src/features/activity/data/update-validation';

const id = '00000000-0000-4000-8000-000000000010';

it('接受合法局部更新', () => {
  expect(validActivityDayUpdate({ id, changes: { exerciseMinutes: 0, sleepMinutes: 30 } })).toBe(true);
});

it('拒绝未知字段、空变更与非整数', () => {
  expect(validActivityDayUpdate({ id, changes: {} })).toBe(false);
  expect(validActivityDayUpdate({ id, changes: { exerciseMinutes: 1.2 } })).toBe(false);
  expect(validActivityDayUpdate({ id, changes: { date: '2026-11-01' } as Record<string, unknown> })).toBe(false);
  expect(validActivityDayUpdate({ id: 'not-a-uuid', changes: { exerciseMinutes: 1 } })).toBe(false);
});
