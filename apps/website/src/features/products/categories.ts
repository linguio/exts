export type CategoryId = 'extension' | 'desktop' | 'packages' | 'skills';

type ProductModule = {
  name: string;
  description: string;
  links?: readonly { label: string; href: string }[];
};

type ProductCategory = {
  id: CategoryId;
  name: string;
  label: string;
  description: string;
  action: string;
  modules: readonly ProductModule[];
  emptyMessage?: string;
};

export const productCategories: readonly ProductCategory[] = [
  {
    id: 'extension', name: 'Extensions', label: '浏览器扩展',
    description: '从新标签页开始，让浏览器里的日常操作更顺手。', action: '查看扩展',
    modules: [{ name: 'Tabs', description: '在新标签页集中访问常用网站，整理分组标签。' }],
  },
  {
    id: 'desktop', name: 'Desktop', label: '桌面应用',
    description: '为 macOS 打造原生工具，处理浏览器之外的日常任务。', action: '查看应用',
    modules: [{ name: 'Photos', description: '按月份浏览 iPhone 照片与视频，批量下载到本地。' }],
  },
  {
    id: 'packages', name: 'Packages', label: '开发工具包',
    description: '将项目中实用的能力整理成独立 npm 包，在更多项目中复用。', action: '浏览工具包',
    modules: [{
      name: 'wxt-stable-output',
      description: '为 WXT 开发提供稳定的扩展加载目录，构建失败时保留上一份成功产物。',
      links: [
        { label: '在 npm 查看', href: 'https://www.npmjs.com/package/@linguio/wxt-stable-output' },
        { label: '查看源码', href: 'https://github.com/linguio/exts/tree/main/packages/wxt-stable-output' },
      ],
    }],
  },
  {
    id: 'skills', name: 'Skills', label: 'AI 工作流',
    description: '将常用方法整理为可复用的 Skills，让 AI 按你的方式协作。', action: '浏览 Skills',
    modules: [], emptyMessage: '暂无公开 Skills',
  },
];

// URL 是分类选择的事实来源，未知或旧分类统一回到浏览器扩展。
export function resolveCategoryId(hash: string): CategoryId {
  return productCategories.find((category) => `#${category.id}` === hash)?.id ?? 'extension';
}
