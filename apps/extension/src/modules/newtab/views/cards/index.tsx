import { ActivityCard } from '../../../studio/components/activity';

/** 首页只组合展示卡片，活动组件及其后续业务由 Studio 持有。 */
export function NewtabCards() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <ActivityCard />
    </div>
  );
}
