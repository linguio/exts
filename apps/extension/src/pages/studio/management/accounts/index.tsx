import type { ColumnDef } from '@tanstack/react-table';
import { useSyncExternalStore } from 'react';
import type { AccountRow } from '../../../../api/accounts';
import { CopyableTextCell, QueryDataTable } from '../../../../components/custom/data-table';
import { readSessionResetVersion, subscribeSessionReset, useAccount } from '../../../../features/account/auth-client';
import { studioSessionKey } from '../../account/state';
import { queryAccounts } from './query';

const registeredDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  hourCycle: 'h23', timeZone: 'Asia/Shanghai',
});

function formatRegisteredDate(timestamp: string) {
  const parts = Object.fromEntries(registeredDate.formatToParts(new Date(timestamp)).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

const columns: ColumnDef<AccountRow>[] = [
  { accessorKey: 'name', header: 'Name', enableSorting: false, meta: { dataTable: { filter: { type: 'text' } } },
    cell: ({ row }) => row.original.name || '—' },
  { accessorKey: 'email', header: 'Email', enableSorting: false, meta: { dataTable: { filter: { type: 'text' } } },
    cell: ({ row }) => <CopyableTextCell value={row.original.email} /> },
  { accessorKey: 'role', header: 'Role', enableSorting: false,
    cell: ({ row }) => row.original.role === 'admin' ? 'Admin' : '-' },
  { accessorKey: 'createdAt', header: 'Registered', enableSorting: false, meta: { dataTable: { filter: { type: 'date' } } },
    cell: ({ row }) => formatRegisteredDate(row.original.createdAt) },
];

const getRowId = (row: AccountRow) => row.id;

export function AccountsPage() {
  const { user } = useAccount();
  const resetVersion = useSyncExternalStore(subscribeSessionReset, readSessionResetVersion);
  if (!user) return null;

  return <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 md:p-6">
    <QueryDataTable columns={columns} getRowId={getRowId}
      queryFn={(request, signal) => queryAccounts(request, user.id, signal)}
      scopeKey={studioSessionKey(user.id, resetVersion)} caption="Accounts" showCaption={false}
      fillRecords appearance={{ columnAlign: 'left' }} />
  </div>;
}
