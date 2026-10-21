import { expect, it } from 'vitest';
import { mergeRecords, interruptRecords } from '../../../src/modules/downloads/history';

const record = (id: string, state: string = 'completed', owner = 'page-a') => ({
  id, source: 'telegram' as const, filename: `${id}.mp4`, state: state as any,
  loadedBytes: 1, createdAt: Number(id) || 1, owner, tabId: 4,
});

it('保留最近 200 条终态及全部活动记录，任务按来源和 ID 隔离', () => {
  const history = Array.from({ length: 205 }, (_, index) => record(String(index)));
  const result = mergeRecords(history, [record('active', 'downloading')]);
  expect(result).toHaveLength(201);
  expect(result.some(item => item.id === '0')).toBe(false);
  expect(result.some(item => item.id === '204')).toBe(true);
  expect(result.some(item => item.id === 'active')).toBe(true);
});

it('终态不会被迟到进度回退，返回记录不暴露内部引用', () => {
  const history = [record('1')];
  const next = mergeRecords(history, [record('1', 'downloading')]);
  expect(next[0]!.state).toBe('completed');
  next[0]!.filename = 'changed';
  expect(history[0]!.filename).toBe('1.mp4');
});

it('页面离开只中断该页面活动任务，完成记录和其他页面不受影响', () => {
  const next = interruptRecords([record('1', 'downloading'), record('2'), record('3', 'downloading', 'page-b')], item => item.owner === 'page-a');
  expect(next.find(item => item.id === '1')?.state).toBe('interrupted');
  expect(next.find(item => item.id === '2')?.state).toBe('completed');
  expect(next.find(item => item.id === '3')?.state).toBe('downloading');
});
