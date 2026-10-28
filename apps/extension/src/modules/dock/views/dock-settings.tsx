import { Button } from '../../../shared/ui/button';
import { SheetTrigger } from '../../../shared/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../shared/ui/tooltip';
import { UiIcon } from '../../../shared/ui/ui-icon';
import { SettingsSheet } from '../../settings';
import { useDockSheetTooltip } from '../components/use-dock-sheet-tooltip';

/** Dock 只提供设置入口，设置抽屉及分区由设置模块持有。 */
export function DockSettings() {
  const sheetTooltip = useDockSheetTooltip();

  return (
    <SettingsSheet {...sheetTooltip.sheetProps} onCloseAutoFocus={sheetTooltip.onCloseAutoFocus}>
      <Tooltip {...sheetTooltip.tooltipProps}>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="entry"
              size="entry"
              className="bookmark-card bookmark-card--dock bookmark-dock__tool"
              aria-label="Open settings"
              {...sheetTooltip.triggerProps}
            >
              <span className="bookmark-card__icon entry-surface">
                <UiIcon name="settings" className="entry-glyph" />
              </span>
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={12}>Settings</TooltipContent>
      </Tooltip>
    </SettingsSheet>
  );
}
