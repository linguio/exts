# 业务查询表格复用设计

状态：已实现并通过自动化检查，用户于 2026-11-09 验收通过并批准本地提交完结；实际结果见 Issue/Commit 记录，未推送。

范围以[Issue](../../changes/issues/2026-11-09-extension-data-table-reuse-issue.md)为准：围绕现有 DataTable 补齐查询复用，不实施新增/编辑/删除、多选或批量操作，不新增依赖、后端接口或数据库结构。已有能力不删除，后续按真实需求逐项扩展。

## 最终交付

普通业务使用 QueryDataTable 一个入口，提供列、筛选和查询函数，不再自行管理查询工具栏、草稿、生效条件、分页排序、Effect、loading/error/retry、取消和迟到响应。底层仍为现有 DataTable，共用一套渲染，不创建第二套表格引擎。

## 功能清单

| 功能 | 行为 |
| --- | --- |
| 首次查询 | 启用后按默认条件请求第一页，每页 20 条 |
| 筛选 | 根据文本/选项/日期配置生成控件，维护独立草稿 |
| Query | 应用草稿，保留用户排序与每页条数，回第一页并请求 |
| Reset | 恢复筛选默认值、清空用户排序、回第一页，仅请求一次；保留每页条数与列显隐 |
| 表头排序 | 普通点击单列、Shift 组合多列，立即请求已生效条件并回第一页 |
| 默认顺序 | 前端不预置业务默认排序，空 sort 由后端兜底 |
| 分页 | 条数、页码、首末页与跳转复用现有实现，使用 total 计算页数 |
| 列显隐 | 使用已有 Columns，无接口请求，不被 Reset 清除 |
| 加载 | 首次及刷新均为 body 中央无可见文字 Spinner；刷新保留同作用域记录 |
| 空/失败 | 成功空结果与失败区分，失败支持 Retry，保留筛选草稿 |
| 请求生命周期 | 新查询取消旧查询，防止迟到响应覆盖，卸载时清理 |
| 作用域 | 资源/账号范围变化清理旧结果，不跨作用域显示旧数据 |

具体交互与数量限制沿用[仓库级表格规范](../../table-conventions.md)，本设计不重新定义另一套默认行为。

## 对外配置

| 配置 | 必填 | 内容 |
| --- | --- | --- |
| columns | 是 | 复用现有 TanStack ColumnDef：字段、标题、格式化及是否允许排序/隐藏 |
| filters | 否，默认空 | 复用已有文本/选项/日期类型，提供标识、标题、选项与必要默认值 |
| queryFn | 是 | 接收标准查询和 AbortSignal，返回 Promise<{ rows, total }> |
| getRowId | 是 | 稳定业务行标识，沿用现有函数，不自动使用数组下标 |
| caption | 是 | 表格名称及无障碍名称，沿用现有约定 |
| scopeKey | 有账号/资源切换时提供，或由已有重建边界保证 | 只标识数据作用域，不作为后端授权依据 |
| enabled | 否，默认 true | 必要依赖未准备好时暂停请求，同时取消在途请求 |
| showCaption / emptyContent | 否 | 复用现有能力，以保持 Daily 已批准的展示；普通页面可不配 |

- 普通业务无需传 data、loading、error、rowCount、remote、onQuery、onReset 或自定义 toolbar。
- 不把所有底层 props 原样转发为一大堆业务配置。本次保留已需要的少量能力，其余按真实需求扩展。
- filters 是控件配置；queryFn 收到的是已经生效的筛选值，两者职责不同。未显示的数据字段也可作为服务端筛选条件，不强制每个筛选都对应一个可见列。
- 默认筛选值来自筛选配置，不要求页面自行 setState。配置初始化/Reset 才应用默认值，普通父组件重渲染不覆盖用户输入。

## 使用方式

以下为现已导出的公共 API：

```tsx
<QueryDataTable
  columns={columns}
  filters={filters}
  queryFn={queryRecords}
  getRowId={row => row.id}
  caption="Records"
  scopeKey={resourceScope}
/>
```

没有筛选时省略 filters。列定义继续使用现有 accessorKey/header/cell/enableSorting 等配置，不另造列声明语言；普通页面不需要组合页脚、错误区、请求 Hook 和 Query/Reset 按钮。

### 查询函数契约

```text
queryFn({ pageIndex, pageSize, sort, filters }, signal)
  → Promise<{ rows: Row[], total: number }>
```

- 公共层统一将 TanStack 分页和排序转换为 pageIndex/pageSize 与有序 {field,order} 数组；业务不重复转换 id/desc。
- filters 是以配置标识为键的已生效值；文本为字符串、选项为字符串数组、日期范围沿用 {from,to}。不向后端新增通用过滤 DSL。
- 资源适配负责把筛选映射到实际参数，例如 date 范围映射 startDate/endDate，并调用现有接口及校验数据；将 days 等集合字段转成 rows，保留 total。
- 接口适配放在资源侧，不在每个页面重复实现；signal 交给既有请求层即可，不在适配函数中创建表格取消控制器。
- 取消和未满足 enabled 条件不当作成功空记录；资源使用 DataTableQueryError 提供安全文案，未知异常统一通用提示，公共层提供错误展示和 Retry。

## 子组件与文件职责

| 单元 | 新增/复用 | 职责及内部组合 |
| --- | --- | --- |
| QueryDataTable / query-data-table.tsx | 新增公共入口 | 接受配置，将查询状态和统一工具栏接到现有 DataTable；不保存令牌或业务地址 |
| useDataTableQuery / use-data-table-query.ts | 新增内部 Hook | 唯一查询状态与请求生命周期，返回表格需要的数据/状态/动作；不作为页面必用的第二个入口 |
| DataTable / data-table.tsx | 复用 | TanStack 状态接入、Table 表头/body、列渲染、Spinner/Empty/Alert、分页 |
| DataTableToolbar / toolbar.tsx | 在原实现上补受控查询模式 | 同一套筛选控件渲染；原即时模式兼容，业务查询模式绑定草稿并提供 Query/Reset/Columns，不新增重复筛选工具栏 |
| DataTableColumnHeader / column-header.tsx | 复用 | 官方 Button 与排序图标，沿用 TanStack 默认表头交互 |
| DataTableDateFilter / date-filter.tsx | 复用 | 官方 Calendar + Popover，编辑草稿日期范围 |
| DataTableColumnVisibility / toolbar.tsx | 复用 | 官方 DropdownMenuCheckboxItem，维护列显隐 |
| DataTablePagination / pagination.tsx | 复用 | Pagination、Select、Input、Button；页码、条数与跳转 |
| query-request.ts | 已新增内部函数 | 实例级取消/迟到防护、元数据验证和安全错误归类，支持纯异步测试，不是全局管理器 |
| types.ts / state.ts / index.ts | 已补充现有文件 | 公开配置和查询/结果类型，必要纯状态转换，导出统一查询入口；不新建状态框架 |

官方基础组件继续使用 Table/表头/body/行/单元格、Button、Input、Select、Popover、Calendar、Command、DropdownMenu、Pagination、Spinner、Empty、Alert。表格不用 Skeleton。必要适配在组合层，官方源码和全局主题不重做。

## 内部实现与数据流

1. QueryDataTable 将配置交给内部查询 Hook，初始草稿/生效筛选取默认值，pageIndex=0、pageSize=20、用户排序为空。
2. 统一 Toolbar 只编辑草稿；Query 一次性提交草稿和第一页；Reset 一次性恢复默认条件。排序/分页直接更新生效查询，保留未提交草稿。
3. Hook 将生效状态标准化为查询参数；参数、scopeKey 或明确重试变化时触发请求。单纯的配置/函数引用重建不制造重复请求，页面不需要额外记忆化来维持基本正确性。
4. 每次请求创建 AbortController，取消前次请求；接收结果时核对请求有效性与作用域，拒绝迟到结果。卸载或停用时清理，不让已结束生命周期更新状态。
5. 同一作用域刷新保留当前成功记录，loading 只驱动 body Spinner；成功更新 rows/total，失败进入可重试状态；作用域变化时立即隔离旧数据。
6. DataTable 仍使用 remote 受控模式，不再次进行本地筛选、排序或切片；根据已确认响应 total 完成越界页收敛。
7. Daily 迁移后仅保留列、日期筛选配置、业务查询适配及必要资源信息，删除原先页面中的 Effect、AbortController、loading/error 状态与手写工具栏。Daily 的数据校验、消息安全和认证保护不移入通用组件。

不增加缓存、自动重试、状态库、HTTP 框架、全局请求管理器或自动生成后台消息路由。

## 后续升级空间

- 列展示延续 ColumnDef.cell，筛选延续配置类型，接口延续 queryFn，视觉延续官方组件与主题；通过这些已有职责边界增量完善。
- DataTable 已有直接使用、选择和操作列渲染能力继续保留，不要求本次统一查询入口提前支持其全部扩展。
- 将来需要新增/编辑/删除、多选或批量操作时，在批准的任务中补同一体系的公共流程；不在本次预留空接口、CRUD 参数或每页任意动作回调。

## 验证与停止点

逻辑覆盖查询草稿/生效隔离、Reset 单次查询、排序/分页与默认值、迟到结果/取消、作用域变化和失败重试；按影响范围执行扩展检查，不新增假 DOM、样式、布局或焦点/指针交互测试。浏览器实际效果由用户验收。

实现与 Daily 迁移已完成，扩展 140 项测试、类型检查及本地 API 构建通过；用户已验收通过，未自动提交。Daily 只保留配置及资源适配，旧页面查询编排已删除。
