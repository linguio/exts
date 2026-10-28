/** 设置反馈文案按业务域集中维护，界面直接使用官方 toast API。 */
export const settingsMessages = {
  loadFailed: 'Unable to load this setting. Please try again.',
  saveFailed: 'Unable to save this setting. Please try again.',
  historyPermissionRemoved: 'History permission was removed. Turn this setting on to grant access again.',
  historyPermissionDenied: 'History permission was not granted. This setting is still off.',
} as const;
