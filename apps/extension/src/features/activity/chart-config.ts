import type { ChartConfig } from '../../components/ui/chart';
import { growthCategories } from './summary';

export const activityChartConfig: ChartConfig = {
  ...Object.fromEntries(growthCategories.map(item => [item.key, { label: item.label, color: item.color }])),
  sleepMinutes: { label: 'Sleep', color: 'var(--chart-3)' },
} satisfies ChartConfig;
