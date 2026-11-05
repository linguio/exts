import { useRef, type ReactNode } from 'react';

import { Card } from '../../components/ui/card';
import { ItemGroup, ItemSeparator } from '../../components/ui/item';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { Sheet, SheetContent, SheetTitle } from '../../components/ui/sheet';
import { UiIcon } from '../../components/custom/ui-icon';
import { HistoryCleanerSettings } from '../../features/history-cleaner/settings-section';
import { MediaDownloadSettings } from '../../features/media-download/settings-section';
import { GeneralSettings } from '../../features/settings/general-settings';

/** 设置模块组合抽屉与各业务设置区域，调用方只提供入口和打开状态。 */
export function SettingsSheet({ children, open, onOpenChange, onCloseAutoFocus }: {
  children: ReactNode;
  open: boolean;
  onOpenChange(open: boolean): void;
  onCloseAutoFocus(): void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children}
      <SheetContent aria-describedby={undefined} onOpenAutoFocus={(event) => {
        // 打开时先聚焦标题，避免自动聚焦主题按钮触发提示。
        event.preventDefault();
        titleRef.current?.focus();
      }} onCloseAutoFocus={onCloseAutoFocus}>
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
