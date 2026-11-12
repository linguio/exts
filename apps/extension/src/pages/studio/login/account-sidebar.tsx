import { useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../../../components/ui/sidebar';
import { toast } from '../../../components/ui/sonner';
import { UiIcon } from '../../../components/custom/ui-icon';
import { useAccount, logoutAccount } from '../../../features/account/auth-client';
import { AccountDialog } from './account-dialog';
import { AccountMenu } from './account-menu';


/** 保留官方登录组合，GitHub 与 Google 共用 Neon 身份和会话。 */
export function AccountSidebar() {
  const [pending, setPending] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { isMobile } = useSidebar();
  const { user, isPending, error, refetch } = useAccount();
  const avatar = user?.image?.startsWith('https://') ? user.image : undefined;
  const name = user?.name || 'Account';

  useEffect(() => {
    if (error) {
      console.error('Studio 账户会话读取失败');
      toast.error(error.message);
    }
  }, [error]);

  async function logout() {
    if (pending) return;
    setPending(true);
    try {
      await logoutAccount();
      toast.success('Signed out successfully.');
      await refetch();
    } catch (error) {
      console.error('Studio 账户退出失败');
      toast.error(error instanceof Error ? error.message : 'Unable to sign out. Please try again.');
    } finally {
      setPending(false);
    }
  }

  if (user && !error) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton ref={triggerRef} size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" aria-label={`Account: ${name}`}>
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  {avatar ? <AvatarImage src={avatar} alt={name} referrerPolicy="no-referrer" /> : null}
                  <AvatarFallback className="rounded-lg"><UiIcon name="user-round" className="size-4" /></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
                <UiIcon name="ellipsis-vertical" className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <AccountMenu triggerRef={triggerRef} user={user} loggingOut={pending} onLogout={() => { void logout(); }} side={isMobile ? 'bottom' : 'right'} sideOffset={4} matchTriggerWidth />
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AccountDialog isPending={isPending} refetch={refetch}>
          {open => <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" tooltip={{ children: 'Account', ...(open ? { hidden: true } : {}) }} aria-label="Account: not signed in">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg"><UiIcon name="user-round" className="size-4" /></AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Account</span>
              <span className="truncate text-xs">{isPending ? 'Checking account…' : error ? ('code' in error && error.code === 'session-expired' ? 'Sign in again' : 'Account unavailable') : 'Not signed in'}</span>
            </div>
          </SidebarMenuButton>}
        </AccountDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
