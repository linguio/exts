import type { Table } from '@tanstack/react-table';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../../ui/command';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../../ui/dropdown-menu';
import { CheckIcon } from 'lucide-react';
import { DataTableDateFilter } from './date-filter';
import type { DateFilterRange } from './state';
import type { DataTableFilter, DataTableFilterValue, DataTableQueryControls } from './types';

export function DataTableToolbar<T>({ table, filters = [], search, visibility, disabled, queryControls }: { table: Table<T>; filters?: DataTableFilter[]; search: boolean; visibility: boolean; disabled: boolean; queryControls?: DataTableQueryControls }) {
  return <div className="flex flex-wrap items-center gap-2">
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
    {queryControls ? <div className="ml-auto flex items-center gap-2">
      <Button type="button" disabled={disabled} onClick={queryControls.onQuery}>Query</Button>
      <Button type="button" variant="outline" disabled={disabled} onClick={queryControls.onReset}>Reset</Button>
      {visibility && <DataTableColumnVisibility table={table} disabled={disabled} />}
    </div> : visibility && <DataTableColumnVisibility table={table} disabled={disabled} />}
  </div>;
}

export function DataTableColumnVisibility<T>({ table, disabled }: { table: Table<T>; disabled: boolean }) {
  return <DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="outline" disabled={disabled} className="ml-auto">Columns</Button></DropdownMenuTrigger><DropdownMenuContent align="end">
      <DropdownMenuLabel>Columns</DropdownMenuLabel><DropdownMenuSeparator />
      {table.getAllLeafColumns().filter(column => column.getCanHide()).map(column => <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()} disabled={column.getIsVisible() && table.getVisibleLeafColumns().filter(item => item.id !== '__selection').length <= 1} onCheckedChange={value => column.toggleVisibility(value)}>
        {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
      </DropdownMenuCheckboxItem>)}
    </DropdownMenuContent></DropdownMenu>;
}
