import { defineBackground } from 'wxt/utils/define-background';

import { registerHistoryCleaner } from '../features/history-cleaner/background';
import { registerSettings } from '../features/settings/background';
import { registerDownloads } from '../features/media-download/records/background';
import { registerAccount } from '../features/account/account-background';
import { AccountSessionExpiredError } from '../features/account/account-controller';
import { registerActivity } from '../features/activity/background';

export default defineBackground(() => {
  registerSettings();
  const account = registerAccount();
  registerActivity(() => account ? account.getSession() : Promise.reject(new AccountSessionExpiredError()));
  registerDownloads();
  registerHistoryCleaner();
});
