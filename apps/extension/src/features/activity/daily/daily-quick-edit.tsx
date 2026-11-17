import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { DataTableEditSheet } from '../../../components/custom/data-table/data-table-edit-sheet';
import { toast } from '../../../components/ui/sonner';
import { useAccount, readSessionResetVersion, subscribeSessionReset } from '../../account/auth-client';
import type { DailyActivityRow } from '../data/types';
import { dailyColumns } from './columns';
import { queryLatestDailyRecord } from './query';
import { requestDailyUpdate, toActivityDayUpdate } from './update';

const getRowId = (row: DailyActivityRow) => row.id;

/** 快捷入口只编排 Daily 查询和账号边界，表单生命周期沿用公共编辑 Sheet。 */
export function DailyQuickEdit({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { user, isPending, error } = useAccount();
  const resetVersion = useSyncExternalStore(subscribeSessionReset, readSessionResetVersion);
  const userId = user?.id;
  const scope = JSON.stringify([userId, resetVersion]);
  const openingScope = useRef<string | null>(null);
  const [record, setRecord] = useState<{ scope: string; row: DailyActivityRow } | null>(null);
  const accountError = error?.message;

  useEffect(() => {
    if (!open) {
      openingScope.current = null;
      setRecord(null);
      return;
    }
    if (openingScope.current !== null && openingScope.current !== scope) {
      setRecord(null);
      onOpenChange(false);
      return;
    }
    if (isPending) return;
    openingScope.current = scope;
    if (accountError || !userId) {
      toast.error(accountError ? 'Unable to verify account status. Please try again.' : 'Please sign in to edit daily records.');
      onOpenChange(false);
      return;
    }
    const controller = new AbortController();
    setRecord(null);
    void queryLatestDailyRecord(userId, controller.signal).then(row => {
      if (controller.signal.aborted) return;
      if (row) setRecord({ scope, row });
      else {
        toast.info('No daily records yet.');
        onOpenChange(false);
      }
    }).catch(() => {
      if (controller.signal.aborted) return;
      console.error('Daily 快捷查询失败', { code: 'QUERY_ERROR' });
      toast.error('Query failed. Please try again.');
      onOpenChange(false);
    });
    return () => controller.abort();
  }, [open, scope, userId, isPending, accountError, onOpenChange]);

  const row = record?.scope === scope ? record.row : null;
  return <DataTableEditSheet key={scope} open={open && !!row && !accountError} row={row} columns={dailyColumns}
    getRowId={getRowId} partialUpdates onOpenChange={onOpenChange}
    updateFn={(rowId, values, signal) => requestDailyUpdate(toActivityDayUpdate(rowId, values), userId!, signal)}
    onSaved={() => setRecord(null)} />;
}
