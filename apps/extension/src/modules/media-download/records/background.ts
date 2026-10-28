import { ADD_TG_DOWNLOAD_MESSAGE, CLEAR_DOWNLOADS_MESSAGE } from './index';
import { isDownloadFilter, validateSavedDownload } from './schema';
import { createDownloadsRepository } from './store';

export function registerDownloads(api: typeof chrome = chrome): void {
  const repository = createDownloadsRepository(api.storage.local);
  api.runtime.onMessage.addListener((message, sender, respond) => {
    if (message?.type !== ADD_TG_DOWNLOAD_MESSAGE && message?.type !== CLEAR_DOWNLOADS_MESSAGE) return;
    const handle = async () => {
      if (sender.id !== api.runtime.id) throw new Error('下载记录请求来源无效');
      if (message.type === ADD_TG_DOWNLOAD_MESSAGE) {
        const url = new URL(sender.url || '');
        if (url.origin !== 'https://web.telegram.org' || !sender.tab) throw new Error('下载记录请求来源无效');
        validateSavedDownload(message.record);
        await repository.update({ type: 'add', record: {
          id: crypto.randomUUID(), source: 'tg', filename: message.record.filename,
          sizeBytes: message.record.sizeBytes, completedAt: Date.now(),
        } });
      } else {
        if (!sender.url?.startsWith(api.runtime.getURL('')) || !isDownloadFilter(message.source)) throw new Error('清空记录请求无效');
        await repository.update({ type: 'clear', source: message.source });
      }
      return { ok: true };
    };
    void handle().then(respond, error => respond({ ok: false, error: error instanceof Error ? error.message : '下载记录保存失败' }));
    return true;
  });
}
