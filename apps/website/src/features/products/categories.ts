export type CategoryId = 'extension' | 'desktop' | 'packages' | 'skills';
export type FeatureSectionId = 'quick-start' | CategoryId;

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
    id: 'extension', name: 'Extension', label: 'Extension',
    description: '按自己的使用习惯，为 Chrome 集成日常需要的浏览器拓展功能。',
    modules: [
      { name: 'Newtab', description: '以新标签页为工作台，集中访问常用网站与工具。' },
      { name: 'History Cleaner', description: '在浏览器打开与关闭时清理访问历史，保留 Cookie、缓存和下载记录。' },
      { name: 'Telegram Web Download', description: 'Telegram Web 图片、视频右键另存为。' },
    ],
  },
  {
    id: 'desktop', name: 'Desktop', label: 'Desktop',
    description: '为 macOS 打造桌面工具，满足自己的工作、生活与兴趣需要。',
    modules: [{ name: 'Photos', description: '按月份浏览 iPhone 照片与视频，批量下载到本地。' }],
  },
  {
    id: 'packages', name: 'Packages', label: 'Packages',
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
    id: 'skills', name: 'Skills', label: 'Skills',
    description: '按自己的开发与 AI 使用习惯，编写和改造适合自己的 Skills。',
    modules: [
      {
        name: 'workflow-change',
        description: '管理开发任务的范围、交付记录、验收与本地提交，可与 Superpowers 配合使用。',
        links: [{ label: '查看源码', href: 'https://github.com/linguio/exts/tree/main/skills/workflow-change' }],
      },
      {
        name: 'workflow-observer',
        description: '观察并记录开发习惯，通过复盘总结改进方向，优化自己的工作流。',
        links: [{ label: '查看源码', href: 'https://github.com/linguio/exts/tree/main/skills/workflow-observer' }],
      },
    ],
  },
];

// URL 是内容选择的事实来源，空地址、未知或旧分类统一回到快速开始。
export function resolveFeatureSectionId(hash: string): FeatureSectionId {
  return productCategories.find((category) => `#${category.id}` === hash)?.id ?? 'quick-start';
}
