import { test } from 'vitest';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { BOOKMARK_GRID, DOCK_FAVORITES } from '../../../src/features/bookmarks/defaults.ts';

test('默认书签标识唯一，入口使用 HTTPS 且图标资源存在', async () => {
  assert.equal(new Set(BOOKMARK_GRID.map(item => item.id)).size, BOOKMARK_GRID.length);
  for (const folder of BOOKMARK_GRID.filter(item => item.type === 'folder')) {
    assert.equal(new Set(folder.items.map(item => item.id)).size, folder.items.length);
  }
  assert.equal(new Set(DOCK_FAVORITES.map(item => item.id)).size, DOCK_FAVORITES.length);
  const bookmarks = [...BOOKMARK_GRID.flatMap(item => item.type === 'folder' ? item.items : [item]), ...DOCK_FAVORITES];
  for (const bookmark of bookmarks) {
    assert.equal(new URL(bookmark.url).protocol, 'https:');
    await access(new URL(`../../../src/assets/${bookmark.icon}`, import.meta.url));
  }
});

test('UI 文件夹位于 EDU 前，保留各自访问与滚动约定', () => {
  const uiIndex = BOOKMARK_GRID.findIndex(item => item.id === 'ui');
  const eduIndex = BOOKMARK_GRID.findIndex(item => item.id === 'edu');
  assert(uiIndex >= 0 && eduIndex > uiIndex);
  const ui = BOOKMARK_GRID[uiIndex];
  const edu = BOOKMARK_GRID[eduIndex];
  assert.equal(ui.type, 'folder');
  assert.equal(ui.blur, true);
  assert.equal(ui.scrollable, true);
  assert(ui.items.length > 0);
  assert.equal(edu.type, 'folder');
  assert.equal(edu.blur, true);
  assert(edu.items.length > 0);
});

test('Dock 仅含直接书签，保留已确认的入口顺序', () => {
  assert(DOCK_FAVORITES.every(item => item.type === 'bookmark'));
  assert.deepEqual(DOCK_FAVORITES.map(item => item.id), ['x', 'github', 'exts', 'gmail']);
});
