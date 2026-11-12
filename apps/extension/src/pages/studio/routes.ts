import type { ComponentType } from 'react';
import type { UiIconName } from '../../components/custom/types';
import { OverviewPage } from './overview';
import { DailyPage } from './activity/daily';

/** 一级入口与业务分组只登记实际实现的页面；菜单不携带账号、查询或业务字段。 */
export const studioOverview = { route: '/overview', title: 'Overview', icon: 'panels-top-left', component: OverviewPage, fillHeight: false } as const satisfies {
  route: string; title: string; icon: UiIconName; component: ComponentType; fillHeight: boolean;
};

export const studioMenu = [{
  id: 'activity', title: 'Activity',
  items: [{ route: '/activity/daily', title: 'Daily', icon: 'notebook-text', component: DailyPage, fillHeight: true }],
}] as const satisfies readonly {
  id: string; title: string;
  items: readonly { route: string; title: string; icon: UiIconName; component: ComponentType; fillHeight: boolean }[];
}[];

export function resolveStudioRoute(route: string | null) {
  if (route === studioOverview.route) return { page: studioOverview, group: undefined };
  for (const group of studioMenu) {
    const page = group.items.find(item => item.route === route);
    if (page) return { page, group };
  }
  return { page: studioOverview, group: undefined };
}
