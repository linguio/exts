import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '../../components/ui/breadcrumb';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../components/ui/empty';
import { Separator } from '../../components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar';
import { UiIcon } from '../../components/custom/ui-icon';
import { StudioSidebar } from './studio-sidebar';


interface StudioProps {
  onHome: () => void;
}

/** 工作台使用官方侧栏框架并复用共享 Account 界面，不阻止访客进入。 */
export function Studio({ onHome }: StudioProps) {
  return (
    <SidebarProvider className="h-dvh min-h-0 overflow-hidden">
      <StudioSidebar onHome={onHome} />
      <SidebarInset className="min-h-0 min-w-0" aria-label="Studio">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbPage>Studio</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><UiIcon name="panels-top-left" className="size-6" /></EmptyMedia>
            <EmptyTitle>No content yet</EmptyTitle>
            <EmptyDescription>There is nothing to display yet.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </SidebarInset>
    </SidebarProvider>
  );
}
