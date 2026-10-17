export type CategoryId = 'extension' | 'desktop' | 'packages' | 'skills';

type ProductModule = {
  name: string;
  description: string;
  installCommand?: string;
  links?: readonly { label: string; href: string }[];
};

type ProductCategory = {
  id: CategoryId;
  name: string;
  label: string;
  description: string;
  modules: readonly ProductModule[];
  emptyMessage?: string;
};

export const productCategories: readonly ProductCategory[] = [
  {
    id: 'extension', name: 'Extension', label: '浏览器拓展',
    description: '按自己的使用习惯，为 Chrome 集成日常需要的浏览器拓展功能。',
    modules: [{ name: 'Tabs', description: '在新标签页集中访问常用网站，整理分组标签。' }],
  },
  {
    id: 'desktop', name: 'Desktop', label: '桌面应用',
    description: '为 macOS 打造桌面工具，满足自己的工作、生活与兴趣需要。',
    modules: [{ name: 'Photos', description: '按月份浏览 iPhone 照片与视频，批量下载到本地。' }],
  },
  {
    id: 'packages', name: 'Packages', label: '工具包',
    description: '针对开发中遇到的痛点，打造符合自己需要的工具包与脚手架。',
    modules: [{
      name: 'WXT 稳定构建产物工具',
      description: '为 WXT 开发模式提供稳定的扩展加载目录，避免重建或构建失败导致扩展加载异常。',
      installCommand: 'pnpm add -D @linguio/wxt-stable-output',
      links: [
        { label: 'npm 包', href: 'https://www.npmjs.com/package/@linguio/wxt-stable-output' },
        { label: '查看源码', href: 'https://github.com/linguio/exts/tree/main/packages/wxt-stable-output' },
      ],
    }],
  },
  {
    id: 'skills', name: 'Skills', label: 'AI 工作流',
    description: '按自己的开发与 AI 使用习惯，编写和改造适合自己的 Skills。',
    modules: [], emptyMessage: '暂无公开 Skills',
  },
];

// URL 是分类选择的事实来源，未知或旧分类统一回到浏览器扩展。
export function resolveCategoryId(hash: string): CategoryId {
  return productCategories.find((category) => `#${category.id}` === hash)?.id ?? 'extension';
}
