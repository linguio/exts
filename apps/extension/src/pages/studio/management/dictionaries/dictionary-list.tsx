import { useState, type FormEvent } from 'react';
import { Plus, Search, SquarePen } from 'lucide-react';
import type { DictionaryGroup } from '../../../../api/dictionaries';
import { Button } from '../../../../components/ui/button';
import { ButtonGroup } from '../../../../components/ui/button-group';
import { UiIcon } from '../../../../components/custom/ui-icon';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../../components/ui/empty';
import { Field } from '../../../../components/ui/field';
import { Input } from '../../../../components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '../../../../components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components/ui/popover';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../../../../components/ui/sidebar';
import { Spinner } from '../../../../components/ui/spinner';

interface DictionaryListProps {
  groups: DictionaryGroup[];
  selectedId?: string;
  pageIndex: number;
  pages: number;
  total?: number;
  loading: boolean;
  failed: boolean;
  search: string;
  searching: boolean;
  onSearch: (value: string) => void;
  onSubmitSearch: () => void;
  onPlaceholderAction: () => void;
  onSelect: (groupId: string) => void;
  onPage: (pageIndex: number) => void;
}

export function DictionaryList({ groups, selectedId, pageIndex, pages, total, loading, failed, search, searching,
  onSearch, onSubmitSearch, onPlaceholderAction, onSelect, onPage }: DictionaryListProps) {
  const [pageEntryInvalid, setPageEntryInvalid] = useState(false);
  const current = Math.min(pageIndex, pages - 1);
  const first = Math.max(0, current - 1);
  const last = Math.min(pages - 1, current + 1);
  const visiblePages = Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => first + index);
  const hasHiddenPages = first > 0 || last < pages - 1;
  const sections = new Map<string, { label: string; groups: DictionaryGroup[] }>();
  for (const group of groups) {
    const { id, label } = group.namespace;
    const section = sections.get(id);
    if (section) section.groups.push(group);
    else sections.set(id, { label, groups: [group] });
  }

  function goToPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entry = String(new FormData(event.currentTarget).get('page') ?? '').trim();
    const page = Number(entry);
    const valid = /^\d+$/.test(entry) && Number.isSafeInteger(page) && page >= 1 && page <= pages;
    setPageEntryInvalid(!valid);
    if (valid && !loading) onPage(page - 1);
  }

  return (
    <section aria-label="Dictionary groups" className="flex min-h-0 min-w-0 flex-col gap-2 overflow-hidden md:border-r md:pr-4">
      <div className="flex shrink-0 items-center gap-2">
        <Field className="min-w-0 flex-1">
          <ButtonGroup className="input-button-group w-full">
            <Input aria-label="Search namespaces or groups" placeholder="Search namespaces or groups…" maxLength={128} value={search}
              onChange={event => onSearch(event.currentTarget.value)} />
            <Button type="button" variant="outline" size="icon" aria-label="Search dictionary groups" onClick={onSubmitSearch}>
              <Search aria-hidden="true" />
            </Button>
          </ButtonGroup>
        </Field>
        <Button type="button" variant="outline" size="icon" aria-label="Add group" onClick={onPlaceholderAction}>
          <Plus aria-hidden="true" />
        </Button>
      </div>
      {loading ? <div role="status" className="grid min-h-0 flex-1 place-items-center">
        <Spinner /><span className="sr-only">Loading dictionary groups</span>
      </div> : groups.length ? <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 p-1">
          {Array.from(sections, ([id, section]) => (
            <SidebarGroup key={id} className="p-0" aria-label={section.label}>
              <SidebarGroupLabel asChild className="h-auto min-h-8 py-1 [overflow-wrap:anywhere]">
                <h2>{section.label}</h2>
              </SidebarGroupLabel>
              <SidebarMenu>
              {section.groups.map(group => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton type="button" isActive={selectedId === group.id}
                    className="pr-9 group-hover/menu-item:bg-sidebar-accent group-hover/menu-item:text-sidebar-accent-foreground"
                    aria-pressed={selectedId === group.id}
                    onClick={() => onSelect(group.id)}>
                    <span className="truncate">{group.label}</span>
                  </SidebarMenuButton>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label={`Edit group ${section.label} / ${group.label}`}
                    className="absolute top-0 right-0" onClick={onPlaceholderAction}>
                    <SquarePen aria-hidden="true" />
                  </Button>
                </SidebarMenuItem>
              ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </div>
      </ScrollArea> : <Empty className="min-h-0 flex-1 p-0"><EmptyHeader>
        <EmptyMedia variant="icon"><UiIcon name="circle-dashed" className="size-6" /></EmptyMedia>
        <EmptyTitle>{failed ? 'Groups unavailable' : searching ? 'No matching groups' : 'No dictionary groups'}</EmptyTitle>
        <EmptyDescription>{failed ? 'Dictionary groups could not be loaded.'
          : searching ? 'Try another group or namespace name or key.' : 'Dictionary groups appear here.'}</EmptyDescription>
      </EmptyHeader></Empty>}
      {total !== undefined && (!failed || total > 0) && <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-2 text-sm text-muted-foreground">
        <span className="tabular-nums">{total} records</span>
        {pages > 0 && <Pagination aria-label="Dictionary group pagination" className="mx-0 w-auto">
          <PaginationContent className="gap-0">
            {visiblePages.map(page => <PaginationItem key={page}>
              {page === current ? <span aria-current="page" className="grid size-7 place-items-center font-medium tabular-nums text-foreground">
                {page + 1}
              </span> : <PaginationLink aria-label={`Page ${page + 1}`} size="icon" className="size-7 tabular-nums"
                href={`#dictionary-page-${page + 1}`} aria-disabled={loading} tabIndex={loading ? -1 : 0}
                onClick={event => {
                  event.preventDefault();
                  if (!loading) onPage(page);
                }}>{page + 1}</PaginationLink>}
            </PaginationItem>)}
            {hasHiddenPages && <PaginationItem>
              <Popover key={pageIndex} onOpenChange={() => setPageEntryInvalid(false)}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="size-7"
                    aria-label="Go to page" disabled={loading}>…</Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-2">
                  <form className="space-y-2" onSubmit={goToPage}>
                    <div className="flex items-center gap-2">
                      <Input aria-label={`Page number (1–${pages})`} inputMode="numeric" name="page"
                        aria-invalid={pageEntryInvalid} defaultValue={current + 1}
                        onChange={() => setPageEntryInvalid(false)} />
                      <Button type="submit" size="sm">Go</Button>
                    </div>
                    {pageEntryInvalid && <p role="status" className="text-sm text-destructive">
                      Enter a page from 1 to {pages}.
                    </p>}
                  </form>
                </PopoverContent>
              </Popover>
            </PaginationItem>}
          </PaginationContent>
        </Pagination>}
      </div>}
    </section>
  );
}
