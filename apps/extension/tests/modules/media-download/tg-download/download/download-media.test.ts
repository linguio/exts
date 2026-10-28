import { describe, expect, it, vi } from 'vitest';
import { saveMedia, type SaveMediaDependencies } from '../../../../../src/modules/media-download/tg-download/download/save-media';

function setup(overrides: Partial<SaveMediaDependencies> = {}) {
  const writable = { write: vi.fn(), close: vi.fn(), abort: vi.fn() };
  const menu = { close: vi.fn(), completed: vi.fn() };
  const dependencies: SaveMediaDependencies = {
    fetch: vi.fn(async () => new Response(new Uint8Array([1, 2]), { status: 200 })),
    showSaveFilePicker: vi.fn(async () => ({ name: 'saved.mp4', createWritable: async () => writable })),
    logger: { error: vi.fn() },
    ...overrides,
  };
  return { writable, menu, dependencies };
}
const image = { tagName: 'IMG', currentSrc: '', src: 'blob:test' };
const video = { tagName: 'VIDEO', currentSrc: '', src: 'https://web.telegram.org/stream/test' };

describe('媒体保存', () => {
  it('文件关闭成功后上报实际名称与写入字节数，记录错误不影响成功提示', async () => {
    const onSaved = vi.fn(() => { throw new Error('记录失败'); });
    const { menu, dependencies } = setup();
    await saveMedia(image, menu, { ...dependencies, onSaved });
    expect(onSaved).toHaveBeenCalledExactlyOnceWith({ filename: 'saved.mp4', sizeBytes: 2 });
    expect(menu.completed).toHaveBeenCalledExactlyOnceWith('saved.mp4');
  });

  it('文件关闭失败不报告成功记录', async () => {
    const onSaved = vi.fn();
    const { writable, dependencies, menu } = setup();
    writable.close.mockRejectedValueOnce(new Error('磁盘失败'));
    await saveMedia(image, menu, { ...dependencies, onSaved });
    expect(onSaved).not.toHaveBeenCalled();
    expect(menu.completed).not.toHaveBeenCalled();
  });

  it('保留 picker id 并建议系统桌面，不改变文件名规则', async () => {
    const { menu, dependencies } = setup();
    await saveMedia(image, menu, dependencies);
    expect(dependencies.showSaveFilePicker).toHaveBeenCalledWith(expect.objectContaining({
      id: 'telegram-download', startIn: 'desktop', suggestedName: expect.stringMatching(/^TG_IMG_\d{8}_\d{6}\.jpg$/),
    }));
  });

  it('取消另存为不请求媒体也不发送完成提示', async () => {
    const onSaved = vi.fn();
    const { menu, dependencies } = setup({ showSaveFilePicker: async () => { throw { name: 'AbortError' }; } });
    await saveMedia(image, menu, { ...dependencies, onSaved });
    expect(onSaved).not.toHaveBeenCalled();
    expect(dependencies.fetch).not.toHaveBeenCalled();
    expect(menu.close).toHaveBeenCalledOnce();
    expect(menu.completed).not.toHaveBeenCalled();
    expect(dependencies.logger.error).not.toHaveBeenCalled();
  });

  it('调用原生文件选择器时保留 Window 接收对象', async () => {
    const previous = Object.getOwnPropertyDescriptor(globalThis, 'showSaveFilePicker');
    let receiver: unknown;
    Object.defineProperty(globalThis, 'showSaveFilePicker', {
      configurable: true,
      value: function (this: unknown) { receiver = this; throw { name: 'AbortError' }; },
    });
    try {
      await saveMedia(image, setup().menu);
      expect(receiver).toBe(globalThis);
    } finally {
      if (previous) Object.defineProperty(globalThis, 'showSaveFilePicker', previous);
      else delete (globalThis as any).showSaveFilePicker;
    }
  });

  it.each([image, video])('完整响应按字节写入，文件关闭成功后才通知完成：$tagName', async media => {
    const { writable, menu, dependencies } = setup();
    let finish!: () => void;
    writable.close.mockImplementation(() => new Promise<void>(resolve => { finish = resolve; }));
    const saving = saveMedia(media, menu, dependencies);
    await vi.waitFor(() => expect(writable.close).toHaveBeenCalledOnce());
    expect(writable.write).toHaveBeenCalledWith(new Uint8Array([1, 2]));
    expect(menu.completed).not.toHaveBeenCalled();
    finish();
    await saving;
    expect(menu.completed).toHaveBeenCalledExactlyOnceWith('saved.mp4');
  });

  it('目录目标沿用流写入，使用实际避重文件名且不弹另存为', async () => {
    const { menu, writable, dependencies } = setup();
    const selectFile = vi.fn(async () => ({ name: 'TG_IMG (1).jpg', createWritable: async () => writable }));
    await saveMedia(image, menu, { ...dependencies, selectFile });
    expect(selectFile).toHaveBeenCalledWith(expect.stringMatching(/^TG_IMG_\d{8}_\d{6}\.jpg$/));
    expect(dependencies.showSaveFilePicker).not.toHaveBeenCalled();
    expect(menu.completed).toHaveBeenCalledExactlyOnceWith('TG_IMG (1).jpg');
  });

  it('目录授权失效时不请求媒体或自动弹另存为，并交给菜单恢复', async () => {
    const { menu, dependencies } = setup();
    const error = new DOMException('需要重新授权', 'NotAllowedError');
    const onError = vi.fn();
    await saveMedia(image, menu, { ...dependencies, selectFile: async () => { throw error; }, onError });
    expect(dependencies.fetch).not.toHaveBeenCalled();
    expect(dependencies.showSaveFilePicker).not.toHaveBeenCalled();
    expect(menu.completed).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledExactlyOnceWith(error);
  });

  it('分段响应按实际写入字节继续 Range 请求', async () => {
    const responses = [
      new Response(new Uint8Array([1, 2]), { status: 206, headers: { 'Content-Range': 'bytes 0-1/3' } }),
      new Response(new Uint8Array([3]), { status: 206, headers: { 'Content-Range': 'bytes 2-2/3' } }),
    ];
    const ranges: string[] = [];
    const { menu, writable, dependencies } = setup({ fetch: async (_input, init) => {
      ranges.push(new Headers(init?.headers).get('Range')!);
      return responses.shift()!;
    } });
    await saveMedia(video, menu, dependencies);
    expect(ranges).toEqual(['bytes=0-', 'bytes=2-']);
    expect(writable.write.mock.calls.map(([chunk]) => [...chunk])).toEqual([[1, 2], [3]]);
    expect(menu.completed).toHaveBeenCalledOnce();
  });

  it('网络失败时中止写入，不发完成提示且可以再次保存', async () => {
    const { menu, writable, dependencies } = setup({ fetch: vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockImplementationOnce(async () => new Response(new Uint8Array([1]), { status: 200 })) });
    await saveMedia(video, menu, dependencies);
    expect(writable.abort).toHaveBeenCalledOnce();
    expect(menu.completed).not.toHaveBeenCalled();
    expect(dependencies.logger.error).toHaveBeenCalledOnce();
    await saveMedia(video, menu, dependencies);
    expect(menu.completed).toHaveBeenCalledOnce();
  });

  it('无法建立写入流时不请求媒体或提示成功', async () => {
    const { menu, dependencies } = setup({ showSaveFilePicker: async () => ({ createWritable: async () => { throw new Error('磁盘已满'); } }) });
    await saveMedia(video, menu, dependencies);
    expect(dependencies.fetch).not.toHaveBeenCalled();
    expect(menu.completed).not.toHaveBeenCalled();
    expect(menu.close).toHaveBeenCalledOnce();
    expect(dependencies.logger.error).toHaveBeenCalledOnce();
  });

  it('关闭文件失败且中止也失败时不产生未捕获异常或成功提示', async () => {
    const { menu, writable, dependencies } = setup();
    writable.close.mockRejectedValue(new Error('关闭失败'));
    writable.abort.mockRejectedValue(new Error('中止失败'));
    await expect(saveMedia(video, menu, dependencies)).resolves.toBeUndefined();
    expect(menu.completed).not.toHaveBeenCalled();
    expect(dependencies.logger.error).toHaveBeenCalled();
  });
});
