import { Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import type { ActivityRecords } from './types';
import { createActivityWeek } from './summary';
import { activityChartConfig } from './chart-config';
import { ActivityTooltipValue } from './tooltip-content';

export function ActivityWeek({ records, today }: { records: ActivityRecords; today: Date }) {
  const week = createActivityWeek(records, today);
  const fullPayload = week.items.map(item => ({
    graphicalItemId: item.key, name: item.key, dataKey: item.key, value: item.minutes, payload: item,
  }));
  return (
    <div className="grid h-24 min-h-0 grid-cols-2 gap-4">
      <div className="relative min-w-0" role="group" aria-label="本周成长投入占比">
        <ChartContainer config={activityChartConfig} className="h-24 w-full aspect-auto">
          <PieChart accessibilityLayer={week.total > 0}>
            {week.total > 0 ? <ChartTooltip cursor={false} content={({ active, payload }) => <ChartTooltipContent
              active={active}
              label={`W${week.weekNumber} Spent`}
              payload={fullPayload}
              formatter={(value, name) => <ActivityTooltipValue
                name={String(name)} minutes={Number(value)} percent={week.total ? Number(value) / week.total * 100 : 0}
                highlighted={name === payload?.[0]?.payload?.key}
              />}
            />} /> : null}
            {/* 无投入时仅用图形权重绘制灰色空圆，不写入记录或参与统计。 */}
            <Pie data={week.total > 0 ? week.items.filter(item => item.minutes > 0)
              : [{ key: 'empty', minutes: 1, fill: 'var(--muted)' }]}
              dataKey="minutes" nameKey="key" outerRadius={44} startAngle={90} endAngle={-270} />
          </PieChart>
        </ChartContainer>
      </div>
      <div className="relative min-w-0" role="group" aria-label="本周成长计划完成度，从内到外为运动、阅读、学习、创作">
        <ChartContainer config={activityChartConfig} className="h-24 w-full aspect-auto">
          <RadialBarChart accessibilityLayer data={week.items.map(item => ({ ...item, fill: item.progressFill }))} innerRadius={14} outerRadius={49} startAngle={90} endAngle={-270} barSize={6}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <ChartTooltip cursor={false} content={({ active, payload }) => <ChartTooltipContent
              active={active}
              label={`W${week.weekNumber} Plan`}
              payload={fullPayload}
              formatter={(_value, name, item) => <ActivityTooltipValue
                name={String(name)} minutes={item.payload.minutes} goal={item.payload.goal} percent={item.payload.percent}
                highlighted={name === payload?.[0]?.payload?.key}
              />}
            />} />
            <RadialBar dataKey="progress" background />
          </RadialBarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
