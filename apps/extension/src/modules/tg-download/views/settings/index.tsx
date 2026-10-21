import { useEffect, useId, useState } from 'react';
import { Button } from '../../../../shared/ui/button';
import { Switch } from '../../../../shared/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { UiIcon } from '../../../../shared/ui/ui-icon';
import { telegramDownloadSetting } from '../../settings';

const description = 'Download photos and videos from Telegram Web.';

export function TelegramDownloadSettings() {
  const id = useId();
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    let changed = false;
    const setting = telegramDownloadSetting();
    const stop = setting.subscribe(value => { changed = true; if (active) setEnabled(value); });
    void setting.get().then(value => { if (active && !changed) setEnabled(value); })
      .catch(() => { if (active) setError('Unable to load this setting.'); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; stop(); };
  }, []);
  return <div className="space-y-2">
    <div className="flex items-center justify-between gap-6">
      <div className="flex min-w-0 items-center gap-1">
        <p id={`${id}-label`} className="text-sm font-normal">Telegram Download</p>
        <Tooltip>
          <TooltipTrigger asChild><Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0 cursor-pointer text-muted-foreground" aria-label="About Telegram Download"><UiIcon name="circle-question-mark" className="size-4" /></Button></TooltipTrigger>
          <TooltipContent side="top" collisionPadding={8} className="max-w-[280px] text-left leading-5">{description}</TooltipContent>
        </Tooltip>
      </div>
      <Switch checked={enabled} disabled={busy} aria-labelledby={`${id}-label`} aria-describedby={`${id}-description`} onCheckedChange={next => {
        setBusy(true);
        setError('');
        void telegramDownloadSetting().set(next).then(() => setEnabled(next))
          .catch(() => setError('Unable to save this setting. Please try again.'))
          .finally(() => setBusy(false));
      }} />
    </div>
    <span id={`${id}-description`} className="sr-only">{description}</span>
    {error && <p role="alert" className="text-sm leading-6 text-foreground">{error}</p>}
  </div>;
}
