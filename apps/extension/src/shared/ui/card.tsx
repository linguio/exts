// 基于 shadcn/ui new-york-v4 官方 Card；固定来源与必要差异见 docs/web-ui-sources.md。
import type { ComponentProps } from 'react';

import { cn } from '../lib/utils';

function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-6 rounded-xl border border-border bg-card py-6 text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Card };
