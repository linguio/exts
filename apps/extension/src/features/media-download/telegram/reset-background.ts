import { TELEGRAM_RESET_MESSAGE } from './constants';

const origin = 'https://web.telegram.org/';

/** 只请求 Exts 内容脚本清理专用库，不删除 Telegram 网站存储。 */
export async function withTelegramReset<T>(operation: () => Promise<T>, api: typeof chrome = chrome): Promise<T> {
  const found = await api.tabs.query({ url: `${origin}*` });
  const temporary = found.length ? null : await api.tabs.create({ url: origin, active: false });
  const tabs = found.length ? found : [temporary!];
  const ids = tabs.map(tab => tab.id).filter((id): id is number => typeof id === 'number');

  async function send(tabId: number, action: 'stop' | 'clear' | 'resume') {
    const until = Date.now() + 15_000;
    for (;;) {
      let response: { ok?: boolean; error?: string };
      try {
        response = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Telegram 页面响应超时')), Math.max(1, until - Date.now()));
          void api.tabs.sendMessage(tabId, { type: TELEGRAM_RESET_MESSAGE, action }).then(
            value => { clearTimeout(timer); resolve(value); },
            error => { clearTimeout(timer); reject(error); },
          );
        });
      } catch (error) {
        // 页面刚创建时，等待内容脚本装载；业务清理失败也不能报告成功。
        if (Date.now() >= until || action !== 'stop') throw error;
        await new Promise(resolve => setTimeout(resolve, 150));
        continue;
      }
      if (!response?.ok) throw new Error(response?.error || 'Telegram 重置失败');
      return;
    }
  }

  try {
    if (!ids.length) throw new Error('Telegram 页面不可用');
    for (const id of ids) await send(id, 'stop');
    await send(ids[0]!, 'clear');
    return await operation();
  } finally {
    for (const id of ids) {
      try { await send(id, 'resume'); } catch { /* 原始错误或成功结果由主操作决定。 */ }
    }
    if (temporary?.id !== undefined) await api.tabs.remove(temporary.id).catch(() => {});
  }
}
