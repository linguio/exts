import { useEffect, useRef, useState } from 'react';

import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { toast } from '../../components/ui/sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { UiIcon } from '../../components/custom/ui-icon';
import { AccountDialog } from '@/pages/account/account-dialog';
import { AccountMenuContent } from '@/pages/account/account-menu-content';
import { logoutAccount } from '@/features/account/auth-client';
import { useAccount } from '@/features/account/auth-client';
import { useDockOverlay } from './use-dock-overlay';

/** 首页账户入口复用共享 Account 登录框，已登录菜单直接在 Dock 展开。 */
export function DockAccount() {
  const { user, isPending, error, refetch } = useAccount();
  const overlay = useDockOverlay();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutAccount();
      toast.success('退出成功');
      await refetch();
      overlay.overlayProps.onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '退出失败，请重试');
    } finally {
      setLoggingOut(false);
    }
  }

  const button = (
    <Button
      ref={triggerRef}
      type="button"
      variant="entry"
      size="entry"
      className="bookmark-card bookmark-card--dock bookmark-dock__tool"
      aria-label="Account"
      {...overlay.triggerProps}
    >
      <span className="bookmark-card__icon entry-surface">
        <UiIcon name="user-round" className="entry-glyph" />
      </span>
    </Button>
  );

  return (
    <Tooltip {...overlay.tooltipProps}>
      {user && !error ? (
        <DropdownMenu {...overlay.overlayProps}>
          <TooltipTrigger asChild><DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger></TooltipTrigger>
          <AccountMenuContent triggerRef={triggerRef} user={user} loggingOut={loggingOut} onLogout={() => { void logout(); }} side="top" sideOffset={12} onCloseAutoFocus={overlay.onCloseAutoFocus} />
        </DropdownMenu>
      ) : (
        <AccountDialog isPending={isPending} refetch={refetch} onOpenChange={overlay.overlayProps.onOpenChange} onCloseAutoFocus={overlay.onCloseAutoFocus}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
        </AccountDialog>
      )}
      <TooltipContent side="top" align="center" sideOffset={12}>Account</TooltipContent>
    </Tooltip>
  );
}
