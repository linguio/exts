import type { DictionaryGroup, DictionaryItem } from '../../../../api/dictionaries';
import { useDataTableQuery } from '../../../../components/custom/data-table/use-data-table-query';
import { UiIcon } from '../../../../components/custom/ui-icon';
import { Card, CardHeader } from '../../../../components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../../components/ui/empty';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { Spinner } from '../../../../components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { requestDictionaries } from '../../../../features/dictionaries/requests';

const columns = ['Label', 'Value', 'Order'] as const;
const cellClass = 'whitespace-normal text-left [overflow-wrap:anywhere]';

export function DictionaryTable({ group, userId }: { group: DictionaryGroup; userId: string }) {
  const { data, loading, failed } = useDataTableQuery<DictionaryItem>([], async (_, signal) => {
    const { items } = await requestDictionaries({ action: 'items', groupId: group.id }, userId, signal);
    return { rows: items, total: items.length };
  }, true, 'unpaged');
  const rows = loading || failed ? [] : data?.rows ?? [];

  const table = (
    <Table aria-label={`${group.label} items`} className="table-fixed" containerClassName="overflow-visible">
      <TableHeader><TableRow>
        {columns.map(column => <TableHead key={column} className="sticky top-0 z-10 w-1/3 bg-background text-left">
          {column}
        </TableHead>)}
      </TableRow></TableHeader>
      {rows.length > 0 && <TableBody>{rows.map(item => (
        <TableRow key={item.id}>
          <TableCell className={cellClass}>{item.label}</TableCell>
          <TableCell className={cellClass}>{item.value}</TableCell>
          <TableCell className={cellClass}>{item.sortOrder}</TableCell>
        </TableRow>
      ))}</TableBody>}
    </Table>
  );

  return (
    <section aria-label={group.label} className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Card className="mb-4 shrink-0 border-0 bg-muted py-4 text-foreground shadow-none">
        <CardHeader className="gap-1 px-4 [overflow-wrap:anywhere]">
          <h2 className="text-lg font-semibold">{group.label}</h2>
          {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
        </CardHeader>
      </Card>
      {rows.length > 0 ? <ScrollArea className="min-h-0 flex-1">{table}</ScrollArea> : <>
        {table}
        {loading ? <div role="status" className="grid min-h-0 flex-1 place-items-center">
          <Spinner /><span className="sr-only">Loading dictionary items</span>
        </div> : <Empty className="min-h-0 flex-1 p-0"><EmptyHeader>
          <EmptyMedia variant="icon"><UiIcon name="circle-dashed" className="size-6" /></EmptyMedia>
          <EmptyTitle>{failed ? 'Items unavailable' : 'No dictionary items'}</EmptyTitle>
          <EmptyDescription>{failed ? 'Items for this group could not be loaded.' : 'This group has no items yet.'}</EmptyDescription>
        </EmptyHeader></Empty>}
      </>}
    </section>
  );
}
