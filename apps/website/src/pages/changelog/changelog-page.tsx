import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ChangelogTimeline } from '@/features/changelog/changelog-timeline';

export function ChangelogPage() {
  return (
    <div className="site-shell">
      <SiteHeader currentPage="changelog" />
      <main className="site-container flex-1 pt-8 sm:pt-12">
        <div className="mx-auto max-w-[720px]">
          <h1 className="mb-6 text-[28px] leading-[1.2] font-semibold tracking-[-0.035em] sm:mb-8 sm:text-[32px]">Changelog</h1>
          <ChangelogTimeline />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
