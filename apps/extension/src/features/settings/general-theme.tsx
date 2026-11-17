import { useId, useRef, useState, useSyncExternalStore } from 'react';

import { readTheme, setTheme, subscribeTheme } from './theme';
import { settingsMessages } from './messages';
import { toast } from '../../components/ui/toast';
import { Item, ItemActions, ItemContent, ItemTitle } from '../../components/ui/item';
import { ToggleGroup, ToggleGroupItem } from '../../components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { UiIcon } from '../../components/custom/ui-icon';
import { StatusIcon } from '../../components/custom/status-icon';

const choices = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'laptop-minimal' },
] as const;

export function ThemeSettings() {
  const id = useId();
  const theme = useSyncExternalStore(subscribeTheme, readTheme);
  const [savingTheme, setSavingTheme] = useState<string | null>(null);
  const saving = useRef(false);

  return (
    <Item role="listitem" className="px-0">
            <ItemContent>
              <ItemTitle id={`${id}-label`}>Theme</ItemTitle>
            </ItemContent>
            <ItemActions>
              <ToggleGroup type="single" variant="outline" size="sm" spacing={0} value={theme} disabled={savingTheme !== null} aria-busy={savingTheme !== null} aria-labelledby={`${id}-label`} onValueChange={(value) => {
                // 单选主题不能取消成空值，保持最后一个有效选择。
                if (value !== 'light' && value !== 'dark' && value !== 'system') return;
                if (saving.current || value === theme) return;
                saving.current = true;
                setSavingTheme(value);
                void setTheme(value).then(() => toast.add({ type: "success", title: settingsMessages.saved })).catch(() => {
                  toast.add({ type: "error", title: settingsMessages.saveFailed });
                }).finally(() => {
                  saving.current = false;
                  setSavingTheme(null);
                });
              }}>
                {choices.map((choice) => (
                  <Tooltip key={choice.value}>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem value={choice.value} aria-label={choice.label} className="w-9 px-0">
                        {savingTheme === choice.value ? <StatusIcon level="loading" /> : <UiIcon name={choice.icon} className="size-4" />}
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent side="top">{choice.label}</TooltipContent>
                  </Tooltip>
                ))}
              </ToggleGroup>
            </ItemActions>
          </Item>
  );
}
