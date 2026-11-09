import { ApiRequestError } from '../../../api/client';
import { activityDurationFields, type ActivityDayDurationValues, type ActivityDayUpdate } from '../../../api/activity';
import { captureSessionGeneration } from '../../account/session-client';
import { isActivityHourValue } from '../data/hours';

/** 将表格校验结果映射为时长字段局部更新。 */
export function toActivityDayDurationValues(values: Record<string, unknown>): ActivityDayDurationValues {
  const durations: ActivityDayDurationValues = {};
  for (const field of activityDurationFields) {
    if (!(field in values)) continue;
    const value = values[field];
    if (typeof value !== 'number' || !isActivityHourValue(value)) {
      throw new ApiRequestError('INVALID_REQUEST', 'Duration must be a non-negative number in 0.5-hour steps.');
    }
    durations[field] = value;
  }
  if (!Object.keys(durations).length) {
    throw new ApiRequestError('INVALID_REQUEST', 'No duration fields to update.');
  }
  return durations;
}

/** 组装扁平 ActivityDayUpdate 请求体。 */
export function toActivityDayUpdate(id: string, values: Record<string, unknown>): ActivityDayUpdate {
  return { id, ...toActivityDayDurationValues(values) };
}

export async function requestDailyUpdate(update: ActivityDayUpdate, userId: string, signal: AbortSignal): Promise<void> {
  const requestId = crypto.randomUUID();
  const cancel = () => { void chrome.runtime.sendMessage({ type: 'exts:activity', action: 'cancel', requestId }).catch(() => {}); };
  signal.throwIfAborted();
  signal.addEventListener('abort', cancel, { once: true });
  try {
    const generation = await captureSessionGeneration();
    signal.throwIfAborted();
    const result = await chrome.runtime.sendMessage({
      type: 'exts:activity', action: 'update', requestId, userId, generation, ...update,
    });
    signal.throwIfAborted();
    if (!result || typeof result.ok !== 'boolean') {
      console.error('Activity 更新消息失败', { reason: 'EMPTY_RESPONSE' });
      throw new ApiRequestError('BACKGROUND_UNAVAILABLE', 'Extension background did not respond. Reload the extension and try again.');
    }
    if (!result.ok) {
      const code = result?.error?.code ?? 'REQUEST_FAILED';
      const message = result?.error?.message ?? 'Unable to save changes. Please try again.';
      throw new ApiRequestError(code, message, result?.error?.status, result?.error?.requestId);
    }
  } catch (error) {
    if (signal.aborted) throw new ApiRequestError('CANCELLED', 'Request cancelled.');
    if (error instanceof ApiRequestError) throw error;
    const message = error instanceof Error ? error.message : '';
    const reason = /receiving end does not exist|could not establish connection/i.test(message) ? 'NO_RECEIVER'
      : /message (?:port|channel).*closed/i.test(message) ? 'CHANNEL_CLOSED' : 'RUNTIME_ERROR';
    console.error('Activity 更新消息失败', { reason });
    throw new ApiRequestError('BACKGROUND_UNAVAILABLE', 'Extension background is unavailable. Reload the extension and try again.');
  } finally {
    signal.removeEventListener('abort', cancel);
  }
}
