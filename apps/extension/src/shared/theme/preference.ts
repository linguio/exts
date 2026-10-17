export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'exts.theme';

export function normalizeTheme(value: unknown): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system';
}

export function resolveTheme(preference: ThemePreference, prefersDark: boolean): 'light' | 'dark' {
  return preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference;
}

export function readThemePreference(storage: Pick<Storage, 'getItem'>): ThemePreference {
  try {
    return normalizeTheme(storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

export function writeThemePreference(preference: ThemePreference, storage: Pick<Storage, 'setItem'>): void {
  storage.setItem(THEME_STORAGE_KEY, preference);
}
