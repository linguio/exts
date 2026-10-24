import assert from 'node:assert/strict';
import { afterEach, test, vi } from 'vitest';

import { registerHistoryCleaner } from '../../../src/modules/history-cleaner/background';

afterEach(() => vi.restoreAllMocks());

function setup({ enabled = true, granted = true, windows = [] } = {}) {
  const listeners = {};
  const api = {
    runtime: { onStartup: { addListener: vi.fn((listener) => { listeners.startup = listener; }) } },
    windows: {
      onRemoved: { addListener: vi.fn((listener) => { listeners.closed = listener; }) },
      getAll: vi.fn(async () => windows),
    },
    storage: { local: { get: vi.fn(async () => ({ settings: { historyCleaner: { enabled } } })) } },
    permissions: { contains: vi.fn(async () => granted) },
    browsingData: { removeHistory: vi.fn(async () => {}) },
  };
  registerHistoryCleaner(api);
  return { api, listeners };
}

test('后台注册和普通 worker 唤醒不清理，窗口事件限于普通窗口与网页弹窗', () => {
  const { api } = setup();
  assert.equal(api.browsingData.removeHistory.mock.calls.length, 0);
  assert.equal(api.runtime.onStartup.addListener.mock.calls.length, 1);
  assert.deepEqual(api.windows.onRemoved.addListener.mock.calls[0][1], { windowTypes: ['normal', 'popup'] });
});

test('配置文件启动只清除全部访问历史', async () => {
  const { api, listeners } = setup();
  await listeners.startup();
  assert.deepEqual(api.browsingData.removeHistory.mock.calls, [[{ since: 0 }]]);
  assert.equal(api.windows.getAll.mock.calls.length, 0);
});

test('关闭设置或缺少权限时，启动和最后窗口关闭均不清理', async () => {
  for (const options of [{ enabled: false }, { granted: false }]) {
    const { api, listeners } = setup(options);
    await listeners.startup();
    await listeners.closed(1);
    assert.equal(api.browsingData.removeHistory.mock.calls.length, 0);
  }
});

test('仍有普通窗口或网页弹窗时不清理', async () => {
  for (const type of ['normal', 'popup']) {
    const { api, listeners } = setup({ windows: [{ type, incognito: false }] });
    await listeners.closed(1);
    assert.equal(api.browsingData.removeHistory.mock.calls.length, 0);
  }
});

test('最后窗口关闭时清理，DevTools 不参与计数', async () => {
  const { api, listeners } = setup({ windows: [{ type: 'devtools' }] });
  await listeners.closed(1);
  assert.deepEqual(api.windows.getAll.mock.calls, [[{ windowTypes: ['normal', 'popup'] }]]);
  assert.deepEqual(api.browsingData.removeHistory.mock.calls, [[{ since: 0 }]]);
});

test('每次触发重新读取开关，后续关闭开关即可停止清理', async () => {
  const { api, listeners } = setup();
  await listeners.startup();
  api.storage.local.get.mockResolvedValue({ settings: { historyCleaner: { enabled: false } } });
  await listeners.closed(1);
  assert.equal(api.browsingData.removeHistory.mock.calls.length, 1);
});

test('多个窗口同时关闭时合并重叠的清理调用', async () => {
  const { api, listeners } = setup();
  let finish;
  api.browsingData.removeHistory.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
  const first = listeners.closed(1);
  const second = listeners.closed(2);
  await new Promise(setImmediate);
  assert.equal(api.browsingData.removeHistory.mock.calls.length, 1);
  finish();
  await first;
  await second;
});

test('权限检查期间关闭开关，尚未开始的删除应停止', async () => {
  const { api, listeners } = setup();
  let allow;
  api.permissions.contains.mockImplementation(() => new Promise((resolve) => { allow = resolve; }));
  const pending = listeners.startup();
  await new Promise(setImmediate);
  api.storage.local.get.mockResolvedValue({ settings: { historyCleaner: { enabled: false } } });
  allow(true);
  await pending;
  assert.equal(api.browsingData.removeHistory.mock.calls.length, 0);
});

test('清理失败只记录错误，不重试且不阻塞后续事件', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  const { api, listeners } = setup();
  api.browsingData.removeHistory.mockRejectedValueOnce(new Error('清理失败'));
  await listeners.startup();
  assert.equal(log.mock.calls.length, 1);
  assert.equal(api.browsingData.removeHistory.mock.calls.length, 1);
  await listeners.startup();
  assert.equal(api.browsingData.removeHistory.mock.calls.length, 2);
});
