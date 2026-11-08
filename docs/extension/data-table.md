# 通用 DataTable

## 位置与职责

`apps/extension/src/components/ui/{table,input,checkbox,select,calendar,command,pagination,alert}.tsx` 为固定版本 shadcn 基础组件；`components/custom/data-table` 提供表格、筛选、分页与排序组合。基于 TanStack Table 8.21.3，不包含账号、业务接口或 Chrome 消息。

## 前端模式

```tsx
import { DataTable, type DataTableFilter } from '@/components/custom/data-table';
import type { ColumnDef } from '@tanstack/react-table';

type RecordRow = { id: string; name: string; status: string; date: string };
const columns: ColumnDef<RecordRow>[] = [
  { accessorKey: 'name', header: '名称', enableHiding: false },
  { accessorKey: 'status', header: '状态' },
  { accessorKey: 'date', header: '日期' },
];
const filters: DataTableFilter[] = [
  { columnId: 'name', label: '名称', type: 'text' },
  { columnId: 'status', label: '状态', type: 'options', options: [
    { label: '完成', value: 'done' }, { label: '待处理', value: 'pending' },
  ] },
  { columnId: 'date', label: '日期', type: 'date' },
];
const getRowId = (row: RecordRow) => row.id;

function Records({ rows }: { rows: RecordRow[] }) {
  return <DataTable columns={columns} data={rows} getRowId={getRowId}
    caption="记录" filters={filters} selection />;
}
```

- `columns`、`data`、`filters` 和 `getRowId` 保持稳定引用，避免不必要的计算与选择清理。禁止以当前页数组下标作为行标识；`__selection` 为内部保留列 ID。
- 数据必须为完整的当前数据集；组件先筛选、排序，再分页。`getRowId` 必填，即使暂不开启选择。
- 字符串列标题自动提供排序按钮；自定义标题使用公开的 `DataTableColumnHeader`，或自行提供合适的非交互标题。`enableSorting: false` 禁用列排序；Shift 点击支持多列排序，`multiSort={false}` 关闭。
- 文本筛选忽略大小写；选项值按字符串精确匹配，同列多选为或、不同列条件为且；选项通过官方 Command 可搜索，重复选择取消勾选。日期面板采用官方 Calendar 的 range 模式，由 Popover 展示；选中起点后先应用下限，再选终点形成闭区间，重置筛选清除日期。日期列需返回 `YYYY-MM-DD` 或以该格式开头的字符串，按日闭区间比较，不负责时区转换。业务应提供已转换到业务时区的日期。
- 搜索是 TanStack 内建全局文本匹配；`search={false}` 关闭。需要排除的列设置 `enableGlobalFilter: false`。
- `columnVisibility={false}` 关闭列控制；`enableHiding: false` 的列不可隐藏。列显隐使用官方 DropdownMenuCheckboxItem。默认控件保留至少一个数据列；非字符串列标题在列控制中以列 ID 展示，业务应使用可读 ID。

## 服务端模式

```tsx
const [query, setQuery] = useState(initialQuery);
<DataTable columns={columns} data={response.rows} getRowId={getRowId}
  caption="记录" filters={filters}
  remote={{ query, onQueryChange: setQuery, rowCount: response.total }}
  loading={loading} hasPreviousResult={hasPreviousResult}
  error={errorMessage} onRetry={reload} />
```

- `query` 包含 `pagination: { pageIndex, pageSize }`、`sorting`、`columnFilters` 和 `globalFilter`。`pageIndex` 从 0 开始，`pageSize` 必须是正整数，`rowCount` 为筛选后的非负总条数；暂不支持未知总数的游标分页。
- `onQueryChange` 使用 React 状态更新器语义，必须支持函数更新。业务订阅 query 后自行映射到接口、请求数据，处理取消和迟到响应；组件不发请求、不自动重试。
- 返回当前页数据和筛选后的总数。组件不会再次对响应执行本地筛选、排序或切片；后端必须支持业务开放的全部查询条件。
- 筛选、搜索、排序及每页条数改变会回到首页；普通翻页保持指定页码。总数收缩时，将超出范围的页码回退到末页。加载期间应同时更新 `loading`，避免拿旧总数判断新的分页范围。
- `hasPreviousResult` 指当前查询范围有可展示的上次结果；首次加载展示 Skeleton，刷新保留内容并展示 Spinner。账号切换由业务清理旧数据，不能把旧账号结果传作新账号的上次结果。

## 行选择和业务操作

- `selection` 默认关闭；开启后支持单行和当前页全选。前端模式可跨页累积选择，服务端模式只维护当前响应范围内的选择，不表达所有查询结果全选。
- 数据引用、筛选、搜索、`selectionKey` 或选择开关变化时清空选择；服务端换页也清空。切换账号或其他数据作用域时更新 `selectionKey`。
- `onSelectionChange(ids)` 返回稳定记录 ID；`bulkActions(ids, clear)` 返回业务操作控件，成功后由业务调用 `clear()`。加载或失败时隐藏批量操作。
- 操作列由业务通过 `ColumnDef.cell` 提供，权限、确认、保存、删除与提示留在业务侧。

## 验收示例

示例文件：`components/custom/data-table/example.tsx`。仅开发模式按需加载，不进入正式导航或生产构建。

1. 在仓库根运行 `pnpm ext:dev`，等待稳定目录发布成功。
2. Chrome/Edge 的扩展管理页加载根 `dist/dev/chrome-mv3-dev-stable`，或重新加载已指向该目录的扩展。
3. 打开 `chrome-extension://<扩展 ID>/newtab.html?table-demo`，看到 87 条通用示例记录。
4. 前端模式输入名称、选择状态及日期范围，确认条件交集、重置、排序、Shift 多列排序及每页条数；在后续页改变条件后回到首页，首页/末页翻页链接不可操作，Pagination 页码与省略号对应当前范围。
5. 日期面板应为 shadcn Calendar，不再是浏览器原生日历；在 Command 面板搜索并切换选项。在 DropdownMenu 中隐藏可隐藏列，保留名称列；勾选单行、当前页全选并翻页，执行示例批量操作后选择清空。
6. 切换服务端模式，观察页面底部 query；确认页码、排序、筛选变化传给模拟服务端，列表与总数对应筛选结果，换页不误选其他记录。这里仅用内存模拟响应，不是实际 HTTP 验证。
7. 切换 loading、refresh、empty、error：分别看到首次骨架、保留内容的刷新提示、官方 Empty 空记录及 Alert 错误重试；error 点击重试回到正常数据。无匹配筛选显示“没有符合条件的记录”。
8. 明暗主题、窄屏横向滚动、菜单/选择控件和键盘操作由用户自行在真实浏览器验收。Table 与 Select 内部滚动沿用官方实现，不额外嵌套 ScrollArea。

代理不执行浏览器视觉或交互验收。实际生产组件接入另一个工作项，不以此示例代替真实业务联调。
