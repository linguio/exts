import { useState, useSyncExternalStore, type CSSProperties } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../components/ui/breadcrumb';
import { Separator } from '../../components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../components/ui/empty';
import { UiIcon } from '../../components/custom/ui-icon';
import { useAccount, readSessionResetVersion, subscribeSessionReset } from '../../features/account/auth-client';
import { studioMenu, type StudioPageId } from './menu';
import { selectedStudioPage, studioAccess, studioSessionKey } from './studio-access';
import { StudioContent } from './studio-content';
import { StudioSidebar } from './studio-sidebar';

interface StudioProps { onHome: () => void }

/** 菜单与内容共享账号边界，页面只能由当前会话的用户操作选中。 */
export function Studio({ onHome }: StudioProps) {
  const account = useAccount();
  const resetVersion = useSyncExternalStore(subscribeSessionReset, readSessionResetVersion);
  const access = studioAccess(account);
  const sessionKey = access === 'ready' ? studioSessionKey(account.user!.id, resetVersion) : null;
  const [selection, setSelection] = useState<{ sessionKey: string; page: StudioPageId } | null>(null);
  const activePage = selectedStudioPage(selection, sessionKey);
  const group = studioMenu.find(group => group.items.some(page => page.id === activePage));
  const page = group?.items.find(page => page.id === activePage);
  const Page = page?.component;
  return (
    <SidebarProvider className="h-dvh min-h-0 overflow-hidden" style={{ '--sidebar-width': 'calc(var(--spacing) * 72)', '--header-height': 'calc(var(--spacing) * 12)' } as CSSProperties}>
      <StudioSidebar onHome={onHome} access={access} sessionKey={sessionKey} activePage={activePage}
        onPageChange={page => { if (sessionKey) setSelection({ sessionKey, page }); }} />
      <SidebarInset className="min-h-0 min-w-0" aria-label="Studio">
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb><BreadcrumbList>
              <BreadcrumbItem>{page ? 'Studio' : <BreadcrumbPage>Studio</BreadcrumbPage>}</BreadcrumbItem>
              {group && page && <><BreadcrumbSeparator /><BreadcrumbItem>{group.title}</BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{page.title}</BreadcrumbPage></BreadcrumbItem></>}
            </BreadcrumbList></Breadcrumb>
          </div>
        </header>
        <StudioContent account={account} resetVersion={resetVersion}>
          {Page ? <Page /> : <Empty><EmptyHeader><EmptyMedia variant="icon"><UiIcon name="panels-top-left" className="size-6" /></EmptyMedia><EmptyTitle>Select a page</EmptyTitle><EmptyDescription>Choose a page from the sidebar to get started.</EmptyDescription></EmptyHeader></Empty>}
        </StudioContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
