import { expect, it, vi } from 'vitest';
vi.mock('wxt/browser', () => ({ browser: {} }));
import { registerDownloads } from '../../../src/modules/downloads/background';
import { registerTelegramDownloadBackground } from '../../../src/modules/telegram-download/background';
import { DOWNLOAD_HISTORY_KEY } from '../../../src/modules/downloads/history';
import { DOWNLOAD_PAGE_READY_MESSAGE, DOWNLOAD_SNAPSHOT_MESSAGE } from '../../../src/modules/downloads/messages';

function createApi() {
  const listeners = {};
  const storage = {};
  const event = key => ({ addListener: fn => { listeners[key] = fn; } });
  const api = {
    storage: { local: { get: async () => ({ ...storage }), set: async values => Object.assign(storage, values) } },
    runtime: { onMessage: event('message'), onStartup: event('startup') },
    tabs: { onRemoved: event('removed'), onUpdated: event('updated') },
  };
  registerTelegramDownloadBackground(registerDownloads(api), api);
  return { storage, listeners, api };
}
const sender = tabId => ({ tab: { id: tabId }, url: 'https://web.telegram.org/k/', frameId: 0 });
const snapshot = (id, state = 'downloading') => ({ type: DOWNLOAD_SNAPSHOT_MESSAGE, pageId: `page-${id}`, snapshot: { tasks: [{ id, filename: `${id}.mp4`, loadedBytes: 0, state }] } });

it('多标签并发上报不会覆盖，普通后台注册不把活动任务判为失败', async () => {
  const { listeners, storage, api } = createApi();
  await Promise.all([listeners.message(snapshot('a'), sender(1)), listeners.message(snapshot('b'), sender(2))]);
  expect(storage[DOWNLOAD_HISTORY_KEY]).toHaveLength(2);
  registerDownloads(api);
  expect(storage[DOWNLOAD_HISTORY_KEY].every(item => item.state === 'downloading')).toBe(true);
});

it('刷新及关闭仅中断相关任务，重启中断剩余活动任务', async () => {
  const { listeners, storage } = createApi();
  await listeners.message(snapshot('a'), sender(1));
  await listeners.message(snapshot('b'), sender(2));
  await listeners.message(snapshot('c', 'completed'), sender(1));
  await listeners.updated(1, { status: 'loading' });
  expect(storage[DOWNLOAD_HISTORY_KEY].find(item => item.id === 'a').state).toBe('interrupted');
  expect(storage[DOWNLOAD_HISTORY_KEY].find(item => item.id === 'b').state).toBe('downloading');
  expect(storage[DOWNLOAD_HISTORY_KEY].find(item => item.id === 'c').state).toBe('completed');
  await listeners.startup();
  expect(storage[DOWNLOAD_HISTORY_KEY].find(item => item.id === 'b').state).toBe('interrupted');
});

it('新页面握手补记旧任务中断，拒绝非 Telegram 页面和子框架消息', async () => {
  const { listeners, storage } = createApi();
  await listeners.message(snapshot('a'), sender(1));
  await listeners.message({ type: DOWNLOAD_PAGE_READY_MESSAGE, pageId: 'new-page' }, sender(1));
  await listeners.message(snapshot('b'), { ...sender(1), url: 'https://example.com/' });
  await listeners.message(snapshot('c'), { ...sender(1), frameId: 2 });
  expect(storage[DOWNLOAD_HISTORY_KEY]).toHaveLength(1);
  expect(storage[DOWNLOAD_HISTORY_KEY][0].state).toBe('interrupted');
});
