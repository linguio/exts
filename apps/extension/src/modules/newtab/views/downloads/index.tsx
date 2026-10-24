import { useEffect, useState, useSyncExternalStore, type ReactElement } from 'react';
import 'sonner/dist/styles.css';

import { clearDownloads, getDownloads, subscribeDownloads } from '../../../downloads';
import { selectRecords, type Downloads, type DownloadFilter } from '../../../downloads/schema';
import { subscribeTheme } from '../../../../shared/theme/runtime';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../../shared/ui/alert-dialog';
import { Button } from '../../../../shared/ui/button';
import { ToggleGroup, ToggleGroupItem } from '../../../../shared/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { Toaster, toast } from '../../../../shared/ui/sonner';
import { UiIcon } from '../../../../shared/ui/ui-icon';
import { BookmarkIcon } from '../../components/bookmark-icon';
import { DownloadRecordRow } from './download-record';

const filters = [
  { value: 'all', label: '全部', icon: null },
  { value: 'tg', label: 'Telegram', icon: 'brand/telegram.svg' },
  { value: 'x', label: 'X', icon: 'brand/x.svg' },
] as const;
const names = { all: '全部', tg: 'TG', x: 'X' };
const folders = { all: 'Exts Downloads', tg: 'Exts Downloads/Telegram', x: 'Exts Downloads/X' };
const readAppearance = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

function NamedTooltip({ label, children, suppressed = false }: { label: string; children: ReactElement; suppressed?: boolean }) {
  return (
    <Tooltip open={suppressed ? false : undefined}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** Download 只组合记录视图与交互；数据写入由 downloads 后台模块持有。 */
export function DownloadsPanel() {
  const [data, setData] = useState<Downloads>();
  const [filter, setFilter] = useState<DownloadFilter>('all');
  const [problem, setProblem] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const appearance = useSyncExternalStore(subscribeTheme, readAppearance);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const failed = (error: unknown) => {
      if (active) setProblem(error instanceof Error ? error.message : '下载记录读取失败');
    };
    const stop = subscribeDownloads(value => {
      revision++;
      if (active) { setData(value); setProblem(''); }
    }, error => { revision++; failed(error); });
    const initialRevision = revision;
    void getDownloads().then(value => {
      if (active && initialRevision === revision) { setData(value); setProblem(''); }
    }).catch(error => { if (initialRevision === revision) failed(error); });
    return () => { active = false; stop(); };
  }, []);

  const records = data ? selectRecords(data, filter) : [];
  const clear = async () => {
    setClearing(true);
    try {
      await clearDownloads(filter);
      setConfirmOpen(false);
    } catch (error) { toast.error(error instanceof Error ? error.message : '下载记录清空失败'); }
    finally { setClearing(false); }
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label="下载记录">
      <div className="flex shrink-0 items-center justify-between gap-4 px-6 pt-4 pb-3">
        <ToggleGroup type="single" value={filter} onValueChange={value => {
          if (value === 'all' || value === 'tg' || value === 'x') setFilter(value);
        }} variant="outline" size="sm" spacing={0} aria-label="下载来源">
          {filters.map(item => (
            <NamedTooltip key={item.value} label={item.label} suppressed={confirmOpen}>
              <ToggleGroupItem value={item.value} aria-label={item.label} className="w-9">
                {item.icon ? <BookmarkIcon icon={item.icon} name={item.label} tone="adaptive" size="sm" /> : <UiIcon name="list" className="size-4" />}
              </ToggleGroupItem>
            </NamedTooltip>
          ))}
        </ToggleGroup>
        <div className="flex items-center gap-1">
          <NamedTooltip label={`打开 ${folders[filter]} 文件夹`} suppressed={confirmOpen}>
            <Button type="button" variant="ghost" size="icon-sm" aria-label={`打开 ${folders[filter]} 文件夹`} onClick={() => toast.info('暂无法打开文件夹，尚未接入 Exts Desktop')}>
              <UiIcon name="folder-open" className="size-4" />
            </Button>
          </NamedTooltip>
          <AlertDialog open={confirmOpen} onOpenChange={open => { if (!clearing) setConfirmOpen(open); }}>
            <NamedTooltip label={`清空${names[filter]}下载记录`} suppressed={confirmOpen}>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon-sm" aria-label={`清空${names[filter]}下载记录`} disabled={!records.length || !!problem || clearing}>
                  <UiIcon name="trash-2" className="size-4" />
                </Button>
              </AlertDialogTrigger>
            </NamedTooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>清空{filter === 'all' ? '全部' : ` ${names[filter]} `}下载记录？</AlertDialogTitle>
                <AlertDialogDescription>仅清空记录，不删除已下载文件</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={clearing} className="border-border">取消</AlertDialogCancel>
                <AlertDialogAction variant="destructive" disabled={clearing} onClick={event => { event.preventDefault(); void clear(); }}>
                  {clearing ? '正在清空…' : '清空记录'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-6">
        {problem ? <p role="alert" className="py-4 text-sm text-destructive">{problem}</p>
          : !data ? <p role="status" className="py-4 text-sm text-muted-foreground">正在读取下载记录…</p>
            : records.length ? <ul className="shrink-0" aria-label={`${names[filter]}下载记录`}>{records.map(record => <DownloadRecordRow key={record.id} record={record} />)}</ul>
              : <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">暂无下载记录</p>}
      </div>
      <Toaster theme={appearance} />
    </section>
  );
}
