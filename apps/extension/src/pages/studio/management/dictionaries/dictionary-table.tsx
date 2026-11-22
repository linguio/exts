import type { DictionaryGroup, DictionaryItem } from '../../../../api/dictionaries';
import { useDataTableQuery } from '../../../../components/custom/data-table/use-data-table-query';
import { Button } from '../../../../components/ui/button';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { Spinner } from '../../../../components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { requestDictionaries } from '../../../../features/dictionaries/requests';

export function DictionaryTable({ group, userId }: { group: DictionaryGroup; userId: string }) {
  const { data, loading, failed, refresh } = useDataTableQuery<DictionaryItem>([], async (_, signal) => {
    const { items } = await requestDictionaries({ action: 'items', groupId: group.id }, userId, signal);
    return { rows: items, total: items.length };
  }, true, 'unpaged');

  return (
    <section aria-label={group.label} className="flex min-h-0 min-w-0 flex-1 flex-col">
      <h2 className="shrink-0 border-b px-4 py-3 font-medium">{group.label}</h2>
      {loading ? <div role="status" className="p-4"><Spinner /><span className="sr-only">Loading dictionary items</span></div>
        : failed ? <div role="alert" className="space-y-2 p-4">
          <p className="text-sm">Unable to load dictionary items.</p>
          <Button type="button" variant="outline" size="sm" onClick={refresh}>Retry</Button>
        </div>
          : data?.rows.length ? <ScrollArea className="min-h-0 flex-1">
            <Table aria-label={`${group.label} items`}>
              <TableHeader><TableRow><TableHead>Value</TableHead><TableHead>Label</TableHead><TableHead>Order</TableHead></TableRow></TableHeader>
              <TableBody>{data.rows.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.value}</TableCell><TableCell>{item.label}</TableCell><TableCell>{item.sortOrder}</TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </ScrollArea> : <p className="p-4 text-sm text-muted-foreground">This dictionary has no items.</p>}
    </section>
  );
}
