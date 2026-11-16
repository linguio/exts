import { useId } from 'react';
import { Card } from '../../components/ui/card';
import { ItemGroup, ItemSeparator } from '../../components/ui/item';
import { ThemeSettings } from './general-theme';
import { NotificationSettings } from './general-notifications';
import { HistoryCleanerSettings } from './feature-history-cleaner';
import { MediaDownloadSettings } from './feature-media-download';

/** 设置功能按扁平文件组织，页面只持有 Sheet 容器。 */
export function SettingsContent() {
  const id = useId();
  return <div className="space-y-6 p-6 text-left [&_[data-slot=item-separator]]:h-0 [&_[data-slot=item-separator]]:border-t [&_[data-slot=item-separator]]:border-border [&_[data-slot=item-separator]]:bg-transparent">
    <section aria-labelledby={`${id}-general`} className="space-y-3">
      <h3 id={`${id}-general`} className="text-sm font-medium">General</h3>
      <Card className="gap-0 px-4 py-0 shadow-none">
        <ItemGroup>
          <ThemeSettings />
          <ItemSeparator />
          <NotificationSettings />
        </ItemGroup>
      </Card>
    </section>
    <section aria-labelledby={`${id}-features`} className="space-y-3">
      <h3 id={`${id}-features`} className="text-sm font-medium">Features</h3>
      <Card className="gap-0 px-4 py-0 shadow-none">
        <ItemGroup>
          <HistoryCleanerSettings />
          <ItemSeparator />
          <MediaDownloadSettings />
        </ItemGroup>
      </Card>
    </section>
  </div>;
}
