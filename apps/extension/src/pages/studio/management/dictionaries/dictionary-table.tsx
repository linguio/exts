import { Plus } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { DictionaryGroup, DictionaryItem } from '../../../../api/dictionaries';
import { DataTable } from '../../../../components/custom/data-table/data-table';
import { useDataTableQuery } from '../../../../components/custom/data-table/use-data-table-query';
import { DataTableRowActions } from '../../../../components/custom/data-table/row-actions';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../../../components/ui/breadcrumb';
import { UiIcon } from '../../../../components/custom/ui-icon';
import { Card, CardHeader } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../../components/ui/empty';
import { requestDictionaries } from '../../../../features/dictionaries/requests';

const itemColumns: ColumnDef<DictionaryItem>[] = [
  { accessorKey: 'label', header: 'Label', enableSorting: false,
    cell: ({ row }) => <span className="whitespace-normal [overflow-wrap:anywhere]">{row.original.label}</span> },
  { accessorKey: 'value', header: 'Value', enableSorting: false,
    cell: ({ row }) => <span className="whitespace-normal [overflow-wrap:anywhere]">{row.original.value}</span> },
  { accessorKey: 'sortOrder', header: 'Order', enableSorting: false },
];
const noItems: DictionaryItem[] = [];
const getItemId = (item: DictionaryItem) => item.id;

export function DictionaryTable({ group, userId, onPlaceholderAction }: {
  group: DictionaryGroup;
  userId: string;
  onPlaceholderAction: () => void;
}) {
  const { data, query, loading, failed, hasPreviousResult, onQueryChange } = useDataTableQuery<DictionaryItem>([], async (_, signal) => {
    const { items } = await requestDictionaries({ action: 'items', groupId: group.id }, userId, signal);
    return { rows: items, total: items.length };
  }, true, 'unpaged');
  const columns: ColumnDef<DictionaryItem>[] = [...itemColumns, {
    id: '__actions', header: 'Actions', enableSorting: false, enableHiding: false,
    cell: ({ row }) => <DataTableRowActions disabled={loading} label={`Edit item ${row.original.label}`} onEdit={onPlaceholderAction} />,
  }];

  return (
    <section aria-label={group.label} className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Card className="mb-4 shrink-0 border-0 bg-muted py-4 text-foreground shadow-none">
        <CardHeader className="gap-1 px-4 [overflow-wrap:anywhere]">
          <Breadcrumb aria-label="Dictionary group"><BreadcrumbList>
            <BreadcrumbItem>{group.namespace.label}</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><h2><BreadcrumbPage>{group.label}</BreadcrumbPage></h2></BreadcrumbItem>
          </BreadcrumbList></Breadcrumb>
          {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
        </CardHeader>
      </Card>
      <DataTable columns={columns} data={data?.rows ?? noItems} getRowId={getItemId}
        caption={`${group.namespace.label} / ${group.label} items`} showCaption={false}
        search={false} showPagination={false} fillRecords
        appearance={{
          frame: 'borderless',
          columnAlign: 'left',
          columnWidths: { label: '30%', value: '30%', sortOrder: '30%', __actions: '10%' },
        }}
        loading={loading} failed={failed} hasPreviousResult={hasPreviousResult}
        remote={{ query, onQueryChange, rowCount: data?.total ?? 0 }}
        toolbar={() => <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onPlaceholderAction}>
            <Plus aria-hidden="true" /> Add item
          </Button>
        </div>}
        emptyContent={<Empty className="min-h-0 flex-1 p-0"><EmptyHeader>
          <EmptyMedia variant="icon"><UiIcon name="circle-dashed" className="size-6" /></EmptyMedia>
          <EmptyTitle>{failed ? 'Items unavailable' : 'No dictionary items'}</EmptyTitle>
          <EmptyDescription>{failed ? 'Items for this group could not be loaded.' : 'This group has no items yet.'}</EmptyDescription>
        </EmptyHeader></Empty>}
      />
    </section>
  );
}
