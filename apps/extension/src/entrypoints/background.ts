import { defineBackground } from 'wxt/utils/define-background';

import { registerHistoryCleaner } from '../modules/history-cleaner/background';
import { registerDownloads } from '../modules/downloads/background';
import { registerTelegramDownloadBackground } from '../modules/telegram-download/background';

export default defineBackground(() => {
  registerHistoryCleaner();
  const downloads = registerDownloads();
  registerTelegramDownloadBackground(downloads);
});
