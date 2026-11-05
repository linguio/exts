import { createObjectStore, type ObjectStorage } from '../../../lib/storage/object-store';
import { normalizeDownloads, applyDownloadsUpdate, validateDownloadsUpdate } from './schema';
import { DOWNLOADS_KEY } from './constants';

export function createDownloadsRepository(storage: ObjectStorage) {
  return createObjectStore({ key: DOWNLOADS_KEY, storage, normalize: normalizeDownloads, apply: applyDownloadsUpdate, validatePatch: validateDownloadsUpdate });
}
