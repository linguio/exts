# 通用 DataTable

本文维护扩展组件的技术接入、示例和 Daily 业务规则。[仓库级表格规范](../table-conventions.md) 为跨应用长期规范，表格交互、列表 API 默认值和数量限制以该规范为准；组件底层具备的即时筛选能力不等于业务默认查询方式。后续共性规则先更新仓库级规范，再同步本文件的调用说明。

## 复用目标与当前落地状态

普通业务表格的目标是仅提供字段、筛选、接口及必要资源元数据，查询与标准 CRUD 的共同流程只维护一份，强制边界见[配置驱动与单一维护原则](../table-conventions.md#配置驱动与单一维护原则)。

扩展已提供 QueryDataTable 作为普通业务查询入口，复用现有 DataTable 渲染。Daily 已迁入该入口，查询走真实接口，编辑仅在当前响应行上临时预览；真实写接口仍待后续接入。以下 DataTable 低层 API 保留兼容，不代表每张业务表格都应重复实现查询流程。

## 位置与职责

强制选型和职责边界见 [扩展规范](../../apps/extension/AGENTS.md#共用能力与职责目录)，控件组合约定见 [UI 规范](./ui.md#通用数据表格)，固定源码与适配见 [官方来源](../web-ui-sources.md)。

`apps/extension/src/components/ui/{table,input,checkbox,select,calendar,command,pagination,alert}.tsx` 为固定版本 shadcn 基础组件；`components/custom/data-table` 提供表格、筛选、分页与排序组合。基于 TanStack Table 8.21.3，不包含账号、业务接口或 Chrome 消息。

## 普通业务查询入口

```tsx
import { QueryDataTable, type DataTableFilter } from '@/components/custom/data-table';

const filters: DataTableFilter[] = [
  { columnId: 'date', label: 'Date range', type: 'date' },
  { columnId: 'status', label: 'Status', type: 'options',
    options: [{ label: 'Active', value: 'active' }], defaultValue: ['active'] },
];

<QueryDataTable columns={columns} filters={filters} queryFn={queryRecords}
  getRowId={row => row.id} caption="Records" scopeKey={resourceScope} />
```

- columns、queryFn、getRowId、caption 必填；filters 可省略，省略时从 `columns[].meta.dataTable.filter` 推导。scopeKey 用于账号/资源变化时同步隔离全部查询状态，或由父级已存在的重建边界保证；不读取组件内部账号。
- 行末 Edit 需可写字段且（`updateFn` 或显式 `previewEdits`）；`previewEdits` 默认 false。预览保存只补丁当前成功响应、不重新请求；`updateFn` 保存成功后由组合层 `refresh`。`filters` 省略时从 columns meta 推导，显式 `[]` 表示无筛选。默认每页 20 条；可选 `fillRecords` 在父级 flex 链内占满剩余高度，记录区官方 ScrollArea 纵向滚动、分页紧随表格，横向滚动沿用官方 Table。可选 `headerNote`/`editDescription` 供页面补充说明。
- enabled 默认 true；false 时不发请求并取消在途请求，首次未启用不显示为查询成功空记录。showCaption/emptyContent 保留既有展示能力。
- filters.defaultValue 仅在查询入口初始化和 Reset 时应用。文本默认值为字符串，选项为字符串数组，日期范围为 {from,to}；默认值不会被编辑草稿污染，父级重渲染不重新应用默认条件。
- queryFn 接收 {pageIndex,pageSize,sort,filters} 和 signal，返回 Promise<{rows,total}>。sort 已转换为有序 {field,order} 数组；filters 的键为 columnId，值为已经生效的筛选值。筛选不要求对应可见数据列。
- queryFn 放在资源适配侧，只映射业务字段、调用已有接口并验证响应；将 signal 转交既有请求能力，不再创建表格 AbortController。调用方无需传 data/loading/error/rowCount/remote 或 Query/Reset 处理器。
- queryFn 引用变化只更新下一次使用的函数，不因普通重渲染再次请求；资源含义变化必须使用 scopeKey，或明确点击 Query/Retry，不能仅靠替换函数引用隐式切换数据范围。
- 资源侧确认可公开的错误使用公开 DataTableQueryError；未知异常统一显示 Failed to load records. Please retry.，不展示原始错误。公共层验证集合、总数及页记录数量的基本契约，记录内部安全分类日志。
- 查询、重置、分页、排序、列显隐和 body 加载沿用仓库级规范。Retry 只重试已生效查询，不提交草稿。scopeKey 变化同步重建内容，取消旧请求，首帧不展示旧作用域数据。

### 内部职责

- query-data-table.tsx：公开 QueryDataTable，按 scopeKey 重建私有内容实例，连接内部 Hook、Toolbar、可选编辑 Sheet 和原 DataTable。
- column-meta.ts：从列 meta 推导 filters、编辑字段与草稿校验。
- data-table-edit-sheet.tsx：共用 Sheet 草稿、字段校验、提交防重、失败 toast 与未保存 AlertDialog。
- use-data-table-query.ts：唯一草稿/生效查询和结果状态，管理请求 Effect、queryFn 最新引用、启用/停用及重试。
- state.ts：默认值复制、草稿/Query/Reset 状态转换、分页排序参数标准化。
- query-request.ts：实例级请求执行/取消，丢弃迟到结果并规范化安全错误；供纯异步测试验证，不是全局请求管理器。
- toolbar.tsx：同一份文本、选项和日期控件渲染；queryControls 模式绑定草稿，右侧为官方 ButtonGroup（Query/Reset）与独立 Columns 图标菜单，原 DataTable 即时模式保持兼容。
- 原表头、日期、列显隐及分页组件继续复用，不新增官方原语或改变主题。

## DataTable 低层前端模式

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

## DataTable 低层服务端模式

```tsx
const [query, setQuery] = useState(initialQuery);
<DataTable columns={columns} data={response.rows} getRowId={getRowId}
  caption="记录" filters={filters}
  remote={{ query, onQueryChange: setQuery, rowCount: response.total }}
  loading={loading} hasPreviousResult={hasPreviousResult}
  error={errorMessage} onRetry={reload} />
```

- `query` 包含 `pagination: { pageIndex, pageSize }`、`sorting`、`columnFilters` 和 `globalFilter`。`pageIndex` 从 0 开始，`pageSize` 必须是正整数，`rowCount` 为筛选后的非负总条数；暂不支持未知总数的游标分页。
- 直接使用低层 DataTable 时，onQueryChange 使用 React 状态更新器语义，必须支持函数更新。低层仅展示；普通业务使用 QueryDataTable，由共同查询层接管请求、取消、迟到防护和手动重试，不自行复制生命周期。
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
- 满足编辑条件时 QueryDataTable 增加 Actions 列与 Edit 按钮；列显隐不改变编辑字段集合。`previewEdits` 时行预览只改匹配行、保留 total、不重排当前页，且在途或 key 不一致时拒绝补丁。有损关闭走 AlertDialog。

## 列 meta 配置

```tsx
meta: {
  dataTable: {
    filter: { type: 'date', label: 'Date range' },
    edit: { type: 'integer', unit: 'min', min: 0, emptyAsNull: true },
  },
}
```

- `filter` 类型支持 text、options、date，语义与独立 `DataTableFilter` 一致。
- `edit.type` 支持 text 与 integer（`readOnly`、`disabled`、`unit`、`emptyAsNull`、min/max、校验文案等）。`unit` 仅在编辑 Sheet 内以官方 InputGroup 后缀展示，不改变草稿值、校验或 payload。`readOnly` 可聚焦复制且不进 payload；`disabled` 显示但控件禁用，不参与校验与 payload，也不能单独使行末 Edit 出现。日期等业务主键应 `readOnly`，不从单元格展示文本反解析。
- 共用 `DataTableEditSheet` 标题固定为 **Edit**，共用 `SquarePen` 图标；标题栏 `min-h-14`、`text-lg font-semibold`、`px-6 pr-16` 与 Settings Sheet 一致；打开时 `onOpenAutoFocus` 阻止默认聚焦首字段，程序聚焦标题，避免只读 Date 被自动选中。组合层写死标题与图标，`QueryDataTable` 不提供 `editTitle` 覆盖。
- Daily 在 columns.tsx 单一维护展示、筛选与编辑；`query.ts` 继续提供实际使用的真实查询适配，临时编辑只更新当前返回记录。

## Daily 真实查询与行预览编辑

- Daily 使用 QueryDataTable：`queryFn` 为 `queryDailyRecords`，`previewEdits` 显式开启，`fillRecords` 占 Studio 可用高度；`pageSizes` 为 20/50/100；筛选从 columns meta 推导，工具栏单行、窄屏横向滚动。
- 行末 Edit 打开共用 Sheet，日期只读，五项时长回填原始分钟。保存由共用层对当前响应行浅合并，不调用写接口、保存后不立即重新查询；下次 Query、翻页或刷新以接口数据为准。Daily 不传 `editDescription`，页面与 Sheet 内均无该英文说明；其他页面仍可按需传入。
- `query.ts` 映射 date→startDate/endDate 与 Activity 响应；行预览逻辑在 `row-preview.ts` 与 `use-data-table-query`，不把第二数据源放进资源层。Daily 页 `p-4 md:p-6`；Studio 主内容 `overflow-auto`，非 Daily 页面正常整页滚动。
- Daily 工具栏左侧日期条件，右侧为 ButtonGroup（Query 文字、Reset 图标）与紧邻独立的 Columns 图标菜单；Reset/Columns 带 Tooltip 与 aria-label。排序使用已有表头：普通点击切换单列，Shift 点击组合多列，沿用 TanStack 优先级与交互，不另设排序配置区。
- 日期草稿点击 Query 后生效，保留当前排序并回首页；排序立即查询，但只使用已生效日期，保留草稿。翻页/每页条数使用已生效条件。
- Reset 同时清空草稿与已生效日期、用户排序，回第一页并立即查询一次；保留每页条数和列显隐。初始化、重置和清空排序时，前端 sorting 为空，发送 sort:[]，由后端默认 date desc；默认日期不占用户排序优先级。手动选择时长时按用户顺序排序，由后端追加 date desc 作为末尾稳定条件；主动选择 Date 时按显式优先级参与。
- 表头与内容默认居中，样式由 DataTable 组合层维护，官方 Table 原语保持不变。首次与刷新统一在整个 tbody 的水平/垂直中心显示官方 Spinner，首次保留表头与空白内容区，刷新保留同账号记录；不新增顶部行，不使用 Skeleton；失败 Alert 支持 Retry，不把失败当空结果；新请求取消旧请求且忽略迟到响应。会话重置由 Studio 内容边界重建 Daily。
- Daily 复用 remote 查询契约，由接口返回 rows/total，不对当前页再次排序或筛选。Home 图表仍使用真实接口、明确日期升序的不分页范围，并校验 total 等于记录数，拒绝不完整响应。

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

## 配置化复用改造验收（2026-11-09）

1. 启动本地 API（仓库根 pnpm api:dev），Chrome/Edge 重新加载 dist/build/chrome-mv3；本次最终构建显式指向 http://127.0.0.1:8000，未部署 API。
2. 进入 Studio → Activity → Daily，首次自动请求 pageIndex=0/pageSize=20/sort=[]，默认日期倒序来自后端；body 内只有居中 Spinner，表头/工具栏/页脚保留。
3. 修改日期草稿不请求；普通点击时长表头立即请求旧的已生效日期；草稿保持。Query 后才提交新日期并回第一页。
4. Shift 点击第二个时长列，按用户选择先后传 sort；翻页保持已生效筛选/排序，修改每页条数回首页；跳转只接受实际存在的页码。
5. 隐藏一列、每页改为 50、翻页并修改草稿，再 Reset：恢复无日期和空用户排序、第一页，仅请求一次；保留 50 条及隐藏列。
6. API 暂不可用时 Query，看到错误与 Retry；先编辑草稿再 Retry，仍重试上次生效条件。恢复 API 后再重试，成功显示记录；不会把失败当作成功空结果。
7. 快速连续查询/排序，最后一次请求生效；退出、换号或同账号重新登录后旧记录不再显示。真实生命周期与跨账号交互仍由用户在浏览器验收。
8. 对照 daily/daily-records.tsx：应只剩 QueryDataTable 的配置和资源查询函数，查询 Effect、AbortController、手写工具栏及旧 daily/state.ts 已删除；公共流程位于 custom/data-table。
9. 本次 Daily 实际使用日期筛选；文本/选项查询模式复用既有控件并有配置/状态检查，未新增第二个真实业务表格或执行浏览器视觉验收。
