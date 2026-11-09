import { expect, it } from 'vitest';
import { toActivityDayChanges } from '../../../src/features/activity/daily/update';

it('只映射五项时长并拒绝空 payload', () => {
  expect(toActivityDayChanges({ exerciseMinutes: 12, sleepMinutes: 0 })).toEqual({ exerciseMinutes: 12, sleepMinutes: 0 });
  expect(() => toActivityDayChanges({})).toThrowError(/至少需要一项变更/);
  expect(() => toActivityDayChanges({ exerciseMinutes: 1.2 })).toThrow();
});
