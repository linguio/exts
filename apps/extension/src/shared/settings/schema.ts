import { normalizeTheme, type ThemePreference } from '../theme/preference';

export const SETTINGS_KEY = 'settings';
export const LEGACY_SETTINGS_KEYS = ['exts.theme', 'telegramDownload.enabled', 'historyCleaner.enabled'];

export interface Settings {
  version: 1;
  theme: ThemePreference;
  telegramDownload: { enabled: boolean };
  historyCleaner: { enabled: boolean };
}

export type SettingsPatch = {
  theme?: ThemePreference;
  telegramDownload?: { enabled: boolean };
  historyCleaner?: { enabled: boolean };
};

function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

/** 新配置优先，旧键只补齐缺失值；保留已存在的其他字段。 */
export function normalizeSettings(stored: Record<string, unknown>): Settings {
  const current = object(stored[SETTINGS_KEY]);
  if (typeof current.version === 'number' && current.version > 1) throw new Error('当前扩展不支持此配置版本');
  const telegramDownload = object(current.telegramDownload);
  const historyCleaner = object(current.historyCleaner);
  return {
    ...current,
    version: 1,
    theme: normalizeTheme(current.theme ?? stored['exts.theme']),
    telegramDownload: { ...telegramDownload, enabled: typeof telegramDownload.enabled === 'boolean' ? telegramDownload.enabled : typeof stored['telegramDownload.enabled'] === 'boolean' ? stored['telegramDownload.enabled'] : true },
    historyCleaner: { ...historyCleaner, enabled: typeof historyCleaner.enabled === 'boolean' ? historyCleaner.enabled : stored['historyCleaner.enabled'] === true },
  };
}

/** 消息输入也必须校验，禁止用无效数据覆盖正式配置。 */
export function validateSettingsPatch(value: unknown): asserts value is SettingsPatch {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('无效配置更新');
  for (const [key, entry] of Object.entries(value)) {
    if (key === 'theme') {
      if (entry !== 'light' && entry !== 'dark' && entry !== 'system') throw new Error('无效主题');
    } else if (key === 'telegramDownload' || key === 'historyCleaner') {
      const section = object(entry);
      if (typeof section.enabled !== 'boolean' || Object.keys(section).some(field => field !== 'enabled')) throw new Error('无效功能配置');
    } else throw new Error('未知配置字段');
  }
}
