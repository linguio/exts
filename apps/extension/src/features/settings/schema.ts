import type { ThemePreference } from '../../lib/theme/preference';

export const SETTINGS_KEY = 'settings';

export interface Settings {
  theme: ThemePreference;
  mediaDownload: { enabled: boolean };
  historyCleaner: { enabled: boolean };
}

export interface AccountSettings extends Settings { userId: string }

export type SettingsPatch = {
  theme?: ThemePreference;
  mediaDownload?: { enabled: boolean };
  historyCleaner?: { enabled: boolean };
};

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system', mediaDownload: { enabled: false }, historyCleaner: { enabled: false },
};

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export function parseSettings(value: unknown): Settings | null {
  const current = object(value);
  const mediaDownload = object(current?.mediaDownload);
  const historyCleaner = object(current?.historyCleaner);
  if (!current || !mediaDownload || !historyCleaner
    || (current.theme !== 'light' && current.theme !== 'dark' && current.theme !== 'system')
    || typeof mediaDownload.enabled !== 'boolean' || typeof historyCleaner.enabled !== 'boolean') return null;
  return { theme: current.theme, mediaDownload: { enabled: mediaDownload.enabled },
    historyCleaner: { enabled: historyCleaner.enabled } };
}

export function parseAccountSettings(value: unknown, userId: string): Settings | null {
  const current = object(value);
  return current?.userId === userId ? parseSettings(current) : null;
}

/** 设置更新必须是单个已知字段，和服务端的部分更新契约一致。 */
export function validateSettingsPatch(value: unknown): asserts value is SettingsPatch {
  const patch = object(value);
  if (!patch || Object.keys(patch).length !== 1) throw new Error('无效配置更新');
  const [key, entry] = Object.entries(patch)[0]!;
  if (key === 'theme') {
    if (entry !== 'light' && entry !== 'dark' && entry !== 'system') throw new Error('无效主题');
  } else if (key === 'mediaDownload' || key === 'historyCleaner') {
    const section = object(entry);
    if (!section || typeof section.enabled !== 'boolean' || Object.keys(section).length !== 1) throw new Error('无效功能配置');
  } else throw new Error('未知配置字段');
}
