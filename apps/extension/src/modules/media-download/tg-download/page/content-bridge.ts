import type { ContentScriptContext } from 'wxt/utils/content-script-context';
import { mediaDownloadSetting } from '../../settings';
import { type ThemePreference } from '../../../../shared/theme/preference';
import { getSettings, subscribeSettings } from '../../../../shared/settings/index';
import { TELEGRAM_CONFIG_EVENT, TELEGRAM_READY_EVENT, TELEGRAM_SAVED_EVENT } from './events';
import { addTelegramDownload } from '../../records/index';
import { validateSavedDownload } from '../../records/schema';

/** 隔离环境同步配置并仅将成功保存元数据传给后台，不传媒体和目录句柄。 */
export function registerTelegramDownloadBridge(ctx: ContentScriptContext) {
  const setting = mediaDownloadSetting();
  let enabled = false;
  let theme: ThemePreference = 'system';
  let active = true;
  let settingVersion = 0;
  let themeVersion = 0;
  const dispatch = () => window.dispatchEvent(new CustomEvent(TELEGRAM_CONFIG_EVENT, { detail: JSON.stringify({ enabled, theme }) }));
  const publish = () => { if (active && ctx.isValid) dispatch(); };
  const stop = setting.subscribe(value => { if (!active) return; settingVersion++; enabled = value; publish(); });
  const stopTheme = subscribeSettings(settings => {
    if (active) { themeVersion++; theme = settings.theme; publish(); }
  });
  ctx.onInvalidated(() => {
    if (!active) return;
    active = false;
    // 扩展重载后旧监听接口可能已失效，清理失败也必须停用页面入口。
    try { stop(); } catch { /* 旧上下文无需继续取消存储监听。 */ }
    try { stopTheme(); } catch { /* 继续发布停用状态。 */ }
    enabled = false;
    dispatch();
  });
  const initialSettingVersion = settingVersion;
  void setting.get().then(value => {
    if (active && settingVersion === initialSettingVersion) { enabled = value; publish(); }
  }).catch(error => { if (active && ctx.isValid) console.error('TG Download 配置读取失败', error); });
  const initialThemeVersion = themeVersion;
  void getSettings().then(settings => {
    if (active && themeVersion === initialThemeVersion) { theme = settings.theme; publish(); }
  }).catch(error => { if (active && ctx.isValid) console.error('TG Download 主题读取失败', error); });
  ctx.addEventListener(window, TELEGRAM_READY_EVENT, publish);
  ctx.addEventListener(window, TELEGRAM_SAVED_EVENT, event => {
    if (!active || !ctx.isValid) return;
    try {
      const detail = (event as CustomEvent<unknown>).detail;
      if (typeof detail !== 'string' || detail.length > 4096) return;
      const record: unknown = JSON.parse(detail);
      validateSavedDownload(record);
      void addTelegramDownload(record).catch(error => {
        if (active && ctx.isValid) console.error('TG Download 记录保存失败', error);
      });
    } catch (error) { if (active && ctx.isValid) console.error('TG Download 记录消息无效', error); }
  });
}
