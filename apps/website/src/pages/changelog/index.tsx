import { SiteDocumentLayout } from '@/shared/layout/site-document-layout';
import { ChangelogTimeline } from './timeline';

export function ChangelogPage() {
  return (
    <SiteDocumentLayout currentPage="changelog" title="更新日志">
      <p className="mb-8 text-sm leading-6 text-foreground">
        记录 Exts 的更新与进展，分享工具从想法到实现的变化。
      </p>
      <ChangelogTimeline />
    </SiteDocumentLayout>
  );
}
