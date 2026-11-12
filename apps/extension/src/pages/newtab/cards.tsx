import { TimerCard } from '../../features/activity/timer/timer-card';
import { ActivityCard } from '../../features/activity/charts/activity-card';

/** 首页只组合展示卡片，活动组件及其业务由 Activity 功能持有。 */
export function NewtabCards() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <TimerCard />
      <ActivityCard />
    </div>
  );
}
