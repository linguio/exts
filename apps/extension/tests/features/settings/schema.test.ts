import { expect, it } from 'vitest';
import { DEFAULT_SETTINGS, parseSettings, validateSettingsPatch } from '../../../src/features/settings/schema';

const legacy = { theme: 'dark', mediaDownload: { enabled: true }, historyCleaner: { enabled: false } };
it('旧设置和新用户的通知声音默认关闭，已保存开关保留', () => {
  expect(DEFAULT_SETTINGS).toHaveProperty('notifications.soundEnabled', false);
  expect(parseSettings(legacy)).toEqual({ ...legacy, notifications: { soundEnabled: false } });
  expect(parseSettings({ ...legacy, notifications: { soundEnabled: true } })).toHaveProperty('notifications.soundEnabled', true);
  expect(parseSettings({ ...legacy, notifications: { soundEnabled: 'true' } })).toBeNull();
});
it('通知开关仅接受单项布尔更新', () => {
  expect(() => validateSettingsPatch({ notifications: { soundEnabled: true } })).not.toThrow();
  for (const patch of [{ notifications: { soundEnabled: 'true' } }, { notifications: { enabled: true } },
    { notifications: { soundEnabled: false, extra: true } }, { notifications: { soundEnabled: false }, theme: 'dark' }]) {
    expect(() => validateSettingsPatch(patch)).toThrow();
  }
});
