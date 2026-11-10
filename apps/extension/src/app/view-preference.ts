export type AppView = 'home' | 'studio';
const UI_SESSION_KEY = 'ui-session';
type UiSession = { view: AppView; studio?: { userId: string; route: string } };
let writeTail: Promise<void> = Promise.resolve();

/** UI 导航状态只在当前扩展会话内保留，不同步云端或写入本地持久存储。 */
async function readUiSession(storage = chrome.storage.session): Promise<UiSession> {
  try {
    const stored = (await storage.get(UI_SESSION_KEY))[UI_SESSION_KEY];
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return { view: 'home' };
    const value = stored as Record<string, unknown>;
    const candidate = value.studio && typeof value.studio === 'object' && !Array.isArray(value.studio)
      ? value.studio as Record<string, unknown> : undefined;
    const userId = candidate?.userId;
    const route = candidate?.route;
    const studio = typeof userId === 'string' && typeof route === 'string' ? { userId, route } : undefined;
    return { view: value.view === 'studio' ? 'studio' : 'home', ...(studio ? { studio } : {}) };
  } catch {
    console.error('UI 会话读取失败，使用默认首页');
    return { view: 'home' };
  }
}

function updateUiSession(update: (current: UiSession) => UiSession, storage = chrome.storage.session): Promise<void> {
  const result = writeTail.then(async () => {
    const current = await readUiSession(storage);
    await storage.set({ [UI_SESSION_KEY]: update(current) });
  });
  writeTail = result.catch(() => {});
  return result;
}

export async function readViewPreference(storage = chrome.storage.session): Promise<AppView> {
  return (await readUiSession(storage)).view;
}

export function saveViewPreference(view: AppView, storage = chrome.storage.session): Promise<void> {
  return updateUiSession(current => ({ ...current, view }), storage);
}

export async function readStudioRoute(userId: string, storage = chrome.storage.session): Promise<string | null> {
  const studio = (await readUiSession(storage)).studio;
  return studio?.userId === userId ? studio.route : null;
}

export function saveStudioRoute(userId: string, route: string, storage = chrome.storage.session): Promise<void> {
  return updateUiSession(current => ({ ...current, studio: { userId, route } }), storage);
}

/** 统一清理账号状态；UI 会话已不在 local 存储中。 */
export async function clearAccountLocalState(storage = chrome.storage.local): Promise<void> {
  const keys = Object.keys(await storage.get(null));
  if (keys.length) await storage.remove(keys);
}
