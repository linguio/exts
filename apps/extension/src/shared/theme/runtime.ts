import { readThemePreference, resolveTheme, THEME_STORAGE_KEY, writeThemePreference, type ThemePreference } from './preference';

const THEME_CHANGE_EVENT = 'exts:theme-change';
let mirroredPreference: ThemePreference | undefined;

export function readTheme(): ThemePreference {
  try {
    return readThemePreference(window.localStorage);
  } catch {
    return 'system';
  }
}

export function applyTheme(preference = readTheme()): void {
  const resolved = resolveTheme(preference, window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
  // 网页内容脚本无法访问扩展同源 localStorage，只读取这里发布的主题副本。
  if (typeof chrome !== 'undefined' && chrome.storage?.local && mirroredPreference !== preference) {
    mirroredPreference = preference;
    void chrome.storage.local.set({ [THEME_STORAGE_KEY]: preference }).catch(error => {
      mirroredPreference = undefined;
      console.error('扩展网页主题同步失败', error);
    });
  }
}

export function setTheme(preference: ThemePreference): void {
  // 保存成功才应用，失败由设置区域直接提示；不伪装成已持久化。
  writeThemePreference(preference, window.localStorage);
  applyTheme(preference);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function subscribeTheme(onChange: () => void): () => void {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const update = () => {
    applyTheme();
    onChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.storageArea === window.localStorage && (event.key === THEME_STORAGE_KEY || event.key === null)) update();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, update);
  media.addEventListener('change', update);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, update);
    media.removeEventListener('change', update);
  };
}
