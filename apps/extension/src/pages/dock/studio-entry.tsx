import { Button } from '../../components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { UiIcon } from '../../components/custom/ui-icon';

interface StudioDockEntryProps {
  onOpen: () => void;
}

/** 首页 Dock 仅提供进入工作台的入口。 */
export function StudioDockEntry({ onOpen }: StudioDockEntryProps) {
  const label = 'Open Studio';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="entry"
          size="entry"
          onClick={onOpen}
          aria-label={label}
        >
          <span className="entry-surface">
            <UiIcon name="panels-top-left" className="entry-glyph" />
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" sideOffset={12}>{label}</TooltipContent>
    </Tooltip>
  );
}
