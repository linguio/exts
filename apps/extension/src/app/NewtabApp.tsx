import { Activity, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import 'sonner/dist/styles.css';

import { BOOKMARK_GRID, DOCK_FAVORITES } from '../modules/newtab/constants/bookmarks';
import { BookmarkDock } from '../modules/newtab/views/dock/bookmark-dock';
import { BookmarkGrid } from '../modules/newtab/views/bookmarks/bookmark-grid';
import { NewtabCards } from '../modules/newtab/views/cards/index';
import { ScrollArea, ScrollBar } from '../shared/ui/scroll-area';
import { TooltipProvider } from '../shared/ui/tooltip';
import { openBookmarkInGroup } from '../modules/newtab/utils/tab.js';
import type { OpenBookmark } from '../modules/newtab/types/bookmarks';
import { Studio } from '../modules/studio';
import { subscribeTheme } from '../shared/theme/runtime';
import { Toaster } from '../shared/ui/sonner';

import './newtab.css';

const readAppearance = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/** 首页保留自身状态与布局测量，隐藏时由 Activity 暂停观察，显示后重新测量。 */
function NewtabHome() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bookmarksRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement>(null);
  const [contentWidth, setContentWidth] = useState<number>();

  useLayoutEffect(() => {
    const viewport = viewportRef.current!;
    const content = contentRef.current!;
    const bookmarks = bookmarksRef.current!;
    const cards = cardsRef.current!;

    function updateWidth() {
      const availableWidth = viewport.getBoundingClientRect().width;
      const regionGap = parseFloat(getComputedStyle(content).columnGap);
      const bookmarkGap = parseFloat(getComputedStyle(bookmarks).columnGap);
      const cardsWidth = cards.getBoundingClientRect().width;
      const availableBookmarksWidth = Math.max(0, availableWidth - cardsWidth - regionGap);
      let rowWidth = 0;
      let widestRow = 0;

      // 按实际项目宽度模拟换行，只保留最宽一行所需空间，不保留空列。
      for (const item of bookmarks.children) {
        const itemWidth = item.getBoundingClientRect().width;
        const nextWidth = rowWidth === 0 ? itemWidth : rowWidth + bookmarkGap + itemWidth;
        if (rowWidth > 0 && nextWidth > availableBookmarksWidth) {
          widestRow = Math.max(widestRow, rowWidth);
          rowWidth = itemWidth;
        } else {
          rowWidth = nextWidth;
        }
      }

      const bookmarksWidth = Math.min(availableBookmarksWidth, Math.max(widestRow, rowWidth));
      setContentWidth(Math.min(availableWidth, bookmarksWidth + regionGap + cardsWidth));
    }

    updateWidth();
    // 监听未收缩的外层，避免居中后的宽度反过来影响下一次列数计算。
    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const onOpenBookmark: OpenBookmark = (folder, bookmark) => {
    void openBookmarkInGroup(window.chrome, folder, bookmark);
  };

  return (
    <div className="newtab-content-viewport" ref={viewportRef}>
      <div className="newtab-content" ref={contentRef} style={{ width: contentWidth }}>
        <section className="newtab-scroll-area" aria-label="常用书签">
          <ScrollArea className="size-full" viewportClassName="overscroll-contain">
            <div className="bookmarks newtab-bookmarks" ref={bookmarksRef} data-bookmarks>
              <BookmarkGrid bookmarks={BOOKMARK_GRID} onOpenBookmark={onOpenBookmark} />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
        <aside className="newtab-scroll-area" ref={cardsRef} aria-label="卡片区域">
          <ScrollArea className="size-full" viewportClassName="overscroll-contain">
            <NewtabCards />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

/** 页面组合只管理主视图切换，Dock 与抽屉不随主视图隐藏。 */
export function App() {
  const [studioActive, setStudioActive] = useState(false);
  const appearance = useSyncExternalStore(subscribeTheme, readAppearance);

  return (
    <TooltipProvider>
      <main className="bookmarks-page newtab-page">
        <div className="grid min-h-0 min-w-0 overflow-hidden">
          <Activity mode={studioActive ? 'hidden' : 'visible'}>
            <NewtabHome />
          </Activity>
          <Activity mode={studioActive ? 'visible' : 'hidden'}>
            <Studio />
          </Activity>
        </div>
        <div className="flex min-w-0 justify-center" data-bookmark-dock>
          <BookmarkDock
            favorites={DOCK_FAVORITES}
            studioActive={studioActive}
            onStudioChange={setStudioActive}
          />
        </div>
      </main>
      <Toaster theme={appearance} />
    </TooltipProvider>
  );
}
