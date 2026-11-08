import { useState } from 'react';

import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/ui/tooltip';
import { UiIcon } from '../../../components/custom/ui-icon';
import { LoadingRegion } from '../../../components/custom/loading-region';
import { createActivityCalendar } from '../data/calendar';
import { ActivityCalendar } from './calendar-grid';
import { useActivityToday } from './use-activity-today';
import { useActivityData } from './provider';
import { ActivityTrend } from './trend-chart';
import { ActivityWeek } from './week-charts';

/** 当前视图读取真实接口结果；分类切换只改变字段展示。 */
export function ActivityCard() {
  const { view, setView, records, status, hasPreviousResult } = useActivityData();
  const loading = status === 'loading';
  const [category, setCategory] = useState<'growth' | 'sleep'>('growth');
  const categoryLabel = category === 'growth' ? 'Growth' : 'Sleep';
  const today = useActivityToday();
  const days = createActivityCalendar(records, today);

  return (
    <Card
      aria-label="Activity"
      className="box-border h-[var(--size-bookmark-folder)] w-full shrink-0 gap-4 rounded-[var(--radius)] p-4 shadow-none"
    >
      <header className="flex h-8 shrink-0 items-center justify-between">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => {
            if (value === 'calendar' || value === 'chart' || value === 'pie') setView(value);
          }}
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Activity view"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="calendar" aria-label="Check-ins" className="w-9">
                <UiIcon name="calendar-days" className="size-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Check-ins</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="chart" aria-label="Trends" className="w-9">
                <UiIcon name="chart-column" className="size-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Trends</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="pie" aria-label="Summary" className="w-9">
                <UiIcon name="chart-pie" className="size-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Summary</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        {view === 'chart' ? <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={categoryLabel} onClick={() => setCategory(current => current === 'growth' ? 'sleep' : 'growth')}>
                <UiIcon name="chevrons-up-down" className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{categoryLabel}</TooltipContent>
        </Tooltip> : null}
      </header>
      {view === 'calendar' ? <LoadingRegion loading={loading} hasPreviousResult={hasPreviousResult} label="加载活动日历" className="h-24 w-full">
        <ActivityCalendar days={days} />
      </LoadingRegion> : null}
      {view === 'chart' ? <LoadingRegion loading={loading} hasPreviousResult={hasPreviousResult} label="加载活动趋势" className="h-24 w-full">
        <ActivityTrend records={records} today={today} category={category} />
      </LoadingRegion> : null}
      {view === 'pie' ? <ActivityWeek records={records} today={today} loading={loading} hasPreviousResult={hasPreviousResult} /> : null}
    </Card>
  );
}
