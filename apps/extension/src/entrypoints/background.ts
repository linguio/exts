import { defineBackground } from 'wxt/utils/define-background';

import { registerHistoryCleaner } from '../features/history-cleaner/background';
import { registerSettings } from '../features/settings/background';
import { registerDownloads } from '../features/media-download/records/background';
import { registerAccount } from '../features/account/account-background';
import { AccountSessionExpiredError } from '../features/account/account-controller';
import { registerActivity } from '../features/activity/background';
import { createSessionReset } from '../features/account/session-reset';

export default defineBackground(() => {
  const session = createSessionReset();
  const account = registerAccount(chrome, session);
  const getSession = () => account ? account.getSession() : Promise.reject(new AccountSessionExpiredError());
  const settings = registerSettings(getSession, () => account ? account.getStoredUserId() : Promise.resolve(null), chrome, session);
  registerActivity(getSession, chrome, session);
  registerDownloads(chrome, session);
  registerHistoryCleaner(chrome, settings);
});
