import { Bar, BarChart, BarStack, CartesianGrid, ReferenceLine, XAxis } from 'recharts';
import { CHART_BAR_RADIUS, ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../../shared/ui/chart';
import type { ActivityRecords } from '../../types/activity';
import { createActivityTrend, growthCategories } from '../../utils/activity/summary';
import { activityChartConfig } from './chart-config';
import { ActivityTooltipValue } from './tooltip-content';

export function ActivityTrend({ records, today, category }: { records: ActivityRecords; today: Date; category: 'growth' | 'sleep' }) {
  const { days, averageGrowth } = createActivityTrend(records, today);
  const sleeping = category === 'sleep';
  return (
    <ChartContainer config={activityChartConfig} className="h-24 w-full aspect-auto" aria-label={`截至昨天最近14天${sleeping ? '睡眠' : '成长'}时长，柱高单位为分钟`}>
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
              return day.date;
            }}
            formatter={(value, name) => <ActivityTooltipValue name={String(name)} minutes={Number(value)} />}
          />}
        />
        {sleeping ? <Bar dataKey="sleepMinutes" radius={CHART_BAR_RADIUS} /> : <BarStack stackId="growth" radius={CHART_BAR_RADIUS}>
          {[...growthCategories].reverse().map(item => (
            <Bar key={item.key} dataKey={item.key} fill={`var(--color-${item.key})`} />
          ))}
        </BarStack>}
        <ReferenceLine
          y={sleeping ? 420 : averageGrowth}
          ifOverflow="extendDomain"
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
        />
      </BarChart>
    </ChartContainer>
  );
}
