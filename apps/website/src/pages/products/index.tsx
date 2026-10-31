import { useSyncExternalStore } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SiteDocumentLayout } from '@/shared/layout/site-document-layout';
import { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';
import { Button } from '@/shared/ui/button';
import { productCategories, resolveFeatureSectionId } from '@/shared/products/categories';
import { QuickStart } from './quick-start';
import { ApiOverview } from './api';

const navigation = [{ id: 'quick-start', label: 'Quick Start' }, ...productCategories, { id: 'api', label: 'API' }];

function subscribeToCategory(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function getCategorySnapshot() {
  return resolveFeatureSectionId(window.location.hash);
}

export function FeaturesPage() {
  const selectedId = useSyncExternalStore(subscribeToCategory, getCategorySnapshot, () => 'quick-start');
  const selected = productCategories.find((category) => category.id === selectedId) ?? productCategories[0];

  return (
    <SiteDocumentLayout currentPage="features" title="产品介绍">
      <p className="mb-8 text-sm leading-6 text-foreground">
        Exts 是我按个人习惯打造的工具集合，围绕日常开发、工作、生活与兴趣，把想法变成顺手的工具。
      </p>
      <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 sm:gap-8">
        <nav aria-label="功能分类" className="flex flex-col items-start gap-2">
          {navigation.map((category) => (
            <Button
              key={category.id}
              asChild
              variant="ghost"
              className={`h-10 px-2 text-sm font-medium ${selectedId === category.id ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              <a href={`#${category.id}`} aria-current={selectedId === category.id ? 'location' : undefined} aria-controls="feature-modules">{category.label}</a>
            </Button>
          ))}
        </nav>
        <section id="feature-modules" aria-label={selectedId === 'quick-start' ? 'Quick Start' : selectedId === 'api' ? 'API' : selected.label} aria-live="polite" className="min-w-0 space-y-8 pt-1">
          {selectedId === 'quick-start' ? <QuickStart /> : selectedId === 'api' ? <ApiOverview /> : selected.modules.length > 0 ? selected.modules.map((module) => (
            <article key={module.name}>
              <h2 className="site-section-title break-words">{module.name}</h2>
              <p className="text-sm leading-6 text-foreground">{module.description}</p>
              {module.installCommand && (
                <ScrollArea className="mt-3 rounded-md bg-secondary">
                  <pre className="w-max p-3 text-sm leading-6"><code>{module.installCommand}</code></pre>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
              {module.links && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm leading-6">
                  {module.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="site-resource-link">
                      {link.label}<ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </article>
          )) : (
            <p className="text-sm leading-6 text-muted-foreground">{selected.emptyMessage}</p>
          )}
        </section>
      </div>
    </SiteDocumentLayout>
  );
}
