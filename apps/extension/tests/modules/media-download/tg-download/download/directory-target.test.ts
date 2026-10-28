import { describe, expect, it, vi } from 'vitest';
import { createDirectoryTarget, type DownloadDirectory } from '../../../../../src/modules/media-download/tg-download/download/directory-target';

function directory(name = 'My downloads') {
  const entries = new Map<string, 'file' | 'directory'>();
  const handle: DownloadDirectory = {
    name,
    requestPermission: vi.fn(async () => 'granted' as PermissionState),
    getFileHandle: vi.fn(async (fileName, options) => {
      if (entries.get(fileName) === 'directory') throw new DOMException('', 'TypeMismatchError');
      if (!entries.has(fileName) && !options?.create) throw new DOMException('', 'NotFoundError');
      entries.set(fileName, 'file');
      return { name: fileName, createWritable: async () => ({ write() {}, close() {} }) };
    }),
  };
  return { handle, entries };
}

function setup(handle = directory().handle) {
  let stored: DownloadDirectory | undefined;
  let tail = Promise.resolve();
  const store = { load: vi.fn(async () => stored), save: vi.fn(async (value: DownloadDirectory) => { stored = value; }) };
  const pick = vi.fn(async () => handle);
  // 与浏览器独占锁一样，只串行执行名称检查与创建。
  const lock = <T>(run: () => Promise<T>) => {
    const next = tail.then(run);
    tail = next.then(() => {}, () => {});
    return next;
  };
  const dependencies = { store, pick, lock };
  return { target: createDirectoryTarget(dependencies), dependencies, store, pick };
}

describe('TG 授权目录目标', () => {
  it('选择目录后持久化，刷新后可恢复目录名称并保存文件', async () => {
    const { target, dependencies } = setup();
    await target.choose();
    const restored = createDirectoryTarget(dependencies);
    await restored.restore();
    expect(restored.name).toBe('My downloads');
    expect((await restored.openFile('TG.jpg')).name).toBe('TG.jpg');
  });

  it('首次快速保存直接打开选择器，选好后继续保存到所选文件夹', async () => {
    const { handle, entries } = directory('Videos');
    const { target, pick } = setup(handle);
    const saving = target.openFile('TG.mp4');
    expect(pick).toHaveBeenCalledOnce();
    await expect(saving).resolves.toMatchObject({ name: 'TG.mp4' });
    expect(entries.get('TG.mp4')).toBe('file');
    expect(target.name).toBe('Videos');
    await target.openFile('second.mp4');
    expect(pick).toHaveBeenCalledOnce();
  });

  it('首次选择取消不创建文件，也不记住目录', async () => {
    const { handle } = directory();
    const { target, pick, store } = setup(handle);
    pick.mockRejectedValueOnce(new DOMException('', 'AbortError'));
    await expect(target.openFile('TG.jpg')).rejects.toMatchObject({ name: 'AbortError' });
    expect(handle.getFileHandle).not.toHaveBeenCalled();
    expect(store.save).not.toHaveBeenCalled();
    expect(target.name).toBeUndefined();
  });

  it('恢复任意名称的已选文件夹，不要求固定名称或子目录', async () => {
    const { target, store } = setup();
    const { handle, entries } = directory('Photos');
    store.load.mockResolvedValueOnce(handle);
    await target.restore();
    expect(target.name).toBe('Photos');
    await target.openFile('TG.jpg');
    expect(entries.get('TG.jpg')).toBe('file');
  });

  it('在调用栈内直接打开目录选择器和请求权限，不先等待存储', async () => {
    const { handle } = directory();
    const { target, pick } = setup(handle);
    const choosing = target.choose();
    expect(pick).toHaveBeenCalledOnce();
    await choosing;
    const opening = target.openFile('TG.jpg');
    expect(handle.requestPermission).toHaveBeenCalledWith({ mode: 'readwrite' });
    await opening;
  });

  it('取消更换目录不替换原目录，也不重新保存句柄', async () => {
    const { target, pick, store } = setup();
    await target.choose();
    pick.mockRejectedValueOnce(new DOMException('', 'AbortError'));
    await expect(target.choose()).rejects.toMatchObject({ name: 'AbortError' });
    expect(target.name).toBe('My downloads');
    expect(store.save).toHaveBeenCalledOnce();
  });

  it('权限拒绝时不创建文件，之后重新授权可以恢复', async () => {
    const { handle } = directory();
    const { target } = setup(handle);
    await target.choose();
    vi.mocked(handle.requestPermission).mockResolvedValueOnce('denied');
    await expect(target.openFile('TG.jpg')).rejects.toMatchObject({ name: 'NotAllowedError' });
    expect(handle.getFileHandle).not.toHaveBeenCalled();
    await expect(target.openFile('TG.jpg')).resolves.toMatchObject({ name: 'TG.jpg' });
  });

  it('遇到同名文件或同名目录，递增后缀且保留原文件', async () => {
    const { handle, entries } = directory();
    entries.set('TG.jpg', 'file');
    entries.set('TG (1).jpg', 'directory');
    const { target } = setup(handle);
    await target.choose();
    expect((await target.openFile('TG.jpg')).name).toBe('TG (2).jpg');
    expect(entries.get('TG.jpg')).toBe('file');
    expect(handle.getFileHandle).not.toHaveBeenCalledWith('TG.jpg', { create: true });
  });

  it('两个页面同时下载同名文件，各自创建不同文件', async () => {
    const { target, dependencies } = setup();
    await target.choose();
    const other = createDirectoryTarget(dependencies);
    await other.restore();
    const files = await Promise.all([target.openFile('TG.mp4'), other.openFile('TG.mp4')]);
    expect(files.map(file => file.name)).toEqual(['TG.mp4', 'TG (1).mp4']);
  });

  it('目标目录被删除时，创建失败向上传递，不无限重试', async () => {
    const { handle } = directory();
    vi.mocked(handle.getFileHandle).mockRejectedValue(new DOMException('', 'NotFoundError'));
    const { target } = setup(handle);
    await target.choose();
    await expect(target.openFile('TG.jpg')).rejects.toMatchObject({ name: 'NotFoundError' });
    expect(handle.getFileHandle).toHaveBeenCalledTimes(2);
  });

  it('持久化失败不丢失已有选择，读取失败后仍可重新选择', async () => {
    const { target, store, pick } = setup();
    await target.choose();
    pick.mockResolvedValueOnce(directory('Other').handle);
    store.save.mockRejectedValueOnce(new Error('quota'));
    await expect(target.choose()).rejects.toThrow('quota');
    expect(target.name).toBe('My downloads');
    store.load.mockRejectedValueOnce(new Error('blocked'));
    await expect(target.restore()).rejects.toThrow('blocked');
    await target.choose();
    expect(target.name).toBe('My downloads');
  });
});
