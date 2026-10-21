import { createDownloadMenu } from '../components/download-menu/index';
import { findMediaAt, canOpenDownloadMenu } from './media-target';
import { saveMedia, type DownloadableMedia } from '../download-core/save-media';
import { TELEGRAM_CONFIG_EVENT, TELEGRAM_READY_EVENT } from './events';
import { normalizeTheme } from '../../../shared/theme/preference';

export function registerTelegramDownloadPage() {
  let enabled = false;
  let selected: DownloadableMedia | undefined;
  const menu = createDownloadMenu(document, () => {
    if (!enabled || !selected) return;
    // 直接调用保存流程，以保留系统另存为所需的用户激活。
    void saveMedia(selected, menu);
  });
  window.addEventListener(TELEGRAM_CONFIG_EVENT, event => {
    try {
      const config = JSON.parse((event as CustomEvent<string>).detail);
      enabled = config.enabled === true;
      menu.theme(normalizeTheme(config.theme));
      if (!enabled) { selected = undefined; menu.disable(); }
    } catch { enabled = false; menu.disable(); }
  });
  document.addEventListener('contextmenu', event => {
    // 每次打开前同步核对隔离环境，扩展重载后旧页面入口立即停用。
    window.dispatchEvent(new Event(TELEGRAM_READY_EVENT));
    if (!enabled) return;
    const media = findMediaAt(document, event.target, event.clientX, event.clientY);
    if (!media || !canOpenDownloadMenu(menu.busy(), media)) return;
    event.preventDefault();
    selected = media;
    menu.open({ x: event.clientX, y: event.clientY });
  }, true);
  window.dispatchEvent(new Event(TELEGRAM_READY_EVENT));
}
