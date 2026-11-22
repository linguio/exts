import { useState } from 'react';
import type { DictionaryGroup } from '../../../../api/dictionaries';
import { useDataTableQuery } from '../../../../components/custom/data-table/use-data-table-query';
import { useAccount } from '../../../../features/account/auth-client';
import { requestDictionaries } from '../../../../features/dictionaries/requests';
import { DictionaryList } from './dictionary-list';
import { DictionaryTable } from './dictionary-table';

export function DictionariesPage() {
  const { user } = useAccount();
  return user ? <DictionariesView key={user.id} userId={user.id} /> : null;
}

function DictionariesView({ userId }: { userId: string }) {
  const [selectedId, setSelectedId] = useState<string>();
  const { data, query, loading, failed, refresh, onQueryChange } = useDataTableQuery<DictionaryGroup>([],
    async ({ pageIndex, pageSize }, signal) => {
      const { groups, total } = await requestDictionaries({ action: 'groups', pageIndex, pageSize }, userId, signal);
      return { rows: groups, total };
    }, true);

  const groups = loading || failed ? [] : data?.rows ?? [];
  const selected = groups.find(group => group.id === selectedId) ?? groups[0];
  const { pageIndex, pageSize } = query.pagination;
  return (
    <div className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
      <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-lg border md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
        <DictionaryList groups={groups} selectedId={selected?.id} pageIndex={pageIndex}
          pages={Math.ceil((data?.total ?? 0) / pageSize)} loading={loading} failed={failed}
          onSelect={setSelectedId} onRetry={refresh}
          onPage={index => {
            setSelectedId(undefined);
            onQueryChange(previous => ({ ...previous, pagination: { ...previous.pagination, pageIndex: index } }));
          }}
        />
        {selected && <DictionaryTable key={selected.id} group={selected} userId={userId} />}
        {!selected && !loading && !failed && <p className="p-4 text-sm text-muted-foreground">No dictionary items to display.</p>}
      </div>
    </div>
  );
}
