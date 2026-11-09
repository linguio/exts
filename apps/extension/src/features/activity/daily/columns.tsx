import type { CellContext, ColumnDef } from '@tanstack/react-table';
import type { DailyActivityRow } from '../data/types';
import { formatActivityDuration } from '../data/format';

const durationCell = ({ getValue }: CellContext<DailyActivityRow, unknown>) => {
  const hours = getValue<number | null>();
  return hours === null ? '—' : formatActivityDuration(hours);
};

const durationEdit = {
  type: 'number' as const,
  unit: 'h',
  required: true,
  requiredMessage: 'Enter a number of hours.',
  min: 0,
  step: 0.5,
  rejectEmptyIfChanged: true,
  invalidMessage: 'Enter hours in 0.5 steps.',
  emptyChangedMessage: 'Enter hours in 0.5 steps.',
  minMessage: 'Hours cannot be negative.',
  stepMessage: 'Enter hours in 0.5 steps.',
};

export const dailyColumns: ColumnDef<DailyActivityRow>[] = [
  { accessorKey: 'date', header: 'Date', enableHiding: false, sortDescFirst: true,
    meta: { dataTable: {
      filter: { type: 'date', label: 'Date range' },
      edit: { type: 'text', readOnly: true },
    } } },
  { accessorKey: 'exerciseHours', header: 'Exercise', sortDescFirst: true, cell: durationCell,
    meta: { dataTable: { edit: durationEdit } } },
  { accessorKey: 'readingHours', header: 'Reading', sortDescFirst: true, cell: durationCell,
    meta: { dataTable: { edit: durationEdit } } },
  { accessorKey: 'learningHours', header: 'Learning', sortDescFirst: true, cell: durationCell,
    meta: { dataTable: { edit: durationEdit } } },
  { accessorKey: 'creationHours', header: 'Creation', sortDescFirst: true, cell: durationCell,
    meta: { dataTable: { edit: durationEdit } } },
  { accessorKey: 'sleepHours', header: 'Sleep', sortDescFirst: true, cell: durationCell,
    meta: { dataTable: { edit: durationEdit } } },
];
