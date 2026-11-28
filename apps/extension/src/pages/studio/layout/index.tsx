import type { CSSProperties, ReactNode } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../../components/ui/breadcrumb';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../../../components/ui/sidebar';
import { cn } from '../../../lib/utils';

interface StudioLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  pageTitle?: string;
  groupTitle?: string;
  fillHeight: boolean;
  scrollContent: boolean;
}

/** Studio 外壳只组合侧栏、顶栏与内容布局，不读取账号或保存导航。 */
export function StudioLayout({ children, sidebar, pageTitle, groupTitle, fillHeight, scrollContent }: StudioLayoutProps) {
  return (
    <SidebarProvider className="h-dvh min-h-0 overflow-hidden" style={{ '--sidebar-width': 'calc(var(--spacing) * 72)', '--header-height': 'calc(var(--spacing) * 12)' } as CSSProperties} onContextMenuCapture={event => event.preventDefault()}>
      {sidebar}
      <SidebarInset className="min-h-0 min-w-0" aria-label="Studio">
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb><BreadcrumbList>
              <BreadcrumbItem>{pageTitle ? 'Studio' : <BreadcrumbPage>Studio</BreadcrumbPage>}</BreadcrumbItem>
              {groupTitle && pageTitle && <><BreadcrumbSeparator /><BreadcrumbItem>{groupTitle}</BreadcrumbItem></>}
              {pageTitle && <><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{pageTitle}</BreadcrumbPage></BreadcrumbItem></>}
            </BreadcrumbList></Breadcrumb>
          </div>
        </header>
        <div className={cn('flex min-h-0 flex-1 flex-col', fillHeight && 'overflow-hidden')}>
          {fillHeight || !scrollContent
            ? children
            : <ScrollArea className="min-h-0 flex-1" viewportClassName="[&>div]:flex [&>div]:min-h-full [&>div]:flex-col">{children}</ScrollArea>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
