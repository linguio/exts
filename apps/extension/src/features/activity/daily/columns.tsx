import type { CellContext, ColumnDef } from '@tanstack/react-table';
import type { DailyActivityRow } from '../data/types';
import { formatActivityDuration } from '../data/format';

const durationCell = ({ getValue }: CellContext<DailyActivityRow, unknown>) => {
  const minutes = getValue<number | null>();
  return minutes === null ? '—' : formatActivityDuration(minutes);
};

export const dailyColumns: ColumnDef<DailyActivityRow>[] = [
  { accessorKey: 'date', header: 'Date', enableHiding: false, sortDescFirst: true },
  { accessorKey: 'exerciseMinutes', header: 'Exercise', sortDescFirst: true, cell: durationCell },
  { accessorKey: 'readingMinutes', header: 'Reading', sortDescFirst: true, cell: durationCell },
  { accessorKey: 'learningMinutes', header: 'Learning', sortDescFirst: true, cell: durationCell },
  { accessorKey: 'creationMinutes', header: 'Creation', sortDescFirst: true, cell: durationCell },
  { accessorKey: 'sleepMinutes', header: 'Sleep', sortDescFirst: true, cell: durationCell },
];
