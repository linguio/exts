import { defineBackground } from 'wxt/utils/define-background';

import { registerHistoryCleaner } from '../modules/history-cleaner/background';
import { registerSettings } from '../shared/settings/background';
import { registerDownloads } from '../modules/media-download/background/records';
import { registerAccount } from '../modules/studio/services/account-background';

export default defineBackground(() => {
  registerSettings();
  registerAccount();
  registerDownloads();
  registerHistoryCleaner();
});
