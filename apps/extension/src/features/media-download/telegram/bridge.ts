import type { ContentScriptContext } from 'wxt/utils/content-script-context';
import { mediaDownloadSetting } from '../settings';
import { type ThemePreference } from '../../../lib/theme/preference';
import { getSettings, subscribeSettings } from '../../settings/index';
import { TELEGRAM_CONFIG_EVENT, TELEGRAM_READY_EVENT, TELEGRAM_SAVED_EVENT, TELEGRAM_RESET_EVENT, TELEGRAM_RESET_DONE_EVENT } from './constants';
import { addTelegramDownload } from '../records/client';
import { validateSavedDownload } from '../records/schema';
import { TELEGRAM_RESET_PENDING_KEY } from './reset-background';

/** 隔离环境同步配置并仅将成功保存元数据传给后台，不传媒体和目录句柄。 */
export function registerTelegramDownloadBridge(ctx: ContentScriptContext) {
  const setting = mediaDownloadSetting();
  let enabled = false;
  let theme: ThemePreference = 'system';
  let active = true;
  let resetting = true;
  let pageReady = false;
  let settingVersion = 0;
  let themeVersion = 0;
  const dispatch = () => window.dispatchEvent(new CustomEvent(TELEGRAM_CONFIG_EVENT, { detail: JSON.stringify({ enabled: enabled && !resetting, theme }) }));
  const publish = () => { if (active && ctx.isValid) dispatch(); };
  const stop = setting.subscribe(value => { if (!active) return; settingVersion++; enabled = value; publish(); });
  const stopTheme = subscribeSettings(settings => {
    if (active) { themeVersion++; theme = settings.theme; publish(); }
  });
  ctx.onInvalidated(() => {
    if (!active) return;
    active = false;
    chrome.storage.onChanged.removeListener(onStorageChanged);
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
  ctx.addEventListener(window, TELEGRAM_READY_EVENT, () => { pageReady = true; publish(); if (resetting && !resetTask) checkReset(); });
  ctx.addEventListener(window, TELEGRAM_SAVED_EVENT, event => {
    if (!active || !ctx.isValid || resetting) return;
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
  let resetTask: Promise<void> | undefined;
  const checkReset = () => {
    if (resetTask) return;
    let repeat = false;
    resetTask = (async () => {
      resetting = true;
      publish();
      const pending = (await chrome.storage.local.get(TELEGRAM_RESET_PENDING_KEY))[TELEGRAM_RESET_PENDING_KEY];
      if (typeof pending === 'string') {
        if (!pageReady) await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => { window.removeEventListener(TELEGRAM_READY_EVENT, ready); reject(new Error('Telegram 页面启动超时')); }, 15_000);
          const ready = () => { clearTimeout(timer); window.removeEventListener(TELEGRAM_READY_EVENT, ready); resolve(); };
          window.addEventListener(TELEGRAM_READY_EVENT, ready);
        });
        const nonce = crypto.randomUUID();
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => { window.removeEventListener(TELEGRAM_RESET_DONE_EVENT, done); reject(new Error('Telegram 重置超时')); }, 15_000);
          const done = (event: Event) => {
            let result: { nonce?: string; ok?: boolean; error?: string };
            try { result = JSON.parse((event as CustomEvent<string>).detail); } catch { return; }
            if (result.nonce !== nonce) return;
            clearTimeout(timer);
            window.removeEventListener(TELEGRAM_RESET_DONE_EVENT, done);
            if (result.ok) resolve();
            else reject(new Error(result.error || 'Telegram 重置失败'));
          };
          window.addEventListener(TELEGRAM_RESET_DONE_EVENT, done);
          window.dispatchEvent(new CustomEvent(TELEGRAM_RESET_EVENT, { detail: JSON.stringify({ nonce, clear: true }) }));
        });
        const latest = (await chrome.storage.local.get(TELEGRAM_RESET_PENDING_KEY))[TELEGRAM_RESET_PENDING_KEY];
        if (latest === pending) await chrome.storage.local.remove(TELEGRAM_RESET_PENDING_KEY);
        else repeat = true;
      }
      enabled = (await getSettings()).mediaDownload.enabled;
      resetting = false;
      publish();
    })().catch(error => { if (active && ctx.isValid) console.error('TG Download 重置失败', error); })
      .finally(() => { resetTask = undefined; if (repeat && active && ctx.isValid) checkReset(); });
  };
  const onStorageChanged = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
    if (area === 'local' && changes[TELEGRAM_RESET_PENDING_KEY]?.newValue) checkReset();
  };
  chrome.storage.onChanged.addListener(onStorageChanged);
  checkReset();
}
