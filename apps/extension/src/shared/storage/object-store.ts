/** 各顶层对象共享串行读写规则，具体格式和迁移由业务模块提供。 */
export interface ObjectStorage {
  get(keys: string[]): Promise<Record<string, unknown>>;
  set(values: Record<string, unknown>): Promise<void>;
  remove(keys: string[]): Promise<void>;
}

export async function readObject<T>(key: string, normalize: (stored: Record<string, unknown>) => T, api: Pick<typeof chrome, 'storage'> = chrome, legacyKeys: string[] = []): Promise<T> {
  return normalize(await api.storage.local.get([key, ...legacyKeys]));
}

export function createObjectStore<T, P>(options: {
  key: string;
  storage: ObjectStorage;
  legacyKeys?: string[];
  normalize(stored: Record<string, unknown>): T;
  validatePatch?(patch: P): void;
  apply(current: T, patch: P): T;
}) {
  const { key, storage, legacyKeys = [], normalize, validatePatch, apply } = options;
  let tail: Promise<unknown> = Promise.resolve();
  function enqueue<R>(operation: () => Promise<R>): Promise<R> {
    const pending = tail.then(operation);
    tail = pending.catch(() => {});
    return pending;
  }
  async function load(): Promise<T> {
    const stored = await storage.get([key, ...legacyKeys]);
    const value = normalize(stored);
    if (JSON.stringify(stored[key]) !== JSON.stringify(value)) await storage.set({ [key]: value });
    const obsolete = legacyKeys.filter(oldKey => oldKey in stored);
    if (obsolete.length) await storage.remove(obsolete);
    return value;
  }
  return {
    get: () => enqueue(load),
    update: (patch: P) => enqueue(async () => {
      validatePatch?.(patch);
      const current = await load();
      const next = apply(current, patch);
      await storage.set({ [key]: next });
      return next;
    }),
  };
}

export function subscribeObject<T>(key: string, parse: (value: unknown) => T, listener: (value: T) => void, api: Pick<typeof chrome, 'storage'> = chrome): () => void {
  const changed = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
    if (area === 'local' && key in changes) listener(parse(changes[key]?.newValue));
  };
  api.storage.onChanged.addListener(changed);
  return () => api.storage.onChanged.removeListener(changed);
}
