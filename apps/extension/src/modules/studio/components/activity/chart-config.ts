import type { ChartConfig } from '../../../../shared/ui/chart';
import { growthCategories } from '../../utils/activity/summary';

export const activityChartConfig: ChartConfig = {
  ...Object.fromEntries(growthCategories.map(item => [item.key, { label: item.label, color: item.color }])),
  sleepMinutes: { label: 'Sleep', color: 'var(--chart-3)' },
} satisfies ChartConfig;
