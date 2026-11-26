import { Calendar } from '../../ui/calendar';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { UiIcon } from '../ui-icon';
import { formatFilterDate, parseFilterDate, type DateFilterRange } from './state';

export function DataTableDateFilter({ id, value, onChange, disabled }: {
  id: string; value: DateFilterRange; onChange: (value: DateFilterRange | undefined) => void; disabled: boolean;
}) {
  const from = parseFilterDate(value.from);
  const to = parseFilterDate(value.to);
  return <Popover><PopoverTrigger asChild><Button id={id} type="button" variant="outline" className="w-48 min-w-0 shrink justify-start" disabled={disabled}>
    <UiIcon name="calendar-days" className="size-4" />
    <span className="min-w-0 truncate text-xs tabular-nums">{from ? `${value.from}${to ? ` – ${value.to}` : ' – …'}` : 'Select dates'}</span>
  </Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
    <Calendar mode="range" defaultMonth={from} selected={from ? { from, to } : undefined} numberOfMonths={2}
      onSelect={range => onChange(range?.from ? { from: formatFilterDate(range.from), to: range.to ? formatFilterDate(range.to) : undefined } : undefined)} />
  </PopoverContent></Popover>;
}
