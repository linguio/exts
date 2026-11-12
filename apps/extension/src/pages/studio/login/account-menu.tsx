import { useRef, useState, type RefObject } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../../../components/ui/dropdown-menu';
import { UiIcon } from '../../../components/custom/ui-icon';
import type { AccountUser } from '../../../features/account/account-controller';
import { SettingsSheet } from '../../settings';

/** Studio 与 Newtab 使用相同的账户菜单内容。 */
export function AccountMenu({ user, loggingOut, onLogout, side, sideOffset, matchTriggerWidth = false, onCloseAutoFocus, triggerRef }: {
  user: AccountUser;
  loggingOut: boolean;
  onLogout: () => void;
  side: 'top' | 'bottom' | 'right';
  sideOffset: number;
  matchTriggerWidth?: boolean;
  onCloseAutoFocus?: (event: Event) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openingSettings = useRef(false);
  const avatar = user.image?.startsWith('https://') ? user.image : undefined;
  const name = user.name || 'Account';

  return (
    <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} onCloseAutoFocus={(event) => {
      event.preventDefault();
      onCloseAutoFocus?.(event);
      triggerRef.current?.focus();
    }}>
      <DropdownMenuContent className={matchTriggerWidth ? 'w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg' : 'min-w-56 rounded-lg'} side={side} align="end" sideOffset={sideOffset} onCloseAutoFocus={(event) => {
        onCloseAutoFocus?.(event);
        if (openingSettings.current) {
          // 菜单关闭时把焦点交给设置抽屉，不恢复到被遮罩的入口。
          event.preventDefault();
          openingSettings.current = false;
        }
      }}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              {avatar ? <AvatarImage src={avatar} alt={name} referrerPolicy="no-referrer" /> : null}
              <AvatarFallback className="rounded-lg"><UiIcon name="user-round" className="size-4" /></AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem><UiIcon name="circle-user" className="size-4" />Account</DropdownMenuItem>
          <DropdownMenuItem><UiIcon name="bell" className="size-4" />Notifications</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {
            openingSettings.current = true;
            setSettingsOpen(true);
          }}><UiIcon name="settings" className="size-4" />Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={loggingOut} onSelect={onLogout}>
          <UiIcon name="log-out" className="size-4" />
          {loggingOut ? 'Signing out…' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </SettingsSheet>
  );
}
