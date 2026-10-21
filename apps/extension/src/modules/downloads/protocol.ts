export interface DownloadTask {
  id: string;
  filename: string;
  state: 'downloading' | 'completed' | 'failed';
  loadedBytes: number;
  totalBytes?: number;
  errorCode?: string;
}

export interface TaskSnapshot {
  tasks: DownloadTask[];
}

const MAX_ID_LENGTH = 128;
const MAX_FILENAME_LENGTH = 512;
const MAX_ERROR_CODE_LENGTH = 128;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every(key => keys.includes(key));
}

function isValidTask(value: unknown): value is DownloadTask {
  if (!isRecord(value) || !hasOnlyKeys(value, [
    'id',
    'filename',
    'state',
    'loadedBytes',
    'totalBytes',
    'errorCode',
  ])) return false;

  if (
    typeof value.id !== 'string'
    || value.id.length === 0
    || value.id.length > MAX_ID_LENGTH
    || typeof value.filename !== 'string'
    || value.filename.length === 0
    || value.filename.length > MAX_FILENAME_LENGTH
    || (
      value.state !== 'downloading'
      && value.state !== 'completed'
      && value.state !== 'failed'
    )
    || typeof value.loadedBytes !== 'number'
    || !Number.isFinite(value.loadedBytes)
    || value.loadedBytes < 0
  ) return false;

  if (value.totalBytes !== undefined) {
    if (
      typeof value.totalBytes !== 'number'
      || !Number.isFinite(value.totalBytes)
      || value.totalBytes < 0
      || value.loadedBytes > value.totalBytes
    ) return false;
  }

  if (
    value.errorCode !== undefined
    && (
      typeof value.errorCode !== 'string'
      || value.errorCode.length > MAX_ERROR_CODE_LENGTH
    )
  ) return false;

  return true;
}

export function isTaskSnapshot(value: unknown): value is TaskSnapshot {
  if (!isRecord(value) || !hasOnlyKeys(value, ['tasks']) || !Array.isArray(value.tasks)) {
    return false;
  }

  return value.tasks.every(isValidTask);
}

export function parseTaskSnapshot(value: unknown): TaskSnapshot | undefined {
  if (!isTaskSnapshot(value)) return undefined;

  return {
    tasks: value.tasks.map(task => ({ ...task })),
  };
}
