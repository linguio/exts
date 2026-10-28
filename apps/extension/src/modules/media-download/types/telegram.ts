export interface DownloadMenuController {
  close(): void;
  completed(filename: string): void;
}

export interface MediaWritable {
  write(chunk: Uint8Array): Promise<void> | void;
  close(): Promise<void> | void;
  abort?(): Promise<void> | void;
}

export interface SaveFileHandle {
  name?: string;
  createWritable(): Promise<MediaWritable>;
}

export interface SaveMediaDependencies {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  logger: Pick<Console, 'error'>;
  selectFile?(suggestedName: string): Promise<SaveFileHandle>;
  onError?(error: unknown): void;
  onSaved?(record: { filename: string; sizeBytes: number }): void;
  showSaveFilePicker?(options: { id: string; startIn: string; suggestedName: string }): Promise<SaveFileHandle>;
}

export interface DownloadableMedia {
  currentSrc: string;
  src: string;
  tagName: string;
}

export interface DownloadDirectory {
  name: string;
  requestPermission(options: { mode: 'readwrite' }): Promise<PermissionState>;
  getFileHandle(name: string, options?: { create?: boolean }): Promise<SaveFileHandle>;
}
