import { ApiRequestError } from '../../api/client';
import type { ActivityPeriod } from '../../api/activity';
import { captureSessionGeneration } from '../account/session-client';

export async function requestActivity(period: ActivityPeriod, userId: string, signal: AbortSignal): Promise<unknown> {
  const requestId = crypto.randomUUID();
  const cancel = () => { void chrome.runtime.sendMessage({ type: 'exts:activity', action: 'cancel', requestId }).catch(() => {}); };
  signal.throwIfAborted();
  signal.addEventListener('abort', cancel, { once: true });
  try {
    const generation = await captureSessionGeneration();
    signal.throwIfAborted();
    const result = await chrome.runtime.sendMessage({ type: 'exts:activity', action: 'get', requestId, userId, generation, ...period });
    signal.throwIfAborted();
    if (!result || typeof result.ok !== 'boolean') {
      console.error('Activity 后台消息失败', { reason: 'EMPTY_RESPONSE' });
      throw new ApiRequestError('BACKGROUND_UNAVAILABLE', '扩展后台未响应，请重新加载扩展');
    }
    if (!result?.ok) {
      throw new ApiRequestError(result?.error?.code ?? 'REQUEST_FAILED', result?.error?.message ?? '活动请求失败',
        result?.error?.status, result?.error?.requestId);
    }
    return result.data;
  } catch (error) {
    if (signal.aborted) throw new ApiRequestError('CANCELLED', '请求已取消');
    if (error instanceof ApiRequestError) throw error;
    // 只归类浏览器消息通道错误，不输出原始错误及消息载荷；联调结束清理诊断。
    const message = error instanceof Error ? error.message : '';
    const reason = /receiving end does not exist|could not establish connection/i.test(message) ? 'NO_RECEIVER'
      : /message (?:port|channel).*closed/i.test(message) ? 'CHANNEL_CLOSED' : 'RUNTIME_ERROR';
    console.error('Activity 后台消息失败', { reason });
    throw new ApiRequestError('BACKGROUND_UNAVAILABLE', '扩展后台通信失败，请重新加载扩展');
  } finally {
    signal.removeEventListener('abort', cancel);
  }
}
