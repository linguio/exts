import type { MouseEvent } from 'react';
import type { DictionaryGroup } from '../../../../api/dictionaries';
import { Button } from '../../../../components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '../../../../components/ui/pagination';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { Spinner } from '../../../../components/ui/spinner';

interface DictionaryListProps {
  groups: DictionaryGroup[];
  selectedId?: string;
  pageIndex: number;
  pages: number;
  loading: boolean;
  failed: boolean;
  onSelect: (groupId: string) => void;
  onPage: (pageIndex: number) => void;
  onRetry: () => void;
}

export function DictionaryList({ groups, selectedId, pageIndex, pages, loading, failed,
  onSelect, onPage, onRetry }: DictionaryListProps) {
  const pageLink = (index: number) => {
    const blocked = loading || index < 0 || index >= pages;
    return {
      href: `#dictionary-page-${index + 1}`, 'aria-disabled': blocked, tabIndex: blocked ? -1 : 0,
      onClick: (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (!blocked) onPage(index);
      },
    };
  };
  return (
    <section aria-label="Dictionary groups" className="flex min-h-0 min-w-0 flex-col border-b md:border-r md:border-b-0">
      <ScrollArea className="min-h-0 max-h-40 flex-1 md:max-h-none">
        <div className="space-y-1 p-2">
          {loading ? <div role="status" className="p-2"><Spinner /><span className="sr-only">Loading dictionary groups</span></div>
            : failed ? <div role="alert" className="space-y-2 p-2">
              <p className="text-sm">Unable to load dictionary groups.</p>
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>Retry</Button>
            </div>
              : groups.length === 0 ? <p className="p-2 text-sm text-muted-foreground">No dictionary groups.</p>
                : groups.map(group => (
                  <Button key={group.id} type="button" variant={selectedId === group.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start" aria-pressed={selectedId === group.id}
                    onClick={() => onSelect(group.id)}>
                    <span className="truncate">{group.label}</span>
                  </Button>
                ))}
        </div>
      </ScrollArea>
      <Pagination aria-label="Dictionary group pagination" className="shrink-0 border-t py-2">
        <PaginationContent>
          <PaginationItem><PaginationPrevious {...pageLink(pageIndex - 1)} /></PaginationItem>
          <PaginationItem><span className="text-sm tabular-nums">{pages ? pageIndex + 1 : 0} / {pages}</span></PaginationItem>
          <PaginationItem><PaginationNext {...pageLink(pageIndex + 1)} /></PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
