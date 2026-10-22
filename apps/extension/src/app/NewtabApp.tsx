import { BOOKMARK_GRID, DOCK_COMPONENTS, DOCK_DEVTOOLS, DOCK_FAVORITES } from '../modules/newtab/constants/bookmarks';
import { BookmarkDock } from '../modules/newtab/views/dock/bookmark-dock';
import { BookmarkGrid } from '../modules/newtab/views/bookmarks/bookmark-grid';
import { NewtabCards } from '../modules/newtab/views/cards/index';
import { TooltipProvider } from '../shared/ui/tooltip';
import { openBookmarkInGroup } from '../modules/newtab/utils/tab.js';
import type { Bookmark, BookmarkCollection } from '../modules/newtab/types/bookmarks';

import './newtab.css';

/** 页面级组合入口：业务数据由 constants 提供，交互由下层视图组件负责。 */
export function App() {
  const onOpenBookmark = (folder: BookmarkCollection, bookmark: Bookmark) => {
    void openBookmarkInGroup(window.chrome, folder, bookmark);
  };

  return (
    <TooltipProvider>
      <main className="bookmarks-page newtab-page">
        <div className="newtab-content">
          <section className="newtab-scroll-area overflow-auto overscroll-contain" aria-label="常用书签">
            <div className="bookmarks flex flex-wrap items-start content-start gap-6" data-bookmarks>
              <BookmarkGrid bookmarks={BOOKMARK_GRID} onOpenBookmark={onOpenBookmark} />
            </div>
          </section>
          <aside className="newtab-scroll-area overflow-auto overscroll-contain" aria-label="卡片区域">
            <NewtabCards />
          </aside>
        </div>
        <div className="flex min-w-0 justify-center" data-bookmark-dock>
          <BookmarkDock
            favorites={DOCK_FAVORITES}
            components={DOCK_COMPONENTS}
            devtools={DOCK_DEVTOOLS}
            onOpenBookmark={onOpenBookmark}
          />
        </div>
      </main>
    </TooltipProvider>
  );
}
