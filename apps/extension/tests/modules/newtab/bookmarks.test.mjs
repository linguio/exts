import { test } from 'vitest';
import assert from 'node:assert/strict';
import * as bookmarkConfig from '../../../src/modules/newtab/constants/bookmarks.ts';

const { BOOKMARK_GRID, DOCK_COMPONENTS, DOCK_FAVORITES } = bookmarkConfig;

const uiBookmarks = [
  { type: 'bookmark', id: 'lucide', name: 'Lucide', url: 'https://lucide.dev', icon: 'brand/lucide.svg', iconTone: 'neutral' },
  { type: 'bookmark', id: 'shadcnio', name: 'shadcn.io', url: 'https://www.shadcn.io/', icon: 'brand/shadcnio.svg', iconTone: 'neutral' },
  { type: 'bookmark', id: 'iconfont', name: 'Iconfont', url: 'https://www.iconfont.cn', icon: 'brand/iconfont.svg', iconTone: 'neutral' },
  { type: 'bookmark', id: 'antd', name: 'Ant Design', url: 'https://ant.design', icon: 'brand/antd.svg', iconTone: 'neutral' },
  { type: 'bookmark', id: 'element-ui', name: 'Element UI', url: 'https://element.eleme.io', icon: 'brand/element-ui.svg', iconTone: 'neutral' },
  { type: 'bookmark', id: 'element-plus', name: 'Element Plus', url: 'https://element-plus.org', icon: 'brand/element-plus.svg', iconTone: 'neutral' },
  { type: 'bookmark', id: 'simpleicons', name: 'Simple Icons', url: 'https://simpleicons.org/', icon: 'brand/simpleicons.svg', iconTone: 'neutral' },
];

// 验证页面展示的文件夹内容与入口顺序。
test('Grid 书签配置在 EDU 前提供默认模糊且可滚动的 UI 文件夹', () => {
  assert.deepEqual(BOOKMARK_GRID, [
      {
        type: 'folder',
        id: 'ai',
        name: 'AI',
        items: [
          { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', icon: 'brand/chatgpt.svg', iconTone: 'adaptive' },
          { id: 'grok', name: 'Grok', url: 'https://grok.com', icon: 'brand/grok.svg' },
          { id: 'cursor', name: 'Cursor', url: 'https://cursor.com', icon: 'brand/cursor.svg', iconTone: 'adaptive' },
        ],
      },
      {
        type: 'folder',
        id: 'social-media',
        name: 'Social Media',
        items: [
          { id: 'telegram', name: 'Telegram', url: 'https://web.telegram.org/', icon: 'brand/telegram.svg', iconTone: 'adaptive' },
          { id: 'bilibili', name: 'Bilibili', url: 'https://www.bilibili.com', icon: 'brand/bilibili.svg', iconTone: 'adaptive' },
          { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com', icon: 'brand/youtube.svg', iconTone: 'adaptive' },
        ],
      },
      {
        type: 'folder',
        id: 'devops',
        name: 'DevOps',
        items: [
          { id: 'shadcnui', name: 'shadcn/ui', url: 'https://ui.shadcn.com/', icon: 'brand/shadcnui.svg', iconTone: 'adaptive' },
          { id: 'namecheap', name: 'Namecheap', url: 'https://www.namecheap.com', icon: 'brand/namecheap.svg', iconTone: 'adaptive' },
          { id: 'vercel', name: 'Vercel', url: 'https://vercel.com', icon: 'brand/vercel.svg', iconTone: 'adaptive' },
          { id: 'npm', name: 'npm', url: 'https://www.npmjs.com/', icon: 'brand/npm.svg', iconTone: 'adaptive' },
        ],
      },
      {
        type: 'folder',
        id: 'pm',
        name: 'PM',
        items: [
          { id: 'linear', name: 'Linear', url: 'https://linear.app', icon: 'brand/linear.svg', iconTone: 'adaptive' },
          { id: 'notion', name: 'Notion', url: 'https://www.notion.so', icon: 'brand/notion.svg', iconTone: 'adaptive' },
        ],
      },
      {
        type: 'folder',
        id: 'ui',
        name: 'UI',
        blur: true,
        scrollable: true,
        items: uiBookmarks,
      },
      {
        type: 'folder',
        id: 'edu',
        name: 'EDU',
        blur: true,
        items: [
          { id: 'pmi', name: 'PMI', url: 'https://www.pmi.org/', icon: 'brand/text-pmi.svg', iconTone: 'adaptive' },
          { id: 'jlpt', name: 'JLPT', url: 'https://jlpt-main.neea.cn/', icon: 'brand/text-jlpt.svg', iconTone: 'adaptive' },
          { id: 'ielts', name: 'IELTS', url: 'https://ielts.neea.cn/', icon: 'brand/text-ielts.svg', iconTone: 'adaptive' },
          { id: 'chsi', name: '学信网', url: 'https://www.chsi.com.cn/', icon: 'brand/text-chsi.svg', iconTone: 'adaptive' },
        ],
      },

  ]);
});

test('Dock 收藏配置保持当前常用入口顺序', () => {
  assert.deepEqual(DOCK_FAVORITES, [
    { type: 'bookmark', id: 'x', name: 'X', url: 'https://x.com', icon: 'brand/x.svg', iconTone: 'adaptive' },
    { type: 'bookmark', id: 'github', name: 'GitHub', url: 'https://github.com', icon: 'brand/github.svg', iconTone: 'adaptive' },
    { type: 'bookmark', id: 'exts', name: 'Exts', url: 'https://exts.linguio.dev/', icon: 'brand/exts.svg' },
    { type: 'bookmark', id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', icon: 'brand/gmail.svg', iconTone: 'adaptive' },
  ]);
});

test('Components 聚合入口保持当前组件工具顺序', () => {
  assert.deepEqual(DOCK_COMPONENTS, {
    type: 'bookmark-group',
    id: 'components',
    name: 'Components',
    icon: { kind: 'ui', name: 'blocks' },
    bookmarks: uiBookmarks,
  });
});
