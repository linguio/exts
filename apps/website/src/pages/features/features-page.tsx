import { useSyncExternalStore } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SiteDocumentLayout } from '@/components/layout/site-document-layout';
import { Button } from '@/components/ui/button';
import { productCategories, resolveCategoryId } from '@/features/products/categories';

function subscribeToCategory(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function getCategorySnapshot() {
  return resolveCategoryId(window.location.hash);
}

export function FeaturesPage() {
  const selectedId = useSyncExternalStore(subscribeToCategory, getCategorySnapshot, () => 'extension');
  const selected = productCategories.find((category) => category.id === selectedId) ?? productCategories[0];

  return (
    <SiteDocumentLayout currentPage="features" title="产品介绍">
      <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 sm:gap-8">
        <nav aria-label="功能分类" className="flex flex-col items-start gap-2">
          {productCategories.map((category) => (
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
        <section id="feature-modules" aria-label={selected.label} aria-live="polite" className="min-w-0 space-y-8 pt-1">
          {selected.modules.length > 0 ? selected.modules.map((module) => (
            <article key={module.name}>
              <h2 className="site-section-title break-words">{module.name}</h2>
              <p className="text-sm leading-6 text-foreground">{module.description}</p>
              {module.installCommand && (
                <pre className="mt-3 overflow-x-auto rounded-md bg-secondary p-3 text-sm leading-6"><code>{module.installCommand}</code></pre>
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
