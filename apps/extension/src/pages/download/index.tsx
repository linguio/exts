import { type ReactNode } from 'react';

import { Separator } from '../../components/ui/separator';
import { Sheet, SheetContent, SheetTitle } from '../../components/ui/sheet';
import { UiIcon } from '../../components/custom/ui-icon';
import { DownloadsPanel } from '../../features/media-download/records/records';

/** 下载页面持有记录抽屉；调用方只提供入口和打开状态。 */
export function MediaDownloadSheet({ children, open, onOpenChange }: {
  children: ReactNode;
  open: boolean;
  onOpenChange(open: boolean): void;
}) {

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children}
      <SheetContent aria-describedby={undefined}>
        <header className="flex min-h-14 shrink-0 items-center px-6 pr-16">
          <UiIcon name="download" className="mr-3 size-5 shrink-0" />
          <SheetTitle className="text-lg font-semibold">Media Download</SheetTitle>
        </header>
        <Separator />
        <DownloadsPanel />
      </SheetContent>
    </Sheet>
  );
}
