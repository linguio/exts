import { useState } from 'react';

/** Dock 弹出层打开时隐藏入口提示，不干预官方焦点恢复。 */
export function useDockOverlay() {
  const [open, setOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return {
    overlayProps: {
      open,
      onOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
        setTooltipOpen(false);
      },
    },
    tooltipProps: {
      open: tooltipOpen && !open,
      onOpenChange(nextOpen: boolean) {
        if (!open) setTooltipOpen(nextOpen);
      },
    },
  };
}
