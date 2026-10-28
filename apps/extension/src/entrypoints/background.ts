import { defineBackground } from 'wxt/utils/define-background';

import { registerHistoryCleaner } from '../modules/history-cleaner/background';
import { registerSettings } from '../shared/settings/background';
import { registerDownloads } from '../modules/media-download/records/background';

export default defineBackground(() => {
  registerSettings();
  registerDownloads();
  registerHistoryCleaner();
});
