import type { AsyncStorage } from 'oidc-client-ts';

/** 扩展源 IndexedDB 与网页内容脚本的源隔离，不向页面消息返回凭据。 */
export function createAuthStorage(): AsyncStorage {
  let database: Promise<IDBDatabase> | undefined;
  function open() {
    return database ??= new Promise((resolve, reject) => {
      const request = indexedDB.open('exts-oidc', 1);
      request.onupgradeneeded = () => { request.result.createObjectStore('credentials'); };
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = () => { database = undefined; reject(new Error('认证存储不可用')); };
    });
  }
  async function operation<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('credentials', mode);
      const request = action(transaction.objectStore('credentials'));
      transaction.oncomplete = () => { resolve(request.result); };
      transaction.onerror = transaction.onabort = () => { reject(new Error('认证存储操作失败')); };
    });
  }
  return {
    get length() { return operation('readonly', store => store.count()); },
    clear: async () => { await operation('readwrite', store => store.clear()); },
    key: async index => {
      const keys = await operation('readonly', store => store.getAllKeys());
      return keys[index] === undefined ? null : String(keys[index]);
    },
    getItem: async key => ((await operation('readonly', store => store.get(key))) as string | undefined) ?? null,
    setItem: async (key, value) => { await operation('readwrite', store => store.put(value, key)); },
    removeItem: async key => { await operation('readwrite', store => store.delete(key)); },
  };
}
