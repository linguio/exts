import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { Download, Ellipsis, FolderOpen, Save } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../../shared/ui/dropdown-menu';
import { Button } from '../../../../../shared/ui/button';
import { ButtonGroup } from '../../../../../shared/ui/button-group';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../shared/ui/popover';
import { Toaster, toast } from '../../../../../shared/ui/sonner';
import styles from './style.css?inline';
import type { DownloadMenuController } from '../../download/save-media';
import { resolveTheme, type ThemePreference } from '../../../../../shared/theme/preference';

/** 菜单和完成提示隔离在同一 Shadow DOM，业务提示只在保存成功后触发。 */
export function createDownloadMenu(document: Document, actions: {
  save(): void;
  saveAs(): void;
  chooseDirectory(): void;
  directoryAvailable: boolean;
}) {
  const host = document.createElement('exts-telegram-download');
  host.style.cssText = 'all:initial;position:fixed;inset:0;pointer-events:none;z-index:2147483647';
  const shadow = host.attachShadow({ mode: 'open' });
  const sheet = document.createElement('style');
  const mount = document.createElement('div');
  shadow.append(sheet, mount);
  (document.body ?? document.documentElement).append(host);
  const root = createRoot(mount);
  let open = false;
  let busy = false;
  let moreOpen = false;
  let x = 0;
  let y = 0;
  let directoryReady = false;
  let message = '';
  let preference: ThemePreference = 'system';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const applyTheme = () => { host.dataset.theme = resolveTheme(preference, media.matches); };
  sheet.textContent = styles.replace(/:root(\[[^\]]+\])?/g, (_selector, attributes: string | undefined) => attributes ? `:host(${attributes})` : ':host');

  const run = (action: () => void) => {
    if (busy || !directoryReady) return;
    busy = true;
    open = false;
    moreOpen = false;
    message = '';
    // 先在原始点击栈调用系统选择器，再卸载菜单，避免关闭与焦点恢复抢在操作前执行。
    try { action(); }
    finally { render(); }
  };
  const render = () => flushSync(() => root.render(<>
    <Popover open={open} onOpenChange={value => { open = value; if (!value) moreOpen = false; render(); }}>
      <PopoverTrigger asChild><button aria-label="Telegram Download" tabIndex={-1} style={{ position: 'fixed', left: x, top: y, width: 0, height: 0, padding: 0, border: 0, opacity: 0 }} /></PopoverTrigger>
      <PopoverContent portalContainer={mount} sideOffset={0} align="start" collisionPadding={8} className="pointer-events-auto w-max border-0 bg-transparent p-0 shadow-none" aria-label="Telegram 下载操作" onCloseAutoFocus={event => event.preventDefault()}
        onInteractOutside={event => { if (event.detail.originalEvent.composedPath().includes(host)) event.preventDefault(); }}>
        {message && <div role="status" className="max-w-72 px-2 py-1.5 text-xs break-words text-muted-foreground">{message}</div>}
        <ButtonGroup aria-label="下载操作">
          <Button type="button" variant="outline" className="border-solid border-border" disabled={busy || !directoryReady} onClick={() => run(actions.save)}><Download className="size-4" />下载资源</Button>
          <DropdownMenu open={moreOpen} modal={false} onOpenChange={value => { moreOpen = value; render(); }}>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="border-solid border-border" aria-label="更多下载操作" disabled={busy || !directoryReady}><Ellipsis className="size-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent portalContainer={mount} align="end" sideOffset={4} className="pointer-events-auto" onCloseAutoFocus={event => event.preventDefault()}
              onPointerDownOutside={event => { if (event.detail.originalEvent.composedPath().includes(host)) event.preventDefault(); }}
              onFocusOutside={event => { if (event.detail.originalEvent.composedPath().includes(host)) event.preventDefault(); }}>
              <DropdownMenuItem disabled={busy || !directoryReady} onClick={() => run(actions.saveAs)}><Save className="size-4" />文件另存为</DropdownMenuItem>
              <DropdownMenuItem disabled={busy || !directoryReady || !actions.directoryAvailable} onClick={() => run(actions.chooseDirectory)}><FolderOpen className="size-4" />选择文件夹</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </PopoverContent>
    </Popover>
    <Toaster id="tg-download" theme={resolveTheme(preference, media.matches)} className="toaster group pointer-events-auto" />
  </>));
  const close = () => { open = false; moreOpen = false; busy = false; render(); };
  applyTheme();
  render();
  media.addEventListener('change', () => { applyTheme(); render(); });
  const controller: DownloadMenuController & {
    open(point: { x: number; y: number }): void;
    busy(): boolean;
    disable(): void;
    theme(value: ThemePreference): void;
    ready(warning?: string): void;
    problem(message: string): void;
  } = {
    open(point) { x = point.x; y = point.y; open = true; moreOpen = false; render(); },
    close,
    busy: () => busy,
    disable: close,
    theme(value) { preference = value; applyTheme(); render(); },
    ready(warning = '') { directoryReady = true; message = warning; render(); },
    problem(value) { message = value; busy = false; open = true; render(); },
    completed() { toast.success('下载完成', { toasterId: 'tg-download' }); },
  };
  return controller;
}
