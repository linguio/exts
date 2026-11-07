import { ADD_TG_DOWNLOAD_MESSAGE, CLEAR_DOWNLOADS_MESSAGE } from './constants';
import { isDownloadFilter, validateSavedDownload } from './schema';
import { createDownloadsRepository } from './repository';
import type { SessionReset } from '../../account/session-reset';

export function registerDownloads(api: typeof chrome = chrome, session?: SessionReset): void {
  const repository = createDownloadsRepository(api.storage.local);
  api.runtime.onMessage.addListener((message, sender, respond) => {
    if (message?.type !== ADD_TG_DOWNLOAD_MESSAGE && message?.type !== CLEAR_DOWNLOADS_MESSAGE) return;
    const fromExtensionPage = sender.url?.startsWith(api.runtime.getURL('')) === true;
    if (session && (fromExtensionPage ? !session.accepts(message.generation) : session.resetting)) {
      respond({ ok: false, error: '会话已变更，请重试' }); return true;
    }
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
    void (session ? session.track(handle) : handle()).then(respond, error => respond({ ok: false, error: error instanceof Error ? error.message : '下载记录保存失败' }));
    return true;
  });
}
