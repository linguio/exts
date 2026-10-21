import { createDownloadMenu } from './menu';
import { findMediaAt, canOpenDownloadMenu } from './media-target';
import { saveMedia, type DownloadableMedia } from './download-media';
import { createVideoTaskStore } from './task-store';
import { TELEGRAM_CONFIG_EVENT, TELEGRAM_READY_EVENT, TELEGRAM_TASK_EVENT } from './bridge';
import { normalizeTheme } from '../../shared/theme/preference';

export function registerTelegramDownloadPage() {
    let enabled = false;
    let selected: DownloadableMedia | undefined;
    const store = createVideoTaskStore();
    const menu = createDownloadMenu(document, () => {
      // 同一页面手势内调用保存窗口，不异步等待扩展消息，以保留文件选择器所需的用户激活。
      if (!enabled || !selected) return;
      void saveMedia(selected, menu, undefined, store);
    });
    window.addEventListener(TELEGRAM_CONFIG_EVENT, event => {
      try {
        const config = JSON.parse((event as CustomEvent<string>).detail);
        enabled = config.enabled === true;
        menu.theme(normalizeTheme(config.theme));
        if (!enabled) { selected = undefined; menu.disable(); }
      } catch { enabled = false; menu.disable(); }
    });
    store.subscribe(snapshot => {
      window.dispatchEvent(new CustomEvent(TELEGRAM_TASK_EVENT, { detail: JSON.stringify(snapshot) }));
    });
    document.addEventListener('contextmenu', event => {
      if (!enabled) return;
      const media = findMediaAt(document, event.target, event.clientX, event.clientY);
      if (!media || !canOpenDownloadMenu(menu.busy(), media)) return;
      event.preventDefault();
      selected = media;
      menu.open({ x: event.clientX, y: event.clientY });
    }, true);
    window.dispatchEvent(new Event(TELEGRAM_READY_EVENT));
}
