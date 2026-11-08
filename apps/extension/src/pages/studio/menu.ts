import type { ComponentType } from 'react';
import type { UiIconName } from '../../components/custom/types';
import { DailyPage } from './daily-page';

/** 只登记实际实现的分组和页面；菜单不携带账号、查询或业务字段。 */
export const studioMenu = [{
  id: 'activity', title: 'Activity',
  items: [{ id: 'daily', title: 'Daily', icon: 'notebook-text', component: DailyPage }],
}] as const satisfies readonly {
  id: string; title: string;
  items: readonly { id: string; title: string; icon: UiIconName; component: ComponentType }[];
}[];

export type StudioPageId = typeof studioMenu[number]['items'][number]['id'];
