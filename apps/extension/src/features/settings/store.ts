import { parseAccountSettings, parseSettings, SETTINGS_KEY, type Settings } from './schema';
import type { ObjectStorage } from '../../lib/storage/object-store';

/** 同一键保存未登录本机设置或当前账号的云端副本；账号副本读取时核对 userId。 */
export function createSettingsRepository(storage: ObjectStorage) {
  return {
    async getOffline(): Promise<Settings | null> {
      const stored = await storage.get([SETTINGS_KEY]);
      const value = stored[SETTINGS_KEY];
      if (value && typeof value === 'object' && 'userId' in value) return null;
      return parseSettings(value);
    },
    async replaceOffline(value: unknown): Promise<Settings> {
      const settings = parseSettings(value);
      if (!settings) throw new Error('本地设置格式无效');
      await storage.set({ [SETTINGS_KEY]: settings });
      return settings;
    },
    async get(userId: string): Promise<Settings | null> {
      const stored = await storage.get([SETTINGS_KEY]);
      return parseAccountSettings(stored[SETTINGS_KEY], userId);
    },
    async replace(userId: string, value: unknown): Promise<Settings> {
      const settings = parseSettings(value);
      if (!settings) throw new Error('接口设置格式无效');
      await storage.set({ [SETTINGS_KEY]: { userId, ...settings } });
      return settings;
    },
  };
}
