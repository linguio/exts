import { activityDurationFields } from '../../../api/activity';

const recordIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validActivityDayUpdate(payload: Record<string, unknown>): boolean {
  if (typeof payload.id !== 'string' || !recordIdPattern.test(payload.id)) return false;
  const changes = payload.changes;
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) return false;
  const entries = Object.entries(changes);
  if (!entries.length || entries.length > activityDurationFields.length) return false;
  const allowed = new Set<string>(activityDurationFields);
  for (const [field, value] of entries) {
    if (!allowed.has(field)) return false;
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) return false;
  }
  return true;
}
