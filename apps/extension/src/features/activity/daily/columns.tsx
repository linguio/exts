import type { CellContext, ColumnDef } from '@tanstack/react-table';
import type { DailyActivityRow } from '../data/types';
import { formatActivityDuration } from '../data/format';

const durationCell = ({ getValue }: CellContext<DailyActivityRow, unknown>) => {
  const minutes = getValue<number | null>();
  return minutes === null ? '—' : formatActivityDuration(minutes);
};

const durationEdit = {
  type: 'integer' as const,
  unit: 'min',
  min: 0,
  max: 2147483647,
  emptyAsNull: true,
  digitsOnly: true,
  rejectEmptyIfChanged: true,
  invalidMessage: 'Enter a whole number of minutes.',
  emptyChangedMessage: 'Enter a whole number of minutes.',
  minMessage: 'Minutes cannot be negative.',
  maxMessage: 'Minutes cannot exceed 2,147,483,647.',
};

export const dailyColumns: ColumnDef<DailyActivityRow>[] = [
  { accessorKey: 'date', header: 'Date', enableHiding: false, sortDescFirst: true,
    meta: { dataTable: {
      filter: { type: 'date', label: 'Date range' },
      edit: { type: 'text', readOnly: true },
    } } },
  { accessorKey: 'exerciseMinutes', header: 'Exercise', sortDescFirst: true, cell: durationCell,
    meta: { dataTable: { edit: durationEdit } } },
  { accessorKey: 'readingMinutes', header: 'Reading', sortDescFirst: true, cell: durationCell,
    meta: { dataTable: { edit: durationEdit } } },
  { accessorKey: 'learningMinutes', header: 'Learning', sortDescFirst: true, cell: durationCell,
    meta: { dataTable: { edit: durationEdit } } },
  { accessorKey: 'creationMinutes', header: 'Creation', sortDescFirst: true, cell: durationCell,
    meta: { dataTable: { edit: durationEdit } } },
  { accessorKey: 'sleepMinutes', header: 'Sleep', sortDescFirst: true, cell: durationCell,
    meta: { dataTable: { edit: durationEdit } } },
];
