import { describe, expect, it, vi } from 'vitest';

import { createSettingsRepository } from '../../../src/shared/settings/store';

function setup(initial: Record<string, unknown> = {}) {
  const data = structuredClone(initial);
  const storage = {
    get: vi.fn(async () => structuredClone(data)),
    set: vi.fn(async (values: Record<string, unknown>) => { Object.assign(data, structuredClone(values)); }),
    remove: vi.fn(async (keys: string[]) => { for (const key of keys) delete data[key]; }),
  };
  return { data, storage, repository: createSettingsRepository(storage) };
}

describe('统一 Settings 存储', () => {
  it('将现有 Telegram 开关迁为媒体下载总开关，保留其他配置和下载记录', async () => {
    const { repository, data } = setup({
      settings: { version: 1, theme: 'dark', telegramDownload: { enabled: false }, historyCleaner: { enabled: true } },
      downloads: { version: 1, tg: { records: [1] }, x: { records: [] } },
    });
    expect(await repository.get()).toEqual({
      version: 2, theme: 'dark', mediaDownload: { enabled: false }, historyCleaner: { enabled: true },
    });
    expect(data.downloads).toEqual({ version: 1, tg: { records: [1] }, x: { records: [] } });
    expect(await repository.update({ mediaDownload: { enabled: true } }))
      .toMatchObject({ mediaDownload: { enabled: true } });
  });

  it('已有媒体下载总开关优先于旧 Telegram 值，迁移写入失败不改旧对象', async () => {
    const current = setup({ settings: { version: 2, mediaDownload: { enabled: true }, telegramDownload: { enabled: false } } });
    expect(await current.repository.get()).toMatchObject({ mediaDownload: { enabled: true } });
    const previous = { version: 1, telegramDownload: { enabled: false } };
    const failed = setup({ settings: previous });
    failed.storage.set.mockRejectedValueOnce(new Error('保存失败'));
    await expect(failed.repository.get()).rejects.toThrow('保存失败');
    expect(failed.data.settings).toEqual(previous);
  });

  it('首次初始化持久化默认值，重复加载不重置选择或触碰下载数据', async () => {
    const { repository, storage, data } = setup({ downloads: { tg: { records: [1] } } });
    expect(await repository.get()).toEqual({ version: 2, theme: 'system', mediaDownload: { enabled: true }, historyCleaner: { enabled: false } });
    await repository.update({ theme: 'dark' });
    const calls = storage.set.mock.calls.length;
    expect((await repository.get()).theme).toBe('dark');
    expect(storage.set).toHaveBeenCalledTimes(calls);
    expect(data.downloads).toEqual({ tg: { records: [1] } });
  });

  it('迁移旧主题和开关，已有新值优先并保留其他字段', async () => {
    const { repository, data } = setup({
      'exts.theme': 'dark', 'telegramDownload.enabled': false, 'historyCleaner.enabled': true,
      settings: { version: 1, theme: 'light', future: 12, telegramDownload: { directoryMode: 'remember' } },
    });
    expect(await repository.get()).toEqual({
      version: 2, theme: 'light', future: 12,
      mediaDownload: { enabled: false, directoryMode: 'remember' }, historyCleaner: { enabled: true },
    });
    expect(data).not.toHaveProperty('exts.theme');
    expect(data).not.toHaveProperty('telegramDownload.enabled');
    expect(data).not.toHaveProperty('historyCleaner.enabled');
  });

  it('旧值无效时补齐默认值，有效旧主题可迁入', async () => {
    expect((await setup({ 'exts.theme': 'dark' }).repository.get()).theme).toBe('dark');
    expect(await setup({ settings: { theme: 'bad', telegramDownload: { enabled: 'yes' } } }).repository.get())
      .toEqual({ version: 2, theme: 'system', mediaDownload: { enabled: true }, historyCleaner: { enabled: false } });
  });

  it('并发修改主题和不同开关不会丢失彼此的更新', async () => {
    const { repository } = setup();
    await Promise.all([
      repository.update({ theme: 'dark' }),
      repository.update({ mediaDownload: { enabled: false } }),
      repository.update({ historyCleaner: { enabled: true } }),
    ]);
    expect(await repository.get()).toEqual({ version: 2, theme: 'dark', mediaDownload: { enabled: false }, historyCleaner: { enabled: true } });
  });

  it('迁移写入失败保留旧数据，失败后允许下一次操作恢复', async () => {
    const { repository, storage, data } = setup({ 'exts.theme': 'dark' });
    storage.set.mockRejectedValueOnce(new Error('磁盘失败'));
    await expect(repository.get()).rejects.toThrow('磁盘失败');
    expect(data['exts.theme']).toBe('dark');
    expect(storage.remove).not.toHaveBeenCalled();
    expect((await repository.get()).theme).toBe('dark');
    storage.set.mockRejectedValueOnce(new Error('保存失败'));
    await expect(repository.update({ theme: 'light' })).rejects.toThrow('保存失败');
    expect((await repository.update({ historyCleaner: { enabled: true } })).theme).toBe('dark');
  });

  it('拒绝无效更新和较新版本，不覆盖已有数据', async () => {
    const { repository, storage } = setup();
    await expect(repository.update({ theme: 'bad' } as never)).rejects.toThrow();
    await expect(repository.update({ other: true } as never)).rejects.toThrow();
    expect(storage.set).not.toHaveBeenCalled();
    const newer = setup({ settings: { version: 3, theme: 'dark' } });
    await expect(newer.repository.get()).rejects.toThrow();
    expect(newer.storage.set).not.toHaveBeenCalled();
  });
});
