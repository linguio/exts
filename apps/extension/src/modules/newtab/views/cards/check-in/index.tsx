import { Card } from '../../../../../shared/ui/card';
import { ToggleGroup, ToggleGroupItem } from '../../../../../shared/ui/toggle-group';
import { createJlptCalendar } from './calendar';
import { StudyCalendar } from './calendar-grid';
import records from './data/jlpt.json';
import { useLocalDate } from './use-local-date';

/** 卡片入口组合固定的 JLPT 选项和本地学习日历，不接入其他数据源。 */
export function CheckInCard() {
  const today = useLocalDate();
  const days = createJlptCalendar(records, today);

  return (
    <Card
      aria-label="Daily check-in"
      className="box-border h-[var(--size-bookmark-folder)] w-full shrink-0 gap-4 rounded-[var(--radius)] p-4 shadow-none"
    >
      <header className="flex h-8 shrink-0 items-center justify-between">
        <h2 className="text-sm font-medium">Daily check-in</h2>
        <ToggleGroup type="single" value="jlpt" variant="outline" size="sm" spacing={0} aria-label="学习记录类型">
          <ToggleGroupItem value="jlpt">JLPT</ToggleGroupItem>
        </ToggleGroup>
      </header>
      <StudyCalendar days={days} />
    </Card>
  );
}
