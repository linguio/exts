import { readObject, subscribeObject } from '../../../shared/storage/object-store';
import { DOWNLOADS_KEY, normalizeDownloads, type Downloads, type DownloadFilter, type SavedDownload } from './schema';

export const ADD_TG_DOWNLOAD_MESSAGE = 'exts:downloads:add-tg';
export const CLEAR_DOWNLOADS_MESSAGE = 'exts:downloads:clear';

export function getDownloads(api: Pick<typeof chrome, 'storage'> = chrome): Promise<Downloads> {
  return readObject(DOWNLOADS_KEY, normalizeDownloads, api);
}

export function subscribeDownloads(listener: (downloads: Downloads) => void, onError: (error: unknown) => void, api: Pick<typeof chrome, 'storage'> = chrome): () => void {
  return subscribeObject(DOWNLOADS_KEY, value => {
    try { return normalizeDownloads({ [DOWNLOADS_KEY]: value }); }
    catch (error) { onError(error); return undefined; }
  }, value => { if (value) listener(value); }, api);
}

async function send(message: unknown, api: Pick<typeof chrome, 'runtime'>): Promise<void> {
  const response = await api.runtime.sendMessage(message);
  if (!response?.ok) throw new Error(response?.error || '下载记录保存失败');
}

export function addTelegramDownload(record: SavedDownload, api: Pick<typeof chrome, 'runtime'> = chrome): Promise<void> {
  return send({ type: ADD_TG_DOWNLOAD_MESSAGE, record }, api);
}

export function clearDownloads(source: DownloadFilter, api: Pick<typeof chrome, 'runtime'> = chrome): Promise<void> {
  return send({ type: CLEAR_DOWNLOADS_MESSAGE, source }, api);
}
