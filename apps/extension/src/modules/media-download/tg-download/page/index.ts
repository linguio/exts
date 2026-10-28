import { createDownloadMenu } from '../components/download-menu/index';
import { findMediaAt, canOpenDownloadMenu } from './media-target';
import { saveMedia, type DownloadableMedia } from '../download/save-media';
import { TELEGRAM_CONFIG_EVENT, TELEGRAM_READY_EVENT, TELEGRAM_SAVED_EVENT } from './events';
import { createDirectoryTarget } from '../download/directory-target';
import { normalizeTheme } from '../../../../shared/theme/preference';

export function registerTelegramDownloadPage() {
  let enabled = false;
  let selected: DownloadableMedia | undefined;
  let previewObserver: MutationObserver | undefined;
  const directory = createDirectoryTarget();
  const clearPreview = () => {
    previewObserver?.disconnect();
    previewObserver = undefined;
    selected = undefined;
    menu.close();
  };
  const watchPreview = (media: HTMLImageElement | HTMLVideoElement) => {
    previewObserver?.disconnect();
    const viewer = media.closest('.media-viewer-whole') ?? media.closest('.media-viewer-mover');
    if (!viewer) return;
    // 仅跟随当前预览层；TG 退出预览会先取消 active，再移除整个预览节点。
    previewObserver = new MutationObserver(() => {
      if (!viewer.isConnected || (viewer.matches('.media-viewer-whole') && !viewer.classList.contains('active'))) {
        clearPreview();
      }
    });
    previewObserver.observe(viewer, { attributes: true, attributeFilter: ['class'] });
    if (viewer.parentElement) previewObserver.observe(viewer.parentElement, { childList: true });
  };
  const save = (saveAs = false) => {
    if (!enabled || !selected) { menu.close(); return; }
    const media = selected;
    // 直接进入 picker 或缓存句柄的权限请求，不先等待 IndexedDB。
    void saveMedia(media, menu, {
      onSaved: record => window.dispatchEvent(new CustomEvent(TELEGRAM_SAVED_EVENT, { detail: JSON.stringify(record) })),
      ...(!saveAs && directory.available ? {
      selectFile: filename => directory.openFile(filename),
      onError(error) {
        if (!enabled || selected !== media) return;
        const name = error && typeof error === 'object' && 'name' in error ? error.name : '';
        const message = name === 'NotAllowedError' || name === 'SecurityError'
          ? '文件夹未获写入授权，请重试或选择其他文件夹。'
          : name === 'NotFoundError'
            ? '文件夹已不存在，请重新选择文件夹。'
            : '保存失败，请检查文件夹和磁盘空间，或重新选择文件夹。';
        menu.problem(message);
      },
      } : {}),
    });
  };
  const menu = createDownloadMenu(document, {
    directoryAvailable: directory.available,
    save: () => save(),
    saveAs: () => save(true),
    chooseDirectory() {
      if (!enabled) { menu.close(); return; }
      // choose() 在点击栈内立即调用系统目录选择器。
      void directory.choose().then(() => {
        menu.close();
        menu.ready();
        if (!enabled) menu.disable();
      }).catch(error => {
        menu.close();
        menu.ready();
        if (!enabled) { menu.disable(); return; }
        if (error && typeof error === 'object' && error.name === 'AbortError') return;
        console.error('TG Download 目录选择失败', error);
        menu.problem('无法记住所选文件夹，请重试或选择其他文件夹。');
      });
    },
  });
  void directory.restore().then(() => {
    menu.ready(directory.available ? '' : '浏览器不支持选择文件夹，下载时将使用另存为。');
  }).catch(error => {
    console.error('TG Download 目录恢复失败', error);
    menu.ready('无法恢复文件夹，请重新选择文件夹。');
  });
  window.addEventListener(TELEGRAM_CONFIG_EVENT, event => {
    try {
      const config = JSON.parse((event as CustomEvent<string>).detail);
      enabled = config.enabled === true;
      menu.theme(normalizeTheme(config.theme));
      if (!enabled) clearPreview();
    } catch { enabled = false; clearPreview(); }
  });
  document.addEventListener('contextmenu', event => {
    // 每次打开前同步核对隔离环境，扩展重载后旧页面入口立即停用。
    window.dispatchEvent(new Event(TELEGRAM_READY_EVENT));
    if (!enabled) return;
    const media = findMediaAt(document, event.target, event.clientX, event.clientY);
    if (!media || !canOpenDownloadMenu(menu.busy(), media)) return;
    event.preventDefault();
    selected = media;
    watchPreview(media);
    menu.open({ x: event.clientX, y: event.clientY });
  }, true);
  window.dispatchEvent(new Event(TELEGRAM_READY_EVENT));
}
