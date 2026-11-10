import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../components/ui/empty';
import { UiIcon } from '../../../components/custom/ui-icon';

/** Daily 成功查询的空记录展示。 */
export function DailyEmpty() {
  return <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon"><UiIcon name="circle-dashed" className="size-6" /></EmptyMedia>
      <EmptyTitle>No activity records</EmptyTitle>
      <EmptyDescription>There are no records for the selected date range.</EmptyDescription>
    </EmptyHeader>
  </Empty>;
}
