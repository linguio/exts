import { useState } from 'react';

import { BrandIcon } from '../../../shared/brand/brand-icon';
import { Avatar, AvatarFallback } from '../../../shared/ui/avatar';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { Field, FieldGroup } from '../../../shared/ui/field';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../../../shared/ui/sidebar';
import { toast } from '../../../shared/ui/sonner';
import { UiIcon } from '../../../shared/ui/ui-icon';

/** 基于官方 login-03 精简为第三方登录入口，本期仅提示未接入。 */
export function AccountLogin() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DialogTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" tooltip={{ children: 'Account', ...(open ? { hidden: true } : {}) }} aria-label="Account: not signed in">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg"><UiIcon name="user-round" className="size-4" /></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Account</span>
                <span className="truncate text-xs">Not signed in</span>
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
                    <Button variant="outline" type="button" onClick={() => toast.info('GitHub 登录暂未接入')}>
                      <BrandIcon icon="brand/github.svg" name="GitHub" size="sm" />
                      Login with GitHub
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
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
