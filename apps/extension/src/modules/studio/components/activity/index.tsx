import { useState } from 'react';

import { Card } from '../../../../shared/ui/card';
import { ToggleGroup, ToggleGroupItem } from '../../../../shared/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { UiIcon } from '../../../../shared/ui/ui-icon';
import type { ActivityRecords } from '../../types/activity';
import { createActivityCalendar } from '../../utils/activity/calendar';
import { ActivityCalendar } from './calendar-grid';
import { useLocalDate } from '../../hooks/activity/use-local-date';

/** 活动卡片归 Studio 持有；日历保留完整网格，记录初始为空，图表暂留空。 */
export function ActivityCard() {
  const [view, setView] = useState<'calendar' | 'chart'>('calendar');
  const [records] = useState<ActivityRecords>({});
  const today = useLocalDate();
  const days = createActivityCalendar(records, today);

  return (
    <Card
      aria-label="Activity"
      className="box-border h-[var(--size-bookmark-folder)] w-full shrink-0 gap-4 rounded-[var(--radius)] p-4 shadow-none"
    >
      <header className="flex h-8 shrink-0 items-center">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => {
            if (value === 'calendar' || value === 'chart') setView(value);
          }}
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Activity view"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="calendar" aria-label="Calendar" className="w-9">
                <UiIcon name="calendar-days" className="size-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Calendar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="chart" aria-label="Chart" className="w-9">
                <UiIcon name="chart-column" className="size-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Chart</TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </header>
      {view === 'calendar' ? <ActivityCalendar days={days} /> : null}
    </Card>
  );
}
