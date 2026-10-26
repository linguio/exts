import { useRef, useState } from 'react';

import { Button } from '../../../../shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../shared/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { UiIcon } from '../../../../shared/ui/ui-icon';
import { toast } from '../../../../shared/ui/sonner';

const placeholders = [
  { name: 'Placeholder A', icon: 'list' },
  { name: 'Placeholder B', icon: 'folder-open' },
] as const;

/** 操作菜单沿用官方交互，本期选择占位项只显示未接入提示。 */
export function DockActions() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const pointerDownOutsideRef = useRef(false);

  return (
    <Tooltip
      open={tooltipOpen && !menuOpen}
      onOpenChange={(open) => {
        if (!menuOpen) setTooltipOpen(open);
      }}
    >
      <DropdownMenu
        open={menuOpen}
        onOpenChange={(open) => {
          setMenuOpen(open);
          setTooltipOpen(false);
        }}
      >
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="entry"
              size="entry"
              aria-label="Actions"
              onPointerDown={() => setTooltipOpen(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
                  setTooltipOpen(false);
                }
              }}
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
          onPointerDownOutside={() => {
            pointerDownOutsideRef.current = true;
          }}
          onCloseAutoFocus={(event) => {
            if (!pointerDownOutsideRef.current) return;
            // 保留原菜单的鼠标关闭行为，键盘关闭仍交给官方焦点恢复。
            event.preventDefault();
            pointerDownOutsideRef.current = false;
            if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
          }}
        >
          {placeholders.map((item) => (
            <DropdownMenuItem key={item.name} onSelect={() => { toast.info('暂未接入'); }}>
              <UiIcon name={item.icon} className="size-4" />
              <span>{item.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
}
