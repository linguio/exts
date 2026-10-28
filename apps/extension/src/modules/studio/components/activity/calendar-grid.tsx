import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import type { ActivityDay } from '../../types/activity';
import { formatActivityDuration } from '../../utils/activity/calendar';

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

        const description = `${day.label}，活动时长：${formatActivityDuration(day.minutes)}`;
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
          <Tooltip key={day.date}>
            <TooltipTrigger asChild>{cell}</TooltipTrigger>
            <TooltipContent side="top">
              <p>{day.label}</p>
              <p>活动时长：{formatActivityDuration(day.minutes)}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
