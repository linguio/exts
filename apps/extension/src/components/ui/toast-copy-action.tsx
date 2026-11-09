import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

/** 复制成功后展示 Check 的时长，便于用户辨认反馈。 */
export const TOAST_COPY_FEEDBACK_MS = 2_000;

/** 与 DataTable Columns 相同：悬停/键盘提示固定短标签。 */
export const TOAST_COPY_TOOLTIP = 'Copy';

export function getToastCopyAriaLabel(copied: boolean): string {
  return copied ? 'Copied' : 'Copy toast message';
}

/** 与 DataTable Columns 触发器一致的仅图标 outline 按钮组合。 */
export const toastCopyButtonClassName = 'shrink-0';

interface ToastCopyActionProps {
  displayText: string;
}

/** Sonner 官方 action 插槽：仅图标复制当前 Toast 可见英文文案。 */
export function ToastCopyAction({ displayText }: ToastCopyActionProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => { if (timerRef.current !== undefined) clearTimeout(timerRef.current); }, []);

  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      if (timerRef.current !== undefined) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), TOAST_COPY_FEEDBACK_MS);
    } catch {
      setCopied(false);
    }
  }

  const ariaLabel = getToastCopyAriaLabel(copied);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={toastCopyButtonClassName}
            aria-label={ariaLabel}
            onClick={event => { void handleCopy(event); }}
            onPointerDown={event => { event.stopPropagation(); }}
          >
            {copied
              ? <Check className="size-4" aria-hidden />
              : <Copy className="size-4" aria-hidden />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{TOAST_COPY_TOOLTIP}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
