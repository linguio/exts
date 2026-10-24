import { getSettings, subscribeSettings, updateSettings } from '../../shared/settings';

export const telegramDownloadSetting = () => ({
  get: async () => (await getSettings()).telegramDownload.enabled,
  set: async (enabled: boolean) => { await updateSettings({ telegramDownload: { enabled } }); },
  subscribe: (listener: (enabled: boolean) => void) => subscribeSettings(settings => listener(settings.telegramDownload.enabled)),
});
