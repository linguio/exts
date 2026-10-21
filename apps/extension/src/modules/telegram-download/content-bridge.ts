import type { ContentScriptContext } from 'wxt/utils/content-script-context';
import { browser } from 'wxt/browser';
import { telegramDownloadSetting } from './settings';
import { normalizeTheme, THEME_STORAGE_KEY, type ThemePreference } from '../../shared/theme/preference';
import { parseTaskSnapshot } from '../downloads/protocol';
import { createTaskReporter } from './task-reporter';
import { TELEGRAM_CONFIG_EVENT, TELEGRAM_READY_EVENT, TELEGRAM_TASK_EVENT } from './bridge';
import { DOWNLOAD_PAGE_END_MESSAGE, DOWNLOAD_PAGE_READY_MESSAGE, DOWNLOAD_SNAPSHOT_MESSAGE } from '../downloads/messages';

export function registerTelegramDownloadBridge(ctx: ContentScriptContext) {
    const pageId = crypto.randomUUID();
    const setting = telegramDownloadSetting();
    let enabled = false;
    let version = 0;
    let theme: ThemePreference = 'system';
    let themeVersion = 0;
    const publish = () => window.dispatchEvent(new CustomEvent(TELEGRAM_CONFIG_EVENT, { detail: JSON.stringify({
      enabled, theme,
    }) }));
    const stop = setting.subscribe(value => { version++; enabled = value; publish(); });
    const initialVersion = version;
    const onThemeChanged = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === 'local' && THEME_STORAGE_KEY in changes) {
        themeVersion++; theme = normalizeTheme(changes[THEME_STORAGE_KEY]?.newValue); publish();
      }
    };
    browser.storage.onChanged.addListener(onThemeChanged);
    const initialThemeVersion = themeVersion;
    void browser.storage.local.get(THEME_STORAGE_KEY).then(stored => {
      if (themeVersion === initialThemeVersion) { theme = normalizeTheme(stored[THEME_STORAGE_KEY]); publish(); }
    }).catch(error => console.error('Telegram Download 主题读取失败', error));
    void setting.get().then(value => {
      if (version === initialVersion) { enabled = value; publish(); }
    }).catch(error => { enabled = false; publish(); console.error('Telegram Download 配置读取失败', error); });
    const send = (message: object) => browser.runtime.sendMessage({ ...message, pageId }).catch(error => console.error('下载记录同步失败', error));
    const reporter = createTaskReporter(snapshot => { void send({ type: DOWNLOAD_SNAPSHOT_MESSAGE, snapshot }); });
    void send({ type: DOWNLOAD_PAGE_READY_MESSAGE });
    ctx.addEventListener(window, TELEGRAM_READY_EVENT, publish);
    ctx.addEventListener(window, TELEGRAM_TASK_EVENT, event => {
      try {
        const snapshot = parseTaskSnapshot(JSON.parse((event as CustomEvent<string>).detail));
        if (snapshot) reporter.update(snapshot);
      } catch { /* 忽略页面中不符合协议的消息。 */ }
    });
    ctx.addEventListener(window, 'pagehide', () => { reporter.flush(); void send({ type: DOWNLOAD_PAGE_END_MESSAGE }); });
    ctx.onInvalidated(() => { reporter.flush(); stop(); browser.storage.onChanged.removeListener(onThemeChanged); enabled = false; publish(); });
}
