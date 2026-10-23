import { useLayoutEffect, useRef, useState } from 'react';

import { BOOKMARK_GRID, DOCK_COMPONENTS, DOCK_FAVORITES } from '../modules/newtab/constants/bookmarks';
import { BookmarkDock } from '../modules/newtab/views/dock/bookmark-dock';
import { BookmarkGrid } from '../modules/newtab/views/bookmarks/bookmark-grid';
import { NewtabCards } from '../modules/newtab/views/cards/index';
import { TooltipProvider } from '../shared/ui/tooltip';
import { openBookmarkInGroup } from '../modules/newtab/utils/tab.js';
import type { Bookmark, BookmarkCollection } from '../modules/newtab/types/bookmarks';

import './newtab.css';

/** 页面级组合入口：业务数据由 constants 提供，交互由下层视图组件负责。 */
export function App() {
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

  const onOpenBookmark = (folder: BookmarkCollection, bookmark: Bookmark) => {
    void openBookmarkInGroup(window.chrome, folder, bookmark);
  };

  return (
    <TooltipProvider>
      <main className="bookmarks-page newtab-page">
        <div className="newtab-content-viewport" ref={viewportRef}>
          <div className="newtab-content" ref={contentRef} style={{ width: contentWidth }}>
            <section className="newtab-scroll-area overflow-auto overscroll-contain" aria-label="常用书签">
              <div className="bookmarks newtab-bookmarks" ref={bookmarksRef} data-bookmarks>
                <BookmarkGrid bookmarks={BOOKMARK_GRID} onOpenBookmark={onOpenBookmark} />
              </div>
            </section>
            <aside className="newtab-scroll-area overflow-auto overscroll-contain" ref={cardsRef} aria-label="卡片区域">
              <NewtabCards />
            </aside>
          </div>
        </div>
        <div className="flex min-w-0 justify-center" data-bookmark-dock>
          <BookmarkDock
            favorites={DOCK_FAVORITES}
            components={DOCK_COMPONENTS}
            onOpenBookmark={onOpenBookmark}
          />
        </div>
      </main>
    </TooltipProvider>
  );
}
