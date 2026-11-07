import { expect, it, vi } from 'vitest';
import { createSessionReset } from '../../../src/features/account/session-reset';

it('重置切换代次、取消旧请求并等待旧写入完成', async () => {
  const session = createSessionReset();
  const old = session.generation;
  expect(session.accepts(old)).toBe(true);
  const cancelled = vi.fn();
  session.onCancel(cancelled);
  let complete!: () => void;
  const write = session.track(() => new Promise<void>(resolve => { complete = resolve; }));
  let finished = false;
  const reset = session.begin().then(() => { finished = true; });
  expect(cancelled).toHaveBeenCalledOnce();
  expect(session.isCurrent(old)).toBe(false);
  await expect(session.track(async () => {})).rejects.toThrow('会话正在重置');
  expect(finished).toBe(false);
  complete();
  await write;
  await reset;
  expect(finished).toBe(true);
  session.finish();
  expect(session.accepts(old)).toBe(false);
  expect(session.accepts(session.generation)).toBe(true);
  expect(session.isCurrent(old)).toBe(false);
  expect(session.isCurrent(session.generation)).toBe(true);
});
