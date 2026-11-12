import { expect, it } from 'vitest';
import { Countdown } from '../../../../src/features/activity/timer/countdown';

it('手动选择按五分钟吸附并限制在零至六十分钟', () => {
  const timer = new Countdown();
  expect(timer.select(12)).toBe(10 * 60_000);
  expect(timer.select(63)).toBe(60 * 60_000);
  expect(timer.select(-1)).toBe(0);
});

it('以截止时间计算剩余量，迟到采样不累积漂移', () => {
  const timer = new Countdown();
  timer.start(5, 1000);
  expect(timer.sample(62_234)).toEqual({ remainingMs: 238_766, completed: false });
});

it('归零只完成一次，恢复采样不会重复提醒', () => {
  const timer = new Countdown();
  timer.start(5, 1000);
  expect(timer.sample(400_000)).toEqual({ remainingMs: 0, completed: true });
  expect(timer.sample(500_000)).toEqual({ remainingMs: 0, completed: false });
});

it('再次选择先停止原计时，提交新值后使用新截止时间', () => {
  const timer = new Countdown();
  timer.start(5, 1000);
  expect(timer.select(15)).toBe(900_000);
  expect(timer.sample(999_999)).toEqual({ remainingMs: 900_000, completed: false });
  timer.start(15, 1_000_000);
  expect(timer.sample(1_001_500)).toEqual({ remainingMs: 898_500, completed: false });
});

it('选择零取消计时，不触发结束提醒', () => {
  const timer = new Countdown();
  timer.start(60, 0);
  timer.start(0, 1000);
  expect(timer.sample(9_000_000)).toEqual({ remainingMs: 0, completed: false });
});
