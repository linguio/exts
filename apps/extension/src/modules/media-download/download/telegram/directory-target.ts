import type { DownloadDirectory, SaveFileHandle } from '../../types/telegram';
import { directoryStore } from '../../stores/telegram/directory';

interface DirectoryDependencies {
  store: {
    load(): Promise<DownloadDirectory | undefined>;
    save(directory: DownloadDirectory): Promise<void>;
  };
  pick?: () => Promise<DownloadDirectory>;
  lock<T>(run: () => Promise<T>): Promise<T>;
}

function defaultDependencies(): DirectoryDependencies {
  const runtime = globalThis as typeof globalThis & {
    showDirectoryPicker?: (options: { id: string; mode: string; startIn: string }) => Promise<DownloadDirectory>;
  };
  return {
    store: directoryStore,
    pick: runtime.showDirectoryPicker && globalThis.navigator?.locks
      ? () => runtime.showDirectoryPicker!({ id: 'telegram-download-directory', mode: 'readwrite', startIn: 'downloads' })
      : undefined,
    lock: run => navigator.locks.request('exts:telegram-download:create-file', run),
  };
}

/** 只持有当前 Telegram 来源授权；名称锁覆盖同来源页面的查重与文件占位。 */
export function createDirectoryTarget(dependencies = defaultDependencies()) {
  let directory: DownloadDirectory | undefined;
  const choose = async () => {
    if (!dependencies.pick) throw new Error('浏览器不支持选择文件夹');
    // 首个异步操作必须是 picker，避免等待 IndexedDB 导致用户激活过期。
    const selected = await dependencies.pick();
    await dependencies.store.save(selected);
    directory = selected;
  };
  return {
    get available() { return !!dependencies.pick; },
    get name() { return directory?.name; },
    async restore() {
      const restored = await dependencies.store.load();
      if (restored && (typeof restored.requestPermission !== 'function' || typeof restored.getFileHandle !== 'function')) {
        throw new Error('保存的目录不可用，请重新选择');
      }
      directory = restored;
    },
    choose,
    async openFile(suggestedName: string): Promise<SaveFileHandle> {
      // 首次快速保存直接选择并记住文件夹，随后继续本次下载。
      if (!directory) await choose();
      const selected = directory;
      if (!selected) throw new Error('请先选择文件夹');
      // 点击栈内立即请求权限；已授权时不会重复弹窗，失效时可由本次手势恢复。
      if (await selected.requestPermission({ mode: 'readwrite' }) !== 'granted') {
        throw new DOMException('请重新授权，或选择其他文件夹', 'NotAllowedError');
      }
      return dependencies.lock(async () => {
        const destination = selected;
        const dot = suggestedName.lastIndexOf('.');
        const base = dot > 0 ? suggestedName.slice(0, dot) : suggestedName;
        const extension = dot > 0 ? suggestedName.slice(dot) : '';
        for (let index = 0; ; index++) {
          const name = index ? `${base} (${index})${extension}` : suggestedName;
          try {
            await destination.getFileHandle(name);
          } catch (error) {
            const kind = error && typeof error === 'object' && 'name' in error ? error.name : '';
            if (kind === 'TypeMismatchError') continue; // 同名目录也需要避让。
            if (kind !== 'NotFoundError') throw error;
            // 创建失败直接交给菜单恢复；父目录被删除时不能继续循环。
            return destination.getFileHandle(name, { create: true });
          }
        }
      });
    },
  };
}
