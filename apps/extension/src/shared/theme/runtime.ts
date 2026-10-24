import { getSettings, subscribeSettings, updateSettings } from '../settings';
import { readThemePreference, resolveTheme, writeThemePreference, type ThemePreference } from './preference';

const THEME_CHANGE_EVENT = 'exts:theme-change';
let preferenceInMemory: ThemePreference | undefined;
let revision = 0;

export function readTheme(): ThemePreference {
  if (preferenceInMemory) return preferenceInMemory;
  try { return readThemePreference(window.localStorage); }
  catch { return 'system'; }
}

/** head 脚本只同步读取缓存，不向正式配置写回默认值。 */
export function applyTheme(preference = readTheme()): void {
  const resolved = resolveTheme(preference, window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

function acceptTheme(preference: ThemePreference): void {
  preferenceInMemory = preference;
  try { writeThemePreference(preference, window.localStorage); }
  catch (error) { console.error('主题首屏缓存保存失败', error); }
  applyTheme(preference);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export async function setTheme(preference: ThemePreference): Promise<void> {
  const before = ++revision;
  const settings = await updateSettings({ theme: preference });
  // 后续配置事件已经应用较新值时，不用较旧的保存响应覆盖它。
  if (before === revision) acceptTheme(settings.theme);
}

export function subscribeTheme(onChange: () => void): () => void {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const update = () => { applyTheme(); onChange(); };
  let active = true;
  const stop = subscribeSettings(settings => { revision++; acceptTheme(settings.theme); });
  const before = revision;
  void getSettings().then(settings => {
    if (active && before === revision) acceptTheme(settings.theme);
  }).catch(error => console.error('主题配置读取失败', error));
  window.addEventListener(THEME_CHANGE_EVENT, update);
  media.addEventListener('change', update);
  return () => {
    active = false;
    stop();
    window.removeEventListener(THEME_CHANGE_EVENT, update);
    media.removeEventListener('change', update);
  };
}
