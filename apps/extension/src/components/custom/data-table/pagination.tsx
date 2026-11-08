import { useEffect, useState, type MouseEvent } from 'react';
import type { Table } from '@tanstack/react-table';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '../../ui/pagination';
import { paginationItems } from './state';

export function DataTablePagination<T>({ table, pageSizes, disabled }: { table: Table<T>; pageSizes: number[]; disabled: boolean }) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pages = table.getPageCount();
  const [target, setTarget] = useState(String(pageIndex + 1));
  useEffect(() => setTarget(String(pageIndex + 1)), [pageIndex]);
  const sizes = [...new Set([...pageSizes, pageSize])].filter(n => Number.isSafeInteger(n) && n > 0).sort((a, b) => a - b);
  // 官方 Pagination 使用链接；保留其组件与默认样式，通过语义和事件防护处理不可翻页状态。
  const linkProps = (index: number, blocked: boolean) => ({
    href: `#page-${index + 1}`, 'aria-disabled': blocked, tabIndex: blocked ? -1 : 0,
    onClick: (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); if (!blocked) table.setPageIndex(index); },
  });
  const noPrevious = disabled || !table.getCanPreviousPage();
  const noNext = disabled || !table.getCanNextPage();
  return <div className="flex flex-wrap items-center justify-between gap-4">
    <span className="shrink-0 text-sm whitespace-nowrap text-muted-foreground">{table.getRowCount()} records · Page {pages ? pageIndex + 1 : 0} of {pages}</span>
    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-4">
      <div className="flex shrink-0 items-center gap-2 whitespace-nowrap"><span className="text-sm">Rows per page</span><Select value={String(pageSize)} onValueChange={value => table.setPageSize(Number(value))} disabled={disabled}><SelectTrigger aria-label="Rows per page"><SelectValue /></SelectTrigger><SelectContent>{sizes.map(size => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div>
      <Pagination aria-label="Table pagination" className="mx-0 w-auto shrink-0"><PaginationContent>
        <PaginationItem><PaginationLink size="default" {...linkProps(0, noPrevious)}>First</PaginationLink></PaginationItem>
        <PaginationItem><PaginationPrevious {...linkProps(Math.max(0, pageIndex - 1), noPrevious)} /></PaginationItem>
        {paginationItems(pageIndex, pages).map((page, index) => <PaginationItem key={page === 'ellipsis' ? `gap-${index}` : page}>
          {page === 'ellipsis' ? <PaginationEllipsis /> : <PaginationLink isActive={page === pageIndex} aria-label={`Page ${page + 1}`} {...linkProps(page, disabled)}>{page + 1}</PaginationLink>}
        </PaginationItem>)}
        <PaginationItem><PaginationNext {...linkProps(Math.min(Math.max(0, pages - 1), pageIndex + 1), noNext)} /></PaginationItem>
        <PaginationItem><PaginationLink size="default" {...linkProps(Math.max(0, pages - 1), noNext)}>Last</PaginationLink></PaginationItem>
      </PaginationContent></Pagination>
      <form className="flex shrink-0 items-center gap-2 whitespace-nowrap" onSubmit={e => { e.preventDefault(); const page = Number(target); if (Number.isSafeInteger(page) && page >= 1 && page <= pages) table.setPageIndex(page - 1); }}>
        <Input className="w-20" type="number" aria-label="Go to page" min={1} max={Math.max(1, pages)} value={target} disabled={disabled || !pages} onChange={e => setTarget(e.target.value)} />
        <Button type="submit" variant="outline" size="sm" disabled={disabled || !pages}>Go</Button>
      </form>
    </div>
  </div>;
}
