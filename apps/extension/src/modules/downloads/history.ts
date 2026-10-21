export type DownloadState = 'downloading' | 'completed' | 'failed' | 'interrupted';

export interface DownloadRecord {
  id: string;
  source: 'telegram';
  filename: string;
  state: DownloadState;
  loadedBytes: number;
  totalBytes?: number;
  errorCode?: string;
  createdAt: number;
  tabId: number;
  owner: string;
}

export const DOWNLOAD_HISTORY_KEY = 'downloads.records';
export const DOWNLOAD_TERMINAL_LIMIT = 200;

export function mergeRecords(existing: DownloadRecord[], updates: DownloadRecord[]): DownloadRecord[] {
  const records = new Map(existing.map(record => [`${record.source}:${record.id}`, { ...record }]));
  for (const update of updates) {
    const key = `${update.source}:${update.id}`;
    const previous = records.get(key);
    if (previous && previous.state !== 'downloading') continue;
    records.set(key, { ...update, createdAt: previous?.createdAt ?? update.createdAt });
  }
  let terminalCount = 0;
  return [...records.values()].sort((a, b) => b.createdAt - a.createdAt).filter(record => {
    return record.state === 'downloading' || ++terminalCount <= DOWNLOAD_TERMINAL_LIMIT;
  });
}

export function interruptRecords(records: DownloadRecord[], belongsToPage: (record: DownloadRecord) => boolean): DownloadRecord[] {
  return mergeRecords([], records.map(record => record.state === 'downloading' && belongsToPage(record)
    ? { ...record, state: 'interrupted', errorCode: 'interrupted' }
    : record));
}

export function parseRecords(value: unknown): DownloadRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter((record): record is DownloadRecord => Boolean(record && typeof record === 'object'
    && typeof record.id === 'string' && record.id.length <= 128 && record.source === 'telegram'
    && typeof record.filename === 'string' && record.filename.length <= 512
    && ['downloading', 'completed', 'failed', 'interrupted'].includes(record.state)
    && Number.isFinite(record.loadedBytes) && record.loadedBytes >= 0
    && Number.isFinite(record.createdAt) && Number.isInteger(record.tabId) && typeof record.owner === 'string'
    && (record.totalBytes === undefined || Number.isFinite(record.totalBytes) && record.totalBytes >= record.loadedBytes)));
}
