interface StorageChanges {
  addListener(listener: (changes: Record<string, { newValue?: unknown }>, area: string) => void): void;
  removeListener(listener: (changes: Record<string, { newValue?: unknown }>, area: string) => void): void;
}

interface SettingStorage {
  local: { get(key: string): Promise<Record<string, unknown>>; set(values: Record<string, unknown>): Promise<void> };
  onChanged: StorageChanges;
}

/** 配置键与默认值由业务持有，共用层只负责一致的存储和订阅规则。 */
export function createBooleanSetting(key: string, defaultValue: boolean, storage: SettingStorage = chrome.storage) {
  const normalize = (value: unknown) => typeof value === 'boolean' ? value : defaultValue;
  return {
    async get() { return normalize((await storage.local.get(key))[key]); },
    async set(value: boolean) { await storage.local.set({ [key]: value }); },
    subscribe(listener: (value: boolean) => void) {
      const changed = (changes: Record<string, { newValue?: unknown }>, area: string) => {
        if (area === 'local' && key in changes) listener(normalize(changes[key]?.newValue));
      };
      storage.onChanged.addListener(changed);
      return () => storage.onChanged.removeListener(changed);
    },
  };
}
