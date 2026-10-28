import { CalendarDays, ChartColumn, ChevronDown, ChevronUp, CircleCheck, CircleDashed, CircleMinus, CircleQuestionMark, CircleX, Download, Eye, EyeOff, FolderOpen, LaptopMinimal, List, LoaderCircle, Lock, LockOpen, Moon, PanelsTopLeft, Settings, Sun, Trash2, TriangleAlert, X, Zap, type LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import type { UiIconName } from './types';
import { cn } from '../lib/utils';

const uiIconMap: Record<UiIconName, LucideIcon> = {
  'calendar-days': CalendarDays,
  'chart-column': ChartColumn,
  'panels-top-left': PanelsTopLeft,
  zap: Zap,
  download: Download,
  lock: Lock,
  'lock-open': LockOpen,
  eye: Eye,
  'eye-off': EyeOff,
  settings: Settings,
  x: X,
  'circle-question-mark': CircleQuestionMark,
  sun: Sun,
  moon: Moon,
  'laptop-minimal': LaptopMinimal,
  list: List,
  'folder-open': FolderOpen,
  'trash-2': Trash2,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'circle-check': CircleCheck,
  'circle-minus': CircleMinus,
  'circle-dashed': CircleDashed,
  'loader-circle': LoaderCircle,
  'triangle-alert': TriangleAlert,
  'circle-x': CircleX,
};

interface UiIconProps extends Omit<ComponentProps<'svg'>, 'name'> {
  name: UiIconName;
}

function UiIcon({ name, className, ...props }: UiIconProps) {
  const Icon = uiIconMap[name];
  return <Icon aria-hidden="true" strokeWidth={1.75} className={cn('size-7', className)} {...props} />;
}

export { UiIcon };
