import { useState, type ReactNode } from 'react';

import { BrandIcon } from '../../../components/custom/brand-icon';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Field, FieldGroup } from '../../../components/ui/field';
import { toast } from '../../../components/ui/sonner';
import { loginAccount } from '../../../features/account/auth-client';
import type { AccountProvider } from '../../../features/account/account-controller';

/** Studio 与 Newtab 共用同一登录表单和认证操作。 */
export function LoginDialog({ children, isPending, refetch, onOpenChange, onCloseAutoFocus }: { children: ReactNode | ((open: boolean) => ReactNode); isPending: boolean; refetch: () => Promise<void>; onOpenChange?: (open: boolean) => void; onCloseAutoFocus?: (event: Event) => void }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<AccountProvider | null>(null);

  async function login(provider: AccountProvider) {
    if (pending) return;
    setPending(provider);
    try {
      await loginAccount(provider);
      toast.success('Signed in successfully.');
      await refetch();
      setOpen(false);
      onOpenChange?.(false);
    } catch (error) {
      if (error instanceof Error && error.message === 'Sign-in cancelled.') toast.info(error.message);
      else {
        console.error('Studio OIDC 登录失败');
        toast.error(error instanceof Error ? error.message : 'Sign-in failed. Please try again.');
      }
    } finally {
      setPending(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
      if (nextOpen) void refetch();
    }}>
      <DialogTrigger asChild>{typeof children === 'function' ? children(open) : children}</DialogTrigger>
      <DialogContent onCloseAutoFocus={onCloseAutoFocus} className="gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-sm">
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
                      <BrandIcon icon="brand/github.svg" size="sm" />
                      {pending === 'github' ? 'Signing in…' : 'Login with GitHub'}
                    </Button>
                    <Button variant="outline" type="button" disabled={pending !== null || isPending} onClick={() => { void login('google'); }}>
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.84 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
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
