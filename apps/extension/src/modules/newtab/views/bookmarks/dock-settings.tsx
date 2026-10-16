import { useRef, useState } from 'react';

import { Button } from '../../../../shared/ui/button';
import { Separator } from '../../../../shared/ui/separator';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../../../../shared/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { UiIcon } from '../../../../shared/ui/ui-icon';
import { HistoryCleanerSettings } from '../../../history-cleaner/settings-section';

/** 设置页面组合独立功能的设置区域，后台逻辑由对应模块持有。 */
export function DockSettings() {
  const [open, setOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const suppressRestoredFocusTooltip = useRef(false);

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
      setTooltipOpen(false);
    }}>
      <Tooltip open={tooltipOpen && !open} onOpenChange={(nextOpen) => {
        if (!open && !suppressRestoredFocusTooltip.current) setTooltipOpen(nextOpen);
      }}>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="bookmark-card entry-trigger bookmark-card--dock bookmark-dock__tool box-border h-16 w-16 flex-none cursor-pointer rounded-[var(--radius)] bg-transparent p-0 text-foreground hover:bg-transparent focus-visible:outline-none"
              aria-label="Open settings"
              onPointerMove={() => {
                suppressRestoredFocusTooltip.current = false;
              }}
              onBlur={() => {
                suppressRestoredFocusTooltip.current = false;
              }}
              onPointerDown={() => setTooltipOpen(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') setTooltipOpen(false);
              }}
            >
              <span className="bookmark-card__icon entry-surface">
                <UiIcon name="settings" className="entry-glyph" />
              </span>
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={12}>Settings</TooltipContent>
      </Tooltip>
      <SheetContent className="w-[560px]" onCloseAutoFocus={() => {
        // 只抑制关闭后的焦点恢复提示；保留 Radix 默认焦点恢复和下次主动悬停。
        suppressRestoredFocusTooltip.current = true;
        setTooltipOpen(false);
      }}>
        <header className="flex min-h-14 shrink-0 items-center px-6 pr-16">
          <SheetTitle className="text-lg font-semibold">Settings</SheetTitle>
        </header>
        <Separator />
        <div className="min-h-0 overflow-y-auto">
          <HistoryCleanerSettings />
        </div>
      </SheetContent>
    </Sheet>
  );
}
