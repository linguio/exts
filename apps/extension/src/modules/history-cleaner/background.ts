import { getHistoryCleanerEnabled } from './settings';

/** 只在真实浏览器事件中清理，后台注册或普通唤醒不代表浏览器启动。 */
export function registerHistoryCleaner(api: typeof chrome = chrome): void {
  let inFlight: Promise<void> | undefined;

  async function clearIfEnabled(checkWindows: boolean): Promise<void> {
    if (checkWindows) {
      const windows = await api.windows.getAll({ windowTypes: ['normal', 'popup'] });
      if (windows.some((window) => !window.incognito && (window.type === 'normal' || window.type === 'popup'))) return;
    }
    // 在真正调用删除前读取最新持久配置，不依赖 worker 内存缓存开关。
    if (await getHistoryCleanerEnabled(api)) await api.browsingData.removeHistory({ since: 0 });
  }

  function run(checkWindows: boolean): Promise<void> {
    // 多个窗口同时退出时合并重叠调用，结束后允许下一次独立事件执行。
    if (!inFlight) {
      inFlight = clearIfEnabled(checkWindows)
        .catch((error: unknown) => { console.error('访问历史自动清理失败：', error); })
        .finally(() => { inFlight = undefined; });
    }
    return inFlight;
  }

  api.runtime.onStartup.addListener(() => run(false));
  api.windows.onRemoved.addListener(() => run(true), { windowTypes: ['normal', 'popup'] });
}
