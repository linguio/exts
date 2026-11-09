import { activityDurationFields, type ActivityDayDurationValues, type ActivityDayUpdate, type ActivityDurationField } from '../../../api/activity';
import { isActivityHourValue } from './hours';

const recordIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const activityUpdateMetaFields = new Set(['type', 'action', 'requestId', 'userId', 'generation']);

export type ActivityDayUpdatePayload =
  | { ok: true; update: ActivityDayUpdate }
  | { ok: false; message: string };

/** 后台更新前置校验；返回可展示的英文错误，便于与 API 失败区分。 */
export function parseActivityDayUpdate(payload: Record<string, unknown>): ActivityDayUpdatePayload {
  if (typeof payload.id !== 'string' || !recordIdPattern.test(payload.id)) {
    return { ok: false, message: 'Activity record id is missing or invalid.' };
  }
  const durations: ActivityDayDurationValues = {};
  for (const key of Object.keys(payload)) {
    if (key === 'id' || activityUpdateMetaFields.has(key)) continue;
    if (!activityDurationFields.includes(key as ActivityDurationField)) {
      return { ok: false, message: `Unknown activity field: ${key}.` };
    }
    const value = payload[key];
    if (typeof value !== 'number' || !isActivityHourValue(value)) {
      return { ok: false, message: `${key} must be a non-negative number in 0.5-hour steps.` };
    }
    durations[key as ActivityDurationField] = value;
  }
  if (!Object.keys(durations).length) {
    return { ok: false, message: 'Activity update must include at least one hour field.' };
  }
  return { ok: true, update: { id: payload.id, ...durations } };
}

export function validActivityDayUpdate(payload: Record<string, unknown>): boolean {
  return parseActivityDayUpdate(payload).ok;
}
