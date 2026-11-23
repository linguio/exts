import type { ApiClient } from './client';

export interface DictionaryGroup {
  id: string;
  key: string;
  label: string;
  description?: string | null;
  createdAt: string;
}

export interface DictionaryItem {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
  createdAt: string;
}

export interface DictionaryGroups {
  groups: DictionaryGroup[];
  total: number;
  pageIndex: number;
  pageSize: number;
}

export type DictionaryQuery =
  | { action: 'groups'; pageIndex: number; pageSize: number; search?: string }
  | { action: 'items'; groupId: string };

export function getDictionaryGroups(client: ApiClient, pageIndex: number, pageSize: number, search: string | undefined,
  expectedUserId: string, signal: AbortSignal) {
  return client.request<DictionaryGroups>('/api/dictionaries/groups', {
    expectedUserId, signal, json: { pageIndex, pageSize, search },
  });
}

export function getDictionaryItems(client: ApiClient, groupId: string, expectedUserId: string, signal: AbortSignal) {
  return client.request<{ items: DictionaryItem[] }>('/api/dictionaries/items', {
    expectedUserId, signal, json: { groupId },
  });
}
