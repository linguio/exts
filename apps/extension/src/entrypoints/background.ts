import { defineBackground } from 'wxt/utils/define-background';

import { registerHistoryCleaner } from '../modules/history-cleaner/background';
import { registerSettings } from '../shared/settings/background';

export default defineBackground(() => {
  registerSettings();
  registerHistoryCleaner();
});
