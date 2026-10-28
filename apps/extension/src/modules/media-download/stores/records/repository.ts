import { createObjectStore, type ObjectStorage } from '../../../../shared/storage/object-store';
import { normalizeDownloads, applyDownloadsUpdate, validateDownloadsUpdate } from '../../utils/records/schema';
import { DOWNLOADS_KEY } from '../../constants/records';

export function createDownloadsRepository(storage: ObjectStorage) {
  return createObjectStore({ key: DOWNLOADS_KEY, storage, normalize: normalizeDownloads, apply: applyDownloadsUpdate, validatePatch: validateDownloadsUpdate });
}
