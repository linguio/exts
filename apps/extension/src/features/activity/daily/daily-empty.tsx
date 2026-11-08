import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../components/ui/empty';
import { UiIcon } from '../../../components/custom/ui-icon';

/** Daily 暂不请求数据，不把尚未接入显示为查询成功空记录。 */
export function DailyEmpty() {
  return <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon"><UiIcon name="notebook-text" className="size-6" /></EmptyMedia>
      <EmptyTitle>No activity records</EmptyTitle>
      <EmptyDescription>There are no records to display. Data connection is not available yet.</EmptyDescription>
    </EmptyHeader>
  </Empty>;
}
