import { useRef } from 'react';

import { Button } from '../../../../shared/ui/button';
import { Card } from '../../../../shared/ui/card';
import { ItemGroup, ItemSeparator } from '../../../../shared/ui/item';
import { ScrollArea } from '../../../../shared/ui/scroll-area';
import { Separator } from '../../../../shared/ui/separator';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../../../../shared/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { UiIcon } from '../../../../shared/ui/ui-icon';
import { HistoryCleanerSettings } from '../../../history-cleaner/settings-section';
import { MediaDownloadSettings } from '../settings/media-download-settings';
import { GeneralSettings } from '../settings/general-settings';
import { useDockSheetTooltip } from './use-dock-sheet-tooltip';

/** 设置页面组合独立功能的设置区域，后台逻辑由对应模块持有。 */
export function DockSettings() {
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
              aria-label="Open settings"
              {...sheetTooltip.triggerProps}
            >
              <span className="bookmark-card__icon entry-surface">
                <UiIcon name="settings" className="entry-glyph" />
              </span>
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={12}>Settings</TooltipContent>
      </Tooltip>
      <SheetContent aria-describedby={undefined} onOpenAutoFocus={(event) => {
        // 打开时先聚焦标题，避免自动聚焦主题按钮触发提示。
        event.preventDefault();
        titleRef.current?.focus();
      }} onCloseAutoFocus={sheetTooltip.onCloseAutoFocus}>
        <header className="flex min-h-14 shrink-0 items-center px-6 pr-16">
          <UiIcon name="settings" className="mr-3 size-5 shrink-0" />
          <SheetTitle ref={titleRef} tabIndex={-1} className="text-lg font-semibold">Settings</SheetTitle>
        </header>
        <Separator />
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 p-6">
            <GeneralSettings />
            <section aria-labelledby="features-heading" className="space-y-3">
              <h3 id="features-heading" className="text-sm font-medium">Features</h3>
              <Card className="gap-0 px-4 py-0 shadow-none">
                <ItemGroup>
                  <HistoryCleanerSettings />
                  <ItemSeparator />
                  <MediaDownloadSettings />
                </ItemGroup>
              </Card>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
