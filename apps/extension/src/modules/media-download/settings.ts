import { getSettings, subscribeSettings, updateSettings } from '../../shared/settings/index';

export const mediaDownloadSetting = () => ({
  get: async () => (await getSettings()).mediaDownload.enabled,
  set: async (enabled: boolean) => { await updateSettings({ mediaDownload: { enabled } }); },
  subscribe: (listener: (enabled: boolean) => void) => subscribeSettings(settings => listener(settings.mediaDownload.enabled)),
});
