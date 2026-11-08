import { QueryDataTable, type DataTableFilter } from '../../../components/custom/data-table';
import { useAccount } from '../../account/auth-client';
import type { DailyActivityRow } from '../data/types';
import { dailyColumns } from './columns';
import { DailyEmpty } from './daily-empty';
import { queryDailyRecords } from './query';

const filters: DataTableFilter[] = [{ columnId: 'date', label: 'Date range', type: 'date' }];
const getRowId = (row: DailyActivityRow) => row.date;

export function DailyRecords() {
  const { user } = useAccount();
  return <QueryDataTable columns={dailyColumns} filters={filters} getRowId={getRowId}
    queryFn={(request, signal) => queryDailyRecords(request, user!.id, signal)}
    scopeKey={user?.id} enabled={!!user} caption="Daily activity records" showCaption={false}
    emptyContent={<DailyEmpty />} />;
}
