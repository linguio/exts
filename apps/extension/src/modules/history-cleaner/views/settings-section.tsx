import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { Switch } from '../../../shared/ui/switch';
import { Button } from '../../../shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../shared/ui/tooltip';
import { UiIcon } from '../../../shared/ui/ui-icon';
import { Item, ItemActions, ItemContent, ItemTitle } from '../../../shared/ui/item';
import { getHistoryCleanerEnabled, setHistoryCleanerEnabled } from '../settings';
import { subscribeSettings } from '../../../shared/settings/index';
import { settingsMessages } from '../../../shared/settings/messages';
import { toast } from '../../../shared/ui/sonner';

const descriptions = [
  'Clears all browsing history when the browser starts and when the last window closes.',
  'Keeps cookies, cache, and downloaded files.',
];

export function HistoryCleanerSettings() {
  const id = useId();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
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
      if (mounted.current && currentVersion === version.current) {
        toast.error(settingsMessages.loadFailed);
      }
    } finally {
      if (mounted.current && currentVersion === version.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const onPermissionRemoved = (permissions: chrome.permissions.Permissions) => {
      if (!permissions.permissions?.includes('browsingData')) return;
      toast.error(settingsMessages.historyPermissionRemoved);
      void refresh();
    };
    const onPermissionAdded = (permissions: chrome.permissions.Permissions) => {
      if (permissions.permissions?.includes('browsingData')) void refresh();
    };
    const stopSettings = subscribeSettings(() => { void refresh(); });
    chrome.permissions.onRemoved.addListener(onPermissionRemoved);
    chrome.permissions.onAdded.addListener(onPermissionAdded);
    void refresh();
    return () => {
      mounted.current = false;
      version.current++;
      stopSettings();
      chrome.permissions.onRemoved.removeListener(onPermissionRemoved);
      chrome.permissions.onAdded.removeListener(onPermissionAdded);
    };
  }, [refresh]);

  async function toggle(next: boolean) {
    if (saving.current || loading) return;
    saving.current = true;
    version.current++;
    setPending(true);
    try {
      // 直接从点击调用设置方法，让其中的权限请求保留用户手势。
      const current = await setHistoryCleanerEnabled(next);
      if (mounted.current) {
        setEnabled(current);
        if (next && !current) toast.error(settingsMessages.historyPermissionDenied);
      }
    } catch {
      if (mounted.current) {
        toast.error(settingsMessages.saveFailed);
      }
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
    <Item role="listitem" className="px-0">
      <ItemContent className="min-w-0">
        <ItemTitle>
          <span id={`${id}-label`}>Clear History</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0 cursor-pointer text-muted-foreground" aria-label="About history cleanup">
                <UiIcon name="circle-question-mark" className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" collisionPadding={8} className="max-w-[280px] text-left leading-5">
              <div className="space-y-1">
                {descriptions.map(description => <p key={description}>{description}</p>)}
              </div>
            </TooltipContent>
          </Tooltip>
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <Switch
          checked={enabled}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-description`}
          disabled={loading || pending}
          onCheckedChange={(next) => { void toggle(next); }}
        />
      </ItemActions>
      <span id={`${id}-description`} className="sr-only">{descriptions.join(' ')}</span>
    </Item>
  );
}
