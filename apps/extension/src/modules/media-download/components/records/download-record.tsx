import { useLayoutEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { formatSize } from '../../utils/records/format';
import type { DownloadRecord } from '../../types/records';

export function DownloadRecordRow({ record }: { record: DownloadRecord }) {
  const stemRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  const prefix = record.filename.match(/^(TG_|X_)/)?.[0] || '';
  const extensionIndex = record.filename.lastIndexOf('.');
  const extension = extensionIndex > prefix.length ? record.filename.slice(extensionIndex) : '';
  const stem = record.filename.slice(prefix.length, extension ? extensionIndex : undefined);

  useLayoutEffect(() => {
    const element = stemRef.current!;
    const measure = () => setTruncated(element.scrollWidth > element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [record.filename]);

  return (
    <li className="flex h-10 shrink-0 items-center gap-4 border-b border-border last:border-b-0">
      <Tooltip open={truncated ? undefined : false}>
        <TooltipTrigger asChild>
          <span tabIndex={truncated ? 0 : undefined} aria-label={record.filename} className="flex min-w-0 flex-1 text-sm outline-none focus-visible:outline-2 focus-visible:outline-ring">
            {prefix && <span className="shrink-0">{prefix}</span>}
            <span ref={stemRef} className="min-w-0 truncate">{stem}</span>
            {extension && <span className="shrink-0">{extension}</span>}
          </span>
        </TooltipTrigger>
        {truncated && <TooltipContent className="max-w-[min(32rem,calc(100vw-2rem))] break-all">{record.filename}</TooltipContent>}
      </Tooltip>
      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{formatSize(record.sizeBytes)}</span>
    </li>
  );
}
