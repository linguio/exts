import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { UiIcon } from '../../components/custom/ui-icon';
import { DailyQuickEdit } from '../../features/activity/daily/daily-quick-edit';
import { useDockOverlay } from './use-dock-overlay';

/** 操作菜单只提供入口，查询与编辑由 Daily 业务组件持有。 */
export function ActionsEntry() {
  const overlay = useDockOverlay();
  const [dailyOpen, setDailyOpen] = useState(false);

  return (
    <><Tooltip {...overlay.tooltipProps}>
      <DropdownMenu {...overlay.overlayProps}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="entry"
              size="entry"
              aria-label="Actions"
            >
              <span className="entry-surface">
                <UiIcon name="zap" className="entry-glyph" />
              </span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={12}>Actions</TooltipContent>
        <DropdownMenuContent
          side="top"
          align="center"
          sideOffset={12}
        >
          <DropdownMenuItem disabled={dailyOpen} onSelect={() => setDailyOpen(true)}>
            <UiIcon name="notebook-text" className="size-4" />
            <span>Edit Daily</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
    <DailyQuickEdit open={dailyOpen} onOpenChange={setDailyOpen} /></>
  );
}
