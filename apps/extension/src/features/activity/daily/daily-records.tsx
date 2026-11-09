import { useSyncExternalStore } from 'react';
import { QueryDataTable } from '../../../components/custom/data-table';
import { useAccount, readSessionResetVersion, subscribeSessionReset } from '../../account/auth-client';
import { studioSessionKey } from '../../../pages/studio/studio-access';
import type { DailyActivityRow } from '../data/types';
import { dailyColumns } from './columns';
import { DailyEmpty } from './daily-empty';
import { queryDailyRecords } from './query';

const getRowId = (row: DailyActivityRow) => row.date;

export function DailyRecords() {
  const { user } = useAccount();
  const resetVersion = useSyncExternalStore(subscribeSessionReset, readSessionResetVersion);
  const sessionKey = user ? studioSessionKey(user.id, resetVersion) : undefined;
  return <QueryDataTable columns={dailyColumns} getRowId={getRowId}
    queryFn={(request, signal) => queryDailyRecords(request, user!.id, signal)}
    scopeKey={sessionKey} enabled={!!user} caption="Daily activity records" showCaption={false}
    fillRecords pageSizes={[20, 50, 100]}
    previewEdits emptyContent={<DailyEmpty />} />;
}
