import { defineContentScript } from 'wxt/utils/define-content-script';
import { registerTelegramDownloadPage } from '../features/media-download/telegram/page';

// 网页主环境入口：页面空闲时启动 Telegram 下载逻辑。
export default defineContentScript({
  matches: ['https://web.telegram.org/*'],
  world: 'MAIN',
  runAt: 'document_idle',
  main: registerTelegramDownloadPage,
});
