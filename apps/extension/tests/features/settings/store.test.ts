import { expect, it, vi } from 'vitest';

import { createSettingsRepository } from '../../../src/features/settings/store';

const settings = { theme: 'dark', mediaDownload: { enabled: true }, historyCleaner: { enabled: false } };

function setup(initial: Record<string, unknown> = {}) {
  const data = structuredClone(initial);
  const storage = {
    get: vi.fn(async () => structuredClone(data)),
    set: vi.fn(async (values: Record<string, unknown>) => { Object.assign(data, structuredClone(values)); }),
    remove: vi.fn(async () => {}),
  };
  return { data, storage, repository: createSettingsRepository(storage) };
}

it('只读取当前账号的有效副本，不把无归属数据当成设置', async () => {
  const { repository } = setup({ settings: { userId: 'account-a', ...settings } });
  expect(await repository.get('account-a')).toEqual(settings);
  expect(await repository.get('account-b')).toBeNull();
  expect(await setup({ settings }).repository.get('account-a')).toBeNull();
});

it('接口成功值写入账号副本，写入失败不覆盖原值', async () => {
  const { repository, storage, data } = setup({ settings: { userId: 'account-a', ...settings } });
  storage.set.mockRejectedValueOnce(new Error('磁盘失败'));
  await expect(repository.replace('account-a', { ...settings, theme: 'light' })).rejects.toThrow('磁盘失败');
  expect(data.settings).toEqual({ userId: 'account-a', ...settings });
  await repository.replace('account-a', { ...settings, theme: 'light' });
  expect(await repository.get('account-a')).toMatchObject({ theme: 'light' });
  await expect(repository.replace('account-a', { ...settings, theme: 'bad' })).rejects.toThrow('接口设置格式无效');
});

it('未登录设置只读取无账号归属的本机值', async () => {
  const { repository } = setup({ settings });
  expect(await repository.getOffline()).toEqual(settings);
  expect(await repository.get('account-a')).toBeNull();
  await repository.replaceOffline({ ...settings, theme: 'light' });
  expect(await repository.getOffline()).toMatchObject({ theme: 'light' });
  expect(await setup({ settings: { userId: 'account-a', ...settings } }).repository.getOffline()).toBeNull();
});
