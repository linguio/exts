import { Button } from '../../components/ui/button';
import { SheetTrigger } from '../../components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { UiIcon } from '../../components/custom/ui-icon';
import { useDockSheetTooltip } from './use-dock-sheet-tooltip';
import { MediaDownloadSheet } from '../download';

/** Dock 只提供一级入口，记录抽屉由媒体下载模块持有。 */
export function DockDownload() {
  const sheetTooltip = useDockSheetTooltip();

  return (
    <MediaDownloadSheet {...sheetTooltip.sheetProps} onCloseAutoFocus={sheetTooltip.onCloseAutoFocus}>
      <Tooltip {...sheetTooltip.tooltipProps}>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="entry"
              size="entry"
              className="bookmark-card bookmark-card--dock bookmark-dock__tool"
              aria-label="Open Media Download"
              {...sheetTooltip.triggerProps}
            >
              <span className="bookmark-card__icon entry-surface">
                <UiIcon name="download" className="entry-glyph" />
              </span>
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={12}>Media Download</TooltipContent>
      </Tooltip>
    </MediaDownloadSheet>
  );
}
