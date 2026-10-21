import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../shared/ui/dropdown-menu';
import { Button } from '../../../../shared/ui/button';
import { Toaster } from '../../../../shared/ui/sonner';
import styles from './style.css?inline';
import type { DownloadMenuController } from '../../download-core/save-media';
import { resolveTheme, type ThemePreference } from '../../../../shared/theme/preference';

/** 菜单和完成提示隔离在同一 Shadow DOM，业务提示只在保存成功后触发。 */
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
  let x = 0;
  let y = 0;
  let preference: ThemePreference = 'system';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const applyTheme = () => { host.dataset.theme = resolveTheme(preference, media.matches); };
  sheet.textContent = styles.replace(/:root(\[[^\]]+\])?/g, (_selector, attributes: string | undefined) => attributes ? `:host(${attributes})` : ':host');

  const render = () => flushSync(() => root.render(<>
    <DropdownMenu open={open} modal={false} onOpenChange={value => { open = value; render(); }}>
      <DropdownMenuTrigger asChild><button aria-label="Telegram Download" tabIndex={-1} style={{ position: 'fixed', left: x, top: y, width: 0, height: 0, padding: 0, border: 0, opacity: 0 }} /></DropdownMenuTrigger>
      <DropdownMenuContent portalContainer={mount} sideOffset={0} align="start" className="pointer-events-auto w-max min-w-0" onCloseAutoFocus={event => event.preventDefault()}
        onPointerDownOutside={event => { if (event.detail.originalEvent.composedPath().includes(host)) event.preventDefault(); }}
        onFocusOutside={event => { if (event.detail.originalEvent.composedPath().includes(host)) event.preventDefault(); }}>
        <DropdownMenuItem asChild disabled={busy} onSelect={event => { event.preventDefault(); if (busy) return; busy = true; render(); onSave(); }}>
          <Button type="button" variant="ghost" disabled={busy} className="w-fit cursor-pointer justify-start"><Download className="size-4" />下载资源</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Toaster id="tg-download" theme={resolveTheme(preference, media.matches)} position="top-right" className="toaster group pointer-events-auto" />
  </>));
  const close = () => { open = false; busy = false; render(); };
  applyTheme();
  render();
  media.addEventListener('change', () => { applyTheme(); render(); });
  const controller: DownloadMenuController & {
    open(point: { x: number; y: number }): void;
    busy(): boolean;
    disable(): void;
    theme(value: ThemePreference): void;
  } = {
    open(point) { x = point.x; y = point.y; open = true; render(); },
    close,
    busy: () => busy,
    disable: close,
    theme(value) { preference = value; applyTheme(); render(); },
    completed(filename) { toast.success('下载完成', { description: filename, toasterId: 'tg-download' }); },
  };
  return controller;
}
