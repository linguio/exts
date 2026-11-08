import { DataTable, type DataTableFilter } from '../../../components/custom/data-table';
import type { DailyActivityRow } from '../data/types';
import { dailyColumns } from './columns';
import { DailyEmpty } from './daily-empty';

const rows: DailyActivityRow[] = [];
const filters: DataTableFilter[] = [{ columnId: 'date', label: 'Date range', type: 'date' }];
const getRowId = (row: DailyActivityRow) => row.date;

/** 先交付可查看的表格和筛选结构；数据接入前不发送请求或填充模拟记录。 */
export function DailyRecords() {
  return <DataTable columns={dailyColumns} data={rows} getRowId={getRowId}
    caption="Daily activity records" showCaption={false} filters={filters} search={false} showPagination={false}
    emptyContent={<DailyEmpty />} />;
}
