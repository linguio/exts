import { type ReactNode } from 'react';

import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { Sheet, SheetContent, SheetTitle } from '../../components/ui/sheet';
import { UiIcon } from '../../components/custom/ui-icon';
import { SettingsContent } from '../../features/settings';

/** 设置模块组合抽屉与各业务设置区域，调用方只提供入口和打开状态。 */
export function SettingsSheet({ children, open, onOpenChange, onCloseAutoFocus }: {
  children: ReactNode;
  open: boolean;
  onOpenChange(open: boolean): void;
  onCloseAutoFocus?(event: Event): void;
}) {

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children}
      <SheetContent aria-describedby={undefined} onCloseAutoFocus={onCloseAutoFocus}>
        <header className="flex min-h-14 shrink-0 items-center px-6 pr-16">
          <UiIcon name="settings" className="mr-3 size-5 shrink-0" />
          <SheetTitle className="text-lg font-semibold">Settings</SheetTitle>
        </header>
        <Separator />
        <ScrollArea className="min-h-0 flex-1">
          <SettingsContent />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
