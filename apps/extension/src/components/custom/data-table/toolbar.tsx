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
  return <div className="ml-auto flex shrink-0 items-center gap-2">
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

export function DataTableToolbar<T>({ table, filters = [], search, visibility, disabled, queryControls, singleRow = false }: { table: Table<T>; filters?: DataTableFilter[]; search: boolean; visibility: boolean; disabled: boolean; queryControls?: DataTableQueryControls; singleRow?: boolean }) {
  return <div className={singleRow ? 'flex w-max min-w-full flex-nowrap items-center gap-2' : 'flex flex-wrap items-center gap-2'}>
    {search && <Input className="w-64" aria-label="Search all columns" placeholder="Search…" value={String(table.getState().globalFilter ?? '')} onChange={e => table.setGlobalFilter(e.target.value)} disabled={disabled} />}
    {filters.map(filter => {
      const column = queryControls ? undefined : table.getColumn(filter.columnId);
      if (!column && !queryControls) return null;
      const value = queryControls ? queryControls.draft[filter.columnId] : column?.getFilterValue();
      const setValue = (next: DataTableFilterValue) => queryControls ? queryControls.onFilterChange(filter.columnId, next) : column?.setFilterValue(next);
      if (filter.type === 'text') return <Input key={filter.columnId} className="w-48" aria-label={filter.label} placeholder={filter.label} value={String(value ?? '')} onChange={e => setValue(e.target.value)} disabled={disabled} />;
      if (filter.type === 'date') return <DataTableDateFilter key={filter.columnId} label={filter.label} value={(value ?? {}) as DateFilterRange} onChange={setValue} disabled={disabled} />;
      const selected = (value ?? []) as string[];
      return <Popover key={filter.columnId}><PopoverTrigger asChild><Button type="button" variant="outline" disabled={disabled}>{filter.label}{selected.length ? ` (${selected.length})` : ''}</Button></PopoverTrigger><PopoverContent className="w-64 p-0" align="start">
        <Command><CommandInput placeholder={`Search ${filter.label}…`} aria-label={`Search ${filter.label} options`} /><CommandList><CommandEmpty>No options found.</CommandEmpty><CommandGroup>
          {filter.options.map(option => <CommandItem key={option.value} value={option.value} keywords={[option.label]} onSelect={() => setValue(selected.includes(option.value) ? selected.filter(value => value !== option.value) : [...selected, option.value])}>
            {selected.includes(option.value) && <><CheckIcon aria-hidden="true" className="size-4" /><span className="sr-only">Selected: </span></>}{option.label}
          </CommandItem>)}
        </CommandGroup></CommandList></Command>
      </PopoverContent></Popover>;
    })}
    {!queryControls && (table.getState().columnFilters.length > 0 || table.getState().globalFilter) && <Button type="button" variant="ghost" disabled={disabled} onClick={() => { table.setColumnFilters([]); table.setGlobalFilter(''); }}>Reset filters</Button>}
    {queryControls
      ? <DataTableQueryActions table={table} disabled={disabled} queryControls={queryControls} showVisibility={visibility} />
      : visibility && <DataTableColumnVisibility table={table} disabled={disabled} trigger="text" />}
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
