import type { ApiClient } from './client';

export interface AccountRow {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  role?: 'admin' | null;
}

export interface AccountsQuery {
  pageIndex: number;
  pageSize: number;
  email: string;
  name: string;
  startDate?: string;
  endDate?: string;
}

export interface AccountsResult {
  accounts: AccountRow[];
  total: number;
  pageIndex: number;
  pageSize: number;
}

export function getAccounts(client: ApiClient, query: AccountsQuery, expectedUserId: string, signal: AbortSignal) {
  return client.request<AccountsResult>('/api/accounts/list', { expectedUserId, signal, json: { ...query } });
}
