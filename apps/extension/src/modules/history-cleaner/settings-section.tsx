import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { Button } from '../../shared/ui/button';
import { cn } from '../../shared/lib/utils';
import { getHistoryCleanerEnabled, HISTORY_CLEANER_ENABLED_KEY, setHistoryCleanerEnabled } from './settings';

export function HistoryCleanerSettings() {
  const id = useId();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);
  const saving = useRef(false);
  const version = useRef(0);

  const refresh = useCallback(async () => {
    if (saving.current) return;
    const currentVersion = ++version.current;
    try {
      const current = await getHistoryCleanerEnabled();
      if (mounted.current && currentVersion === version.current) setEnabled(current);
    } catch {
      if (mounted.current && currentVersion === version.current) setError('Unable to load this setting. Please try again.');
    } finally {
      if (mounted.current && currentVersion === version.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const onStorageChanged = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === 'local' && HISTORY_CLEANER_ENABLED_KEY in changes) void refresh();
    };
    const onPermissionRemoved = (permissions: chrome.permissions.Permissions) => {
      if (!permissions.permissions?.includes('browsingData')) return;
      setError('History permission was removed. Turn this setting on to grant access again.');
      void refresh();
    };
    const onPermissionAdded = (permissions: chrome.permissions.Permissions) => {
      if (permissions.permissions?.includes('browsingData')) void refresh();
    };
    chrome.storage.onChanged.addListener(onStorageChanged);
    chrome.permissions.onRemoved.addListener(onPermissionRemoved);
    chrome.permissions.onAdded.addListener(onPermissionAdded);
    void refresh();
    return () => {
      mounted.current = false;
      version.current++;
      chrome.storage.onChanged.removeListener(onStorageChanged);
      chrome.permissions.onRemoved.removeListener(onPermissionRemoved);
      chrome.permissions.onAdded.removeListener(onPermissionAdded);
    };
  }, [refresh]);

  async function toggle() {
    if (saving.current || loading) return;
    const next = !enabled;
    saving.current = true;
    version.current++;
    setPending(true);
    setError(null);
    try {
      // 直接从点击调用设置方法，让其中的权限请求保留用户手势。
      const current = await setHistoryCleanerEnabled(next);
      if (mounted.current) {
        setEnabled(current);
        if (next && !current) setError('History permission was not granted. This setting is still off.');
      }
    } catch {
      if (mounted.current) setError('Unable to save this setting. Please try again.');
    } finally {
      saving.current = false;
      if (mounted.current) {
        setPending(false);
        // 保存期间可能收到其他页面的更新，最终重新读取实际状态。
        void refresh();
      }
    }
  }

  return (
    <section aria-labelledby={`${id}-heading`} className="space-y-4 p-6">
      <h3 id={`${id}-heading`} className="text-sm font-semibold">Browsing history</h3>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 space-y-2">
          <p id={`${id}-label`} className="text-sm font-medium">Clear history on startup and close</p>
          <p id={`${id}-description`} className="text-sm leading-6 text-muted-foreground">
            Clears all browsing history when the browser starts and the last window closes. Cookies, cache, and downloads are kept.
          </p>
        </div>
        <Button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-description`}
          disabled={loading || pending}
          onClick={() => { void toggle(); }}
          className={cn('h-6 w-11 shrink-0 justify-start rounded-full p-1', enabled ? 'bg-primary' : 'bg-muted')}
        >
          <span aria-hidden="true" className={cn('size-4 rounded-full bg-background transition-transform duration-[var(--duration-fast)]', enabled && 'translate-x-5')} />
        </Button>
      </div>
      {error && <p role="alert" className="text-sm leading-6 text-foreground">{error}</p>}
    </section>
  );
}
