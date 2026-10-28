import { LEGACY_SETTINGS_KEYS, normalizeSettings, SETTINGS_KEY, validateSettingsPatch, type Settings, type SettingsPatch } from './schema';
import { createObjectStore, type ObjectStorage } from '../storage/object-store';

/** 仅后台持有仓库；初始化和更新共用队列，失败不阻塞后续操作。 */
export function createSettingsRepository(storage: ObjectStorage) {
  return createObjectStore<Settings, SettingsPatch>({
    key: SETTINGS_KEY,
    storage,
    legacyKeys: LEGACY_SETTINGS_KEYS,
    normalize: normalizeSettings,
    validatePatch: validateSettingsPatch,
    apply(current, patch) {
      return {
        ...current, ...patch,
        mediaDownload: { ...current.mediaDownload, ...patch.mediaDownload },
        historyCleaner: { ...current.historyCleaner, ...patch.historyCleaner },
      };
    },
  });
}
