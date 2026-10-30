import { test } from 'vitest';
import assert from 'node:assert/strict';
import * as bookmarkConfig from '../../../src/modules/newtab/constants/bookmarks.ts';

const { BOOKMARK_GRID, DOCK_FAVORITES } = bookmarkConfig;

const uiBookmarks = [
  { type: 'bookmark', id: 'shadcnui', name: 'shadcn/ui', url: 'https://ui.shadcn.com/', icon: 'brand/shadcnui.svg' },
  { type: 'bookmark', id: 'lucide', name: 'Lucide', url: 'https://lucide.dev', icon: 'brand/lucide.svg' },
  { type: 'bookmark', id: 'shadcnio', name: 'shadcn.io', url: 'https://www.shadcn.io/', icon: 'brand/shadcnio.svg' },
  { type: 'bookmark', id: 'simpleicons', name: 'Simple Icons', url: 'https://simpleicons.org/', icon: 'brand/simpleicons.svg' },
  { type: 'bookmark', id: 'iconfont', name: 'Iconfont', url: 'https://www.iconfont.cn', icon: 'brand/iconfont.svg' },
  { type: 'bookmark', id: 'antd', name: 'Ant Design', url: 'https://ant.design', icon: 'brand/antd.svg' },
  { type: 'bookmark', id: 'element-ui', name: 'Element UI', url: 'https://element.eleme.io', icon: 'brand/element-ui.svg' },
  { type: 'bookmark', id: 'element-plus', name: 'Element Plus', url: 'https://element-plus.org', icon: 'brand/element-plus.svg' },
];

// 验证页面展示的文件夹内容与入口顺序。
test('Grid 书签配置在 EDU 前提供默认模糊且可滚动的 UI 文件夹', () => {
  assert.deepEqual(BOOKMARK_GRID, [
      {
        type: 'folder',
        id: 'ai',
        name: 'AI',
        items: [
          { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', icon: 'brand/chatgpt.svg' },
          { id: 'grok', name: 'Grok', url: 'https://grok.com', icon: 'brand/grok.svg' },
          { id: 'cursor', name: 'Cursor', url: 'https://cursor.com', icon: 'brand/cursor.svg' },
        ],
      },
      {
        type: 'folder',
        id: 'social-media',
        name: 'Social Media',
        items: [
          { id: 'telegram', name: 'Telegram', url: 'https://web.telegram.org/', icon: 'brand/telegram.svg' },
          { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com', icon: 'brand/youtube.svg' },
          { id: 'bilibili', name: 'Bilibili', url: 'https://www.bilibili.com', icon: 'brand/bilibili.svg' },
        ],
      },
      {
        type: 'folder',
        id: 'devops',
        name: 'DevOps',
        items: [
          { id: 'namecheap', name: 'Namecheap', url: 'https://www.namecheap.com', icon: 'brand/namecheap.svg' },
          { id: 'vercel', name: 'Vercel', url: 'https://vercel.com', icon: 'brand/vercel.svg' },
          { id: 'neon', name: 'Neon', url: 'https://neon.com/', icon: 'brand/neon.svg' },
        ],
      },
      {
        type: 'folder',
        id: 'pm',
        name: 'PM',
        items: [
          { id: 'linear', name: 'Linear', url: 'https://linear.app', icon: 'brand/linear.svg' },
          { id: 'notion', name: 'Notion', url: 'https://www.notion.so', icon: 'brand/notion.svg' },
          { id: 'npm', name: 'npm', url: 'https://www.npmjs.com/', icon: 'brand/npm.svg' },
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
          { id: 'pmi', name: 'PMI', url: 'https://www.pmi.org/', icon: 'brand/text-pmi.svg' },
          { id: 'jlpt', name: 'JLPT', url: 'https://jlpt-main.neea.cn/', icon: 'brand/text-jlpt.svg' },
          { id: 'ielts', name: 'IELTS', url: 'https://ielts.neea.cn/', icon: 'brand/text-ielts.svg' },
          { id: 'chsi', name: '学信网', url: 'https://www.chsi.com.cn/', icon: 'brand/text-chsi.svg' },
        ],
      },

  ]);
});

test('Dock 收藏配置保持当前常用入口顺序', () => {
  assert.deepEqual(DOCK_FAVORITES, [
    { type: 'bookmark', id: 'x', name: 'X', url: 'https://x.com', icon: 'brand/x.svg' },
    { type: 'bookmark', id: 'github', name: 'GitHub', url: 'https://github.com', icon: 'brand/github.svg' },
    { type: 'bookmark', id: 'exts', name: 'Exts', url: 'https://exts.linguio.dev/', icon: 'brand/exts.svg' },
    { type: 'bookmark', id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', icon: 'brand/gmail.svg' },
  ]);
});
