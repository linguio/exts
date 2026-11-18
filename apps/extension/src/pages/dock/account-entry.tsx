import { useEffect, useRef, useState } from 'react';

import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { toast } from '@linguio/exts-ui/plus/toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { UiIcon } from '../../components/custom/ui-icon';
import { LoginDialog } from '@/pages/studio/account/login-dialog';
import { AccountMenu } from '@/pages/studio/account/menu';
import { logoutAccount } from '@/features/account/auth-client';
import { useAccount } from '@/features/account/auth-client';
import { useDockOverlay } from './use-dock-overlay';

/** 首页账户入口复用共享 Account 登录框，已登录菜单直接在 Dock 展开。 */
export function AccountEntry() {
  const { user, isPending, error, refetch } = useAccount();
  const overlay = useDockOverlay();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (error) toast.add({ type: "error", title: error.message });
  }, [error]);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutAccount();
      toast.add({ type: "success", title: 'Signed out successfully.' });
      await refetch();
      overlay.overlayProps.onOpenChange(false);
    } catch (error) {
      toast.add({ type: "error", title: error instanceof Error ? error.message : 'Unable to sign out. Please try again.' });
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
          <AccountMenu triggerRef={triggerRef} user={user} loggingOut={loggingOut} onLogout={() => { void logout(); }} side="top" sideOffset={12} />
        </DropdownMenu>
      ) : (
        <LoginDialog isPending={isPending} refetch={refetch} onOpenChange={overlay.overlayProps.onOpenChange}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
        </LoginDialog>
      )}
      <TooltipContent side="top" align="center" sideOffset={12}>Account</TooltipContent>
    </Tooltip>
  );
}
