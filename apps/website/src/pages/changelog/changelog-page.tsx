import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ChangelogTimeline } from '@/features/changelog/changelog-timeline';

export function ChangelogPage() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 sm:px-10 lg:px-12">
      <SiteHeader currentPage="changelog" />
      <main className="mx-auto w-full max-w-[720px] flex-1 pt-9 pb-8 sm:pt-14">
        <h1 className="mb-12 text-[32px] leading-[1.2] font-semibold tracking-[-0.035em] sm:mb-16 sm:text-[38px]">Changelog</h1>
        <ChangelogTimeline />
      </main>
      <SiteFooter />
    </div>
  );
}
