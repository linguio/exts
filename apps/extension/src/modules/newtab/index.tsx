import { useLayoutEffect, useRef, useState } from 'react';

import { BOOKMARK_GRID } from './constants/bookmarks';
import { BookmarkGrid } from './views/bookmarks/bookmark-grid';
import { NewtabCards } from './views/cards/index';
import { ScrollArea, ScrollBar } from '../../shared/ui/scroll-area';
import { openBookmarkInGroup } from './utils/bookmarks/tab.js';
import type { OpenBookmark } from './types/bookmarks';

/** 首页保留自身状态与布局测量，隐藏时由 Activity 暂停观察，显示后重新测量。 */
export function NewtabHome() {
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

