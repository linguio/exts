import { BookmarkCard } from '../../features/bookmarks/bookmark-card';
import { ScrollArea, ScrollBar } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import type { Bookmark } from '../../features/bookmarks/bookmark';
import { StudioDockEntry } from './studio-entry';
import { ActionsEntry } from './actions-entry';
import { AccountEntry } from './account-entry';
import { DownloadEntry } from './download-entry';
import { SettingsEntry } from './settings-entry';

interface DockProps {
  favorites: Bookmark[];
  onOpenStudio: () => void;
}

/** 常驻 Dock 组合收藏、模块入口与工具菜单，具体业务由所属模块持有。 */
export function Dock({ favorites, onOpenStudio }: DockProps) {
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
              <StudioDockEntry onOpen={onOpenStudio} />
            </div>
            <ActionsEntry />
            <DownloadEntry />
            <AccountEntry />
            <SettingsEntry />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </nav>
  );
}
