import { LEGACY_SETTINGS_KEYS, normalizeSettings, SETTINGS_KEY, type Settings, type SettingsPatch } from './schema';
import { readObject, subscribeObject } from '../storage/object-store';

export { SETTINGS_KEY } from './schema';
export type { Settings, SettingsPatch } from './schema';
export const SETTINGS_UPDATE_MESSAGE = 'exts:settings:update';

export async function getSettings(api: Pick<typeof chrome, 'storage'> = chrome): Promise<Settings> {
  return readObject(SETTINGS_KEY, normalizeSettings, api, LEGACY_SETTINGS_KEYS);
}

export async function updateSettings(patch: SettingsPatch, api: Pick<typeof chrome, 'runtime'> = chrome): Promise<Settings> {
  const response = await api.runtime.sendMessage({ type: SETTINGS_UPDATE_MESSAGE, patch });
  if (!response?.ok) throw new Error(response?.error || '配置保存失败');
  return response.settings;
}

export function subscribeSettings(listener: (settings: Settings) => void, api: Pick<typeof chrome, 'storage'> = chrome): () => void {
  return subscribeObject(SETTINGS_KEY, value => normalizeSettings({ [SETTINGS_KEY]: value }), listener, api);
}
