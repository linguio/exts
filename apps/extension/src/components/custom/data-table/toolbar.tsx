import type { Table } from '@tanstack/react-table';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../../ui/command';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../../ui/dropdown-menu';
import { CheckIcon } from 'lucide-react';
import { DataTableDateFilter } from './date-filter';
import type { DateFilterRange } from './state';
import type { DataTableFilter } from './types';

export function DataTableToolbar<T>({ table, filters = [], search, visibility, disabled }: { table: Table<T>; filters?: DataTableFilter[]; search: boolean; visibility: boolean; disabled: boolean }) {
  return <div className="flex flex-wrap items-center gap-2">
    {search && <Input className="w-64" aria-label="搜索所有列" placeholder="搜索…" value={String(table.getState().globalFilter ?? '')} onChange={e => table.setGlobalFilter(e.target.value)} disabled={disabled} />}
    {filters.map(filter => {
      const column = table.getColumn(filter.columnId);
      if (!column) return null;
      if (filter.type === 'text') return <Input key={filter.columnId} className="w-48" aria-label={filter.label} placeholder={filter.label} value={String(column.getFilterValue() ?? '')} onChange={e => column.setFilterValue(e.target.value)} disabled={disabled} />;
      if (filter.type === 'date') return <DataTableDateFilter key={filter.columnId} label={filter.label} value={(column.getFilterValue() ?? {}) as DateFilterRange} onChange={value => column.setFilterValue(value)} disabled={disabled} />;
      const selected = (column.getFilterValue() ?? []) as string[];
      return <Popover key={filter.columnId}><PopoverTrigger asChild><Button type="button" variant="outline" disabled={disabled}>{filter.label}{selected.length ? ` (${selected.length})` : ''}</Button></PopoverTrigger><PopoverContent className="w-64 p-0" align="start">
        <Command><CommandInput placeholder={`搜索${filter.label}…`} aria-label={`搜索${filter.label}选项`} /><CommandList><CommandEmpty>没有匹配选项</CommandEmpty><CommandGroup>
          {filter.options.map(option => <CommandItem key={option.value} value={option.value} keywords={[option.label]} onSelect={() => column.setFilterValue(selected.includes(option.value) ? selected.filter(value => value !== option.value) : [...selected, option.value])}>
            {selected.includes(option.value) && <><CheckIcon aria-hidden="true" className="size-4" /><span className="sr-only">已选：</span></>}{option.label}
          </CommandItem>)}
        </CommandGroup></CommandList></Command>
      </PopoverContent></Popover>;
    })}
    {(table.getState().columnFilters.length > 0 || table.getState().globalFilter) && <Button type="button" variant="ghost" disabled={disabled} onClick={() => { table.setColumnFilters([]); table.setGlobalFilter(''); }}>重置筛选</Button>}
    {visibility && <DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="outline" disabled={disabled}>显示列</Button></DropdownMenuTrigger><DropdownMenuContent align="end">
      <DropdownMenuLabel>显示列</DropdownMenuLabel><DropdownMenuSeparator />
      {table.getAllLeafColumns().filter(column => column.getCanHide()).map(column => <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()} disabled={column.getIsVisible() && table.getVisibleLeafColumns().filter(item => item.id !== '__selection').length <= 1} onCheckedChange={value => column.toggleVisibility(value)}>
        {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
      </DropdownMenuCheckboxItem>)}
    </DropdownMenuContent></DropdownMenu>}
  </div>;
}
