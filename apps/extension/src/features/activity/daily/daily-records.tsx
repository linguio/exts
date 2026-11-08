import { useEffect, useMemo, useState } from 'react';
import { DataTable, DataTableColumnVisibility } from '../../../components/custom/data-table';
import { DataTableDateFilter } from '../../../components/custom/data-table/date-filter';
import { resolveUpdate, type DateFilterRange } from '../../../components/custom/data-table/state';
import { Button } from '../../../components/ui/button';
import { useAccount } from '../../account/auth-client';
import { ApiRequestError } from '../../../api/client';
import { requestActivity } from '../requests';
import { parseActivityDays, type ActivityDaysResponse } from '../data/response';
import type { DailyActivityRow } from '../data/types';
import { dailyColumns } from './columns';
import { DailyEmpty } from './daily-empty';
import { applyDailyDates, dailyRequest, defaultDailyQuery, resetDailyQuery } from './state';

const getRowId = (row: DailyActivityRow) => row.date;
const emptyRows: DailyActivityRow[] = [];

export function DailyRecords() {
  const { user } = useAccount();
  const userId = user?.id;
  const [query, setQuery] = useState(defaultDailyQuery);
  const [draft, setDraft] = useState<DateFilterRange>({});
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{ key: string; userId: string; response?: ActivityDaysResponse; loading: boolean; error?: string }>();
  const request = useMemo(() => dailyRequest(query), [query]);
  const key = JSON.stringify([userId, request, revision]);
  const previous = result?.userId === userId ? result?.response : undefined;
  const loading = !!userId && (result?.key !== key || result.loading);
  const error = result?.key === key ? result.error : undefined;

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    setResult(old => ({ key, userId, response: old?.userId === userId ? old.response : undefined, loading: true }));
    void requestActivity(request, userId, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      const response = parseActivityDays(data, userId, request);
      setResult({ key, userId, response, loading: false });
    }).catch(cause => {
      if (controller.signal.aborted) return;
      console.error('Daily 加载失败', { code: cause instanceof ApiRequestError ? cause.code : 'UNKNOWN_ERROR',
        status: cause instanceof ApiRequestError ? cause.status : undefined,
        requestId: cause instanceof ApiRequestError ? cause.requestId : undefined });
      setResult(old => ({ key, userId, response: old?.userId === userId ? old.response : undefined, loading: false,
        error: cause instanceof ApiRequestError ? cause.message : '加载失败，请重试' }));
    });
    return () => controller.abort();
  }, [key, userId, request]);

  return <DataTable columns={dailyColumns} data={previous?.days ?? emptyRows} getRowId={getRowId}
    caption="Daily activity records" showCaption={false} search={false} emptyContent={<DailyEmpty />}
    loading={loading} hasPreviousResult={previous !== undefined} error={error}
    onRetry={() => setRevision(value => value + 1)}
    remote={{ query, onQueryChange: update => setQuery(old => resolveUpdate(update, old)), rowCount: previous?.total ?? 0 }}
    toolbar={table => <div className="flex flex-wrap items-center gap-2">
      <DataTableDateFilter label="Date range" value={draft} onChange={range => setDraft(range ?? {})} disabled={false} />
      <div className="ml-auto flex items-center gap-2">
        <Button type="button" disabled={!userId} onClick={() => { setQuery(old => applyDailyDates(old, draft)); setRevision(value => value + 1); }}>Query</Button>
        <Button type="button" variant="outline" disabled={!userId} onClick={() => { setDraft({}); setQuery(old => resetDailyQuery(old)); setRevision(value => value + 1); }}>Reset</Button>
        <DataTableColumnVisibility table={table} disabled={false} />
      </div>
    </div>} />;
}
