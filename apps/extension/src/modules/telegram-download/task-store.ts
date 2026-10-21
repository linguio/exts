import type { DownloadTask, TaskSnapshot } from '../downloads/protocol';
import { DOWNLOAD_TERMINAL_LIMIT } from '../downloads/history';

export interface VideoTaskStore {
  start(filename: string): string;
  progress(id: string, loadedBytes: number, totalBytes?: number): void;
  fail(id: string, errorCode: string): void;
  complete(id: string): void;
  snapshot(): TaskSnapshot;
  subscribe(listener: (snapshot: TaskSnapshot) => void): () => void;
}

export interface VideoTaskStoreOptions {
  createId?: () => string;
}

function cloneSnapshot(tasks: DownloadTask[]): TaskSnapshot {
  return {
    tasks: tasks.map(task => ({ ...task })),
  };
}

function isValidByteCount(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function defaultCreateId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createVideoTaskStore(options: VideoTaskStoreOptions = {}): VideoTaskStore {
  const tasks: DownloadTask[] = [];
  const listeners = new Set<(snapshot: TaskSnapshot) => void>();
  const createId = options.createId ?? defaultCreateId;

  const notify = () => {
    let terminalCount = 0;
    const retained = [...tasks].reverse().filter(task => task.state === 'downloading' || ++terminalCount <= DOWNLOAD_TERMINAL_LIMIT).reverse();
    tasks.splice(0, tasks.length, ...retained);
    const snapshot = cloneSnapshot(tasks);
    for (const listener of listeners) listener(cloneSnapshot(snapshot.tasks));
  };

  return {
    start(filename) {
      const id = createId();
      tasks.push({
        id,
        filename,
        state: 'downloading',
        loadedBytes: 0,
      });
      notify();
      return id;
    },

    progress(id, loadedBytes, totalBytes) {
      const task = tasks.find(item => item.id === id);
      if (!task || task.state !== 'downloading' || !isValidByteCount(loadedBytes)) return;

      const nextLoadedBytes = Math.max(task.loadedBytes, loadedBytes);
      const nextTotalBytes = isValidByteCount(totalBytes ?? Number.NaN)
        ? Math.max(task.totalBytes ?? 0, totalBytes!, nextLoadedBytes)
        : task.totalBytes;

      if (
        task.loadedBytes === nextLoadedBytes
        && task.totalBytes === nextTotalBytes
      ) return;

      task.loadedBytes = nextLoadedBytes;
      if (nextTotalBytes !== undefined && nextTotalBytes > 0) {
        task.totalBytes = nextTotalBytes;
      }
      notify();
    },

    fail(id, errorCode) {
      const task = tasks.find(item => item.id === id);
      if (!task || task.state !== 'downloading') return;

      task.state = 'failed';
      task.errorCode = errorCode;
      notify();
    },

    complete(id) {
      const task = tasks.find(item => item.id === id);
      if (!task || task.state !== 'downloading') return;

      task.state = 'completed';
      notify();
    },

    snapshot() {
      return cloneSnapshot(tasks);
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
