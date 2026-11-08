# 通用 DataTable

本文维护扩展组件的技术接入、示例和 Daily 业务规则。[仓库级表格规范](../table-conventions.md) 为跨应用长期规范，表格交互、列表 API 默认值和数量限制以该规范为准；组件底层具备的即时筛选能力不等于业务默认查询方式。后续共性规则先更新仓库级规范，再同步本文件的调用说明。

## 位置与职责

强制选型和职责边界见 [扩展规范](../../apps/extension/AGENTS.md#共用能力与职责目录)，控件组合约定见 [UI 规范](./ui.md#通用数据表格)，固定源码与适配见 [官方来源](../web-ui-sources.md)。

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
- `hasPreviousResult` 指当前查询范围有可展示的上次结果；首次与刷新统一使用 body 内居中的 Spinner，不使用首次 Skeleton；刷新保留同账号已有记录。账号切换由业务清理旧数据，不能把旧账号结果传作新账号的上次结果。

## 可选展示内容

- showCaption 默认为 true；false 不渲染可见 TableCaption，caption 继续作为表格与区域的无障碍名称。Daily 按用户要求隐藏可见说明，其他调用方默认不变。

- emptyContent 可传入业务需要的官方 Empty 组合，替换默认空结果提示；不传时保留原有无记录/筛选无结果文案。通用组件不内置 Daily 等业务文案。
- showPagination 默认为 true；false 只隐藏分页与总数区域，不改变数据处理模式或页大小。Daily 接入服务端真实数据后保留默认分页。

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
7. 切换 loading、refresh、empty、error：分别看到 body 居中的首次 Spinner、保留内容且 body 居中的刷新 Spinner、官方 Empty 空记录及 Alert 错误重试；error 点击重试回到正常数据。无匹配筛选显示“没有符合条件的记录”。
8. 明暗主题、窄屏横向滚动、菜单/选择控件和键盘操作由用户自行在真实浏览器验收。Table 与 Select 内部滚动沿用官方实现，不额外嵌套 ScrollArea。

代理不执行浏览器视觉或交互验收。实际生产组件接入另一个工作项，不以此示例代替真实业务联调。

## Daily 真实查询组合

- DataTable 的可选 toolbar(table, disabled) 可替换默认工具栏；不传保持原行为。公开 DataTableColumnVisibility 复用已有列显隐组合，业务不重复维护列菜单；通用组件不引入业务请求、日期草稿或业务字段。
- Daily 工具栏左侧日期条件，右侧 Query、Reset、Columns。排序使用已有表头：普通点击切换单列，Shift 点击组合多列，沿用 TanStack 优先级与交互，不另设排序配置区。
- 日期草稿点击 Query 后生效，保留当前排序并回首页；排序立即查询，但只使用已生效日期，保留草稿。翻页/每页条数使用已生效条件。
- Reset 同时清空草稿与已生效日期、用户排序，回第一页并立即查询一次；保留每页条数和列显隐。初始化、重置和清空排序时，前端 sorting 为空，发送 sort:[]，由后端默认 date desc；默认日期不占用户排序优先级。手动选择时长时按用户顺序排序，由后端追加 date desc 作为末尾稳定条件；主动选择 Date 时按显式优先级参与。
- 表头与内容默认居中，样式由 DataTable 组合层维护，官方 Table 原语保持不变。首次与刷新统一在整个 tbody 的水平/垂直中心显示官方 Spinner，首次保留表头与空白内容区，刷新保留同账号记录；不新增顶部行，不使用 Skeleton；失败 Alert 支持 Retry，不把失败当空结果；新请求取消旧请求且忽略迟到响应。会话重置由 Studio 内容边界重建 Daily。
- Daily 采用 remote，由接口返回的 days/total 驱动记录和总数，不在前端重新排序。图表采用明确日期升序的不分页范围查询，并校验 total 等于记录数，拒绝不完整响应。

## 本次用户验收

1. 在仓库根运行 pnpm api:dev，确认本地 API 已启动。本次最终产物通过 VITE_API_BASE_URL=http://127.0.0.1:8000 pnpm ext:build 构建，指向该本地 API；代理未部署 API，也未替用户启动长期服务。
2. Chrome/Edge 扩展管理页加载根 dist/build/chrome-mv3（本次生产构建），打开 Newtab，登录后进入 Studio → Activity → Daily。
3. 默认看到本人记录按日期倒序，每页 20 条及筛选后总数；无记录时显示正式空状态，不再显示未接入文案。
4. 选择日期但不点 Query，修改排序应立即请求旧日期范围，日期输入保留；点击 Query 后使用新日期范围并回首页。
5. 普通点击运动表头启用单列排序，再 Shift 点击阅读组合排序；检查顺序符合排序先后优先级，NULL 在最后、0 保持明确值。翻页与修改每页条数使用当前生效条件。分页底栏在常规宽度下为总数、每页条数、页码、跳转同行；窄屏空间不足时仅完整控件组换行，“每页”与选择器、输入框与跳转按钮不会拆开。
6. 隐藏 Reading、改每页 50 并翻页，修改日期草稿后 Reset：日期清空、日期倒序和第一页恢复，每页 50 与隐藏列保留；Network 中只发生一次重置查询。
7. 暂停 API 请求后 Query，看到失败和 Retry；恢复服务后重试；快速修改排序只展示最后一次响应。退出、换号及同账号重新登录不显示旧账号记录。
8. 回 Home 查看 Calendar/Chart/Pie，确认日期范围完整、请求不带分页且 sort 为 date asc。使用接口工具验证非法排序/半组分页参数及未分页超过 500 条返回 422；恰好 500 条完整返回。大数据场景需要相应隔离夹具，不修改真实账号记录。
9. 明暗主题、窄屏、多排序布局、Popover/Select/列显隐与焦点交互由用户实际验收；代理未执行这些检查。

## 第二轮验收补充（2026-11-09）

- 排序交互保持普通点击单列、Shift 点击组合多列，第三点未更改；普通点击清除其他列排序属于沿用的默认行为。
- 在首次加载和刷新时确认表头保留，loading 仅在表格 body 内；表头与记录内容默认居中。
- 分页全部使用英文：Rows per page、First、Previous、Next、Last、Go，以及 records / Page x of y，无障碍名称也同步英文。
- 本轮扩展完整 133 项测试、类型检查与本地 API 构建通过；浏览器视觉、布局和交互由用户重新加载验收，尚未确认通过。

## 加载反馈范围澄清（2026-11-09）

- “首次 Skeleton、后续 Spinner”仅用于模块级 LoadingRegion，不适用于 DataTable。
- DataTable 不区分首次与后续的加载形式，统一 Spinner；覆盖定位范围为整个 body，Spinner 水平及垂直居中，不显示可见文字提示，仅保留读屏名称；表头/工具栏/分页保持原位；已有记录保留，不添加顶部状态行。
- 首次无记录时使用空白 body 承载 Spinner，不渲染骨架或成功空状态；刷新期间也不把旧空结果误显示为已完成查询。

## 默认日期排序验收补充

- 重新加载/Reset 后先 Shift 点击 Exercise，再 Shift 点击 Reading：请求 sort 应为 exerciseMinutes、readingMinutes，不含默认 date；日期由后端追加在最后。
- 检查运动时长优先、相同运动时长再比较阅读时长；时长都相同时按日期倒序。
- 移除全部用户排序或 Reset 后，sort 为 []，后端返回日期倒序；普通点击仍按 TanStack 默认交互切换单列，不改为点击自动累加。
- 本轮针对默认优先级的 9 项相关逻辑检查、扩展类型检查、本地 API 构建通过；API 未修改，浏览器实际交互仍待用户验收。
