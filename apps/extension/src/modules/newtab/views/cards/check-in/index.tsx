import { useState } from 'react';

import { Card } from '../../../../../shared/ui/card';
import { ToggleGroup, ToggleGroupItem } from '../../../../../shared/ui/toggle-group';
import { createJlptCalendar } from './calendar';
import { StudyCalendar } from './calendar-grid';
import jlptRecords from './data/jlpt.json';
import workoutRecords from './data/workout.json';
import { useLocalDate } from './use-local-date';

/** 卡片按所选打卡类型展示独立的本地记录，共用日历和颜色规则。 */
export function CheckInCard() {
  const [activity, setActivity] = useState<'jlpt' | 'workout'>('jlpt');
  const today = useLocalDate();
  const days = createJlptCalendar(activity === 'jlpt' ? jlptRecords : workoutRecords, today);

  return (
    <Card
      aria-label="Daily check-in"
      className="box-border h-[var(--size-bookmark-folder)] w-full shrink-0 gap-4 rounded-[var(--radius)] p-4 shadow-none"
    >
      <header className="flex h-8 shrink-0 items-center justify-between">
        <h2 className="text-sm font-medium">Daily check-in</h2>
        <ToggleGroup
          type="single"
          value={activity}
          onValueChange={(value) => {
            if (value === 'jlpt' || value === 'workout') setActivity(value);
          }}
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="打卡记录类型"
        >
          <ToggleGroupItem value="jlpt">JLPT</ToggleGroupItem>
          <ToggleGroupItem value="workout">Workout</ToggleGroupItem>
        </ToggleGroup>
      </header>
      <StudyCalendar days={days} activity={activity} />
    </Card>
  );
}
