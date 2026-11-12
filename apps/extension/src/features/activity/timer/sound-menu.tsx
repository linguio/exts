import type { ReactElement } from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuTrigger } from '../../../components/ui/context-menu';
import { endSounds, tickSounds, type TimerSounds } from './sound-preference';

/** 复用官方分组与默认勾选，不增加自定义选中背景或右键管理。 */
export function TimerSoundMenu({ children, sounds, onSelect, onOpenChange }: {
  children: ReactElement;
  sounds: TimerSounds;
  onSelect: <K extends keyof TimerSounds>(group: K, value: TimerSounds[K]) => void;
  onOpenChange: (open: boolean) => void;
}) {
  return <ContextMenu onOpenChange={onOpenChange}>
    <ContextMenuTrigger render={children} />
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuLabel>Timer Sound</ContextMenuLabel>
        <ContextMenuRadioGroup value={sounds.tick} onValueChange={value => {
          const sound = tickSounds.find(item => item.value === value);
          if (sound) onSelect('tick', sound.value);
        }}>
          {tickSounds.map(sound => <ContextMenuRadioItem key={sound.value} value={sound.value}>{sound.label}</ContextMenuRadioItem>)}
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuLabel>Completion Sound</ContextMenuLabel>
        <ContextMenuRadioGroup value={sounds.end} onValueChange={value => {
          const sound = endSounds.find(item => item.value === value);
          if (sound) onSelect('end', sound.value);
        }}>
          {endSounds.map(sound => <ContextMenuRadioItem key={sound.value} value={sound.value}>{sound.label}</ContextMenuRadioItem>)}
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>;
}
