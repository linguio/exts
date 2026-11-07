import { SETTINGS_UPDATE_MESSAGE } from './index';
import { createSettingsRepository } from './store';
import type { SessionReset } from '../account/session-reset';

export function registerSettings(api: typeof chrome = chrome, session?: SessionReset): void {
  const repository = createSettingsRepository(api.storage.local);
  // 同步注册监听，worker 每次唤醒都能接收保存请求。
  api.runtime.onMessage.addListener((message, sender, respond) => {
    if (message?.type !== SETTINGS_UPDATE_MESSAGE) return;
    // 设置只能由扩展页面修改，网页内容脚本不具备配置写入职责。
    if (sender.id !== api.runtime.id || !sender.url?.startsWith(api.runtime.getURL(''))) {
      respond({ ok: false, error: '配置请求来源无效' });
      return;
    }
    if (session && !session.accepts(message.generation)) { respond({ ok: false, error: '会话已变更，请重试' }); return true; }
    void (session ? session.track(() => repository.update(message.patch)) : repository.update(message.patch)).then(
      settings => respond({ ok: true, settings }),
      error => respond({ ok: false, error: error instanceof Error ? error.message : '配置保存失败' }),
    );
    return true;
  });
  void (session ? session.track(() => repository.get()) : repository.get())
    .catch(error => console.error('Settings 初始化失败', error));
}
