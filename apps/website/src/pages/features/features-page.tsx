import { useState } from 'react';
import { SiteDocumentLayout } from '@/components/layout/site-document-layout';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: 'extension',
    label: '浏览器扩展',
    modules: [{ name: 'Tabs', description: '在新标签页集中访问常用网站，整理分组标签。' }],
  },
  {
    id: 'desktop',
    label: '桌面应用',
    modules: [{ name: 'Photos', description: '按月份浏览 iPhone 照片与视频，批量下载到本地。' }],
  },
  {
    id: 'collaboration',
    label: '协同功能',
    modules: [],
  },
] as const;

export function FeaturesPage() {
  const [selectedId, setSelectedId] = useState<(typeof categories)[number]['id']>(categories[0].id);
  const selected = categories.find((category) => category.id === selectedId) ?? categories[0];

  return (
    <SiteDocumentLayout currentPage="features" title="产品介绍">
      <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 sm:gap-8">
        <nav aria-label="功能分类" className="flex flex-col items-start gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={`h-10 px-2 text-sm font-medium ${selectedId === category.id ? 'text-foreground' : 'text-muted-foreground'}`}
              aria-pressed={selectedId === category.id}
              aria-controls="feature-modules"
              onClick={() => setSelectedId(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </nav>
        <section id="feature-modules" aria-label={selected.label} aria-live="polite" className="min-w-0 space-y-8 pt-1">
          {selected.modules.length > 0 ? selected.modules.map((module) => (
            <article key={module.name}>
              <h2 className="site-section-title">{module.name}</h2>
              <p className="text-sm leading-6 text-foreground">{module.description}</p>
            </article>
          )) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无协同功能</p>
          )}
        </section>
      </div>
    </SiteDocumentLayout>
  );
}
