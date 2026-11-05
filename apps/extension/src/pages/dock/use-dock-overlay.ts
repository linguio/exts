import { useRef, useState, type KeyboardEvent } from 'react';

/** Dock 弹出层入口共用提示互斥与焦点恢复后的提示抑制。 */
export function useDockOverlay() {
  const [open, setOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [restoredFocus, setRestoredFocus] = useState(false);
  const suppressRestoredFocusTooltip = useRef(false);

  return {
    overlayProps: {
      open,
      onOpenChange(nextOpen: boolean) {
        // 关闭渲染时预先设置标记，避免默认焦点恢复早于 React 提交而短暂描边。
        if (!nextOpen) {
          suppressRestoredFocusTooltip.current = true;
          setRestoredFocus(true);
        }
        setOpen(nextOpen);
        setTooltipOpen(false);
      },
    },
    tooltipProps: {
      open: tooltipOpen && !open,
      onOpenChange(nextOpen: boolean) {
        if (!open && !suppressRestoredFocusTooltip.current) setTooltipOpen(nextOpen);
      },
    },
    triggerProps: {
      'data-restored-focus': restoredFocus || undefined,
      onPointerMove() {
        suppressRestoredFocusTooltip.current = false;
      },
      onBlur() {
        suppressRestoredFocusTooltip.current = false;
        setRestoredFocus(false);
      },
      onPointerDown() {
        setRestoredFocus(false);
        setTooltipOpen(false);
      },
      onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        setRestoredFocus(false);
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') setTooltipOpen(false);
      },
    },
    onCloseAutoFocus() {
      // 保留弹出层默认焦点恢复，仅抑制本次恢复附带的描边与提示。
      suppressRestoredFocusTooltip.current = true;
      setTooltipOpen(false);
    },
  };
}
