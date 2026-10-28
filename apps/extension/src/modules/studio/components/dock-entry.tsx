import { Toggle } from '../../../shared/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../shared/ui/tooltip';
import { UiIcon } from '../../../shared/ui/ui-icon';

interface StudioDockEntryProps {
  active: boolean;
  onActiveChange: (active: boolean) => void;
}

/** 固定图标表达工作台入口，提示表达下一次切换的目标。 */
export function StudioDockEntry({ active, onActiveChange }: StudioDockEntryProps) {
  const label = active ? 'Back to Home' : 'Switch to Studio';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          pressed={active}
          onPressedChange={onActiveChange}
          aria-label={label}
          className="entry-trigger size-16 min-w-0 flex-none rounded-[var(--radius)] p-0"
        >
          <span className="entry-surface">
            <UiIcon name="panels-top-left" className="entry-glyph" />
          </span>
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" sideOffset={12}>{label}</TooltipContent>
    </Tooltip>
  );
}
