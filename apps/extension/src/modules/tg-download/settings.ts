import { createBooleanSetting } from '../../shared/settings/boolean-setting';

export const TELEGRAM_DOWNLOAD_ENABLED_KEY = 'telegramDownload.enabled';
export const telegramDownloadSetting = () => createBooleanSetting(TELEGRAM_DOWNLOAD_ENABLED_KEY, true);
