import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { Separator } from '../../shared/ui/separator';
import { DOWNLOAD_HISTORY_KEY, parseRecords, type DownloadRecord } from './history';

const labels = { downloading: '下载中', completed: '已完成', failed: '失败', interrupted: '已中断' };
const bytes = (value: number) => value < 1024 * 1024 ? `${(value / 1024).toFixed(1)} KB` : `${(value / 1024 / 1024).toFixed(1)} MB`;

export function DownloadsPopup() {
  const [records, setRecords] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    let changed = false;
    const update = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area !== 'local' || !(DOWNLOAD_HISTORY_KEY in changes)) return;
      changed = true;
      if (active) { setRecords(parseRecords(changes[DOWNLOAD_HISTORY_KEY].newValue)); setError(false); setLoading(false); }
    };
    browser.storage.onChanged.addListener(update);
    void browser.storage.local.get(DOWNLOAD_HISTORY_KEY).then(stored => {
      if (active && !changed) setRecords(parseRecords(stored[DOWNLOAD_HISTORY_KEY]));
    }).catch(() => { if (active && !changed) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; browser.storage.onChanged.removeListener(update); };
  }, []);
  return <main className="bg-background font-sans text-foreground">
    <header className="flex min-h-14 items-center px-6"><h1 className="text-lg font-semibold">Downloads</h1></header>
    <Separator />
    <section aria-label="下载记录" className="max-h-[480px] space-y-4 overflow-y-auto p-6">
      {loading ? <p className="text-sm text-muted-foreground">正在读取下载记录…</p>
        : error ? <p role="alert" className="text-sm">无法读取下载记录，请重新打开 Popup。</p>
        : records.length === 0 ? <p className="text-sm text-muted-foreground">没有下载记录</p>
        : records.map(record => <article key={`${record.source}:${record.id}`} className="space-y-2 rounded-md border border-border bg-card p-3 text-card-foreground">
          <p className="break-all text-sm font-medium">{record.filename}</p>
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground"><span>Telegram</span><span>{labels[record.state]}</span></div>
          {record.state === 'downloading' && <progress className="block h-1 w-full accent-primary" aria-label={`${record.filename} 下载进度`} value={record.totalBytes ? record.loadedBytes : undefined} max={record.totalBytes || 1} />}
          <p className="text-xs text-muted-foreground">{bytes(record.loadedBytes)}{record.totalBytes ? ` / ${bytes(record.totalBytes)}` : ''}</p>
          {(record.state === 'failed' || record.state === 'interrupted') && <p className="text-xs text-muted-foreground">{record.state === 'interrupted' ? '页面已离开或浏览器已重启，下载未完成。' : `下载失败（${record.errorCode || 'unknown'}）`}</p>}
        </article>)}
    </section>
  </main>;
}
