import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { UiIcon } from '../../components/custom/ui-icon';
import { toast } from '../../components/ui/sonner';
import { useDockOverlay } from './use-dock-overlay';

const placeholders = [
  { name: 'Placeholder A', icon: 'list' },
  { name: 'Placeholder B', icon: 'folder-open' },
] as const;

/** 操作菜单沿用官方交互，本期选择占位项只显示未接入提示。 */
export function DockActions() {
  const overlay = useDockOverlay();

  return (
    <Tooltip {...overlay.tooltipProps}>
      <DropdownMenu {...overlay.overlayProps}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="entry"
              size="entry"
              aria-label="Actions"
              {...overlay.triggerProps}
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
          onCloseAutoFocus={overlay.onCloseAutoFocus}
        >
          {placeholders.map((item) => (
            <DropdownMenuItem key={item.name} onSelect={() => { toast.info('Not connected yet.'); }}>
              <UiIcon name={item.icon} className="size-4" />
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
}
