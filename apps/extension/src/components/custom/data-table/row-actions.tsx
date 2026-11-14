import { useRef } from 'react';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { UiIcon } from '../ui-icon';

/** 共用行操作只展示已接入的编辑能力，业务页不重复组装菜单。 */
export function DataTableRowActions({ disabled, onEdit }: { disabled: boolean; onEdit: () => void }) {
  const openingEditor = useRef(false);
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button type="button" variant="ghost" size="icon" disabled={disabled} aria-label="Open menu">
        <UiIcon name="ellipsis" className="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" onCloseAutoFocus={event => {
      if (openingEditor.current) {
        // 菜单关闭时把焦点交给现有编辑Sheet，不抢回更多按钮。
        event.preventDefault();
        openingEditor.current = false;
      }
    }}>
      <DropdownMenuItem disabled={disabled} onSelect={() => {
        openingEditor.current = true;
        onEdit();
      }}><UiIcon name="square-pen" className="size-4" />Edit</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}
