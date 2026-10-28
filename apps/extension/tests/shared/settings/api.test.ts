import { expect, it, vi } from 'vitest';

import { getSettings, SETTINGS_KEY, subscribeSettings, updateSettings } from '../../../src/shared/settings';
import { registerSettings } from '../../../src/shared/settings/background';

it('订阅 settings 对象变化并在取消后停止通知', () => {
  const listeners = new Set<(changes: Record<string, { newValue?: unknown }>, area: string) => void>();
  const api = { storage: { onChanged: { addListener: (listener: typeof listeners extends Set<infer T> ? T : never) => listeners.add(listener), removeListener: (listener: typeof listeners extends Set<infer T> ? T : never) => listeners.delete(listener) } } };
  const received: boolean[] = [];
  const stop = subscribeSettings(settings => received.push(settings.mediaDownload.enabled), api as never);
  for (const listener of listeners) listener({ settings: { newValue: { mediaDownload: { enabled: false } } } }, 'sync');
  for (const listener of listeners) listener({ settings: { newValue: { mediaDownload: { enabled: false } } } }, 'local');
  expect(received).toEqual([false]);
  stop();
  expect(listeners.size).toBe(0);
});

it('客户端读取统一配置，写入失败继续报告给设置区域', async () => {
  const api = {
    storage: { local: { get: vi.fn(async () => ({ settings: { theme: 'dark' } })) } },
    runtime: { sendMessage: vi.fn(async () => ({ ok: false, error: '保存失败' })) },
  };
  expect((await getSettings(api as never)).theme).toBe('dark');
  await expect(updateSettings({ theme: 'light' }, api as never)).rejects.toThrow('保存失败');
});

it('后台串行处理来自扩展页面的配置更新，拒绝网页内容脚本写入', async () => {
  const data: Record<string, unknown> = {};
  let listener!: (message: unknown, sender: unknown, respond: (response: unknown) => void) => boolean | void;
  const api = {
    storage: { local: {
      get: vi.fn(async () => structuredClone(data)),
      set: vi.fn(async (values: Record<string, unknown>) => { Object.assign(data, structuredClone(values)); }),
      remove: vi.fn(async () => {}),
    } },
    runtime: {
      id: 'exts-test', getURL: () => 'chrome-extension://exts-test/',
      onMessage: { addListener: (callback: typeof listener) => { listener = callback; } },
    },
  };
  registerSettings(api as never);
  const send = (sender: unknown, patch: unknown) => new Promise<unknown>(resolve => {
    listener({ type: 'exts:settings:update', patch }, sender, resolve);
  });
  const denied = await send({ id: 'exts-test', url: 'https://web.telegram.org/' }, { theme: 'dark' });
  expect(denied).toMatchObject({ ok: false });
  const trusted = { id: 'exts-test', url: 'chrome-extension://exts-test/newtab.html' };
  const results = await Promise.all([
    send(trusted, { theme: 'dark' }),
    send(trusted, { mediaDownload: { enabled: false } }),
  ]);
  expect(results).toEqual([expect.objectContaining({ ok: true }), expect.objectContaining({ ok: true })]);
  expect(data[SETTINGS_KEY]).toMatchObject({ theme: 'dark', mediaDownload: { enabled: false } });
});
