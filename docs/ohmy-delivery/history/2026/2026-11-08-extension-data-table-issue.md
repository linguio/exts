---
date: "2026-11-08"
scope: [extension]
status: completed
type: feature
---

# 实现可复用的通用数据表格

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

Studio 后续首先需要展示 Activity 数据，其他功能也将使用表格。先独立交付支持分页、筛选、排序等常用能力的 DataTable，业务只提供列定义、数据、条件配置和操作，不在各页面重复实现相同控件与状态处理。

### 范围

- 用户最新批准：整个复杂表格的界面全部采用 shadcn 官网基础组件及官方组合；日期使用 Calendar + Popover，选项筛选使用 Command + Popover，列显隐使用 DropdownMenu，分页使用 Pagination 配合 Select/Input，空状态使用 Empty，失败使用 Alert。仅有无法解决的实际问题时说明具体证据并等待用户决定，不自行替代。

- 官方 Table 及实际使用的配套控件放在 src/components/ui；基于官方 Data Table 指导与 TanStack Table 的共用组合放在 src/components/custom/data-table。
- 分页：首页、末页、上一页、下一页、当前页与总页数、页码跳转、每页条数；空结果与边界页正确禁用操作。
- 筛选：文本搜索、列文本筛选、选项多选、日期范围以及重置条件；列与筛选配置由业务传入，不假定特定数据字段。
- 排序：按列升序、降序和清除排序；支持配置多列排序及列是否可排序。
- 列控制：按配置显示或隐藏列，禁止隐藏的列不出现隐藏操作。
- 可选行选择：单行及当前页全选，使用业务提供的稳定行标识；批量操作由业务传入。不将当前页全选表述为全部查询结果全选。
- 展示状态：首次加载、已有内容刷新、无记录、筛选无结果、查询失败及重试入口；错误与重试行为由业务传入。
- 前端模式：对传入的完整数据按筛选、排序、分页顺序处理。
- 服务端模式：公开受控分页、排序、筛选状态及变化回调，由业务传入当前页数据、总数与加载状态；组件不请求接口，也不再次对当前页执行全量筛选或排序。
- 提供最小使用示例及接入说明，说明两种模式、列配置、稳定行标识、状态与回调约定。
- 采用现有主题、官方默认状态和交互；记录官方源码来源、固定版本与必要适配。新增依赖采用精确版本，并同步锁文件。

### 排除项

- 不创建 Studio 菜单，不接入 Activity 页面，不修改现有 Activity 接口或实现后端分页。
- 不把请求、账号、权限、Chrome 消息、缓存和业务通知放入通用组件；不引入额外请求库或全局表格状态管理。
- 不提供单元格编辑、导出、拖拽排序、列宽拖动、固定列、虚拟滚动或持久化用户表格偏好。
- 不承诺服务端跨页全量选择；筛选或数据集变化时按明确规则清理失效选择。
- 不新增视觉、布局、焦点、键盘或指针自动化测试，不引入假 DOM；不执行代理浏览器验收。

## Todo

### 实施 Todo

- [x] 根据用户最新要求统一日期、选项、列显隐、分页、空状态及错误为官方基础组件组合，补齐来源和依赖。

- [x] 核对官方 Table/Data Table 及实际依赖、主题适配，确定精确版本与最小组件契约。
- [x] 迁入官方基础控件，完成通用表格主体、列标题、筛选工具栏、分页栏与可选选择操作。
- [x] 完成前端/服务端两种模式、条件变化回到首页、页数边界和选择状态处理，提供最小接入示例。
- [x] 按真实风险验证前端数据处理、服务端状态与回调边界，执行扩展测试、类型检查与构建并同步来源文档。
- [x] 交付可复现验收步骤，停在用户验收，不主动提交或进入 Activity 接入。

## 验收标准

- 同一共用组件可以用不同列和数据渲染，源码不依赖 Activity 等业务模块。
- 前端模式中搜索、文本/选项/日期筛选、重置、排序与分页共同生效，筛选或每页条数改变后回到首页；空结果不会出现负页码或可用的无效翻页操作。
- 服务端模式中控件变化准确通知业务；数据加载交由业务完成，结果不被当前页本地筛选/排序截断。仅知道页数或总数时按约定显示，不伪造统计数据。
- 行选择、列显隐、批量操作可按需关闭；当前页全选语义明确，不使用数组下标造成换页后误选。
- 加载、刷新、失败及空状态各有明确展示；失败不伪装为空数据，组件不会自行重试、弹业务 Toast 或请求 API。
- 用户在 Chrome/Edge 使用最小示例确认筛选、排序、分页、列显隐、选择及状态反馈；构建位置与具体操作步骤实施后写入交付记录。自动化通过不等于用户验收。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- 状态：已完成。

- [Issue](2026-11-08-extension-data-table-issue.md)

#### 预期交付边界

基于 shadcn 官方组件与 TanStack Table，在扩展中提供可复用 DataTable，覆盖分页、筛选、排序、列显隐、可选行选择及加载/失败/空状态，支持前端和服务端数据处理模式。业务请求与 Activity 接入不在本工作项内。

#### 实际交付

- 按用户最新要求，所有界面控件采用官网基础组件及组合：Calendar/Popover 日期范围、Command/Popover 选项筛选、DropdownMenu 列显隐、Pagination 分页、Empty 空状态与 Alert 错误；撤销原生日期面板和简化展示。TanStack 继续负责表格逻辑。

- 迁入固定版本的官方 Table、Input、Checkbox、Select、Calendar、Command、Pagination、Alert；必要适配为本地导入路径与 data-theme 明暗选择器；补齐同版 DialogHeader 与 DropdownMenuCheckboxItem，保留已有组件的其他实现。
- custom/data-table 实现主体、筛选工具栏、排序标题、分页栏与公开类型/入口，支持前端/服务端受控模式、列显隐、可选选择、业务批量操作插槽及加载/失败/空状态。
- 新增精确依赖 @tanstack/react-table 8.21.3、react-day-picker 9.11.1、cmdk 1.1.1，同步 pnpm-lock.yaml；未升级其他依赖。
- 新增开发模式按需加载示例，入口为 newtab.html?table-demo，不修改正式导航；提供两种模式与状态示例，服务端行为仅内存模拟。
- 新增使用说明、真实数据处理与服务端边界逻辑测试，同步官方来源记录。

#### 验证与限制

- 安装依赖成功，精确版本与锁文件已同步。
- pnpm --filter @exts/extension test --no-file-parallelism --maxWorkers=1：29 个文件、122 项通过，新增 6 项无 DOM 的逻辑测试，验证条件变化页码重置、筛选/排序/分页组合、服务端不重复处理响应及空数据边界；追加日历日期转换和大量页码有界生成测试。一次新增测试发现低年份缺少前导零，已在日期转换函数修正，唯一一次修复重跑通过。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过；保留既有 theme-init 非 module 脚本与大于 500 kB 分块警告。
- 代理未执行浏览器视觉/交互验收或实际后端联调；示例不请求 API。未启动开发服务或更新稳定开发目录。
- 未引入假 DOM、界面快照或焦点/布局自动化测试；真实视觉与操作由用户验收。

#### 用户验收

用户于 2026-11-08 明确表示验收通过并要求 commit；具体浏览器操作细节未单独记录。

#### 提交方案

##### 代码提交

- 文件：apps/extension/package.json、pnpm-lock.yaml、apps/extension/src/entrypoints/newtab/main.tsx、apps/extension/tests/components/data-table.test.ts。
- 官方 UI：apps/extension/src/components/ui/{table,input,checkbox,select,calendar,command,pagination,alert,dialog,dropdown-menu}.tsx。
- 通用组合：apps/extension/src/components/custom/data-table/{column-header,data-table,date-filter,example,pagination,toolbar}.tsx 与 {index,state,types}.ts。
- 摘要：新增官方基础组件及必要组合依赖；实现通用表格、两种处理模式、开发示例和逻辑测试。

```text
feat(extension): 新增可复用的通用数据表格

- 组合 shadcn 官方组件实现分页筛选排序与行选择
- 支持前端和服务端模式并提供开发示例及逻辑测试
```

##### 文档提交

- 文件：docs/ohmy-delivery/readme.md、对应 Issue 与本 Commit 记录、docs/extension/data-table.md、docs/web-ui-sources.md。
- 摘要：记录来源、接入与验收步骤、实际验证及用户验收结果。
- 机械性终态更新：Issue 与交付记录已完成、提交批准已批准、清空工作台当前 Issue 并移入完成索引。文档提交失败时恢复待提交和待批准，保留成功的代码提交。

```text
docs(extension): 记录通用表格交付与验收结果

- 记录组件来源和通用表格接入及验收步骤
- 同步用户验收与工作项完成状态
```

#### 最终提交批准

已批准。用户于 2026-11-08 明确要求验收通过 commit，批准代码与文档两笔本地提交及上述机械性终态更新，不包含推送或发布。

## 关联文档

- [使用与验收说明](../../../extension/data-table.md)
- [验证规范](../../../verification.md)
- [Web UI 来源](../../../web-ui-sources.md)
- [官方 Table](https://ui.shadcn.com/docs/components/base/table)
- [官方 Data Table](https://ui.shadcn.com/docs/components/base/data-table)
- [TanStack Table](https://tanstack.com/table/latest/docs/overview)

## 历史补充

### 元信息

- 当前阶段：用户已验收并批准本地提交，代码与文档分别完结
- 已批准范围依据：用户确认采用 shadcn 官方组件与 TanStack Table，要求先建立 Issue，实现可在多个业务中复用的完整通用表格。
- 任务规模：小型，共用展示组件与表格状态组合，不涉及公共 API、数据模型或权限变更。

### 历史后续事项

无。用户于 2026-11-08 明确表示验收通过并要求本地提交，本工作项已完结，未推送或发布。
