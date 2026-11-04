import { useEffect, useState } from 'react';

import { Button } from '../../../shared/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '../../../shared/ui/dropdown-menu';
import { toast } from '../../../shared/ui/sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../shared/ui/tooltip';
import { UiIcon } from '../../../shared/ui/ui-icon';
import { AccountDialog, AccountMenuContent, logoutAccount, useAccount } from '../../studio';

/** 首页账户入口复用 Studio 登录框，已登录菜单直接在 Dock 展开。 */
export function DockAccount() {
  const { user, isPending, error, refetch } = useAccount();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
      setMenuOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '退出失败，请重试');
    } finally {
      setLoggingOut(false);
    }
  }

  const button = (
    <Button
      type="button"
      variant="entry"
      size="entry"
      className="bookmark-card bookmark-card--dock bookmark-dock__tool"
      aria-label="Account"
      onPointerDown={() => setTooltipOpen(false)}
    >
      <span className="bookmark-card__icon entry-surface">
        <UiIcon name="user-round" className="entry-glyph" />
      </span>
    </Button>
  );

  return (
    <Tooltip open={tooltipOpen && !dialogOpen && !menuOpen} onOpenChange={setTooltipOpen}>
      {user && !error ? (
        <DropdownMenu open={menuOpen} onOpenChange={open => { setMenuOpen(open); setTooltipOpen(false); }}>
          <TooltipTrigger asChild><DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger></TooltipTrigger>
          <AccountMenuContent user={user} loggingOut={loggingOut} onLogout={() => { void logout(); }} side="top" sideOffset={12} />
        </DropdownMenu>
      ) : (
        <AccountDialog isPending={isPending} refetch={refetch} onOpenChange={open => { setDialogOpen(open); setTooltipOpen(false); }}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
        </AccountDialog>
      )}
      <TooltipContent side="top" align="center" sideOffset={12}>Account</TooltipContent>
    </Tooltip>
  );
}
