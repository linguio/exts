import { BrandIcon } from '../../../shared/brand/brand-icon';
import { Button } from '../../../shared/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../shared/ui/empty';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '../../../shared/ui/sidebar';
import { UiIcon } from '../../../shared/ui/ui-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../shared/ui/tooltip';
import { AccountLogin } from './account-login';

interface StudioSidebarProps {
  onHome: () => void;
}

/** 品牌仅展示，返回操作由独立官方按钮承担，缺省内容复用官方 Empty。 */
export function StudioSidebar({ onHome }: StudioSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-12 items-center gap-2 p-2 group-data-[collapsible=icon]:p-0">
          <div className="flex min-w-0 flex-1 items-center gap-2 group-data-[collapsible=icon]:hidden">
            <BrandIcon icon="brand/exts.svg" name="Exts" size="md" className="shrink-0" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Exts</span>
              <span className="truncate text-xs">Studio</span>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm" onClick={onHome} aria-label="Back to Home">
                <UiIcon name="house" className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Back to Home</TooltipContent>
          </Tooltip>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Empty className="group-data-[collapsible=icon]:hidden">
          <EmptyHeader>
            <EmptyMedia variant="icon"><UiIcon name="list" className="size-6" /></EmptyMedia>
            <EmptyTitle>No pages yet</EmptyTitle>
            <EmptyDescription>Studio pages will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </SidebarContent>
      <SidebarFooter>
        <AccountLogin />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
