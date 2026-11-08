import { Fragment, type ReactNode } from 'react';
import type { useAccount } from '../../features/account/auth-client';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../components/ui/empty';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { UiIcon } from '../../components/custom/ui-icon';
import { AccountDialog } from '../account/account-dialog';
import { studioAccess, studioSessionKey } from './studio-access';

/** Studio 共用身份边界；受保护子树随账号和会话重置版本重新创建。 */
export function StudioContent({ children, account, resetVersion }: { children: ReactNode; account: ReturnType<typeof useAccount>; resetVersion: number }) {
  const access = studioAccess(account);
  if (access === 'loading') return <div role="status" className="flex flex-1 items-center justify-center gap-2"><Spinner /><span className="sr-only">Loading account…</span></div>;
  if (access === 'error') return <div className="p-4 md:p-6"><Alert><AlertTitle>Unable to load your account</AlertTitle><AlertDescription>
    <p>Please try again to continue.</p><Button type="button" variant="outline" onClick={() => { void account.refetch(); }}>Retry</Button>
  </AlertDescription></Alert></div>;
  if (access === 'signed-out') return <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon"><UiIcon name="user-round" className="size-6" /></EmptyMedia>
      <EmptyTitle>Sign in to Studio</EmptyTitle>
      <EmptyDescription>Sign in to access your personal workspace.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent><AccountDialog isPending={account.isPending} refetch={account.refetch}><Button type="button">Sign in</Button></AccountDialog></EmptyContent>
  </Empty>;
  return <Fragment key={studioSessionKey(account.user!.id, resetVersion)}>{children}</Fragment>;
}
