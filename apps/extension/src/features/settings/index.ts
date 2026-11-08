import { DEFAULT_SETTINGS, parseSettings, SETTINGS_KEY, type Settings, type SettingsPatch } from './schema';
import { subscribeObject } from '../../lib/storage/object-store';
import { captureSessionGeneration } from '../account/session-client';

export { SETTINGS_KEY } from './schema';
export type { Settings, SettingsPatch } from './schema';
export const SETTINGS_MESSAGE = 'exts:settings';

async function request(action: 'get' | 'refresh' | 'update', patch?: SettingsPatch,
  api: Pick<typeof chrome, 'runtime'> = chrome, expectedGeneration?: string): Promise<Settings> {
  const generation = action === 'get' ? undefined : expectedGeneration ?? await captureSessionGeneration(api);
  const response = await api.runtime.sendMessage({ type: SETTINGS_MESSAGE, action, patch, generation });
  if (!response?.ok) {
    const error = new Error(response?.error?.message ?? '配置请求失败') as Error & { code?: string; status?: number };
    error.code = response?.error?.code;
    error.status = response?.error?.status;
    throw error;
  }
  const settings = parseSettings(response.settings);
  if (!settings) throw new Error('配置返回格式无效');
  return settings;
}

export const getSettings = (api?: Pick<typeof chrome, 'runtime'>) => request('get', undefined, api);
export const refreshSettings = (api?: Pick<typeof chrome, 'runtime'>) => request('refresh', undefined, api);
export const updateSettings = (patch: SettingsPatch, api?: Pick<typeof chrome, 'runtime'>, expectedGeneration?: string) =>
  request('update', patch, api, expectedGeneration);

export function subscribeSettings(listener: (settings: Settings) => void, api: Pick<typeof chrome, 'storage'> = chrome): () => void {
  return subscribeObject(SETTINGS_KEY, value => parseSettings(value) ?? DEFAULT_SETTINGS, listener, api);
}
