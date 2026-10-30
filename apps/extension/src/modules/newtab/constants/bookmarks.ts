import type { Bookmark } from '../../../shared/bookmarks/types';
import type { BookmarkGridItem } from '../types/bookmarks';

// UI 文件夹的开发资源收藏，统一使用透明单色主题配色。
const UI_BOOKMARKS: Bookmark[] = [
  { type: 'bookmark', id: 'shadcnui', name: 'shadcn/ui', url: 'https://ui.shadcn.com/', icon: 'brand/shadcnui.svg' },
  { type: 'bookmark', id: 'lucide', name: 'Lucide', url: 'https://lucide.dev', icon: 'brand/lucide.svg' },
  { type: 'bookmark', id: 'shadcnio', name: 'shadcn.io', url: 'https://www.shadcn.io/', icon: 'brand/shadcnio.svg' },
  { type: 'bookmark', id: 'simpleicons', name: 'Simple Icons', url: 'https://simpleicons.org/', icon: 'brand/simpleicons.svg' },
  { type: 'bookmark', id: 'iconfont', name: 'Iconfont', url: 'https://www.iconfont.cn', icon: 'brand/iconfont.svg' },
  { type: 'bookmark', id: 'antd', name: 'Ant Design', url: 'https://ant.design', icon: 'brand/antd.svg' },
  { type: 'bookmark', id: 'element-ui', name: 'Element UI', url: 'https://element.eleme.io', icon: 'brand/element-ui.svg' },
  { type: 'bookmark', id: 'element-plus', name: 'Element Plus', url: 'https://element-plus.org', icon: 'brand/element-plus.svg' },
];

// 书签配置按页面区域直接导出，避免调用方依赖聚合对象。
// 首页 Grid 只消费文件夹和普通书签，不包含底部 Dock 的内容。
export const BOOKMARK_GRID: BookmarkGridItem[] = [
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
    items: UI_BOOKMARKS,
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
];

// Dock 收藏区只保存直接可点击的常用书签。
export const DOCK_FAVORITES: Bookmark[] = [
  { type: 'bookmark', id: 'x', name: 'X', url: 'https://x.com', icon: 'brand/x.svg' },
  { type: 'bookmark', id: 'github', name: 'GitHub', url: 'https://github.com', icon: 'brand/github.svg' },
  { type: 'bookmark', id: 'exts', name: 'Exts', url: 'https://exts.linguio.dev/', icon: 'brand/exts.svg' },
  { type: 'bookmark', id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', icon: 'brand/gmail.svg' },
];
