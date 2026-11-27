import { useLayoutEffect, useRef, useState } from 'react';
import { toast } from '@linguio/exts-ui/plus/toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

export function CopyableTextCell({ value }: { value: string }) {
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
      <button type="button" className="inline-flex min-w-0 max-w-full cursor-copy text-left"
        aria-label={`Copy ${value}`} onClick={copy}
        onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setOpen(true); }}>
        <span ref={textRef} className="min-w-0 truncate">{value}</span>
      </button>
    </TooltipTrigger>
    {truncated && <TooltipContent className="max-w-[min(32rem,calc(100vw-2rem))] break-all">{value}</TooltipContent>}
  </Tooltip>;
}
