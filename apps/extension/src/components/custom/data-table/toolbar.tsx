import { useId } from 'react';
import type { Table } from '@tanstack/react-table';
import { CheckIcon, Columns3, RotateCcw } from 'lucide-react';
import { Button } from '../../ui/button';
import { ButtonGroup } from '../../ui/button-group';
import { Input } from '../../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../../ui/command';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { DataTableDateFilter } from './date-filter';
import type { DateFilterRange } from './state';
import type { DataTableFilter, DataTableFilterValue, DataTableQueryControls } from './types';

function DataTableQueryActions<T>({ table, disabled, queryControls, showVisibility }: { table: Table<T>; disabled: boolean; queryControls: DataTableQueryControls; showVisibility: boolean }) {
  return <div className="flex items-center justify-end gap-2">
    <ButtonGroup aria-label="Query actions">
      <Button type="button" disabled={disabled} onClick={queryControls.onQuery}>Query</Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="outline" size="icon" disabled={disabled} aria-label="Reset" onClick={queryControls.onReset}>
            <RotateCcw className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset</TooltipContent>
      </Tooltip>
    </ButtonGroup>
    {showVisibility && <DataTableColumnVisibility table={table} disabled={disabled} trigger="icon" />}
  </div>;
}

function DataTableFilterControl({ id, label, filter, value, onChange, disabled }: {
  id: string; label: string; filter: DataTableFilter; value: unknown; onChange: (next: DataTableFilterValue) => void; disabled: boolean;
}) {
  if (filter.type === 'text') return <Input id={id} className="w-48 min-w-0" placeholder={filter.placeholder ?? `Search by ${label.toLowerCase()}`} value={String(value ?? '')}
    onChange={e => onChange(e.target.value)} disabled={disabled} />;
  if (filter.type === 'date') return <DataTableDateFilter id={id} value={(value ?? {}) as DateFilterRange} onChange={onChange} disabled={disabled} />;
  const selected = (value ?? []) as string[];
  return <Popover><PopoverTrigger asChild><Button id={id} type="button" variant="outline" className="min-w-0 shrink" disabled={disabled}>
    <span className="truncate">{selected.length ? `${selected.length} selected` : 'All'}</span>
  </Button></PopoverTrigger><PopoverContent className="w-64 p-0" align="start">
        <Command><CommandInput placeholder={`Search ${label}…`} aria-label={`Search ${label} options`} /><CommandList><CommandEmpty>No options found.</CommandEmpty><CommandGroup>
          {filter.options.map(option => <CommandItem key={option.value} value={option.value} keywords={[option.label]} onSelect={() => onChange(selected.includes(option.value) ? selected.filter(value => value !== option.value) : [...selected, option.value])}>
            {selected.includes(option.value) && <><CheckIcon aria-hidden="true" className="size-4" /><span className="sr-only">Selected: </span></>}{option.label}
          </CommandItem>)}
        </CommandGroup></CommandList></Command>
      </PopoverContent></Popover>;
}

export function DataTableToolbar<T>({ table, filters = [], search, visibility, disabled, queryControls }: { table: Table<T>; filters?: DataTableFilter[]; search: boolean; visibility: boolean; disabled: boolean; queryControls?: DataTableQueryControls }) {
  const prefix = useId();
  const columns = new Map(table.getAllLeafColumns().map(column => [column.id, column]));
  const activeFilters = queryControls ? filters : filters.filter(filter => columns.has(filter.columnId));
  const fields = <>
    {search && <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
      <label htmlFor={prefix} className="text-sm font-medium">Search</label>
      <Input id={prefix} className="w-64 min-w-0" placeholder="Search all columns…" value={String(table.getState().globalFilter ?? '')} onChange={e => table.setGlobalFilter(e.target.value)} disabled={disabled} />
    </div>}
    {activeFilters.map((filter, index) => {
      const id = `${prefix}-${index}`;
      const column = columns.get(filter.columnId);
      const header = column?.columnDef.header;
      const label = typeof header === 'string' ? header : filter.label;
      const value = queryControls ? queryControls.draft[filter.columnId] : column?.getFilterValue();
      const setValue = (next: DataTableFilterValue) => queryControls ? queryControls.onFilterChange(filter.columnId, next) : column?.setFilterValue(next);
      return <div key={filter.columnId} className="flex min-w-0 items-center gap-2 whitespace-nowrap">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        <DataTableFilterControl id={id} label={label} filter={filter} value={value} onChange={setValue} disabled={disabled} />
      </div>;
    })}
  </>;
  if (queryControls) return <div className="grid min-w-0 grid-cols-4 items-center gap-x-4 gap-y-2">
    {fields}
    <div className="col-start-4">
      <DataTableQueryActions table={table} disabled={disabled} queryControls={queryControls} showVisibility={visibility} />
    </div>
  </div>;
  return <div className="flex flex-wrap items-center gap-2">
    {fields}
    {!queryControls && (table.getState().columnFilters.length > 0 || table.getState().globalFilter) && <Button type="button" variant="ghost" disabled={disabled} onClick={() => { table.setColumnFilters([]); table.setGlobalFilter(''); }}>Reset filters</Button>}
    {visibility && <DataTableColumnVisibility table={table} disabled={disabled} trigger="text" />}
  </div>;
}

export function DataTableColumnVisibility<T>({ table, disabled, trigger = 'text' }: { table: Table<T>; disabled: boolean; trigger?: 'text' | 'icon' }) {
  const menu = <>
    <DropdownMenuLabel>Columns</DropdownMenuLabel><DropdownMenuSeparator />
    {table.getAllLeafColumns().filter(column => column.getCanHide()).map(column => <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()} disabled={column.getIsVisible() && table.getVisibleLeafColumns().filter(item => item.id !== '__selection').length <= 1} onCheckedChange={value => column.toggleVisibility(value)}>
      {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
    </DropdownMenuCheckboxItem>)}
  </>;
  if (trigger === 'icon') {
    return <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="icon" disabled={disabled} aria-label="Columns"><Columns3 className="size-4" /></Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Columns</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
    </DropdownMenu>;
  }
  return <DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="outline" disabled={disabled} className="ml-auto">Columns</Button></DropdownMenuTrigger><DropdownMenuContent align="end">{menu}</DropdownMenuContent></DropdownMenu>;
}
