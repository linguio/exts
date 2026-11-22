import { ApiRequestError } from '../../api/client';
import type { DictionaryGroups, DictionaryItem, DictionaryQuery } from '../../api/dictionaries';
import { captureSessionGeneration } from '../account/session-client';

export function requestDictionaries(query: Extract<DictionaryQuery, { action: 'groups' }>,
  userId: string, signal: AbortSignal): Promise<DictionaryGroups>;
export function requestDictionaries(query: Extract<DictionaryQuery, { action: 'items' }>,
  userId: string, signal: AbortSignal): Promise<{ items: DictionaryItem[] }>;
export async function requestDictionaries(query: DictionaryQuery, userId: string, signal: AbortSignal) {
  const requestId = crypto.randomUUID();
  const cancel = () => { void chrome.runtime.sendMessage({ type: 'exts:dictionaries', action: 'cancel', requestId }).catch(() => {}); };
  signal.throwIfAborted();
  signal.addEventListener('abort', cancel, { once: true });

  try {
    const generation = await captureSessionGeneration();
    signal.throwIfAborted();
    const response = await chrome.runtime.sendMessage({
      type: 'exts:dictionaries', ...query, requestId, userId, generation,
    });
    signal.throwIfAborted();
    if (response?.ok !== true || !response.data) {
      throw new ApiRequestError(response?.error?.code ?? 'BACKGROUND_UNAVAILABLE', 'Unable to load dictionaries.');
    }
    return response.data;
  } finally {
    signal.removeEventListener('abort', cancel);
  }
}
