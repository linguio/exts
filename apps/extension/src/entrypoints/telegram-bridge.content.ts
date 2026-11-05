import { defineContentScript } from 'wxt/utils/define-content-script';
import { registerTelegramDownloadBridge } from '../features/media-download/telegram/bridge';

// 扩展隔离环境入口：页面开始加载时启动通信桥接。
export default defineContentScript({
  matches: ['https://web.telegram.org/*'],
  runAt: 'document_start',
  main: registerTelegramDownloadBridge,
});
