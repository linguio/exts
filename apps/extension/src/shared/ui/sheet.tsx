import type { ComponentProps } from 'react';
import * as DialogPrimitive from 'radix-ui/dialog';

import { cn } from '../lib/utils';
import { Button } from './button';
import { UiIcon } from './ui-icon';

// 按 shadcn Sheet 的组合方式封装 Radix，业务内容与宽度由调用方提供。
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetTitle = DialogPrimitive.Title;

function SheetContent({ children, className, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="sheet-overlay blur-overlay fixed inset-0 z-40" />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        aria-describedby={undefined}
        className={cn('sheet-content fixed inset-y-0 right-0 z-50 flex max-w-full flex-col border-l border-border bg-background text-foreground shadow-[var(--shadow-floating)] outline-none', className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close asChild>
          <Button type="button" variant="ghost" size="icon" className="absolute top-2.5 right-4 cursor-pointer" aria-label="Close">
            <UiIcon name="x" className="size-5" />
          </Button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export { Sheet, SheetTrigger, SheetContent, SheetTitle };
