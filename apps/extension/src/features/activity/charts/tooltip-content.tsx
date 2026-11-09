import { formatActivityDuration, formatActivityProgress } from '../data/format';
import { activityChartConfig } from './chart-config';
import { cn } from '../../../lib/utils';

/** 统一数据行，提示容器与标题由官方 ChartTooltipContent 提供。 */
export function ActivityTooltipValue({ name, hours, goal, percent, highlighted = false }: { name: string; hours: number; goal?: number; percent?: number; highlighted?: boolean }) {
  return <>
    <span className={cn('text-muted-foreground', highlighted && 'font-semibold')}>{activityChartConfig[name]?.label ?? name}</span>
    <span className={cn('ml-auto font-mono tabular-nums', highlighted && 'font-semibold')}>
      {percent === undefined ? formatActivityDuration(hours) : formatActivityProgress(hours, percent, goal)}
    </span>
  </>;
}
