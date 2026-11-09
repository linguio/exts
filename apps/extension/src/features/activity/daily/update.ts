import { ApiRequestError } from '../../../api/client';
import { activityDurationFields, type ActivityDayChanges } from '../../../api/activity';
import { captureSessionGeneration } from '../../account/session-client';

/** 将表格校验结果映射为后端局部更新契约。 */
export function toActivityDayChanges(values: Record<string, unknown>): ActivityDayChanges {
  const changes: ActivityDayChanges = {};
  for (const field of activityDurationFields) {
    if (!(field in values)) continue;
    const value = values[field];
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
      throw new ApiRequestError('INVALID_REQUEST', '时长必须是整数');
    }
    changes[field] = value;
  }
  if (!Object.keys(changes).length) throw new ApiRequestError('INVALID_REQUEST', '至少需要一项变更');
  return changes;
}

export async function requestDailyUpdate(id: string, changes: ActivityDayChanges, userId: string, signal: AbortSignal): Promise<void> {
  const requestId = crypto.randomUUID();
  const cancel = () => { void chrome.runtime.sendMessage({ type: 'exts:activity', action: 'cancel', requestId }).catch(() => {}); };
  signal.throwIfAborted();
  signal.addEventListener('abort', cancel, { once: true });
  try {
    const generation = await captureSessionGeneration();
    signal.throwIfAborted();
    const result = await chrome.runtime.sendMessage({
      type: 'exts:activity', action: 'update', requestId, userId, generation, id, changes,
    });
    signal.throwIfAborted();
    if (!result || typeof result.ok !== 'boolean') {
      console.error('Activity 更新消息失败', { reason: 'EMPTY_RESPONSE' });
      throw new ApiRequestError('BACKGROUND_UNAVAILABLE', '扩展后台未响应，请重新加载扩展');
    }
    if (!result.ok) {
      throw new ApiRequestError(result?.error?.code ?? 'REQUEST_FAILED', result?.error?.message ?? '保存失败',
        result?.error?.status, result?.error?.requestId);
    }
  } catch (error) {
    if (signal.aborted) throw new ApiRequestError('CANCELLED', '请求已取消');
    if (error instanceof ApiRequestError) throw error;
    const message = error instanceof Error ? error.message : '';
    const reason = /receiving end does not exist|could not establish connection/i.test(message) ? 'NO_RECEIVER'
      : /message (?:port|channel).*closed/i.test(message) ? 'CHANNEL_CLOSED' : 'RUNTIME_ERROR';
    console.error('Activity 更新消息失败', { reason });
    throw new ApiRequestError('BACKGROUND_UNAVAILABLE', '扩展后台通信失败，请重新加载扩展');
  } finally {
    signal.removeEventListener('abort', cancel);
  }
}
