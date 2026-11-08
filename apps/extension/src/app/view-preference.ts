export type AppView = 'home' | 'studio';
const UI_STORAGE_KEY = 'ui';
let writeTail: Promise<void> = Promise.resolve();

/** 本机 UI 偏好不属于账号设置，不同步云端，也不广播已打开标签页的导航。 */
export async function readViewPreference(storage = chrome.storage.local): Promise<AppView> {
  try {
    const stored = (await storage.get(UI_STORAGE_KEY))[UI_STORAGE_KEY];
    return stored && typeof stored === 'object' && !Array.isArray(stored) && 'view' in stored && stored.view === 'studio' ? 'studio' : 'home';
  } catch {
    console.error('页面位置读取失败，使用默认首页');
    return 'home';
  }
}

export function saveViewPreference(view: AppView, storage = chrome.storage.local): Promise<void> {
  const result = writeTail.then(() => storage.set({ [UI_STORAGE_KEY]: { view } }));
  writeTail = result.catch(() => {});
  return result;
}

/** 统一清理账号状态，仅保留本机 UI 区域，避免按业务键维护清理清单。 */
export async function clearAccountLocalState(storage = chrome.storage.local): Promise<void> {
  const keys = Object.keys(await storage.get(null)).filter(key => key !== UI_STORAGE_KEY);
  if (keys.length) await storage.remove(keys);
}
