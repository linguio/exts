import { Blocks, BrushCleaning, CircleQuestionMark, LaptopMinimal, Moon, Settings, Sun, Wrench, X, type LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import type { UiIconName } from './types';
import { cn } from '../lib/utils';

const uiIconMap: Record<UiIconName, LucideIcon> = {
  blocks: Blocks,
  'brush-cleaning': BrushCleaning,
  wrench: Wrench,
  settings: Settings,
  x: X,
  'circle-question-mark': CircleQuestionMark,
  sun: Sun,
  moon: Moon,
  'laptop-minimal': LaptopMinimal,
};

interface UiIconProps extends Omit<ComponentProps<'svg'>, 'name'> {
  name: UiIconName;
}

function UiIcon({ name, className, ...props }: UiIconProps) {
  const Icon = uiIconMap[name];
  return <Icon aria-hidden="true" strokeWidth={1.75} className={cn('size-7', className)} {...props} />;
}

export { UiIcon };
