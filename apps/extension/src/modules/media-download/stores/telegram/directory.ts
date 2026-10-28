import type { DownloadDirectory } from '../../types/telegram';

/** 句柄存于 Telegram 来源的专用 IndexedDB，不进入扩展配置或下载记录。 */
async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('exts-telegram-download', 1);
    let abandoned = false;
    request.onupgradeneeded = () => { request.result.createObjectStore('directory'); };
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      abandoned = true;
      reject(new Error('目录存储被其他页面占用，请关闭旧页面后重试'));
    };
    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => database.close();
      if (abandoned) database.close();
      else resolve(database);
    };
  });
}

async function access(mode: IDBTransactionMode, value?: DownloadDirectory): Promise<DownloadDirectory | undefined> {
  const database = await openDatabase();
  try {
    return await new Promise<DownloadDirectory | undefined>((resolve, reject) => {
      const transaction = database.transaction('directory', mode);
      const store = transaction.objectStore('directory');
      const request = mode === 'readwrite' ? store.put(value, 'selected') : store.get('selected');
      transaction.oncomplete = () => resolve(mode === 'readonly' ? request.result : undefined);
      transaction.onabort = () => reject(transaction.error ?? request.error ?? new Error('目录存储事务已取消'));
      transaction.onerror = () => reject(transaction.error ?? request.error ?? new Error('目录存储失败'));
    });
  } finally {
    database.close();
  }
}

export const directoryStore = {
  load: () => access('readonly'),
  save: async (directory: DownloadDirectory) => { await access('readwrite', directory); },
};
