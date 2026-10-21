import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { Download, LoaderCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../shared/ui/dropdown-menu';
import styles from './menu.css?inline';
import type { DownloadMenuController } from './download-media';
import { resolveTheme, type ThemePreference } from '../../shared/theme/preference';

/** 复用扩展主题与官方菜单，通过 Shadow DOM 隔离 Telegram 自身的样式。 */
export function createDownloadMenu(document: Document, onSave: () => void) {
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
  let label = '下载资源';
  let notice = '';
  let timer: ReturnType<typeof setTimeout> | undefined;
  let x = 0;
  let y = 0;
  let preference: ThemePreference = 'system';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const applyTheme = () => { host.dataset.theme = resolveTheme(preference, media.matches); };
  applyTheme();
  media.addEventListener('change', applyTheme);
  sheet.textContent = styles.replaceAll(':root', ':host');

  const render = () => flushSync(() => root.render(<>
    <DropdownMenu open={open} modal={false} onOpenChange={value => { open = value; render(); }}>
      <DropdownMenuTrigger asChild><button aria-label="Telegram Download" tabIndex={-1} style={{ position: 'fixed', left: x, top: y, width: 0, height: 0, padding: 0, border: 0, opacity: 0 }} /></DropdownMenuTrigger>
      <DropdownMenuContent portalContainer={mount} sideOffset={0} align="start" className="pointer-events-auto" onCloseAutoFocus={event => event.preventDefault()}
        onPointerDownOutside={event => { if (event.detail.originalEvent.composedPath().includes(host)) event.preventDefault(); }}
        onFocusOutside={event => { if (event.detail.originalEvent.composedPath().includes(host)) event.preventDefault(); }}>
        <DropdownMenuItem disabled={busy} onSelect={event => { event.preventDefault(); onSave(); }}>
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}{label}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {notice && <div role="status" className="pointer-events-none fixed right-6 top-6 max-w-[360px] rounded-md border border-border bg-popover px-3 py-2 font-sans text-sm text-popover-foreground shadow-[var(--shadow-floating)]">{notice}</div>}
  </>));
  const close = () => { open = false; render(); };
  const controller: DownloadMenuController & {
    open(point: { x: number; y: number }): void;
    busy(): boolean;
    disable(): void;
    theme(value: ThemePreference): void;
  } = {
    open(point) { x = point.x; y = point.y; open = true; notice = ''; label = '下载资源'; render(); },
    close,
    busy: () => busy,
    disable() { open = false; notice = ''; render(); },
    theme(value) { preference = value; applyTheme(); },
    loading() { busy = true; label = '正在下载'; render(); },
    ready() { busy = false; label = '下载资源'; render(); },
    result(text) { busy = false; label = text; render(); },
    dismiss(duration) { clearTimeout(timer); timer = setTimeout(close, duration); },
    notice(text, duration) {
      open = false; busy = false; notice = text; render();
      clearTimeout(timer);
      timer = setTimeout(() => { notice = ''; render(); }, duration);
    },
  };
  return controller;
}
