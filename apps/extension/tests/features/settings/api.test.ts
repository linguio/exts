import { expect, it, vi } from 'vitest';

import { getSettings, subscribeSettings, updateSettings } from '../../../src/features/settings/index';
import { registerSettings } from '../../../src/features/settings/background';

const settings = { theme: 'dark', mediaDownload: { enabled: true }, historyCleaner: { enabled: false } };

it('本地副本变化通知页面，取消订阅后停止', () => {
  const listeners = new Set<(changes: Record<string, { newValue?: unknown }>, area: string) => void>();
  const api = { storage: { onChanged: { addListener: (listener: typeof listeners extends Set<infer T> ? T : never) => listeners.add(listener),
    removeListener: (listener: typeof listeners extends Set<infer T> ? T : never) => listeners.delete(listener) } } };
  const received: boolean[] = [];
  const stop = subscribeSettings(value => received.push(value.mediaDownload.enabled), api as never);
  for (const listener of listeners) listener({ settings: { newValue: { userId: 'account-a', ...settings } } }, 'local');
  expect(received).toEqual([true]);
  stop();
  expect(listeners.size).toBe(0);
});

it('客户端读取后台值，保存失败向设置区域报告', async () => {
  const api = { runtime: { sendMessage: vi.fn(async (message: { action: string }) => message.action === 'get'
    ? { ok: true, settings } : { ok: false, error: { message: '保存失败' } }) } };
  expect(await getSettings(api as never)).toEqual(settings);
  await expect(updateSettings({ theme: 'light' }, api as never, 'fixture-generation')).rejects.toThrow('保存失败');
});

it('后台拒绝网页内容脚本写设置', async () => {
  let listener!: (message: unknown, sender: unknown, respond: (response: unknown) => void) => boolean | void;
  const api = { storage: { local: { get: vi.fn(), set: vi.fn(), remove: vi.fn() } },
    runtime: { id: 'exts-test', getURL: () => 'chrome-extension://exts-test/newtab.html',
      onMessage: { addListener: (callback: typeof listener) => { listener = callback; } } } };
  registerSettings(async () => ({ userId: 'account-a', accessToken: 'token' }), async () => 'account-a', api as never);
  const denied = await new Promise<unknown>(resolve => {
    listener({ type: 'exts:settings', action: 'update', patch: { theme: 'dark' } },
      { id: 'exts-test', url: 'https://web.telegram.org/' }, resolve);
  });
  expect(denied).toMatchObject({ ok: false });
});

it('未登录时读默认值并在本机保存，不请求云端', async () => {
  let listener!: (message: unknown, sender: unknown, respond: (response: any) => void) => boolean | void;
  const values: Record<string, unknown> = {};
  const api = { storage: { local: {
    get: vi.fn(async () => structuredClone(values)),
    set: vi.fn(async (next: Record<string, unknown>) => { Object.assign(values, next); }),
  } }, runtime: { id: 'exts-test', getURL: () => 'chrome-extension://exts-test/newtab.html',
    onMessage: { addListener: (callback: typeof listener) => { listener = callback; } } } };
  const getSession = vi.fn(async () => { throw new Error('未登录不应请求云端'); });
  registerSettings(getSession, async () => null, api as never);
  const sender = { id: 'exts-test', url: 'chrome-extension://exts-test/newtab.html' };
  const ask = (action: string, patch?: unknown) => new Promise<any>(resolve => {
    listener({ type: 'exts:settings', action, patch }, sender, resolve);
  });
  expect((await ask('get')).settings).toMatchObject({ theme: 'system', mediaDownload: { enabled: false } });
  expect((await ask('update', { theme: 'dark' })).settings.theme).toBe('dark');
  expect((await ask('get')).settings.theme).toBe('dark');
  expect(values.settings).toMatchObject({ theme: 'dark' });
  expect(getSession).not.toHaveBeenCalled();
});
