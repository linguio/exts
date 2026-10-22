import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../shared/ui/tooltip';
import { formatStudyDuration, type StudyDay } from './calendar';

/** 只展示每日分钟与等级，零记录和未来日期不创建 Tooltip。 */
export function StudyCalendar({ days }: { days: StudyDay[] }) {
  return (
    <div
      role="group"
      aria-label="最近24周 JLPT 学习日历，每列从周日到周六"
      className="mx-auto grid w-fit grid-flow-col grid-cols-[repeat(24,12px)] grid-rows-[repeat(7,12px)] gap-0.5"
    >
      {days.map((day) => {
        if (day.isFuture) return <span key={day.date} aria-hidden="true" />;

        const description = `${day.label}，学习时长：${formatStudyDuration(day.minutes)}`;
        const cell = (
          <span
            key={day.date}
            role="img"
            aria-label={description}
            tabIndex={day.minutes > 0 ? 0 : undefined}
            className="block size-3 rounded-[2px] outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            style={{ backgroundColor: `var(--check-in-level-${day.level})` }}
          />
        );

        if (day.minutes === 0) return cell;

        return (
          <Tooltip key={day.date}>
            <TooltipTrigger asChild>{cell}</TooltipTrigger>
            <TooltipContent side="top">
              <p>{day.label}</p>
              <p>学习时长：{formatStudyDuration(day.minutes)}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
