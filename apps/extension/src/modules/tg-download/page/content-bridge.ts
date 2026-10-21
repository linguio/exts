import type { ContentScriptContext } from 'wxt/utils/content-script-context';
import { browser } from 'wxt/browser';
import { telegramDownloadSetting } from '../settings';
import { normalizeTheme, THEME_STORAGE_KEY, type ThemePreference } from '../../../shared/theme/preference';
import { TELEGRAM_CONFIG_EVENT, TELEGRAM_READY_EVENT } from './events';

/** 隔离环境只同步开关和主题，不再持有下载记录或后台消息链路。 */
export function registerTelegramDownloadBridge(ctx: ContentScriptContext) {
  const setting = telegramDownloadSetting();
  let enabled = false;
  let theme: ThemePreference = 'system';
  let active = true;
  let settingVersion = 0;
  let themeVersion = 0;
  const dispatch = () => window.dispatchEvent(new CustomEvent(TELEGRAM_CONFIG_EVENT, { detail: JSON.stringify({ enabled, theme }) }));
  const publish = () => { if (active && ctx.isValid) dispatch(); };
  const stop = setting.subscribe(value => { if (!active) return; settingVersion++; enabled = value; publish(); });
  const onThemeChanged = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
    if (active && area === 'local' && THEME_STORAGE_KEY in changes) {
      themeVersion++; theme = normalizeTheme(changes[THEME_STORAGE_KEY]?.newValue); publish();
    }
  };
  browser.storage.onChanged.addListener(onThemeChanged);
  ctx.onInvalidated(() => {
    if (!active) return;
    active = false;
    // 扩展重载后旧监听接口可能已失效，清理失败也必须停用页面入口。
    try { stop(); } catch { /* 旧上下文无需继续取消存储监听。 */ }
    try { browser.storage.onChanged.removeListener(onThemeChanged); } catch { /* 继续发布停用状态。 */ }
    enabled = false;
    dispatch();
  });
  const initialSettingVersion = settingVersion;
  void setting.get().then(value => {
    if (active && settingVersion === initialSettingVersion) { enabled = value; publish(); }
  }).catch(error => { if (active && ctx.isValid) console.error('TG Download 配置读取失败', error); });
  const initialThemeVersion = themeVersion;
  void browser.storage.local.get(THEME_STORAGE_KEY).then(stored => {
    if (active && themeVersion === initialThemeVersion) { theme = normalizeTheme(stored[THEME_STORAGE_KEY]); publish(); }
  }).catch(error => { if (active && ctx.isValid) console.error('TG Download 主题读取失败', error); });
  ctx.addEventListener(window, TELEGRAM_READY_EVENT, publish);
}
