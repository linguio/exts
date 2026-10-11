import { SiteDocumentLayout } from '@/components/layout/site-document-layout';
import { ChangelogTimeline } from '@/features/changelog/changelog-timeline';

export function ChangelogPage() {
  return (
    <SiteDocumentLayout currentPage="changelog" title="更新日志">
      <ChangelogTimeline />
    </SiteDocumentLayout>
  );
}
