import { createDownloadFilename } from './filename';
import { parseContentRange, writeResponse } from './range';

export interface DownloadMenuController {
  close(): void;
  completed(filename: string): void;
}

export interface MediaWritable {
  write(chunk: Uint8Array): Promise<void> | void;
  close(): Promise<void> | void;
  abort?(): Promise<void> | void;
}

export interface SaveFileHandle {
  name?: string;
  createWritable(): Promise<MediaWritable>;
}

export interface SaveMediaDependencies {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  logger: Pick<Console, 'error'>;
  selectFile?(suggestedName: string): Promise<SaveFileHandle>;
  onError?(error: unknown): void;
  showSaveFilePicker?(options: { id: string; startIn: string; suggestedName: string }): Promise<SaveFileHandle>;
}

export interface DownloadableMedia {
  currentSrc: string;
  src: string;
  tagName: string;
}

function defaultDependencies(): SaveMediaDependencies {
  const runtime = globalThis as typeof globalThis & { showSaveFilePicker?: SaveMediaDependencies['showSaveFilePicker'] };
  return {
    fetch: globalThis.fetch.bind(globalThis),
    logger: console,
    showSaveFilePicker: runtime.showSaveFilePicker?.bind(runtime),
  };
}

export async function saveMedia(media: DownloadableMedia, menu: DownloadMenuController, overrides: Partial<SaveMediaDependencies> = {}): Promise<void> {
  const dependencies = { ...defaultDependencies(), ...overrides };
  const src = media.currentSrc || media.src;
  if (!src || (!dependencies.selectFile && !dependencies.showSaveFilePicker)) { menu.close(); return; }

  let writable: MediaWritable | undefined;
  let choosing = true;
  const suggestedName = createDownloadFilename(media.tagName);
  try {
    // picker 或目录权限请求必须在当前用户手势内直接调用，确认目标后再取流。
    const handle = await (dependencies.selectFile
      ? dependencies.selectFile(suggestedName)
      : dependencies.showSaveFilePicker!({ id: 'telegram-download', startIn: 'desktop', suggestedName }));
    menu.close();
    choosing = false;
    writable = await handle.createWritable();
    let offset = 0;
    let total = 0;
    for (;;) {
      const response = await dependencies.fetch(src, { credentials: 'include', headers: { Range: `bytes=${offset}-` } });
      if (response.status !== 200 && response.status !== 206) throw new Error(`HTTP ${response.status}`);
      const range = parseContentRange(response.headers.get('Content-Range'));
      total = range?.total || Number(response.headers.get('Content-Length')) || total;
      offset = await writeResponse(response, writable, () => {}, offset, total);
      if (response.status === 200 || !range || offset >= range.total) break;
    }
    await writable.close();
    menu.completed(handle.name || suggestedName);
  } catch (error) {
    if (choosing) menu.close();
    try { await writable?.abort?.(); }
    catch (abortError) { dependencies.logger.error('TG Download 中止文件写入失败', abortError); }
    if (choosing && error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') return;
    dependencies.logger.error('TG Download 下载失败', error);
    dependencies.onError?.(error);
  }
}
