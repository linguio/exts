import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { PlatformDownloads } from '@/features/download/platform-downloads';
import { ModuleShowcase } from '@/features/showcase/module-showcase';
import { site } from '@/config/site';

export function HomePage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-container grid flex-1 content-center items-center gap-12 pt-8 sm:grid-cols-[1.2fr_1fr] sm:gap-8 sm:pt-12">
        <div>
          <h1 className="text-[clamp(1.8rem,4.2vw,2.625rem)] leading-[1.38] font-semibold tracking-[-0.04em]">
            {site.headline.map((line) => <span key={line} className="block">{line}</span>)}
          </h1>
          <PlatformDownloads />
        </div>
        <ModuleShowcase />
      </main>
      <SiteFooter />
    </div>
  );
}
