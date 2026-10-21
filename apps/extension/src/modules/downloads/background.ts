import { browser } from 'wxt/browser';
import { DOWNLOAD_HISTORY_KEY, interruptRecords, mergeRecords, parseRecords, type DownloadRecord } from './history';
import type { TaskSnapshot } from './protocol';

/** 通用记录层不识别网站，功能模块校验来源后报告任务；持久化保持串行。 */
export function registerDownloads(api: typeof browser = browser) {
  let pending = Promise.resolve();
  const update = (transform: (records: DownloadRecord[]) => DownloadRecord[]) => {
    const operation = pending.then(async () => {
      const stored = await api.storage.local.get(DOWNLOAD_HISTORY_KEY);
      await api.storage.local.set({ [DOWNLOAD_HISTORY_KEY]: transform(parseRecords(stored[DOWNLOAD_HISTORY_KEY])) });
    });
    pending = operation.catch(error => console.error('下载记录保存失败', error));
    return operation;
  };

  const history = {
    report(source: DownloadRecord['source'], tabId: number, owner: string, snapshot: TaskSnapshot) {
      return update(records => mergeRecords(records, snapshot.tasks.map(task => ({
        ...task, source, tabId, owner, createdAt: Date.now(),
      }))));
    },
    pageReady(tabId: number, owner: string) {
      return update(records => interruptRecords(records, record => record.tabId === tabId && record.owner !== owner));
    },
    pageEnded(tabId: number, owner: string) {
      return update(records => interruptRecords(records, record => record.tabId === tabId && record.owner === owner));
    },
  };
  api.tabs.onRemoved.addListener(tabId => {
    return update(records => interruptRecords(records, record => record.tabId === tabId)).catch(() => {});
  });
  api.tabs.onUpdated.addListener((tabId, change) => {
    if (change.status === 'loading') {
      return update(records => interruptRecords(records, record => record.tabId === tabId)).catch(() => {});
    }
  });
  api.runtime.onStartup.addListener(() => {
    return update(records => interruptRecords(records, () => true)).catch(() => {});
  });
  return history;
}

export type DownloadHistory = ReturnType<typeof registerDownloads>;
