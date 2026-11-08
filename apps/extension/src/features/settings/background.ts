import { ApiRequestError, createApiClient, type ApiSession } from '../../lib/api/client';
import { resolveApiBaseUrl } from '../../lib/api/config';
import { SETTINGS_MESSAGE } from './index';
import { DEFAULT_SETTINGS, parseSettings, validateSettingsPatch, type Settings, type SettingsPatch } from './schema';
import { createSettingsRepository } from './store';
import type { SessionReset } from '../account/session-reset';

export function registerSettings(getSession: () => Promise<ApiSession>, getStoredUserId: () => Promise<string | null>,
  api: typeof chrome = chrome, session?: SessionReset) {
  const repository = createSettingsRepository(api.storage.local);
  const client = createApiClient({
    baseUrl: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.DEV), getSession,
  });
  let tail: Promise<unknown> = Promise.resolve();
  let refreshing: Promise<Settings> | null = null;
  let refreshedKey: string | null = null;
  const enqueue = <T>(operation: () => Promise<T>): Promise<T> => {
    const result = tail.then(operation);
    tail = result.catch(() => {});
    return result;
  };
  const guarded = <T>(operation: () => Promise<T>): Promise<T> => session ? session.track(operation) : operation();
  const key = (userId: string) => `${session?.generation ?? ''}:${userId}`;

  async function current(): Promise<Settings | null> {
    if (session?.resetting) return null;
    const userId = await getStoredUserId();
    if (session?.resetting) return null;
    return userId ? repository.get(userId) : (await repository.getOffline()) ?? DEFAULT_SETTINGS;
  }

  async function refresh(force = false): Promise<Settings> {
    if (refreshing) return refreshing;
    refreshing = guarded(() => enqueue(async () => {
      if (!await getStoredUserId()) return (await repository.getOffline()) ?? DEFAULT_SETTINGS;
      const auth = await getSession();
      const generation = session?.generation;
      const currentKey = key(auth.userId);
      const saved = await repository.get(auth.userId);
      if (!force && refreshedKey === currentKey && saved) return saved;
      const value = await client.request<unknown>('/api/settings/preferences', { expectedUserId: auth.userId });
      const settings = parseSettings(value);
      if (!settings) throw new ApiRequestError('INVALID_RESPONSE', '接口设置格式无效');
      if (generation && !session?.isCurrent(generation)) throw new ApiRequestError('SESSION_CHANGED', '账号已变更');
      await repository.replace(auth.userId, settings);
      refreshedKey = currentKey;
      return settings;
    })).finally(() => { refreshing = null; });
    return refreshing;
  }

  async function update(patch: SettingsPatch): Promise<Settings> {
    validateSettingsPatch(patch);
    return guarded(() => enqueue(async () => {
      const userId = await getStoredUserId();
      if (!userId) {
        const generation = session?.generation;
        const previous = (await repository.getOffline()) ?? DEFAULT_SETTINGS;
        const next = { ...previous, ...patch };
        if (generation && !session?.isCurrent(generation)) throw new ApiRequestError('SESSION_CHANGED', '账号已变更');
        return repository.replaceOffline(next);
      }
      const auth = await getSession();
      const generation = session?.generation;
      const value = await client.request<unknown>('/api/settings/preferences/update', {
        expectedUserId: auth.userId, json: patch,
      });
      const settings = parseSettings(value);
      if (!settings) throw new ApiRequestError('INVALID_RESPONSE', '接口设置格式无效');
      if (generation && !session?.isCurrent(generation)) throw new ApiRequestError('SESSION_CHANGED', '账号已变更');
      await repository.replace(auth.userId, settings);
      refreshedKey = key(auth.userId);
      return settings;
    }));
  }

  api.runtime.onMessage.addListener((message, sender, respond) => {
    if (message?.type !== SETTINGS_MESSAGE) return;
    if (sender.id !== api.runtime.id) {
      respond({ ok: false, error: { code: 'FORBIDDEN', message: '配置请求来源无效' } });
      return;
    }
    const page = sender.url?.split(/[?#]/)[0] === api.runtime.getURL('newtab.html');
    if (message.action !== 'get' && (!page || (session && !session.accepts(message.generation)))) {
      respond({ ok: false, error: { code: 'SESSION_CHANGED', message: '账号已变更' } });
      return;
    }
    const operation = message.action === 'get' ? async () => (await current()) ?? (await getStoredUserId() ? refresh() : DEFAULT_SETTINGS)
      : message.action === 'refresh' ? () => refresh()
        : message.action === 'update' ? () => update(message.patch)
          : null;
    if (!operation) {
      respond({ ok: false, error: { code: 'INVALID_REQUEST', message: '未知配置操作' } });
      return;
    }
    const generation = session?.generation;
    void operation().then(settings => respond(generation && !session?.isCurrent(generation)
      ? { ok: false, error: { code: 'SESSION_CHANGED', message: '账号已变更' } }
      : { ok: true, settings }), error => {
      const safe = error instanceof ApiRequestError ? error : new ApiRequestError('REQUEST_FAILED', '设置请求失败');
      respond({ ok: false, error: { code: safe.code, message: safe.message, status: safe.status, requestId: safe.requestId } });
    });
    return true;
  });
  return { current, refresh };
}
