import { useEffect, useState } from 'react';

import { BrandIcon } from '../../../shared/brand/brand-icon';
import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/ui/avatar';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../shared/ui/dropdown-menu';
import { Field, FieldGroup } from '../../../shared/ui/field';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../../../shared/ui/sidebar';
import { toast } from '../../../shared/ui/sonner';
import { UiIcon } from '../../../shared/ui/ui-icon';
import { useAccount, loginAccount, logoutAccount } from '../services/auth-client';
import type { AccountProvider } from '../services/account-controller';


/** 保留官方登录组合，GitHub 与 Google 共用 Neon 身份和会话。 */
export function AccountLogin() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<AccountProvider | 'logout' | null>(null);
  const { isMobile } = useSidebar();
  const { user, isPending, error, refetch } = useAccount();
  const avatar = user?.image?.startsWith('https://') ? user.image : undefined;
  const name = user?.name || 'Account';

  useEffect(() => {
    if (error) {
      console.error('Studio 账户会话读取失败');
      toast.error('无法读取登录状态，请重新打开账户后重试');
    }
  }, [error]);

  async function login(provider: AccountProvider) {
    if (pending) return;
    setPending(provider);
    try {
      await loginAccount(provider);
      toast.success('登录成功');
      await refetch();
      setOpen(false);
    } catch (error) {
      if (error instanceof Error && error.message === '已取消登录') {
        toast.info(error.message);
      } else {
        console.error('Studio OIDC 登录失败');
        toast.error(error instanceof Error ? error.message : '登录失败，请重试');
      }
    } finally {
      setPending(null);
    }
  }

  async function logout() {
    if (pending) return;
    setPending('logout');
    try {
      await logoutAccount();
      toast.success('退出成功');
      await refetch();
      setOpen(false);
    } catch (error) {
      console.error('Studio 账户退出失败');
      toast.error(error instanceof Error ? error.message : '退出失败，请重试');
    } finally {
      setPending(null);
    }
  }

  if (user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" aria-label={`Account: ${name}`}>
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
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
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
                <DropdownMenuItem><UiIcon name="credit-card" className="size-4" />Billing</DropdownMenuItem>
                <DropdownMenuItem><UiIcon name="bell" className="size-4" />Notifications</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={pending !== null} onSelect={() => { void logout(); }}>
                <UiIcon name="log-out" className="size-4" />
                {pending === 'logout' ? 'Signing out…' : 'Log out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
      if (nextOpen) void refetch();
    }}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DialogTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" tooltip={{ children: 'Account', ...(open ? { hidden: true } : {}) }} aria-label="Account: not signed in">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg"><UiIcon name="user-round" className="size-4" /></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Account</span>
                <span className="truncate text-xs">{isPending ? 'Checking account…' : 'Not signed in'}</span>
              </div>
            </SidebarMenuButton>
          </DialogTrigger>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogContent className="gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <DialogTitle asChild><CardTitle className="text-xl">Welcome back</CardTitle></DialogTitle>
              <DialogDescription asChild><CardDescription>Login with your Github or Google account</CardDescription></DialogDescription>
            </CardHeader>
            <CardContent>
              <form>
                <FieldGroup>
                  <Field>
                    <Button variant="outline" type="button" disabled={pending !== null || isPending} onClick={() => { void login('github'); }}>
                      <BrandIcon icon="brand/github.svg" name="GitHub" size="sm" />
                      {pending === 'github' ? 'Signing in…' : 'Login with GitHub'}
                    </Button>
                    <Button variant="outline" type="button" disabled={pending !== null || isPending} onClick={() => { void login('google'); }}>
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      {pending === 'google' ? 'Signing in…' : 'Login with Google'}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
