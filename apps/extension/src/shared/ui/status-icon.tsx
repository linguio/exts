import type { ComponentProps } from 'react';

import { cn } from '../lib/utils';
import type { UiIconName } from './types';
import { UiIcon } from './ui-icon';

export type StatusLevel = 'success' | 'neutral' | 'pending' | 'loading' | 'warning' | 'error';

const statusIcons: Record<StatusLevel, UiIconName> = {
  success: 'circle-check',
  neutral: 'circle-minus',
  pending: 'circle-dashed',
  loading: 'loader-circle',
  warning: 'triangle-alert',
  error: 'circle-x',
};

/** 只统一状态图标的等级与外观，业务映射和提示文案由调用方持有。 */
export function StatusIcon({ level, className, ...props }: Omit<ComponentProps<typeof UiIcon>, 'name'> & { level: StatusLevel }) {
  return <UiIcon
    {...props}
    name={statusIcons[level]}
    data-slot="status-icon"
    className={cn('size-4 shrink-0 text-muted-foreground', level === 'loading' && 'animate-spin motion-reduce:animate-none', className)}
  />;
}
