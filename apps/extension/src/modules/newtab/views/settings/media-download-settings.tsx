import { Fragment, useEffect, useId, useState } from 'react';
import { Button } from '../../../../shared/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../../shared/ui/collapsible';
import { Item, ItemActions, ItemContent, ItemGroup, ItemSeparator, ItemTitle } from '../../../../shared/ui/item';
import { Switch } from '../../../../shared/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { UiIcon } from '../../../../shared/ui/ui-icon';
import { mediaDownloadSetting } from '../../../media-download/settings';
import { settingsMessages } from '../../../../shared/settings/messages';
import { toast } from '../../../../shared/ui/sonner';
import { StatusIcon, type StatusLevel } from '../../../../shared/ui/status-icon';

const descriptions = [
  'Download photos and videos from Telegram Web.',
  'Download photos and videos from X. Requires X Download Helper.',
];

export function MediaDownloadSettings() {
  const id = useId();
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    let changed = false;
    const setting = mediaDownloadSetting();
    const stop = setting.subscribe(value => { changed = true; if (active) { setEnabled(value); setUnavailable(false); } });
    void setting.get().then(value => { if (active && !changed) setEnabled(value); })
      .catch(() => {
        if (!active) return;
        setUnavailable(true);
        toast.error(settingsMessages.loadFailed);
      })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; stop(); };
  }, []);
  return <Collapsible role="listitem">
    <Item className="px-0">
      <ItemContent className="min-w-0">
        <ItemTitle>
          <span id={`${id}-label`}>Media Download</span>
          <Tooltip>
            <TooltipTrigger asChild><Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0 cursor-pointer text-muted-foreground" aria-label="About Media Download"><UiIcon name="circle-question-mark" className="size-4" /></Button></TooltipTrigger>
            <TooltipContent side="top" collisionPadding={8} className="max-w-[280px] text-left leading-5">
              <div className="space-y-1">
                {descriptions.map(description => <p key={description}>{description}</p>)}
              </div>
            </TooltipContent>
          </Tooltip>
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Toggle media download details" className="[&[data-state=open]>svg]:rotate-180">
            <UiIcon name="chevron-down" className="size-4" />
          </Button>
        </CollapsibleTrigger>
        <Switch checked={enabled} disabled={busy} aria-labelledby={`${id}-label`} aria-describedby={`${id}-description`} onCheckedChange={next => {
          setBusy(true);
          setUnavailable(false);
          void mediaDownloadSetting().set(next).then(() => setEnabled(next))
            .catch(() => {
              setUnavailable(true);
              toast.error(settingsMessages.saveFailed);
            })
            .finally(() => setBusy(false));
        }} />
      </ItemActions>
    </Item>
    <span id={`${id}-description`} className="sr-only">{descriptions.join(' ')}</span>
    <CollapsibleContent>
      <ItemSeparator />
      <ItemGroup>
        {([
          { name: 'Telegram Download', status: unavailable ? 'Unavailable' : busy ? 'Loading…' : enabled ? 'Enabled' : 'Disabled', level: unavailable ? 'error' : busy ? 'loading' : enabled ? 'success' : 'neutral' },
          { name: 'X Download', status: 'Not integrated', level: 'pending' },
          { name: 'X Download Helper', status: 'Not integrated', level: 'pending' },
        ] satisfies { name: string; status: string; level: StatusLevel }[]).map((item, index) => (
          <Fragment key={item.name}>
          {index > 0 && <ItemSeparator />}
          <Item role="listitem" size="sm" className="px-0">
            <ItemContent className="min-w-0"><span className="text-sm">{item.name}</span></ItemContent>
            <ItemActions>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} aria-label={`${item.name}: ${item.status}`} className="inline-flex outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <StatusIcon level={item.level} />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">{item.status}</TooltipContent>
              </Tooltip>
            </ItemActions>
          </Item>
          </Fragment>
        ))}
      </ItemGroup>
    </CollapsibleContent>
  </Collapsible>;
}
