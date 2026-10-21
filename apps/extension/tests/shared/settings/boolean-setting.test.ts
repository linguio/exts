import { expect, it } from 'vitest';
import { createBooleanSetting } from '../../../src/shared/settings/boolean-setting';

it('默认开启只用于缺省值，显式关闭可持久化且订阅可释放', async () => {
  let stored: unknown;
  const listeners = new Set<(changes: Record<string, { newValue?: unknown }>, area: string) => void>();
  const api = {
    local: {
      get: async () => ({ enabled: stored }),
      set: async (values: Record<string, unknown>) => { stored = values.enabled; },
    },
    onChanged: { addListener: (fn: any) => listeners.add(fn), removeListener: (fn: any) => listeners.delete(fn) },
  };
  const setting = createBooleanSetting('enabled', true, api);
  expect(await setting.get()).toBe(true);
  await setting.set(false);
  expect(await setting.get()).toBe(false);
  const updates: boolean[] = [];
  const stop = setting.subscribe(value => updates.push(value));
  for (const listener of listeners) listener({ enabled: { newValue: true } }, 'sync');
  expect(updates).toEqual([]);
  for (const listener of listeners) listener({ enabled: { newValue: false } }, 'local');
  expect(updates).toEqual([false]);
  stop();
  expect(listeners.size).toBe(0);
});

it('配置读取或保存失败向调用方报告，不当作默认开启', async () => {
  const setting = createBooleanSetting('enabled', true, {
    local: { get: async () => { throw Error('read'); }, set: async () => { throw Error('write'); } },
    onChanged: { addListener() {}, removeListener() {} },
  });
  await expect(setting.get()).rejects.toThrow('read');
  await expect(setting.set(true)).rejects.toThrow('write');
});
