import { SETTINGS_UPDATE_MESSAGE } from './index';
import { createSettingsRepository } from './store';

export function registerSettings(api: typeof chrome = chrome): void {
  const repository = createSettingsRepository(api.storage.local);
  // 同步注册监听，worker 每次唤醒都能接收保存请求。
  api.runtime.onMessage.addListener((message, sender, respond) => {
    if (message?.type !== SETTINGS_UPDATE_MESSAGE) return;
    // 设置只能由扩展页面修改，网页内容脚本不具备配置写入职责。
    if (sender.id !== api.runtime.id || !sender.url?.startsWith(api.runtime.getURL(''))) {
      respond({ ok: false, error: '配置请求来源无效' });
      return;
    }
    void repository.update(message.patch).then(
      settings => respond({ ok: true, settings }),
      error => respond({ ok: false, error: error instanceof Error ? error.message : '配置保存失败' }),
    );
    return true;
  });
  void repository.get().catch(error => console.error('Settings 初始化失败', error));
}
