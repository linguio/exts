import type { IconSize } from '../brand/types';

/** 页面中可以直接打开的外链书签。 */
export interface Bookmark {
  type?: 'bookmark';
  id: string;
  name: string;
  url: string;
  icon: string;
  iconSize?: IconSize;
}
