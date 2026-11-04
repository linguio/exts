import { useEffect, useState } from 'react';

import { BrandIcon } from '../../../shared/brand/brand-icon';
import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/ui/avatar';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { Field, FieldGroup } from '../../../shared/ui/field';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../../../shared/ui/sidebar';
import { toast } from '../../../shared/ui/sonner';
import { UiIcon } from '../../../shared/ui/ui-icon';
import { useAccount, loginWithGitHub, logoutAccount } from '../services/auth-client';


/** 保留官方登录组合；身份和会话来自 Neon，Google 暂未接入。 */
export function AccountLogin() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<'login' | 'logout' | null>(null);
  const { user, isPending, error, refetch } = useAccount();
  const avatar = user?.image?.startsWith('https://') ? user.image : undefined;

  useEffect(() => {
    if (error) {
      console.error('Studio 账户会话读取失败');
      toast.error('无法读取登录状态，请重新打开账户后重试');
    }
  }, [error]);

  async function login() {
    if (pending) return;
    setPending('login');
    try {
      await loginWithGitHub();
      await refetch();
      setOpen(false);
    } catch (error) {
      if (error instanceof Error && error.message === '已取消登录') {
        toast.info(error.message);
      } else {
        console.error('Studio OIDC 登录失败');
        toast.error(error instanceof Error ? error.message : 'GitHub 登录失败，请重试');
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
      await refetch();
      setOpen(false);
    } catch {
      console.error('Studio 账户退出失败');
      toast.error('退出失败，请重试');
    } finally {
      setPending(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
      if (nextOpen) void refetch();
    }}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DialogTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" tooltip={{ children: 'Account', ...(open ? { hidden: true } : {}) }} aria-label={user ? `Account: ${user.name || user.email}` : 'Account: not signed in'}>
              <Avatar className="h-8 w-8 rounded-lg">
                {avatar ? <AvatarImage src={avatar} alt="" referrerPolicy="no-referrer" /> : null}
                <AvatarFallback className="rounded-lg"><UiIcon name="user-round" className="size-4" /></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name || 'Account'}</span>
                <span className="truncate text-xs">{user?.email || (isPending ? 'Checking account…' : 'Not signed in')}</span>
              </div>
            </SidebarMenuButton>
          </DialogTrigger>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogContent className="gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <DialogTitle asChild><CardTitle className="text-xl">{user ? user.name || 'Account' : 'Welcome back'}</CardTitle></DialogTitle>
              <DialogDescription asChild><CardDescription>{user ? user.email : 'Login with your Github or Google account'}</CardDescription></DialogDescription>
            </CardHeader>
            <CardContent>
              {user ? <Button variant="outline" type="button" className="w-full" disabled={pending !== null} onClick={() => { void logout(); }}>
                {pending === 'logout' ? 'Signing out…' : 'Sign out'}
              </Button> : <form>
                <FieldGroup>
                  <Field>
                    <Button variant="outline" type="button" disabled={pending !== null || isPending} onClick={() => { void login(); }}>
                      <BrandIcon icon="brand/github.svg" name="GitHub" size="sm" />
                      {pending === 'login' ? 'Signing in…' : 'Login with GitHub'}
                    </Button>
                    <Button variant="outline" type="button" onClick={() => toast.info('Google 登录暂未接入')}>
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Login with Google
                    </Button>
                  </Field>
                </FieldGroup>
              </form>}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
