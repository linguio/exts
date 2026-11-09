import { useSyncExternalStore } from 'react';
import { QueryDataTable } from '../../../components/custom/data-table';
import { useAccount, readSessionResetVersion, subscribeSessionReset } from '../../account/auth-client';
import { studioSessionKey } from '../../../pages/studio/studio-access';
import type { DailyActivityRow } from '../data/types';
import { dailyColumns } from './columns';
import { DailyEmpty } from './daily-empty';
import { queryDailyRecords } from './query';
import { requestDailyUpdate, toActivityDayUpdate } from './update';

const getRowId = (row: DailyActivityRow) => row.id;

export function DailyRecords() {
  const { user } = useAccount();
  const resetVersion = useSyncExternalStore(subscribeSessionReset, readSessionResetVersion);
  const sessionKey = user ? studioSessionKey(user.id, resetVersion) : undefined;
  const updateDaily = async (rowId: string, values: Record<string, unknown>, signal: AbortSignal) => {
    await requestDailyUpdate(toActivityDayUpdate(rowId, values), user!.id, signal);
  };
  return <QueryDataTable columns={dailyColumns} getRowId={getRowId}
    queryFn={(request, signal) => queryDailyRecords(request, user!.id, signal)}
    updateFn={updateDaily} partialUpdates scopeKey={sessionKey} enabled={!!user} caption="Daily activity records" showCaption={false}
    fillRecords pageSizes={[20, 50, 100]}
    emptyContent={<DailyEmpty />} />;
}
