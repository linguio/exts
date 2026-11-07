import { expect, it, vi } from 'vitest';
import { withTelegramReset } from '../../../../src/features/media-download/telegram/reset-background';

function api(existing: number[] = []) {
  const tabs = {
    query: vi.fn(async () => existing.map(id => ({ id }))),
    create: vi.fn(async () => ({ id: 9 })),
    sendMessage: vi.fn(async (_tabId: number, _message: { action: string }): Promise<{ ok: boolean; error?: string }> => ({ ok: true })),
    remove: vi.fn(async () => {}),
  };
  return { tabs } as unknown as typeof chrome & { tabs: typeof tabs };
}

it('先停止所有 Telegram 页面，再清理专用目录，然后才执行扩展重置', async () => {
  const chromeApi = api([1, 2]);
  const order: string[] = [];
  chromeApi.tabs.sendMessage.mockImplementation(async (id, message) => {
    order.push(`${id}:${message.action}`);
    return { ok: true };
  });
  await withTelegramReset(async () => { order.push('extension-clear'); }, chromeApi);
  expect(order).toEqual(['1:stop', '2:stop', '1:clear', 'extension-clear', '1:resume', '2:resume']);
  expect(chromeApi.tabs.create).not.toHaveBeenCalled();
});

it('没有 Telegram 页面时临时创建非活动页并在结束后移除', async () => {
  const chromeApi = api();
  await withTelegramReset(async () => {}, chromeApi);
  expect(chromeApi.tabs.create).toHaveBeenCalledWith({ url: 'https://web.telegram.org/', active: false });
  expect(chromeApi.tabs.remove).toHaveBeenCalledWith(9);
});

it('目录清理失败时不执行后续扩展清理', async () => {
  const chromeApi = api([1]);
  chromeApi.tabs.sendMessage.mockImplementation(async (_id, message) =>
    message.action === 'clear' ? { ok: false, error: '目录清理失败' } : { ok: true });
  const clear = vi.fn(async () => {});
  await expect(withTelegramReset(clear, chromeApi)).rejects.toThrow('目录清理失败');
  expect(clear).not.toHaveBeenCalled();
});
