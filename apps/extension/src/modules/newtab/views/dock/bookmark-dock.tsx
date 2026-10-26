import { BookmarkCard } from '../../components/bookmark-card/index';
import { ScrollArea, ScrollBar } from '../../../../shared/ui/scroll-area';
import { Separator } from '../../../../shared/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import type { Bookmark } from '../../types/bookmarks';
import { StudioDockEntry } from '../../../studio/dock-entry';
import { DockActions } from './dock-actions';
import { DockDownload } from './dock-download';
import { DockSettings } from './dock-settings';

interface BookmarkDockProps {
  favorites: Bookmark[];
  studioActive: boolean;
  onStudioChange: (active: boolean) => void;
}

/** React Dock，保持直接收藏、分隔线与工具菜单的固定分区结构。 */
export function BookmarkDock({ favorites, studioActive, onStudioChange }: BookmarkDockProps) {
  return (
    <nav className="bookmark-dock box-border min-w-0 w-max max-w-full rounded-[var(--radius)] border border-border bg-surface-raised shadow-[var(--shadow-hover)]" aria-label="Dock">
      <ScrollArea className="min-w-0 max-w-full" viewportClassName="overscroll-x-contain">
        <div className="flex w-max items-center p-2">
          <div className="bookmark-dock__favorites flex shrink-0 flex-nowrap gap-2">
            {favorites.map((bookmark) => (
              <Tooltip key={bookmark.id}>
                <BookmarkCard
                  bookmark={bookmark}
                  variant="dock"
                  target="_self"
                  renderAnchor={(anchor) => <TooltipTrigger asChild>{anchor}</TooltipTrigger>}
                />
                <TooltipContent side="top" align="center" sideOffset={12}>{bookmark.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-12" aria-hidden="true" />
          <div className="bookmark-dock__tools flex shrink-0 flex-nowrap gap-2">
            <div className="bookmark-dock__group relative flex">
              <StudioDockEntry active={studioActive} onActiveChange={onStudioChange} />
            </div>
            <DockActions />
            <DockDownload />
            <DockSettings />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </nav>
  );
}
