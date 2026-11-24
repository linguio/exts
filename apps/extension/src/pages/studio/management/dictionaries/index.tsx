import { useEffect, useState } from 'react';
import { toast } from '@linguio/exts-ui/plus/toast';
import type { DictionaryGroup } from '../../../../api/dictionaries';
import { useDataTableQuery } from '../../../../components/custom/data-table/use-data-table-query';
import { UiIcon } from '../../../../components/custom/ui-icon';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../../components/ui/empty';
import { useAccount } from '../../../../features/account/auth-client';
import { requestDictionaries } from '../../../../features/dictionaries/requests';
import { DictionaryList } from './dictionary-list';
import { DictionaryTable } from './dictionary-table';

function showNotIntegrated() {
  toast.add({ type: 'info', title: 'Not integrated' });
}

export function DictionariesPage() {
  const { user } = useAccount();
  return user ? <DictionariesView key={user.id} userId={user.id} /> : null;
}

function DictionariesView({ userId }: { userId: string }) {
  const [selectedGroup, setSelectedGroup] = useState<DictionaryGroup>();
  const [search, setSearch] = useState('');
  const [selectFirst, setSelectFirst] = useState(false);
  const { data, query, loading, failed, onQueryChange, refresh } = useDataTableQuery<DictionaryGroup>([],
    async ({ pageIndex, pageSize, filters }, signal) => {
      const search = typeof filters.search === 'string' ? filters.search : undefined;
      const { groups, total } = await requestDictionaries({ action: 'groups', pageIndex, pageSize, search }, userId, signal);
      return { rows: groups, total };
    }, true);

  function submitSearch() {
    const value = search.trim();
    setSelectFirst(true);
    if ((query.columnFilters[0]?.value ?? '') === value && query.pagination.pageIndex === 0) {
      refresh();
      return;
    }
    onQueryChange(previous => {
      return { ...previous, columnFilters: value ? [{ id: 'search', value }] : [],
        pagination: { ...previous.pagination, pageIndex: 0 } };
    });
  }

  const groups = failed ? [] : data?.rows ?? [];
  const selected = loading ? selectedGroup
    : selectFirst ? groups[0] : groups.find(group => group.id === selectedGroup?.id) ?? groups[0];
  const { pageIndex, pageSize } = query.pagination;
  const total = data?.total;
  const pages = Math.ceil((total ?? 0) / pageSize);

  useEffect(() => {
    if (!loading && !failed) {
      setSelectedGroup(selected);
      setSelectFirst(false);
    }
  }, [loading, failed, selected]);

  useEffect(() => {
    const lastPage = Math.max(0, pages - 1);
    if (!loading && !failed && pageIndex > lastPage) {
      onQueryChange(previous => ({ ...previous, pagination: { ...previous.pagination, pageIndex: lastPage } }));
    }
  }, [loading, failed, pages, pageIndex, onQueryChange]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 md:p-6">
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,2fr)_minmax(0,3fr)] gap-4 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)] md:gap-6">
        <DictionaryList groups={groups} selectedId={selected?.id} pageIndex={pageIndex}
          pages={pages} total={total} loading={loading} failed={failed}
          search={search} searching={Boolean(query.columnFilters.length)}
          onSearch={setSearch} onSelect={id => setSelectedGroup(groups.find(group => group.id === id))}
          onSubmitSearch={submitSearch}
          onPlaceholderAction={showNotIntegrated}
          onPage={index => {
            if (index === pageIndex) return;
            onQueryChange(previous => ({ ...previous, pagination: { ...previous.pagination, pageIndex: index } }));
          }}
        />
        <div className="flex min-h-0 min-w-0 flex-col">
          {selected && <div className={loading ? 'hidden' : 'flex min-h-0 flex-1 flex-col'}>
            <DictionaryTable key={selected.id} group={selected} userId={userId} onPlaceholderAction={showNotIntegrated} />
          </div>}
          {(loading || !selected) && <Empty className="min-h-0 flex-1 p-0"><EmptyHeader>
            <EmptyMedia variant="icon"><UiIcon name="circle-dashed" className="size-6" /></EmptyMedia>
            <EmptyTitle>{loading ? 'Waiting for dictionary groups' : 'No dictionary selected'}</EmptyTitle>
            <EmptyDescription>{loading ? 'Items appear here after the group query completes.'
              : 'Items appear here when a group is selected.'}</EmptyDescription>
          </EmptyHeader></Empty>}
        </div>
      </div>
    </div>
  );
}
