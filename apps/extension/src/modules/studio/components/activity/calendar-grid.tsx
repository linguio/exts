import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { ChartTooltipContent } from '../../../../shared/ui/chart';
import type { ActivityDay } from '../../types/activity';
import { formatActivityDuration } from '../../utils/activity/calendar';
import { growthCategories } from '../../utils/activity/summary';
import { activityChartConfig } from './chart-config';
import { ActivityTooltipValue } from './tooltip-content';

/** 保留日历网格；无记录日期显示基础灰阶，未来日期留白。 */
export function ActivityCalendar({ days }: { days: ActivityDay[] }) {
  return (
    <div
      role="group"
      aria-label="最近24周活动日历，每列从周日到周六"
      className="mx-auto grid w-fit grid-flow-col grid-cols-[repeat(24,12px)] grid-rows-[repeat(7,12px)] gap-0.5"
    >
      {days.map((day) => {
        if (day.isFuture) return <span key={day.date} aria-hidden="true" />;

        const description = `${day.label}，完成 ${day.level}/4 项，${growthCategories.map(item => `${item.label} ${formatActivityDuration(day.growth[item.key] ?? 0)}`).join('，')}`;
        const cell = (
          <span
            key={day.date}
            role="img"
            aria-label={description}
            tabIndex={day.minutes > 0 ? 0 : undefined}
            className="block size-3 rounded-[2px] outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            style={{ backgroundColor: `var(--activity-level-${day.level})` }}
          />
        );

        if (day.minutes === 0) return cell;

        return (
          <Tooltip key={day.date} disableHoverableContent>
            <TooltipTrigger asChild>{cell}</TooltipTrigger>
            <TooltipContent side="top" className="border-0 bg-transparent p-0 shadow-none">
              <ChartTooltipContent
                config={activityChartConfig}
                active
                label={day.date}
                payload={growthCategories.map(item => ({ graphicalItemId: item.key, name: item.key, dataKey: item.key, value: day.growth[item.key] ?? 0, color: item.color }))}
                formatter={(value, name) => <ActivityTooltipValue name={String(name)} minutes={Number(value)} />}
              />
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
