import { defineBackground } from 'wxt/utils/define-background';

import { registerHistoryCleaner } from '../features/history-cleaner/background';
import { registerSettings } from '../features/settings/background';
import { registerDownloads } from '../features/media-download/records/background';
import { registerAccount } from '../features/account/account-background';

export default defineBackground(() => {
  registerSettings();
  registerAccount();
  registerDownloads();
  registerHistoryCleaner();
});
