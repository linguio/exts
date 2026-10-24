export type DownloadSource = 'tg' | 'x';
export type DownloadFilter = 'all' | DownloadSource;
export interface SavedDownload { filename: string; sizeBytes: number }
export interface DownloadRecord extends SavedDownload { id: string; source: DownloadSource; completedAt: number }
export interface Downloads { version: 1; tg: { records: DownloadRecord[] }; x: { records: DownloadRecord[] } }
export type DownloadsUpdate = { type: 'add'; record: DownloadRecord } | { type: 'clear'; source: DownloadFilter };
export const DOWNLOADS_KEY = 'downloads';

export function isDownloadFilter(value: unknown): value is DownloadFilter {
  return value === 'all' || value === 'tg' || value === 'x';
}

export function validateSavedDownload(value: unknown): asserts value is SavedDownload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('无效下载记录');
  const record = value as SavedDownload;
  if (typeof record.filename !== 'string' || !record.filename.trim() || record.filename.length > 1024 || /[\x00-\x1f/\\]/.test(record.filename)) throw new Error('无效下载文件名');
  if (!Number.isSafeInteger(record.sizeBytes) || record.sizeBytes < 0) throw new Error('无效下载大小');
}

function validateRecord(record: DownloadRecord): void {
  validateSavedDownload(record);
  if ((record.source !== 'tg' && record.source !== 'x') || typeof record.id !== 'string' || !record.id || !Number.isSafeInteger(record.completedAt) || record.completedAt <= 0) throw new Error('无效下载记录');
}

/** 未知或损坏格式拒绝写回，避免初始化或清空时抹掉已有数据。 */
export function normalizeDownloads(stored: Record<string, unknown>): Downloads {
  if (stored[DOWNLOADS_KEY] === undefined) return { version: 1, tg: { records: [] }, x: { records: [] } };
  const data = stored[DOWNLOADS_KEY] as Downloads;
  if (!data || data.version !== 1 || !Array.isArray(data.tg?.records) || !Array.isArray(data.x?.records)) throw new Error('无法读取下载记录格式');
  const normalized = { ...data };
  for (const source of ['tg', 'x'] as const) {
    const records = data[source].records.map(value => {
      const record = { ...value, sizeBytes: value?.sizeBytes ?? 0 };
      validateRecord(record);
      if (record.source !== source) throw new Error('下载记录来源不一致');
      return record;
    });
    normalized[source] = { ...data[source], records };
  }
  return normalized;
}

export function validateDownloadsUpdate(update: DownloadsUpdate): void {
  if (update.type === 'add') validateRecord(update.record);
  else if (update.type !== 'clear' || !isDownloadFilter(update.source)) throw new Error('无效清空范围');
}

export function applyDownloadsUpdate(current: Downloads, update: DownloadsUpdate): Downloads {
  if (update.type === 'add') {
    const { source } = update.record;
    const records = current[source].records;
    return { ...current, [source]: { ...current[source], records: [...records.filter(record => record.id !== update.record.id), update.record] } };
  }
  const next = { ...current };
  for (const source of ['tg', 'x'] as const) {
    if (update.source === 'all' || update.source === source) next[source] = { ...current[source], records: [] };
  }
  return next;
}

export function selectRecords(downloads: Downloads, filter: DownloadFilter): DownloadRecord[] {
  return (filter === 'all' ? [...downloads.tg.records, ...downloads.x.records] : [...downloads[filter].records])
    .sort((a, b) => b.completedAt - a.completedAt);
}

export function formatSize(bytes?: number): string {
  return `${bytes ? Number((bytes / 1024 / 1024).toFixed(1)) : 0} MB`;
}
