import type { ApiClient } from './client';
import type { SettingsPatch } from '../features/settings/schema';

export function getSettingsPreferences(client: ApiClient, userId: string) {
  return client.request<unknown>('/api/settings/preferences', { expectedUserId: userId });
}

export function updateSettingsPreferences(client: ApiClient, userId: string, patch: SettingsPatch) {
  return client.request<unknown>('/api/settings/preferences/update', { expectedUserId: userId, json: patch });
}
