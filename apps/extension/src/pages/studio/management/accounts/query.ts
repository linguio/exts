import type { AccountsResult, AccountRow } from '../../../../api/accounts';
import { DataTableQueryError, type DataTableQueryRequest, type DataTableQueryResult } from '../../../../components/custom/data-table';
import { captureSessionGeneration } from '../../../../features/account/session-client';

export async function queryAccounts(request: DataTableQueryRequest, userId: string,
  signal: AbortSignal): Promise<DataTableQueryResult<AccountRow>> {
  const { pageIndex, pageSize } = request;
  const email = typeof request.filters.email === 'string' ? request.filters.email.trim() : '';
  const name = typeof request.filters.name === 'string' ? request.filters.name.trim() : '';
  if ([name, email].some(value => value.length > 254 || value.includes('\0'))) {
    throw new DataTableQueryError('Name and email searches can contain up to 254 characters.');
  }
  const registered = request.filters.createdAt;
  const range = registered && typeof registered === 'object' && !Array.isArray(registered) ? registered : undefined;

  const requestId = crypto.randomUUID();
  const cancel = () => { void chrome.runtime.sendMessage({ type: 'exts:accounts', action: 'cancel', requestId }).catch(() => {}); };
  signal.throwIfAborted();
  signal.addEventListener('abort', cancel, { once: true });
  try {
    const generation = await captureSessionGeneration();
    signal.throwIfAborted();
    const response = await chrome.runtime.sendMessage({
      type: 'exts:accounts', action: 'list', requestId, userId, generation, pageIndex, pageSize, email, name,
      startDate: range?.from, endDate: range?.to,
    });
    signal.throwIfAborted();
    const data: AccountsResult | undefined = response?.ok === true ? response.data : undefined;
    if (!data || data.pageIndex !== pageIndex || data.pageSize !== pageSize || !Array.isArray(data.accounts)
      || !Number.isSafeInteger(data.total) || data.total < 0 || data.accounts.length > pageSize
      || data.accounts.some(row => !row || typeof row.id !== 'string' || (row.name !== null && typeof row.name !== 'string')
        || typeof row.email !== 'string' || typeof row.createdAt !== 'string' || !Number.isFinite(Date.parse(row.createdAt))
        || (row.role !== undefined && row.role !== null && row.role !== 'admin'))) {
      throw new DataTableQueryError('Unable to load accounts.');
    }
    return { rows: data.accounts, total: data.total };
  } finally {
    signal.removeEventListener('abort', cancel);
  }
}
