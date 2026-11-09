import { DailyRecords } from '../../features/activity/daily/daily-records';

export function DailyPage() {
  return <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 md:p-6">
    <DailyRecords />
  </div>;
}
