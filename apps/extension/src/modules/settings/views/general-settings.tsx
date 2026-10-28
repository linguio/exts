import { useId, useSyncExternalStore } from 'react';

import { readTheme, setTheme, subscribeTheme } from '../../../shared/theme/runtime';
import { settingsMessages } from '../../../shared/settings/messages';
import { toast } from '../../../shared/ui/sonner';
import { Card } from '../../../shared/ui/card';
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from '../../../shared/ui/item';
import { ToggleGroup, ToggleGroupItem } from '../../../shared/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../shared/ui/tooltip';
import { UiIcon } from '../../../shared/ui/ui-icon';

const choices = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'laptop-minimal' },
] as const;

export function GeneralSettings() {
  const id = useId();
  const theme = useSyncExternalStore(subscribeTheme, readTheme);

  return (
    <section aria-labelledby={`${id}-heading`} className="space-y-3">
      <h3 id={`${id}-heading`} className="text-sm font-medium">General</h3>
      <Card className="gap-0 px-4 py-0 shadow-none">
        <ItemGroup>
          <Item role="listitem" className="px-0">
            <ItemContent>
              <ItemTitle id={`${id}-label`}>Theme</ItemTitle>
            </ItemContent>
            <ItemActions>
              <ToggleGroup type="single" variant="outline" size="sm" spacing={0} value={theme} aria-labelledby={`${id}-label`} onValueChange={(value) => {
                // 单选主题不能取消成空值，保持最后一个有效选择。
                if (value !== 'light' && value !== 'dark' && value !== 'system') return;
                void setTheme(value).catch(() => {
                  toast.error(settingsMessages.saveFailed);
                });
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
            </ItemActions>
          </Item>
        </ItemGroup>
      </Card>
    </section>
  );
}
