import { Blocks, CircleQuestionMark, Download, FolderOpen, LaptopMinimal, List, Lock, LockOpen, Moon, Settings, Sun, Trash2, X, type LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import type { UiIconName } from './types';
import { cn } from '../lib/utils';

const uiIconMap: Record<UiIconName, LucideIcon> = {
  blocks: Blocks,
  download: Download,
  lock: Lock,
  'lock-open': LockOpen,
  settings: Settings,
  x: X,
  'circle-question-mark': CircleQuestionMark,
  sun: Sun,
  moon: Moon,
  'laptop-minimal': LaptopMinimal,
  list: List,
  'folder-open': FolderOpen,
  'trash-2': Trash2,
};

interface UiIconProps extends Omit<ComponentProps<'svg'>, 'name'> {
  name: UiIconName;
}

function UiIcon({ name, className, ...props }: UiIconProps) {
  const Icon = uiIconMap[name];
  return <Icon aria-hidden="true" strokeWidth={1.75} className={cn('size-7', className)} {...props} />;
}

export { UiIcon };
