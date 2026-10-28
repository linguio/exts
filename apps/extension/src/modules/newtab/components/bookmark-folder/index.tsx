import { useEffect, useRef, useState, type AnimationEvent } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

import type { BookmarkFolder as BookmarkFolderData, OpenBookmark } from '../../types/bookmarks';
import { cn } from '../../../../shared/lib/utils';
import { BookmarkCard } from '../../../../shared/bookmarks/bookmark-card';
import { Button } from '../../../../shared/ui/button';
import { UiIcon } from '../../../../shared/ui/ui-icon';
import { ScrollArea } from '../../../../shared/ui/scroll-area';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../../../shared/ui/input-otp';
import { canUnlockEdu } from '../../utils/bookmarks/folder-access';

interface BookmarkFolderProps {
  folder: BookmarkFolderData;
  onOpenBookmark?: OpenBookmark;
}

/** 渲染以紧凑图标预览呈现的书签文件夹。 */
export function BookmarkFolder({ folder, onOpenBookmark }: BookmarkFolderProps) {
  const [phase, setPhase] = useState<'locked' | 'revealing' | 'unlocked'>(folder.blur === true ? 'locked' : 'unlocked');
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const shouldFocusFolderRef = useRef(false);
  const shouldFocusLockRef = useRef(false);
  const lockButtonRef = useRef<HTMLButtonElement>(null);
  const folderRef = useRef<HTMLElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isBlurred = phase !== 'unlocked';
  const isPrivateFolder = folder.id === 'edu';

  useEffect(() => {
    if (phase === 'unlocked' && shouldFocusFolderRef.current) {
      shouldFocusFolderRef.current = false;
      folderRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  useEffect(() => {
    if (!pinOpen && shouldFocusLockRef.current) {
      shouldFocusLockRef.current = false;
      lockButtonRef.current?.focus();
    }
  }, [pinOpen]);

  useEffect(() => {
    if (!pinOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (folderRef.current?.contains(event.target as Node)) return;
      setPinOpen(false);
      setPin('');
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [pinOpen]);

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

  function reveal() {
    if (phase !== 'locked') return;
    shouldFocusFolderRef.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('unlocked');
      return;
    }
    setPhase('revealing');
  }

  function completeReveal(event: AnimationEvent<HTMLButtonElement>) {
    if (event.target === event.currentTarget && event.animationName === 'bookmark-folder-reveal') {
      setPhase('unlocked');
    }
  }

  function closePin() {
    shouldFocusLockRef.current = true;
    setPinOpen(false);
    setPin('');
  }

  function completePin(value: string) {
    if (!canUnlockEdu(value)) {
      setPin('');
      return;
    }
    setPinOpen(false);
    setPin('');
    reveal();
  }

  const preview = (
    <div ref={previewRef} inert={isBlurred} aria-hidden={isBlurred} className="grid grid-cols-[repeat(2,var(--size-icon-tile))] gap-4 p-4">
      {folder.items.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id ?? `${folder.name}-${bookmark.name}`}
          bookmark={bookmark}
          variant="preview"
          onClick={(event) => {
            // 保留链接语义，但由扩展创建标签以便将其加入对应分组。
            event.preventDefault();
            if (isBlurred) return;
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

  const revealButton = folder.blur === true ? (
    <Button
      ref={lockButtonRef}
      type="button"
      variant="ghost"
      className={cn(
        'bookmark-folder__blur blur-overlay entry-trigger group absolute inset-0 z-[1] grid h-auto w-auto cursor-pointer place-items-center rounded-[var(--radius)] border-0 p-0 text-inherit hover:bg-overlay focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-100',
        (!isBlurred || pinOpen) && 'hidden',
      )}
      data-revealing={phase === 'revealing' ? 'true' : undefined}
      aria-label={isPrivateFolder ? '输入四位验证码解锁 EDU 书签' : `点击显示 ${folder.name} 书签`}
      disabled={phase !== 'locked'}
      onClick={isPrivateFolder ? () => setPinOpen(true) : reveal}
      onAnimationEnd={completeReveal}
    >
      <span className="relative grid size-7 place-items-center">
        <UiIcon name={isPrivateFolder ? 'lock' : 'eye-off'} className="bookmark-folder__icon-closed absolute size-7 entry-glyph entry-glyph--lift" />
        <UiIcon name={isPrivateFolder ? 'lock-open' : 'eye'} className="bookmark-folder__icon-open absolute size-7 entry-glyph entry-glyph--lift" />
      </span>
    </Button>
  ) : null;

  return (
    <section
      ref={folderRef}
      tabIndex={-1}
      className={cn(
        'bookmark-folder grid justify-self-start self-start gap-3 focus:outline-none',
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
        {revealButton}
        {isPrivateFolder && pinOpen ? (
          <div
            className="bookmark-folder__pin blur-overlay absolute inset-0 z-[2] grid place-items-center rounded-[var(--radius)] p-4"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault();
                closePin();
              }
            }}
          >
            <InputOTP
              maxLength={4}
              pattern={REGEXP_ONLY_DIGITS}
              type="password"
              value={pin}
              onChange={setPin}
              onComplete={completePin}
              containerClassName="flex-col justify-center gap-4"
              aria-label="EDU 四位密码"
              autoFocus
            >
              <InputOTPGroup className="gap-4">
                <InputOTPSlot index={0} masked className="size-16" />
                <InputOTPSlot index={1} masked className="size-16" />
              </InputOTPGroup>
              <InputOTPGroup className="gap-4">
                <InputOTPSlot index={2} masked className="size-16" />
                <InputOTPSlot index={3} masked className="size-16" />
              </InputOTPGroup>
            </InputOTP>
          </div>
        ) : null}
      </div>
      <span className="bookmark-folder__name max-w-full justify-self-center overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold leading-5">
        {folder.name}
      </span>
    </section>
  );
}
