import { readObject, subscribeObject } from '../../../../shared/storage/object-store';
import { normalizeDownloads } from '../../utils/records/schema';
import type { Downloads, DownloadFilter, SavedDownload } from '../../types/records';
import { DOWNLOADS_KEY, ADD_TG_DOWNLOAD_MESSAGE, CLEAR_DOWNLOADS_MESSAGE } from '../../constants/records';

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
