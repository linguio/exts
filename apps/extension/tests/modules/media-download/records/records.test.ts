import { expect, it, vi } from 'vitest';
import { createDownloadsRepository } from '../../../../src/modules/media-download/stores/records/repository';
import { selectRecords } from '../../../../src/modules/media-download/utils/records/schema';
import { formatSize } from '../../../../src/modules/media-download/utils/records/format';
import { registerDownloads } from '../../../../src/modules/media-download/background/records';

function storage() {
  const data: Record<string, unknown> = {};
  return { data, api: {
    get: async () => structuredClone(data),
    set: vi.fn(async (values: Record<string, unknown>) => { Object.assign(data, structuredClone(values)); }),
    remove: async () => {},
  } };
}

it('并发新增持久化且倒序展示，按来源清空保留其他来源', async () => {
  const { data, api } = storage();
  const repository = createDownloadsRepository(api);
  const tg = { id: 'tg-1', source: 'tg' as const, filename: 'TG_IMG_1.jpg', sizeBytes: 12, completedAt: 1 };
  const x = { id: 'x-1', source: 'x' as const, filename: 'X_VIDEO_2.mp4', sizeBytes: 200, completedAt: 2 };
  await Promise.all([repository.update({ type: 'add', record: tg }), repository.update({ type: 'add', record: x })]);
  const reloaded = await createDownloadsRepository(api).get();
  expect(selectRecords(reloaded, 'all')).toEqual([x, tg]);
  await repository.update({ type: 'clear', source: 'tg' });
  expect(selectRecords(await repository.get(), 'all')).toEqual([x]);
  api.set.mockRejectedValueOnce(new Error('空间不足'));
  await expect(repository.update({ type: 'clear', source: 'all' })).rejects.toThrow('空间不足');
  expect(selectRecords(await repository.get(), 'all')).toEqual([x]);
  await repository.update({ type: 'clear', source: 'all' });
  expect(selectRecords(await repository.get(), 'all')).toEqual([]);
  expect(data.downloads).toMatchObject({ tg: { records: [] }, x: { records: [] } });
});

it('大小缺失或为零显示 0 MB，其他大小使用 MB', () => {
  expect(formatSize(undefined)).toBe('0 MB');
  expect(formatSize(0)).toBe('0 MB');
  expect(formatSize(128 * 1024 * 1024)).toBe('128 MB');
  expect(formatSize(2.4 * 1024 * 1024)).toBe('2.4 MB');
});

it('已有记录缺失大小按零读取，未知格式拒绝清空且保留原值', async () => {
  const { data, api } = storage();
  data.downloads = { version: 1, tg: { records: [{ id: 'old', source: 'tg', filename: 'TG_IMG.jpg', completedAt: 1 }] }, x: { records: [] } };
  const repository = createDownloadsRepository(api);
  expect(selectRecords(await repository.get(), 'all')[0]?.sizeBytes).toBe(0);
  data.downloads = { version: 2, tg: { records: [] }, x: { records: [] } };
  await expect(repository.update({ type: 'clear', source: 'all' })).rejects.toThrow('无法读取下载记录格式');
  expect(data.downloads).toMatchObject({ version: 2 });
});

it('只接受 Telegram 内容脚本新增 TG，扩展页面清空；拒绝伪造来源和无效元数据', async () => {
  const { api: local } = storage();
  let listener!: (message: unknown, sender: unknown, respond: (value: any) => void) => boolean | void;
  const api = { storage: { local }, runtime: {
    id: 'test', getURL: () => 'chrome-extension://test/',
    onMessage: { addListener: (callback: typeof listener) => { listener = callback; } },
  } };
  registerDownloads(api as never);
  const send = (message: unknown, sender: unknown) => new Promise<any>(resolve => { listener(message, sender, resolve); });
  const tg = { id: 'test', url: 'https://web.telegram.org/k/', tab: { id: 1 } };
  const extension = { id: 'test', url: 'chrome-extension://test/newtab.html' };
  const add = { type: 'exts:downloads:add-tg', record: { filename: 'TG_IMG_1.jpg', sizeBytes: 10 } };
  expect(await send(add, { ...tg, url: 'https://web.telegram.org.evil.test/' })).toMatchObject({ ok: false });
  expect(await send(add, extension)).toMatchObject({ ok: false });
  expect(await send({ ...add, record: { filename: '../bad', sizeBytes: -1 } }, tg)).toMatchObject({ ok: false });
  expect(await send(add, tg)).toMatchObject({ ok: true });
  expect(await send({ type: 'exts:downloads:clear', source: 'all' }, tg)).toMatchObject({ ok: false });
  expect(await send({ type: 'exts:downloads:clear', source: 'all' }, extension)).toMatchObject({ ok: true });
});
