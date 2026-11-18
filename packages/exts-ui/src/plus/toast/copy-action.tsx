import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../../ui/button';
import { Tooltip, TooltipTrigger } from '../../ui/tooltip';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { Branch as DismissableLayerBranch } from '@radix-ui/react-dismissable-layer';

/** 复制成功后展示 Check 的时长，便于用户辨认反馈。 */
export const TOAST_COPY_FEEDBACK_MS = 2_000;

/** 与 DataTable Columns 相同：悬停/键盘提示固定短标签。 */
export const TOAST_COPY_TOOLTIP = 'Copy';

export function getToastCopyAriaLabel(copied: boolean): string {
  return copied ? 'Copied' : 'Copy toast message';
}

/** 用户批准的 ghost 小型图标复制按钮。 */
export const toastCopyButtonClassName = 'shrink-0';

interface ToastCopyActionProps {
  displayText: string;
  portalContainer?: HTMLElement | ShadowRoot | null;
}

/** Toast 复制入口：复制完整标题和描述。 */
export function ToastCopyAction({ displayText, portalContainer }: ToastCopyActionProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => { if (timerRef.current !== undefined) clearTimeout(timerRef.current); }, []);

  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
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
    <Tooltip>
      <TooltipTrigger asChild onFocus={event => event.preventDefault()}>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={toastCopyButtonClassName}
          aria-label={ariaLabel}
          onClick={event => { void handleCopy(event); }}
        >
          {copied
            ? <Check className="size-4" aria-hidden />
            : <Copy className="size-4" aria-hidden />}
        </Button>
      </TooltipTrigger>
      <TooltipPrimitive.Portal container={portalContainer}>
        <DismissableLayerBranch asChild>
          <TooltipPrimitive.Content sideOffset={4} className="exts-toast-tooltip rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-lg">{TOAST_COPY_TOOLTIP}</TooltipPrimitive.Content>
        </DismissableLayerBranch>
      </TooltipPrimitive.Portal>
    </Tooltip>
  );
}
