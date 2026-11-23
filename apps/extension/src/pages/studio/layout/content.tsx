import { Fragment, type ReactNode } from 'react';
import type { useAccount } from '../../../features/account/auth-client';
import { Button } from '../../../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { studioAccess, studioSessionKey } from '../account/state';

/** Studio 共用身份边界；受保护子树随账号和会话重置版本重新创建。 */
export function StudioContent({ children, account, resetVersion }: { children: ReactNode; account: ReturnType<typeof useAccount>; resetVersion: number }) {
  const access = studioAccess(account);
  if (access === 'loading' || access === 'signed-out') return null;
  if (access === 'error') return <div className="p-4 md:p-6"><Alert><AlertTitle>Unable to load your account</AlertTitle><AlertDescription>
    <p>Please try again to continue.</p><Button type="button" variant="outline" onClick={() => { void account.refetch(); }}>Retry</Button>
  </AlertDescription></Alert></div>;
  return <Fragment key={studioSessionKey(account.user!.id, resetVersion)}>{children}</Fragment>;
}
