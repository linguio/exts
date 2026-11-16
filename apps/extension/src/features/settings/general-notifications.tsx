import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { Button } from '../../components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { Item, ItemActions, ItemContent, ItemGroup, ItemSeparator, ItemTitle } from '../../components/ui/item';
import { Switch } from '../../components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { toast } from '../../components/ui/sonner';
import { UiIcon } from '../../components/custom/ui-icon';
import { notificationSounds, readNotificationAudioStatus, subscribeNotificationAudio } from '../../lib/audio/notification-sounds';
import { getSettings, subscribeSettings, updateSettings } from './store-client';
import { settingsMessages } from './messages';

export function NotificationSettings() {
  const id = useId();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const mounted = useRef(false);
  const saving = useRef(false);
  const status = useSyncExternalStore(subscribeNotificationAudio, readNotificationAudioStatus);
  useEffect(() => {
    mounted.current = true;
    let changed = false;
    const stop = subscribeSettings(settings => { changed = true; setEnabled(settings.notifications.soundEnabled); });
    void getSettings().then(settings => {
      if (mounted.current && !changed) setEnabled(settings.notifications.soundEnabled);
    }).catch(() => { if (mounted.current) toast.error(settingsMessages.loadFailed); })
      .finally(() => { if (mounted.current) setLoading(false); });
    return () => { mounted.current = false; stop(); };
  }, []);
  return <Collapsible role="listitem">
    <Item className="px-0">
      <ItemContent className="min-w-0">
        <ItemTitle>
          <span id={`${id}-label`}>Notifications</span>
          <Tooltip>
            <TooltipTrigger asChild><Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0 cursor-pointer text-muted-foreground" aria-label="About Notifications"><UiIcon name="circle-question-mark" className="size-4" /></Button></TooltipTrigger>
            <TooltipContent side="top" collisionPadding={8} className="max-w-[280px] text-left leading-5">Play a sound for errors. Other notifications stay silent.</TooltipContent>
          </Tooltip>
        </ItemTitle>
        {enabled && (status === 'paused' || status === 'unavailable') && <p role="status" className="text-sm text-muted-foreground">
          {status === 'paused' ? 'Sound is paused. Click preview to try enabling it in this page.' : 'Sound is unavailable. Click preview to try again.'}
        </p>}
      </ItemContent>
      <ItemActions>
        <CollapsibleTrigger asChild><Button type="button" variant="ghost" size="icon-sm" aria-label="Toggle notification details" className="[&[data-state=open]>svg]:rotate-180"><UiIcon name="chevron-down" className="size-4" /></Button></CollapsibleTrigger>
        <Switch checked={enabled} disabled={loading || pending} aria-labelledby={`${id}-label`} aria-describedby={`${id}-description`} onCheckedChange={next => {
          if (saving.current) return;
          saving.current = true;
          setPending(true);
          void updateSettings({ notifications: { soundEnabled: next } }).then(settings => {
            if (!mounted.current) return;
            setEnabled(settings.notifications.soundEnabled);
            notificationSounds.setEnabled(settings.notifications.soundEnabled);
            toast.success(settingsMessages.saved);
          }).catch(() => { if (mounted.current) toast.error(settingsMessages.saveFailed); })
            .finally(() => { saving.current = false; if (mounted.current) setPending(false); });
        }} />
      </ItemActions>
    </Item>
    <span id={`${id}-description`} className="sr-only">Only error notifications play a sound. Preview is available when sounds are off.</span>
    <CollapsibleContent>
      <ItemSeparator />
      <ItemGroup>
        <Item role="listitem" size="sm" className="px-0">
          <ItemContent className="min-w-0">
            <ItemTitle className="text-sm font-normal">Default
              <Tooltip>
                <TooltipTrigger asChild><Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0 cursor-pointer text-muted-foreground" aria-label="About default notifications"><UiIcon name="circle-question-mark" className="size-4" /></Button></TooltipTrigger>
                <TooltipContent side="top" collisionPadding={8}>Default, Success, Warning, Info, Loading. No sound.</TooltipContent>
              </Tooltip>
            </ItemTitle>
          </ItemContent>
          <ItemActions><Tooltip>
            <TooltipTrigger asChild><span tabIndex={0} aria-label="Default: No sound" className="inline-flex size-8 items-center justify-center text-muted-foreground"><UiIcon name="volume-x" className="size-4" /></span></TooltipTrigger>
            <TooltipContent side="top">No sound</TooltipContent>
          </Tooltip></ItemActions>
        </Item>
        <ItemSeparator />
        <Item role="listitem" size="sm" className="px-0">
          <ItemContent className="min-w-0"><span className="text-sm">Error</span></ItemContent>
          <ItemActions><Tooltip>
            <TooltipTrigger asChild><Button type="button" variant="ghost" size="icon-sm" aria-label="Preview error sound" onClick={() => notificationSounds.preview()}><UiIcon name="volume-2" className="size-4" /></Button></TooltipTrigger>
            <TooltipContent side="top">Preview sound</TooltipContent>
          </Tooltip></ItemActions>
        </Item>
      </ItemGroup>
    </CollapsibleContent>
  </Collapsible>;
}
