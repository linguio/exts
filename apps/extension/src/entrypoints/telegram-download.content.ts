import { defineContentScript } from 'wxt/utils/define-content-script';
import { registerTelegramDownloadPage } from '../modules/telegram-download/page';

export default defineContentScript({
  matches: ['https://web.telegram.org/*'],
  world: 'MAIN',
  runAt: 'document_idle',
  main: registerTelegramDownloadPage,
});
