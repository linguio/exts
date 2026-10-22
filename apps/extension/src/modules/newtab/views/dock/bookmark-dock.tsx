import { BookmarkCard } from '../../components/bookmark-card/index';
import { Separator } from '../../../../shared/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import type { Bookmark, BookmarkGroup, OpenBookmark } from '../../types/bookmarks';
import { DockToolMenu } from './dock-tool-menu';
import { DockSettings } from './dock-settings';

interface BookmarkDockProps {
  favorites: Bookmark[];
  components: BookmarkGroup;
  devtools?: BookmarkGroup;
  onOpenBookmark?: OpenBookmark;
}

/** React Dock，保持直接收藏、分隔线与工具菜单的固定分区结构。 */
export function BookmarkDock({ favorites, components, devtools, onOpenBookmark }: BookmarkDockProps) {
  // 没有 DevTools 配置时不渲染空入口，保持 Dock 的固定分区结构。
  const groups = devtools ? [components, devtools] : [components];

  return (
    <nav className="bookmark-dock box-border min-w-0 w-max max-w-full rounded-[var(--radius)] border border-border bg-surface-raised shadow-[var(--shadow-hover)]" aria-label="固定书签">
      <div className="newtab-scroll-area flex items-center overflow-x-auto overscroll-x-contain p-2">
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
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-16" aria-hidden="true" />
        <div className="bookmark-dock__tools flex shrink-0 flex-nowrap gap-2">
          {groups.map((group) => (
            <div key={group.id} className="bookmark-dock__group relative flex">
              <DockToolMenu group={group} onOpenBookmark={onOpenBookmark} />
            </div>
          ))}
          <DockSettings />
        </div>
      </div>
    </nav>
  );
}
