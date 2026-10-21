import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { Switch } from '../../shared/ui/switch';
import { Button } from '../../shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../shared/ui/tooltip';
import { UiIcon } from '../../shared/ui/ui-icon';
import { getHistoryCleanerEnabled, HISTORY_CLEANER_ENABLED_KEY, setHistoryCleanerEnabled } from './settings';

const description = 'Clears all browsing history when the browser starts and the last window closes. Cookies, cache, and downloads are kept.';

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

  async function toggle(next: boolean) {
    if (saving.current || loading) return;
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
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-1">
          <p id={`${id}-label`} className="text-sm font-normal">Clear history on startup and close</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0 cursor-pointer text-muted-foreground" aria-label="About history cleanup">
                <UiIcon name="circle-question-mark" className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" collisionPadding={8} className="max-w-[280px] text-left leading-5">{description}</TooltipContent>
          </Tooltip>
        </div>
        <Switch
          checked={enabled}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-description`}
          disabled={loading || pending}
          onCheckedChange={(next) => { void toggle(next); }}
        />
      </div>
      <span id={`${id}-description`} className="sr-only">{description}</span>
      {error && <p role="alert" className="text-sm leading-6 text-foreground">{error}</p>}
    </div>
  );
}
