import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils';
import { Skeleton } from '../ui/skeleton';
import { Spinner } from '../ui/spinner';

type LoadingRegionProps = ComponentProps<'div'> & {
  loading: boolean;
  hasPreviousResult?: boolean;
  label?: string;
};

/** 只组合区域加载展示；请求生命周期和是否已有结果由调用方提供。 */
export function LoadingRegion({ loading, hasPreviousResult = false, label = 'Loading',
  className, children, ...props }: LoadingRegionProps) {
  return (
    <div {...props} aria-busy={loading} className={cn('relative', className)}>
      {(!loading || hasPreviousResult) && <div className="size-full" aria-hidden={loading}>{children}</div>}
      {loading && !hasPreviousResult && <>
        <Skeleton className="size-full" aria-hidden="true" />
        <span role="status" className="sr-only">{label}</span>
      </>}
      {loading && hasPreviousResult && <div className="absolute inset-0 flex items-center justify-center">
        <Spinner aria-label={label} />
      </div>}
    </div>
  );
}
