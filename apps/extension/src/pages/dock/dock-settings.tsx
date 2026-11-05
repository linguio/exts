import { Button } from '../../components/ui/button';
import { SheetTrigger } from '../../components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { UiIcon } from '../../components/custom/ui-icon';
import { SettingsSheet } from '../settings';
import { useDockOverlay } from './use-dock-overlay';

/** Dock 只提供设置入口，设置抽屉及分区由设置模块持有。 */
export function DockSettings() {
  const overlay = useDockOverlay();

  return (
    <SettingsSheet {...overlay.overlayProps} onCloseAutoFocus={overlay.onCloseAutoFocus}>
      <Tooltip {...overlay.tooltipProps}>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="entry"
              size="entry"
              className="bookmark-card bookmark-card--dock bookmark-dock__tool"
              aria-label="Open settings"
              {...overlay.triggerProps}
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
