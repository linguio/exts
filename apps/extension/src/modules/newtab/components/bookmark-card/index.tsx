import { cva, type VariantProps } from 'class-variance-authority';
import type { MouseEventHandler, ReactElement, ReactNode, Ref } from 'react';

import { BookmarkIcon } from '../bookmark-icon/index';
import type { Bookmark } from '../../types/bookmarks';
import { cn } from '../../../../shared/lib/utils';

// 同一张卡片服务首页 Grid、Dock 和浮层预览，差异集中在 variant 而不是复制组件。
const bookmarkCardVariants = cva(
  'bookmark-card entry-trigger box-border grid justify-items-center gap-2 text-foreground no-underline outline-none',
  {
  variants: {
    variant: {
      grid: 'h-[104px] w-[88px]',
      dock: 'h-16 w-16 flex-none [&_.bookmark-card__name]:hidden',
      preview: 'h-16 w-16 [&_.bookmark-card__name]:hidden',
    },
  },
  defaultVariants: {
    variant: 'grid',
  },
  },
);

interface BookmarkCardProps extends VariantProps<typeof bookmarkCardVariants> {
  bookmark: Bookmark;
  target?: '_self' | '_blank';
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  linkRef?: Ref<HTMLAnchorElement>;
  renderAnchor?: (anchor: ReactElement) => ReactNode;
}

/** 渲染通用书签卡片，由调用方选择打开目标，默认使用新标签页。 */
export function BookmarkCard({ bookmark, target = '_blank', onClick, linkRef, renderAnchor, variant = 'grid' }: BookmarkCardProps) {
  const anchor = (
    <a
      ref={linkRef}
      className={bookmarkCardVariants({ variant })}
      data-variant={variant}
      href={bookmark.url}
      target={target}
      rel="noopener noreferrer"
      aria-label={`在${target === '_self' ? '当前标签页' : '新标签页'}打开 ${bookmark.name}`}
      onClick={onClick}
    >
      <span
        className={cn(
          'bookmark-card__icon entry-surface',
          variant === 'dock' && 'bookmark-card__icon--dock',
          variant === 'preview' && 'bookmark-card__icon--preview',
        )}
      >
        <BookmarkIcon
          icon={bookmark.icon}
          name={bookmark.name}
          size={bookmark.iconSize}
          className="entry-glyph"
        />
      </span>
      <span className="bookmark-card__name max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold leading-5">
        {bookmark.name}
      </span>
    </a>
  );

  return renderAnchor?.(anchor) ?? anchor;
}
