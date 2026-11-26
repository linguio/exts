import { useLayoutEffect, useRef, useState } from 'react';
import { toast } from '@linguio/exts-ui/plus/toast';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { cn } from '../../../lib/utils';

export function CopyableTextCell({ value, className }: { value: string; className?: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const text = textRef.current;
    if (!text) return;
    const measure = () => setTruncated(text.scrollWidth > text.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(text);
    return () => observer.disconnect();
  }, [value]);

  async function copy() {
    setOpen(false);
    try {
      await navigator.clipboard.writeText(value);
      toast.add({ type: 'success', title: 'Copied to clipboard' });
    } catch {
      toast.add({ type: 'error', title: 'Unable to copy' });
    }
  }

  return <Tooltip open={truncated && open} onOpenChange={setOpen}>
    <TooltipTrigger asChild>
      <Button type="button" variant="ghost" size="xs" className={cn('max-w-full min-w-0 cursor-copy justify-start', className)}
        aria-label={`Copy ${value}`} onClick={copy}
        onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setOpen(true); }}>
        <span ref={textRef} className="min-w-0 truncate">{value}</span>
      </Button>
    </TooltipTrigger>
    {truncated && <TooltipContent className="max-w-[min(32rem,calc(100vw-2rem))] break-all">{value}</TooltipContent>}
  </Tooltip>;
}
