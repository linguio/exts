import type { ReactElement } from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuLabel, ContextMenuCheckboxItem, ContextMenuSeparator, ContextMenuTrigger } from '../../../components/ui/context-menu';
import { endSounds, tickSounds, type TimerSounds } from './sound-preference';

/** 官方勾选项支持同组单选或全不选，音频模块负责试听生命周期。 */
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
        {tickSounds.map(sound => <ContextMenuCheckboxItem key={sound.value} checked={sounds.tick === sound.value}
          closeOnClick={false} onCheckedChange={checked => onSelect('tick', checked ? sound.value : null)}>
          {sound.label}
        </ContextMenuCheckboxItem>)}
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuLabel>Completion Sound</ContextMenuLabel>
        {endSounds.map(sound => <ContextMenuCheckboxItem key={sound.value} checked={sounds.end === sound.value}
          closeOnClick={false} onCheckedChange={checked => onSelect('end', checked ? sound.value : null)}>
          {sound.label}
        </ContextMenuCheckboxItem>)}
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>;
}
