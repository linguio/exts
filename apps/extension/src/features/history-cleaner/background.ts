import type { Settings } from '../settings';

interface SettingsSource {
  current(): Promise<Settings | null>;
  refresh(): Promise<Settings>;
}

/** 只在真实浏览器事件中清理，后台注册或普通唤醒不代表浏览器启动。 */
export function registerHistoryCleaner(api: typeof chrome, settings: SettingsSource): void {
  let inFlight: Promise<void> | undefined;

  async function clearIfEnabled(checkWindows: boolean): Promise<void> {
    if (checkWindows) {
      const windows = await api.windows.getAll({ windowTypes: ['normal', 'popup'] });
      if (windows.some((window) => !window.incognito && (window.type === 'normal' || window.type === 'popup'))) return;
    }
    // 关窗时只读取当前账号副本，不在浏览器退出路径上等待网络。
    const current = await settings.current();
    if (current?.historyCleaner.enabled && await api.permissions.contains({ permissions: ['browsingData'] })
      && (await settings.current())?.historyCleaner.enabled) {
      await api.browsingData.removeHistory({ since: 0 });
    }
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

  api.runtime.onStartup.addListener(() => {
    return settings.refresh().catch(() => {}).then(() => run(false));
  });
  api.windows.onRemoved.addListener(() => run(true), { windowTypes: ['normal', 'popup'] });
}
