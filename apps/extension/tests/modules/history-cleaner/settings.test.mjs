import assert from 'node:assert/strict';
import { test, vi } from 'vitest';

import { getHistoryCleanerEnabled, setHistoryCleanerEnabled } from '../../../src/modules/history-cleaner/settings';

function createApi(value, granted = true) {
  return {
    storage: { local: { get: vi.fn(async () => ({ settings: { historyCleaner: { enabled: value } } })) } },
    runtime: { sendMessage: vi.fn(async () => ({ ok: true })) },
    permissions: { contains: vi.fn(async () => granted), request: vi.fn(async () => granted) },
  };
}

test('未设置或无效存储值默认关闭，不读取历史', async () => {
  for (const value of [undefined, false, 'true']) {
    const api = createApi(value);
    assert.equal(await getHistoryCleanerEnabled(api), false);
  }
});

test('已保存开启状态仍要求清理权限存在', async () => {
  assert.equal(await getHistoryCleanerEnabled(createApi(true)), true);
  assert.equal(await getHistoryCleanerEnabled(createApi(true, false)), false);
});

test('启用时立即申请可选权限，授权后持久化开启', async () => {
  const api = createApi(false);
  const pending = setHistoryCleanerEnabled(true, api);
  assert.deepEqual(api.permissions.request.mock.calls, [[{ permissions: ['browsingData'] }]]);
  assert.equal(api.storage.local.get.mock.calls.length, 0);
  assert.equal(await pending, true);
  assert.deepEqual(api.runtime.sendMessage.mock.calls, [[{ type: 'exts:settings:update', patch: { historyCleaner: { enabled: true } } }]]);
});

test('拒绝授权不保存开启状态', async () => {
  const api = createApi(false, false);
  assert.equal(await setHistoryCleanerEnabled(true, api), false);
  assert.equal(api.runtime.sendMessage.mock.calls.length, 0);
});

test('关闭开关仅持久化 false，不申请权限', async () => {
  const api = createApi(true);
  assert.equal(await setHistoryCleanerEnabled(false, api), false);
  assert.deepEqual(api.runtime.sendMessage.mock.calls, [[{ type: 'exts:settings:update', patch: { historyCleaner: { enabled: false } } }]]);
  assert.equal(api.permissions.request.mock.calls.length, 0);
});

test('保存或授权失败向调用者报告错误，不假装成功', async () => {
  const api = createApi(false);
  api.runtime.sendMessage.mockRejectedValueOnce(new Error('保存失败'));
  await assert.rejects(setHistoryCleanerEnabled(true, api), /保存失败/);
  api.permissions.request.mockRejectedValueOnce(new Error('授权失败'));
  await assert.rejects(setHistoryCleanerEnabled(true, api), /授权失败/);
});
