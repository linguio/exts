import { defineBackground } from 'wxt/utils/define-background';

import { registerHistoryCleaner } from '../modules/history-cleaner/background';

export default defineBackground(() => {
  registerHistoryCleaner();
});
