# 实现可复用的通用数据表格：交付记录

## 对应工作项

- 状态：已完成。

- [Issue](../issues/2026-11-08-extension-data-table-issue.md)

## 预期交付边界

基于 shadcn 官方组件与 TanStack Table，在扩展中提供可复用 DataTable，覆盖分页、筛选、排序、列显隐、可选行选择及加载/失败/空状态，支持前端和服务端数据处理模式。业务请求与 Activity 接入不在本工作项内。

## 实际交付

- 按用户最新要求，所有界面控件采用官网基础组件及组合：Calendar/Popover 日期范围、Command/Popover 选项筛选、DropdownMenu 列显隐、Pagination 分页、Empty 空状态与 Alert 错误；撤销原生日期面板和简化展示。TanStack 继续负责表格逻辑。

- 迁入固定版本的官方 Table、Input、Checkbox、Select、Calendar、Command、Pagination、Alert；必要适配为本地导入路径与 data-theme 明暗选择器；补齐同版 DialogHeader 与 DropdownMenuCheckboxItem，保留已有组件的其他实现。
- custom/data-table 实现主体、筛选工具栏、排序标题、分页栏与公开类型/入口，支持前端/服务端受控模式、列显隐、可选选择、业务批量操作插槽及加载/失败/空状态。
- 新增精确依赖 @tanstack/react-table 8.21.3、react-day-picker 9.11.1、cmdk 1.1.1，同步 pnpm-lock.yaml；未升级其他依赖。
- 新增开发模式按需加载示例，入口为 newtab.html?table-demo，不修改正式导航；提供两种模式与状态示例，服务端行为仅内存模拟。
- 新增使用说明、真实数据处理与服务端边界逻辑测试，同步官方来源记录。

## 验证与限制

- 安装依赖成功，精确版本与锁文件已同步。
- pnpm --filter @exts/extension test --no-file-parallelism --maxWorkers=1：29 个文件、122 项通过，新增 6 项无 DOM 的逻辑测试，验证条件变化页码重置、筛选/排序/分页组合、服务端不重复处理响应及空数据边界；追加日历日期转换和大量页码有界生成测试。一次新增测试发现低年份缺少前导零，已在日期转换函数修正，唯一一次修复重跑通过。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过；保留既有 theme-init 非 module 脚本与大于 500 kB 分块警告。
- 代理未执行浏览器视觉/交互验收或实际后端联调；示例不请求 API。未启动开发服务或更新稳定开发目录。
- 未引入假 DOM、界面快照或焦点/布局自动化测试；真实视觉与操作由用户验收。

## 用户验收

用户于 2026-11-08 明确表示验收通过并要求 commit；具体浏览器操作细节未单独记录。

## 提交方案

### 代码提交

- 文件：apps/extension/package.json、pnpm-lock.yaml、apps/extension/src/entrypoints/newtab/main.tsx、apps/extension/tests/components/data-table.test.ts。
- 官方 UI：apps/extension/src/components/ui/{table,input,checkbox,select,calendar,command,pagination,alert,dialog,dropdown-menu}.tsx。
- 通用组合：apps/extension/src/components/custom/data-table/{column-header,data-table,date-filter,example,pagination,toolbar}.tsx 与 {index,state,types}.ts。
- 摘要：新增官方基础组件及必要组合依赖；实现通用表格、两种处理模式、开发示例和逻辑测试。

```text
feat(extension): 新增可复用的通用数据表格

- 组合 shadcn 官方组件实现分页筛选排序与行选择
- 支持前端和服务端模式并提供开发示例及逻辑测试
```

### 文档提交

- 文件：docs/changes/README.md、对应 Issue 与本 Commit 记录、docs/extension/data-table.md、docs/web-ui-sources.md。
- 摘要：记录来源、接入与验收步骤、实际验证及用户验收结果。
- 机械性终态更新：Issue 与交付记录已完成、提交批准已批准、清空工作台当前 Issue 并移入完成索引。文档提交失败时恢复待提交和待批准，保留成功的代码提交。

```text
docs(extension): 记录通用表格交付与验收结果

- 记录组件来源和通用表格接入及验收步骤
- 同步用户验收与工作项完成状态
```

## 最终提交批准

已批准。用户于 2026-11-08 明确要求验收通过 commit，批准代码与文档两笔本地提交及上述机械性终态更新，不包含推送或发布。
