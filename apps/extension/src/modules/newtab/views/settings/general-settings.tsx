import { useId, useState, useSyncExternalStore } from 'react';

import { readTheme, setTheme, subscribeTheme } from '../../../../shared/theme/runtime';
import { ToggleGroup, ToggleGroupItem } from '../../../../shared/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../shared/ui/tooltip';
import { UiIcon } from '../../../../shared/ui/ui-icon';

const choices = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'laptop-minimal' },
] as const;

export function GeneralSettings() {
  const id = useId();
  const theme = useSyncExternalStore(subscribeTheme, readTheme);
  const [error, setError] = useState<string | null>(null);

  return (
    <section aria-labelledby={`${id}-heading`} className="space-y-4">
      <h3 id={`${id}-heading`} className="text-xs font-medium text-muted-foreground">General</h3>
      <div className="flex items-center justify-between gap-6">
        <p id={`${id}-label`} className="text-sm font-normal">Theme</p>
        <ToggleGroup type="single" variant="outline" size="sm" spacing={0} value={theme} aria-labelledby={`${id}-label`} onValueChange={(value) => {
          // 单选主题不能取消成空值，保持最后一个有效选择。
          if (value !== 'light' && value !== 'dark' && value !== 'system') return;
          void setTheme(value).then(() => setError(null))
            .catch(() => setError('Unable to save this setting. Please try again.'));
        }}>
          {choices.map((choice) => (
            <Tooltip key={choice.value}>
              <TooltipTrigger asChild>
                <ToggleGroupItem value={choice.value} aria-label={choice.label} className="w-9 px-0">
                  <UiIcon name={choice.icon} className="size-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="top">{choice.label}</TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </div>
      {error && <p role="alert" className="text-sm leading-6 text-foreground">{error}</p>}
    </section>
  );
}
