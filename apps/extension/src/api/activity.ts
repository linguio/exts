import type { ApiClient } from './client';

export interface ActivityPeriod { startDate: string; endDate: string }
export const activitySortFields = ['date', 'exerciseHours', 'readingHours', 'learningHours', 'creationHours', 'sleepHours'] as const;
export type ActivitySortField = typeof activitySortFields[number];
export interface ActivitySort { field: ActivitySortField; order: 'asc' | 'desc' }
export interface ActivityQuery {
  startDate?: string;
  endDate?: string;
  pageIndex?: number;
  pageSize?: number;
  sort?: ActivitySort[];
}

export const activityDurationFields = ['exerciseHours', 'readingHours', 'learningHours', 'creationHours', 'sleepHours'] as const;
export type ActivityDurationField = typeof activityDurationFields[number];
export type ActivityDayDurationValues = Partial<Record<ActivityDurationField, number>>;
export type ActivityDayUpdate = { id: string } & ActivityDayDurationValues;

export function getActivityDays(client: ApiClient, query: ActivityQuery, userId: string, signal: AbortSignal) {
  return client.request<unknown>('/api/activity/days', {
    method: 'POST', json: { startDate: query.startDate, endDate: query.endDate,
      pageIndex: query.pageIndex, pageSize: query.pageSize, sort: query.sort },
    expectedUserId: userId, signal,
  });
}

export function updateActivityDay(client: ApiClient, update: ActivityDayUpdate, userId: string, signal: AbortSignal) {
  return client.request<unknown>('/api/activity/days/update', {
    method: 'POST', json: update, expectedUserId: userId, signal,
  });
}
