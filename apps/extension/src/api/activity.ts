import type { ApiClient } from './client';

export interface ActivityPeriod { startDate: string; endDate: string }

export function getActivityDays(client: ApiClient, period: ActivityPeriod, userId: string, signal: AbortSignal) {
  return client.request<unknown>('/api/activity/days', {
    method: 'POST', json: { startDate: period.startDate, endDate: period.endDate },
    expectedUserId: userId, signal,
  });
}
