import type { IconSize, IconTone } from './icons';

/** 页面中可以直接打开的外链书签。 */
export interface Bookmark {
  type?: 'bookmark';
  id: string;
  name: string;
  url: string;
  icon: string;
  iconTone?: IconTone;
  iconSize?: IconSize;
}

/** 首页 Grid 使用的书签文件夹；文件夹本身不代表一个外链。 */
export interface BookmarkFolder {
  type: 'folder';
  id: string;
  name: string;
  items: Bookmark[];
  blur?: boolean;
  scrollable?: boolean;
}

// Grid 同时承载普通书签和文件夹，分组打开只处理书签文件夹。
export type BookmarkGridItem = Bookmark | BookmarkFolder;
export type OpenBookmark = (folder: BookmarkFolder, bookmark: Bookmark) => void;
