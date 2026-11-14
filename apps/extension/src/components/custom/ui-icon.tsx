import { Clock, Timer, Bell, CalendarDays, ChartColumn, ChartPie, Info, ChevronDown, ChevronsUpDown, ChevronUp, CircleCheck, CircleDashed, CircleMinus, CircleQuestionMark, CircleUser, CircleX, Download, Ellipsis, EllipsisVertical, Eye, EyeOff, FolderOpen, House, LaptopMinimal, List, LoaderCircle, Lock, LockOpen, LogOut, Moon, NotebookText, PanelLeft, PanelsTopLeft, Settings, SquarePen, Sun, Trash2, TriangleAlert, UserRound, X, Zap, type LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import type { UiIconName } from './types';
import { cn } from '../../lib/utils';

const uiIconMap: Record<UiIconName, LucideIcon> = {
  'notebook-text': NotebookText,
  house: House,
  info: Info,
  'panel-left': PanelLeft,
  'user-round': UserRound,
  'ellipsis-vertical': EllipsisVertical,
  ellipsis: Ellipsis,
  'square-pen': SquarePen,
  'circle-user': CircleUser,
  bell: Bell,
  clock: Clock,
  timer: Timer,
  'log-out': LogOut,
  'calendar-days': CalendarDays,
  'chart-column': ChartColumn,
  'chart-pie': ChartPie,
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
  'chevrons-up-down': ChevronsUpDown,
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
