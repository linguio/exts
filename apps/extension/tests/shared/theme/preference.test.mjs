import assert from 'node:assert/strict';
import { test } from 'vitest';

import { normalizeTheme, readThemePreference, resolveTheme, THEME_STORAGE_KEY, writeThemePreference } from '../../../src/shared/theme/preference';

test('主题默认跟随系统，无效或不可读的偏好不启用任意主题', () => {
  for (const value of [null, undefined, '', 'invalid', true]) assert.equal(normalizeTheme(value), 'system');
  assert.equal(readThemePreference({ getItem: () => null }), 'system');
  assert.equal(readThemePreference({ getItem: () => { throw new Error('读取失败'); } }), 'system');
});

test('三种主题本机保存后可读回，读取使用同一偏好键', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  for (const theme of ['light', 'dark', 'system']) {
    writeThemePreference(theme, storage);
    assert.equal(values.get(THEME_STORAGE_KEY), theme);
    assert.equal(readThemePreference(storage), theme);
  }
});

test('System 跟随系统变化，手动明暗模式不被系统偏好覆盖', () => {
  assert.equal(resolveTheme('system', false), 'light');
  assert.equal(resolveTheme('system', true), 'dark');
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
});

test('保存失败向设置区域报告，不假装已持久化', () => {
  assert.throws(() => writeThemePreference('dark', { setItem: () => { throw new Error('保存失败'); } }), /保存失败/);
});
