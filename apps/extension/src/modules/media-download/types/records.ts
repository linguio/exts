export type DownloadSource = 'tg' | 'x';
export type DownloadFilter = 'all' | DownloadSource;
export interface SavedDownload { filename: string; sizeBytes: number }
export interface DownloadRecord extends SavedDownload { id: string; source: DownloadSource; completedAt: number }
export interface Downloads { version: 1; tg: { records: DownloadRecord[] }; x: { records: DownloadRecord[] } }
export type DownloadsUpdate = { type: 'add'; record: DownloadRecord } | { type: 'clear'; source: DownloadFilter };
