import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../components/ui/breadcrumb';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar';
import { cn } from '../../lib/utils';
import { useAccount, readSessionResetVersion, subscribeSessionReset } from '../../features/account/auth-client';
import { resolveStudioRoute } from './menu';
import { studioAccess, studioSessionKey } from './studio-access';
import { StudioContent } from './studio-content';
import { StudioSidebar } from './studio-sidebar';
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
    <SidebarProvider className="h-dvh min-h-0 overflow-hidden" style={{ '--sidebar-width': 'calc(var(--spacing) * 72)', '--header-height': 'calc(var(--spacing) * 12)' } as CSSProperties} onContextMenuCapture={event => event.preventDefault()}>
      <StudioSidebar onHome={onHome} access={access} sessionKey={sessionKey} activeRoute={activeRoute}
        onRouteChange={route => {
          if (!sessionKey || !account.user) return;
          const nextRoute = resolveStudioRoute(route).page.route;
          setSelection({ sessionKey, route: nextRoute });
          void saveStudioRoute(account.user.id, nextRoute).catch(() => toast.error('Unable to save page preference.'));
        }} />
      <SidebarInset className="min-h-0 min-w-0" aria-label="Studio">
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb><BreadcrumbList>
              <BreadcrumbItem>{page ? 'Studio' : <BreadcrumbPage>Studio</BreadcrumbPage>}</BreadcrumbItem>
              {group && page && <><BreadcrumbSeparator /><BreadcrumbItem>{group.title}</BreadcrumbItem></>}
              {page && <><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{page.title}</BreadcrumbPage></BreadcrumbItem></>}
            </BreadcrumbList></Breadcrumb>
          </div>
        </header>
        <div className={cn('flex min-h-0 flex-1 flex-col', fillHeightPage && 'overflow-hidden')}>
          {fillHeightPage || access === 'signed-out'
            ? pageBody
            : <ScrollArea className="min-h-0 flex-1" viewportClassName="[&>div]:flex [&>div]:min-h-full [&>div]:flex-col">{pageBody}</ScrollArea>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
