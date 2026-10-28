import { cva, type VariantProps } from 'class-variance-authority';

import type { IconSize } from './types';
import { getExtensionAsset } from '../browser/assets.js';

const brandIconVariants = cva(
  'bookmark-icon block object-contain',
  {
    variants: {
      size: {
        sm: 'bookmark-icon--sm h-4 w-4',
        md: 'bookmark-icon--md h-8 w-8',
        wide: 'bookmark-icon--wide h-7 w-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

interface BrandIconProps extends VariantProps<typeof brandIconVariants> {
  icon: string;
  name: string;
  size?: IconSize;
  className?: string;
}

/** 书签随主题切换黑白；Exts 保留正式外形及主体与底板的对比。 */
export function BrandIcon({ icon, name: _name, size = 'md', className }: BrandIconProps) {
  // 图标只承担装饰作用，书签名称由相邻文本或按钮 aria-label 提供。
  return (
    <img
      className={brandIconVariants({ size, className })}
      src={getExtensionAsset(`assets/${icon}`)}
      alt=""
      aria-hidden="true"
      data-brand={icon === 'brand/exts.svg' ? 'exts' : undefined}
      data-size={size}
    />
  );
}
