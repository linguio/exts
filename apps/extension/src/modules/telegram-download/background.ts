import { browser } from 'wxt/browser';
import type { DownloadHistory } from '../downloads/background';
import { parseTaskSnapshot } from '../downloads/protocol';
import { DOWNLOAD_PAGE_END_MESSAGE, DOWNLOAD_PAGE_READY_MESSAGE, DOWNLOAD_SNAPSHOT_MESSAGE } from '../downloads/messages';

export function registerTelegramDownloadBackground(history: DownloadHistory, api: typeof browser = browser) {
  api.runtime.onMessage.addListener((message, sender) => {
    const tabId = sender.tab?.id;
    if (typeof tabId !== 'number' || sender.frameId !== 0 || !sender.url?.startsWith('https://web.telegram.org/')) return;
    if (!message || typeof message !== 'object' || typeof message.pageId !== 'string' || message.pageId.length > 128) return;
    if (message.type === DOWNLOAD_PAGE_READY_MESSAGE) return history.pageReady(tabId, message.pageId);
    if (message.type === DOWNLOAD_PAGE_END_MESSAGE) return history.pageEnded(tabId, message.pageId);
    if (message.type !== DOWNLOAD_SNAPSHOT_MESSAGE) return;
    const snapshot = parseTaskSnapshot(message.snapshot);
    if (snapshot) return history.report('telegram', tabId, message.pageId, snapshot);
  });
}
