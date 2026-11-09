import type { ApiClient } from './client';

export interface ActivityPeriod { startDate: string; endDate: string }
export const activitySortFields = ['date', 'exerciseMinutes', 'readingMinutes', 'learningMinutes', 'creationMinutes', 'sleepMinutes'] as const;
export type ActivitySortField = typeof activitySortFields[number];
export interface ActivitySort { field: ActivitySortField; order: 'asc' | 'desc' }
export interface ActivityQuery {
  startDate?: string;
  endDate?: string;
  pageIndex?: number;
  pageSize?: number;
  sort?: ActivitySort[];
}

export const activityDurationFields = ['exerciseMinutes', 'readingMinutes', 'learningMinutes', 'creationMinutes', 'sleepMinutes'] as const;
export type ActivityDurationField = typeof activityDurationFields[number];
export type ActivityDayChanges = Partial<Record<ActivityDurationField, number>>;

export function getActivityDays(client: ApiClient, query: ActivityQuery, userId: string, signal: AbortSignal) {
  return client.request<unknown>('/api/activity/days', {
    method: 'POST', json: { startDate: query.startDate, endDate: query.endDate,
      pageIndex: query.pageIndex, pageSize: query.pageSize, sort: query.sort },
    expectedUserId: userId, signal,
  });
}

export function updateActivityDay(client: ApiClient, id: string, changes: ActivityDayChanges, userId: string, signal: AbortSignal) {
  return client.request<unknown>('/api/activity/days/update', {
    method: 'POST', json: { id, changes }, expectedUserId: userId, signal,
  });
}
