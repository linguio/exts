import { useRef } from 'react';

import { Button } from '../../../../shared/ui/button';
import { Separator } from '../../../../shared/ui/separator';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../../../../shared/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { UiIcon } from '../../../../shared/ui/ui-icon';
import { useDockSheetTooltip } from './use-dock-sheet-tooltip';

/** Dock 下载入口与空抽屉。 */
export function DockDownload() {
  const sheetTooltip = useDockSheetTooltip();
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <Sheet {...sheetTooltip.sheetProps}>
      <Tooltip {...sheetTooltip.tooltipProps}>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="entry"
              size="entry"
              className="bookmark-card bookmark-card--dock bookmark-dock__tool"
              aria-label="Open download"
              {...sheetTooltip.triggerProps}
            >
              <span className="bookmark-card__icon entry-surface">
                <UiIcon name="download" className="entry-glyph" />
              </span>
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={12}>Download</TooltipContent>
      </Tooltip>
      <SheetContent aria-describedby={undefined} className="w-[560px] sm:max-w-full" onOpenAutoFocus={(event) => {
        event.preventDefault();
        titleRef.current?.focus();
      }} onCloseAutoFocus={sheetTooltip.onCloseAutoFocus}>
        <header className="flex min-h-14 shrink-0 items-center px-6 pr-16">
          <UiIcon name="download" className="mr-3 size-5 shrink-0" />
          <SheetTitle ref={titleRef} tabIndex={-1} className="text-lg font-semibold">Download</SheetTitle>
        </header>
        <Separator />
      </SheetContent>
    </Sheet>
  );
}
