import { BrandIcon } from '../../../components/custom/brand-icon';
import { useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

export function AboutDialog({ open, onOpenChange, onCloseAutoFocus }: {
  open: boolean;
  onOpenChange(open: boolean): void;
  onCloseAutoFocus(event: Event): void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const version = chrome.runtime.getManifest().version;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 sm:max-w-[400px]" onCloseAutoFocus={onCloseAutoFocus} onOpenAutoFocus={(event) => {
        // 初始聚焦标题，避免关闭按钮自动显示焦点描边。
        event.preventDefault();
        titleRef.current?.focus();
      }}>
        <DialogHeader className="items-center text-center sm:text-center">
          <BrandIcon icon="brand/exts.svg" size="md" className="size-12!" />
          <DialogTitle ref={titleRef} tabIndex={-1} className="text-xl outline-none">Exts</DialogTitle>
          <DialogDescription>Ideas into action</DialogDescription>
          <p className="text-xs text-muted-foreground">{version}</p>
        </DialogHeader>
        <p className="text-center text-xs whitespace-nowrap text-muted-foreground">
          Built by{' '}
          <a href="https://x.com/lingui_dev" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">Lin Gui</a>
          {' · '}
          <a href="https://github.com/linguio/exts" target="_blank" rel="noopener noreferrer" className="font-medium">Source on <span className="underline underline-offset-4">GitHub</span></a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
