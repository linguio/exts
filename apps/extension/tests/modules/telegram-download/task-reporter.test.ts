import { expect, it, vi } from 'vitest';
import { createTaskReporter } from '../../../src/modules/telegram-download/task-reporter';

it('开始立即上报，合并进度，终态立即保存且不重发其他历史任务', () => {
  vi.useFakeTimers();
  try {
    const send = vi.fn();
    const reporter = createTaskReporter(send);
    const task = { id: 'a', filename: 'a.mp4', loadedBytes: 0, state: 'downloading' as const };
    reporter.update({ tasks: [task] });
    expect(send).toHaveBeenCalledTimes(1);
    for (let loadedBytes = 1; loadedBytes < 20; loadedBytes++) reporter.update({ tasks: [{ ...task, loadedBytes }] });
    expect(send).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(250);
    expect(send.mock.lastCall?.[0].tasks[0].loadedBytes).toBe(19);
    reporter.update({ tasks: [{ ...task, state: 'completed', loadedBytes: 20 }] });
    expect(send).toHaveBeenCalledTimes(3);
    reporter.update({ tasks: [{ ...task, state: 'completed', loadedBytes: 20 }, { ...task, id: 'b' }] });
    expect(send.mock.lastCall?.[0].tasks.map((item: any) => item.id)).toEqual(['b']);
  } finally { vi.useRealTimers(); }
});
