export const TELEGRAM_RESET_PENDING_KEY = 'telegramDownloadResetPending';

/** 页面自行清理 Telegram 来源的目录库；账号操作只留下待处理标记。 */
export async function markTelegramReset(api: typeof chrome = chrome): Promise<void> {
  await api.storage.local.set({ [TELEGRAM_RESET_PENDING_KEY]: crypto.randomUUID() });
}
