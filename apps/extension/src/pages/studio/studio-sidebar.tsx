import { BrandIcon } from '../../components/custom/brand-icon';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../components/ui/empty';
import type { studioAccess } from './studio-access';
import { Button } from '../../components/ui/button';
import { studioMenu, type StudioPageId } from './menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '../../components/ui/sidebar';
import { UiIcon } from '../../components/custom/ui-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { AccountLogin } from './account-login';

interface StudioSidebarProps {
  onHome: () => void;
  access: ReturnType<typeof studioAccess>;
  sessionKey: string | null;
  activePage: StudioPageId | null;
  onPageChange: (page: StudioPageId) => void;
}

/** 采用 dashboard-01 的 inset/offcanvas 侧栏；业务菜单仅在确认登录后挂载。 */
export function StudioSidebar({ onHome, access, sessionKey, activePage, onPageChange }: StudioSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  function selectPage(page: StudioPageId) {
    onPageChange(page);
    if (isMobile) setOpenMobile(false);
  }
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SidebarMenu><SidebarMenuItem><SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
            <div><BrandIcon icon="brand/exts.svg" size="sm" /><span className="text-base font-semibold">Exts</span></div>
          </SidebarMenuButton></SidebarMenuItem></SidebarMenu>
          <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon-sm" onClick={onHome} aria-label="Back to Home"><UiIcon name="house" className="size-4" /></Button></TooltipTrigger><TooltipContent side="right">Back to Home</TooltipContent></Tooltip>
        </div>
      </SidebarHeader>
      <SidebarContent key={sessionKey ?? 'signed-out'}>
        {access === 'signed-out' && <Empty><EmptyHeader>
          <EmptyMedia variant="icon"><UiIcon name="user-round" className="size-6" /></EmptyMedia>
          <EmptyTitle>Not signed in</EmptyTitle>
          <EmptyDescription>Sign in to see your pages.</EmptyDescription>
        </EmptyHeader></Empty>}
        {access === 'ready' && studioMenu.map(group => <SidebarGroup key={group.id}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>{group.items.map(page => <SidebarMenuItem key={page.id}>
            <SidebarMenuButton tooltip={page.title} isActive={page.id === activePage} onClick={() => selectPage(page.id)}>
              <UiIcon name={page.icon} className="size-4" /><span>{page.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>)}</SidebarMenu>
        </SidebarGroup>)}
      </SidebarContent>
      <SidebarFooter><AccountLogin /></SidebarFooter>
    </Sidebar>
  );
}
