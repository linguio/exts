import { useEffect, useState, useSyncExternalStore } from 'react';
import { useAccount, readSessionResetVersion, subscribeSessionReset } from '../../features/account/auth-client';
import { resolveStudioRoute } from './routes';
import { studioAccess, studioSessionKey } from './studio-access';
import { StudioContent } from './layout/content';
import { StudioSidebar } from './layout/sidebar';
import { StudioLayout } from './layout';
import { LoginPage } from '../login';
import { saveStudioRoute, readStudioRoute } from '../../app/view-preference';
import { toast } from '../../components/ui/sonner';

interface StudioProps { onHome: () => void }

/** 菜单与内容共享账号边界，页面只能由当前会话的用户操作选中。 */
export function Studio({ onHome }: StudioProps) {
  const account = useAccount();
  const resetVersion = useSyncExternalStore(subscribeSessionReset, readSessionResetVersion);
  const access = studioAccess(account);
  const sessionKey = access === 'ready' ? studioSessionKey(account.user!.id, resetVersion) : null;
  const [selection, setSelection] = useState<{ sessionKey: string; route: string } | null>(null);
  useEffect(() => {
    if (!sessionKey || !account.user) return;
    let active = true;
    void readStudioRoute(account.user.id).then(route => {
      if (active) setSelection({ sessionKey, route: resolveStudioRoute(route).page.route });
    }).catch(() => {
      if (active) setSelection({ sessionKey, route: resolveStudioRoute(null).page.route });
    });
    return () => { active = false; };
  }, [sessionKey, account.user]);
  const activeRoute = sessionKey && selection?.sessionKey === sessionKey ? selection.route : null;
  const resolved = access === 'ready' ? resolveStudioRoute(activeRoute) : null;
  const page = resolved?.page;
  const group = resolved?.group;
  const Page = page?.component;
  const fillHeightPage = page?.fillHeight === true;
  const pageBody = access === 'signed-out'
    ? <LoginPage isPending={account.isPending} onRefetch={account.refetch} />
    : (
    <StudioContent account={account} resetVersion={resetVersion}>
      {Page ? <Page /> : null}
    </StudioContent>
  );
  return (
    <StudioLayout pageTitle={page?.title} groupTitle={group?.title} fillHeight={fillHeightPage}
      scrollContent={access !== 'signed-out'} sidebar={
      <StudioSidebar onHome={onHome} access={access} sessionKey={sessionKey} activeRoute={activeRoute}
        onRouteChange={route => {
          if (!sessionKey || !account.user) return;
          const nextRoute = resolveStudioRoute(route).page.route;
          setSelection({ sessionKey, route: nextRoute });
          void saveStudioRoute(account.user.id, nextRoute).catch(() => toast.error('Unable to save page preference.'));
        }} />
    }>
      {pageBody}
    </StudioLayout>
  );
}
