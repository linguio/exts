import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { UiIcon } from '../ui-icon';

/** 共用行操作直接展示已接入的编辑能力。 */
export function DataTableRowActions({ disabled, onEdit }: { disabled: boolean; onEdit: () => void }) {
  return <Tooltip>
    <TooltipTrigger asChild>
      <Button type="button" variant="ghost" size="icon" disabled={disabled} aria-label="Edit record" onClick={onEdit}>
        <UiIcon name="square-pen" className="size-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Edit</TooltipContent>
  </Tooltip>;
}
