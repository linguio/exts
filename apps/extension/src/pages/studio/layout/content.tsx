import { Fragment, type ReactNode } from 'react';
import type { useAccount } from '../../../features/account/auth-client';
import { Button } from '../../../components/ui/button';
import { Spinner } from '../../../components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { studioAccess, studioSessionKey } from '../account/state';

/** Studio 共用身份边界；受保护子树随账号和会话重置版本重新创建。 */
export function StudioContent({ children, account, resetVersion }: { children: ReactNode; account: ReturnType<typeof useAccount>; resetVersion: number }) {
  const access = studioAccess(account);
  if (access === 'loading') return <div className="grid min-h-0 flex-1 place-items-center" aria-busy="true">
    <Spinner aria-label="Loading account…" />
  </div>;
  if (access === 'error') return <div className="p-4 md:p-6"><Alert><AlertTitle>Unable to load your account</AlertTitle><AlertDescription>
    <p>Please try again to continue.</p><Button type="button" variant="outline" onClick={() => { void account.refetch(); }}>Retry</Button>
  </AlertDescription></Alert></div>;
  if (access === 'signed-out') return null;
  return <Fragment key={studioSessionKey(account.user!.id, resetVersion)}>{children}</Fragment>;
}
