import { Bar, BarChart, BarStack, CartesianGrid, ReferenceLine, XAxis } from 'recharts';
import { CHART_BAR_RADIUS, ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../components/ui/chart';
import type { ActivityRecords } from '../data/types';
import { createActivityTrend, growthCategories } from '../data/summary';
import { activityChartConfig } from './chart-config';
import { ActivityTooltipValue } from './tooltip-content';

export function ActivityTrend({ records, today, category }: { records: ActivityRecords; today: Date; category: 'growth' | 'sleep' }) {
  const { days, averageGrowth } = createActivityTrend(records, today);
  const sleeping = category === 'sleep';
  return (
    <ChartContainer config={activityChartConfig} className="h-24 w-full aspect-auto" aria-label={`截至昨天最近14天${sleeping ? '睡眠' : '成长'}时长，柱高单位为小时`}>
      <BarChart accessibilityLayer data={sleeping ? days.map(day => ({ ...day, fill: day.sleepColor })) : days} margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} tickMargin={6} axisLine={false} interval={0} height={28} />
        <ChartTooltip
          cursor={false}
          itemSorter={item => growthCategories.findIndex(category => category.key === item.dataKey)}
          content={<ChartTooltipContent
            labelFormatter={(_label, payload) => {
              const day = payload[0]?.payload;
              if (!day) return null;
              return day.date.slice(5);
            }}
            formatter={(value, name) => <ActivityTooltipValue name={String(name)} hours={Number(value)} />}
          />}
        />
        {sleeping ? <Bar dataKey="sleepHours" radius={CHART_BAR_RADIUS} /> : <BarStack stackId="growth" radius={CHART_BAR_RADIUS}>
          {[...growthCategories].reverse().map(item => (
            <Bar key={item.key} dataKey={item.key} fill={`var(--color-${item.key})`} />
          ))}
        </BarStack>}
        <ReferenceLine
          y={sleeping ? 7 : averageGrowth}
          ifOverflow="extendDomain"
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
        />
      </BarChart>
    </ChartContainer>
  );
}
