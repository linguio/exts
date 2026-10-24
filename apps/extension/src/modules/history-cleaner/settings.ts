import { getSettings, updateSettings } from '../../shared/settings';

/** 配置与授权同时有效才启用，避免撤销权限后继续显示开启。 */
export async function getHistoryCleanerEnabled(api: typeof chrome = chrome): Promise<boolean> {
  if (!await api.permissions.contains({ permissions: ['browsingData'] })) return false;
  // 权限检查可能异步等待，最后读取开关以尊重期间发生的关闭操作。
  return (await getSettings(api)).historyCleaner.enabled;
}

export async function setHistoryCleanerEnabled(enabled: boolean, api: typeof chrome = chrome): Promise<boolean> {
  // 权限请求必须从用户手势直接发起，此前不能等待其他异步操作。
  if (enabled && !await api.permissions.request({ permissions: ['browsingData'] })) return false;
  await updateSettings({ historyCleaner: { enabled } }, api);
  return enabled;
}
