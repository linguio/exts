import { useEffect, useRef, useState, type MouseEvent } from 'react';

import type { BookmarkFolder as BookmarkFolderData, OpenBookmark } from '../../types/bookmarks';
import { cn } from '../../../../shared/lib/utils';
import { BookmarkCard } from '../bookmark-card/index';
import { Button } from '../../../../shared/ui/button';
import { UiIcon } from '../../../../shared/ui/ui-icon';
import { ScrollArea } from '../../../../shared/ui/scroll-area';

interface BookmarkFolderProps {
  folder: BookmarkFolderData;
  onOpenBookmark?: OpenBookmark;
}

/** 渲染以紧凑图标预览呈现的书签文件夹。 */
export function BookmarkFolder({ folder, onOpenBookmark }: BookmarkFolderProps) {
  const [isBlurred, setIsBlurred] = useState(folder.blur === true);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const firstBookmarkRef = useRef<HTMLAnchorElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!folder.scrollable) return;
    const viewport = scrollAreaRef.current?.querySelector<HTMLDivElement>('[data-slot="scroll-area-viewport"]');
    const content = previewRef.current;
    if (!viewport || !content) return;

    const updateScrollHint = () => {
      // 滚动偏移可包含小数，保留一像素容差，避免到边界后仍显示对应提示。
      setCanScrollUp(viewport.scrollHeight - viewport.clientHeight > 1 && viewport.scrollTop > 1);
      setCanScrollDown(viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop > 1);
    };

    updateScrollHint();
    viewport.addEventListener('scroll', updateScrollHint, { passive: true });
    const observer = new ResizeObserver(updateScrollHint);
    observer.observe(viewport);
    observer.observe(content);
    return () => {
      viewport.removeEventListener('scroll', updateScrollHint);
      observer.disconnect();
    };
  }, [folder.scrollable, folder.items.length]);

  function reveal(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsBlurred(false);
    firstBookmarkRef.current?.focus();
  }

  const preview = (
    <div ref={previewRef} className="grid grid-cols-[repeat(2,var(--size-icon-tile))] gap-4 p-4">
      {folder.items.map((bookmark, index) => (
        <BookmarkCard
          key={bookmark.id ?? `${folder.name}-${bookmark.name}`}
          bookmark={bookmark}
          variant="preview"
          linkRef={index === 0 ? firstBookmarkRef : undefined}
          onClick={(event) => {
            // 保留链接语义，但由扩展创建标签以便将其加入对应分组。
            event.preventDefault();
            onOpenBookmark?.(folder, bookmark);
          }}
        />
      ))}
      {Array.from({ length: Math.max(0, 4 - folder.items.length) }, (_, index) => (
        <span
          key={`placeholder-${index}`}
          className="bookmark-folder__placeholder box-border h-16 w-16"
          aria-hidden="true"
        />
      ))}
    </div>
  );

  return (
    <section
      className={cn(
        'bookmark-folder grid justify-self-start self-start gap-3',
        isBlurred && 'bookmark-folder--blurred',
      )}
      aria-label={folder.name}
    >
      <div className={cn(
        'bookmark-folder__preview relative box-border w-[var(--size-bookmark-folder)] rounded-[var(--radius)] border border-border bg-card',
        folder.scrollable && 'h-[var(--size-bookmark-folder)]',
      )}>
        {folder.scrollable ? (
          <>
            <ScrollArea
              ref={scrollAreaRef}
              className="h-full rounded-[inherit] [&>[data-slot=scroll-area-scrollbar]]:hidden"
              viewportClassName="overscroll-y-contain"
            >
              {preview}
            </ScrollArea>
            {!isBlurred && canScrollUp ? (
              <div aria-hidden="true" data-edge="top" className="bookmark-folder__scroll-hint pointer-events-none absolute inset-x-0 top-0 flex h-4 items-center justify-center rounded-t-[calc(var(--radius)-1px)] text-muted-foreground">
                <UiIcon name="chevron-up" className="relative size-3" />
              </div>
            ) : null}
            {!isBlurred && canScrollDown ? (
              <div aria-hidden="true" data-edge="bottom" className="bookmark-folder__scroll-hint pointer-events-none absolute inset-x-0 bottom-0 flex h-4 items-center justify-center rounded-b-[calc(var(--radius)-1px)] text-muted-foreground">
                <UiIcon name="chevron-down" className="relative size-3" />
              </div>
            ) : null}
          </>
        ) : preview}
        {folder.blur === true ? (
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'bookmark-folder__blur blur-overlay entry-trigger group absolute inset-0 z-[1] grid h-auto w-auto cursor-pointer place-items-center rounded-[var(--radius)] border-0 p-0 text-inherit hover:bg-overlay focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
              !isBlurred && 'bookmark-folder__blur--hidden hidden',
            )}
            aria-label={`点击显示 ${folder.name} 书签`}
            onClick={reveal}
          >
            <UiIcon
              name="lock"
              className="h-7 w-7 entry-glyph entry-glyph--lift group-hover:hidden"
            />
            <UiIcon
              name="lock-open"
              className="hidden h-7 w-7 entry-glyph entry-glyph--lift group-hover:block"
            />
          </Button>
        ) : null}
      </div>
      <span className="bookmark-folder__name max-w-full justify-self-center overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold leading-5">
        {folder.name}
      </span>
    </section>
  );
}
