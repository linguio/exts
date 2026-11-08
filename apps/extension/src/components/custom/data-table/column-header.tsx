import type { Column } from '@tanstack/react-table';
import { Button } from '../../ui/button';
import { UiIcon } from '../ui-icon';

export function DataTableColumnHeader<T>({ column, title, disabled = false }: { column: Column<T>; title: string; disabled?: boolean }) {
  if (!column.getCanSort()) return <span>{title}</span>;
  const sorted = column.getIsSorted();
  return <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={column.getToggleSortingHandler()} aria-label={`${title}：${sorted === 'asc' ? '升序' : sorted === 'desc' ? '降序' : '未排序'}，点击切换；Shift 点击多列排序`}>
    {title}<UiIcon name={sorted === 'asc' ? 'chevron-up' : sorted === 'desc' ? 'chevron-down' : 'chevrons-up-down'} className="size-4" />
  </Button>;
}
