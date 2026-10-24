import { createObjectStore, type ObjectStorage } from '../../shared/storage/object-store';
import { DOWNLOADS_KEY, normalizeDownloads, applyDownloadsUpdate, validateDownloadsUpdate } from './schema';

export function createDownloadsRepository(storage: ObjectStorage) {
  return createObjectStore({ key: DOWNLOADS_KEY, storage, normalize: normalizeDownloads, apply: applyDownloadsUpdate, validatePatch: validateDownloadsUpdate });
}
