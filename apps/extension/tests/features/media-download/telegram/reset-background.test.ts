import { expect, it, vi } from 'vitest';
import { markTelegramReset, TELEGRAM_RESET_PENDING_KEY } from '../../../../src/features/media-download/telegram/reset-background';

it('只写入待清理标记，不打开或等待 Telegram 页面', async () => {
  const set = vi.fn(async (_value: Record<string, unknown>) => {});
  await markTelegramReset({ storage: { local: { set } } } as unknown as typeof chrome);
  expect(set).toHaveBeenCalledOnce();
  expect(set.mock.calls[0]![0]).toEqual({ [TELEGRAM_RESET_PENDING_KEY]: expect.any(String) });
});
