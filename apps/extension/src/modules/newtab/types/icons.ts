import type { UiIconName } from '../../../shared/ui/types';

/** 图标颜色策略：原色、纯单色自适应，以及保留层次的中性灰阶自适应。 */
export type IconTone = 'original' | 'adaptive' | 'neutral';

/** 资源图标的展示尺寸，由实际使用区域决定。 */
export type IconSize = 'sm' | 'md' | 'wide';

/** Dock 顶层入口可以使用通用 UI 图标或保留的资源图标。 */
export type DockIcon =
  | { kind: 'ui'; name: UiIconName }
  | { kind: 'asset'; source: string; tone?: IconTone; size?: IconSize };
