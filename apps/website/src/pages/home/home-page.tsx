import { SiteLayout } from '@/components/layout/site-layout';
import { PlatformDownloads } from '@/features/download/platform-downloads';
import { ModuleShowcase } from '@/features/showcase/module-showcase';
import { site } from '@/config/site';
import { ArrowRight, Blocks, Monitor, Package, Sparkles } from 'lucide-react';
import { productCategories } from '@/features/products/categories';

const categoryIcons = { extension: Blocks, desktop: Monitor, packages: Package, skills: Sparkles };

export function HomePage() {
  return (
    <SiteLayout mainClassName="home-main grid content-center gap-8">
      <section aria-label="Exts 产品概览" className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="flex min-w-0 flex-col gap-6">
          <div>
            <h1 className="text-[40px] leading-[1.1] font-semibold tracking-[-0.04em] sm:text-[56px]">{site.name}</h1>
            <p className="mt-3 text-[32px] leading-[1.2] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[48px]">{site.subtitle}</p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-xl">{site.description}</p>
          </div>
          <PlatformDownloads />
        </div>
        <ModuleShowcase />
      </section>
      <nav aria-label="工具分类" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {productCategories.map((category) => {
          const Icon = categoryIcons[category.id];
          return (
            <a key={category.id} href={`/features/#${category.id}`} className="flex min-w-0 flex-col rounded-lg bg-secondary p-5 text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              <Icon aria-hidden="true" className="mb-3 size-6 shrink-0" />
              <h2 className="text-base leading-6 font-semibold">{category.name} · {category.label}</h2>
              <p className="mt-2 mb-4 text-sm leading-6 text-muted-foreground">{category.description}</p>
              <span className="mt-auto flex items-center gap-2 text-sm leading-6 font-medium">{category.action}<ArrowRight aria-hidden="true" className="size-4" /></span>
            </a>
          );
        })}
      </nav>
    </SiteLayout>
  );
}
