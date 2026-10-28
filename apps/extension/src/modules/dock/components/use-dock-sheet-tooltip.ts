import { useRef, useState, type KeyboardEvent } from 'react';

/** Dock 抽屉入口共用提示互斥与焦点恢复后的提示抑制。 */
export function useDockSheetTooltip() {
  const [open, setOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const suppressRestoredFocusTooltip = useRef(false);

  return {
    sheetProps: {
      open,
      onOpenChange(nextOpen: boolean) {
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
      onPointerMove() {
        suppressRestoredFocusTooltip.current = false;
      },
      onBlur() {
        suppressRestoredFocusTooltip.current = false;
      },
      onPointerDown() {
        setTooltipOpen(false);
      },
      onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        if (event.key === 'Enter' || event.key === ' ') setTooltipOpen(false);
      },
    },
    onCloseAutoFocus() {
      // 保留 Sheet 默认焦点恢复，只阻止随之弹出的入口提示。
      suppressRestoredFocusTooltip.current = true;
      setTooltipOpen(false);
    },
  };
}
