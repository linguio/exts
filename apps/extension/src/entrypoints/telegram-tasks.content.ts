import { defineContentScript } from 'wxt/utils/define-content-script';
import { registerTelegramDownloadBridge } from '../modules/telegram-download/content-bridge';

export default defineContentScript({
  matches: ['https://web.telegram.org/*'],
  runAt: 'document_start',
  main: registerTelegramDownloadBridge,
});
