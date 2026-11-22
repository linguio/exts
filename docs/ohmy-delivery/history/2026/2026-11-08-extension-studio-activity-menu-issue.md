---
date: "2026-11-08"
scope: extension
status: completed
type: task
---

# 完善 Studio 登录提示与活动入口

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

Studio 原有 No pages yet / No content yet 未区分账号状态。交付可复用的账号内容边界、前端菜单与 Daily 页面，整理 Activity 目录并补齐通用表格规范及官方全局样式，避免以后新增页面重复登录/重置逻辑或遗漏基础依赖。

### 排除项

- 不接 Daily 接口、不增加后端分页或数据库字段，不录入、编辑、删除、导出或存储模拟业务记录。
- 不增加路由、云端菜单、权限框架或全局页面状态库，不改变 Home/Dock 和认证协议。
- 不升级无关依赖或迁移其他应用，不把官方来源等同于视觉一致或用户验收。
- 不使用子代理、并行命令、假 DOM 或视觉/布局/焦点/键盘/指针自动化验收。

## Todo

- [x] 实现本机 Home/Studio 偏好、启动恢复与账号重置保留规则，并验证清理边界。

- [x] 收敛用户最后确认的菜单、页面、目录与官网基础层范围。
- [x] 实现共用账号状态与会话边界、dashboard-01 侧栏及截图要求的平铺菜单。
- [x] 交付 Daily 日期查询条件、六列表头与明确的未接入空状态，暂不展示统计分页。
- [x] 迁移 Activity 目录并保留首页行为和既有测试覆盖。
- [x] 一次性对齐官网基础层并补齐规范、来源与接入说明。
- [x] 完成必要验证与用户验收步骤，停在待验收，不自动提交。

## 验收标准

### 验收标准与唯一下一步

用户重新加载根 dist/build/chrome-mv3：

1. 未登录进入 Studio，左侧只有品牌、Home、账号入口及 Not signed in 缺省提示，右侧为登录提示；业务菜单不出现。
2. 登录后看到 Activity 分组与 Daily 平铺项，均无自动选中；右侧 Select a page。点击 Daily 后直接显示官方日期范围、六列表头和无记录/未接入提示，没有接口请求、模拟记录、总数或分页。选择日期、重置及列显隐可以操作。
3. 取消登录保留访客提示；退出后隐藏菜单并恢复提示。换号或重新登录不复用旧选择与页面状态。读取失败与会话过期各自反馈正确。
4. 切到 Studio 后刷新、新开标签页应恢复 Studio；返回 Home 后刷新应恢复 Home；其他已打开标签页不自动跳转。退出后仍停 Studio 登录提示，新登录后没有 Daily 选中项。
5. 检查明暗主题、边框、inset/offcanvas 侧栏、窄屏选择后关闭 Sheet、返回 Home 及原首页图表行为；这些视觉和真实交互由用户验收。

129 项完整逻辑测试通过；修正读取类型收窄后相关 4 项复测、类型检查与最终生产构建通过，保留既有构建警告；代理未执行浏览器验收，未更新稳定开发目录。使用 dist/dev 者自行启动 pnpm ext:dev 更新。用户于 2026-11-08 明确要求 commit，按规则批准本工作项完结；上述步骤保留为复现说明，未执行的浏览器检查不记为通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- 状态：已完成。

- [Issue](2026-11-08-extension-studio-activity-menu-issue.md)

#### 预期交付边界

Studio 共用账号提示与内容重置、dashboard-01 侧栏、Activity / Daily 查询空表结构、Activity 目录整理、完整官方基础主题及规范、本机视图偏好。Daily 不接接口，不修改后端契约。

#### 实际交付

- Studio 统一读取账号，访客左侧显示官方 Empty、右侧显示登录提示，复用现有 AccountDialog；会话过期与普通错误分别处理。登录不自动选择页面，账号变化以账号 ID 和重置版本使内容与旧选择失效。
- dashboard-01 inset/offcanvas 侧栏按用户截图采用分组标题 Activity 与图标平铺项 Daily，保留 Exts、Home、账号入口；移除折叠菜单和缩进。官方 SidebarGroup/Label、BreadcrumbSeparator、EmptyContent 按固定版本补齐。
- Daily 展示官方日期范围筛选、六列表头和明确未接入的 Empty；不填模拟记录或调用 API，不显示总数、分页、页面标题说明及可见 caption。Columns 位于工具栏最右侧，固定文案使用英文。
- 通用 DataTable 增加可选 emptyContent、showPagination、showCaption，默认行为保留，无障碍名称保留。业务列和文案属于 Activity。
- Activity 按 charts/daily/data 分组，原卡片、Provider、算法与消息入口引用同步；保留原时长格式、上海跨日展示更新和既有行为测试，不增加跨日请求。
- 完整迁入固定官方主题骨架 shadcn-theme.css 与 Tailwind 扩展 shadcn.css；核对 70 个标准变量/映射名称。tw-animate-css 精确版本 1.4.0 及锁文件同步；默认边框、轮廓、明暗变体接入现有主题，原个性化颜色/材质/圆角覆盖保留。
- chrome.storage.local.ui.view 保存 Home/Studio，启动读取后再挂载，快速切换串行保存，不广播其他已打开标签页导航。账号重置统一移除除 ui 外的本地键，不把位置混入云端 settings，不保留 Daily 选择或业务数据。
- 扩展 AGENTS、UI 规范、DataTable API 说明、官方来源、Issue 与工作台同步。

#### 验证与限制

- pnpm --filter @exts/extension test --no-file-parallelism --maxWorkers=1：31 个文件、129 项通过。
- 本机位置读取最初缺少 view 属性类型收窄，补齐后相关视图偏好/账号重置 2 个文件、4 项复测通过。
- pnpm --filter @exts/extension typecheck：最终通过。
- pnpm ext:build：最终通过，产物 dist/build/chrome-mv3；既有 theme-init 非 module 脚本和大分块警告保留。
- 固定官方主题的 70 个标准变量/映射名称齐全，目标 var 均有定义；按声明与选择器核对，明暗两种模式原有 Token 取值保留。这不等于浏览器视觉验收。
- git diff --check：开发交付时通过；本地提交请求后未追加检查。
- 未执行代理真实浏览器视觉、布局、焦点、键盘、登录/退出、多标签页或刷新验收；未更新 dist/dev 稳定开发目录。未接 Daily API，未推送或部署。

#### 用户验收

用户于 2026-11-08 明确要求 commit，按仓库规则批准当前工作项本地提交完结；实际浏览器验收细节未另行记录，不把未执行事项记为通过。

#### 提交方案

##### 代码提交

- apps/extension/package.json、pnpm-lock.yaml。
- apps/extension/src/app/{App.tsx,view-preference.ts}、entrypoints/newtab/main.tsx、features/account/background.ts。
- apps/extension/src/components/custom/data-table/{data-table.tsx,toolbar.tsx,types.ts}、components/custom/{types.ts,ui-icon.tsx}、components/ui/{breadcrumb.tsx,empty.tsx,sidebar.tsx}。
- apps/extension/src/features/activity 原文件迁移至 charts/ 与 data/，根 background.ts 引用调整，daily/{columns.tsx,daily-empty.tsx,daily-records.tsx}；pages/newtab/cards.tsx。
- apps/extension/src/pages/studio/{index.tsx,studio-sidebar.tsx,daily-page.tsx,menu.ts,studio-access.ts,studio-content.tsx}。
- apps/extension/src/styles/{index.css,theme.css,shadcn-theme.css,shadcn.css}。
- apps/extension/tests/app/view-preference.test.ts、tests/pages/studio/studio-access.test.ts、tests/features/account/account-reset.test.ts、tests/features/activity/{activity-calendar.test.ts,data.test.ts}。
- 摘要：交付 Studio 账号与菜单、Daily 查询空表、本机视图偏好，完成目录迁移与官方样式基础层对齐。

```text
feat(extension): 完善 Studio 活动页面与本机视图偏好

- 统一账号内容边界并加入 Activity 与 Daily 查询空表
- 整理 Activity 目录并完整对齐 shadcn 基础主题
- 保存本机视图位置并在账号重置时保留
```

##### 文档提交

- apps/extension/AGENTS.md、docs/extension/{ui.md,data-table.md}、docs/web-ui-sources.md、docs/ohmy-delivery/readme.md、对应 Issue 与本 Commit 记录。
- 摘要：同步实际目录、官方组件与主题边界、本机持久化、接入说明及有效验证结果。
- 随文档提交的机械性终态更新：Issue 与交付记录已完成、提交批准已批准、工作台清空当前 Issue 并移入完成索引。失败时保留成功代码提交，文档恢复待提交及待批准。

```text
docs(extension): 记录 Studio 改造与基础主题规范

- 记录菜单和活动页面边界及本机偏好规则
- 同步官方样式来源与工作项完成状态
```

#### 最终提交批准

已批准。用户于 2026-11-08 明确要求 commit，批准两笔本地提交与上述机械性终态更新，不包含推送或发布。

## 关联文档

- [扩展规范](../../../../apps/extension/AGENTS.md)
- [扩展 UI 规范](../../../extension/ui.md)
- [DataTable 接入说明](../../../extension/data-table.md)
- [Web UI 来源](../../../web-ui-sources.md)
- [业务 API 规范](../../../api-conventions.md)

## 历史补充

### 元信息

- 当前阶段：用户批准本地提交完结，代码与文档分别提交
- 已批准范围依据：用户明确要求开始实施，并追加确认 dashboard-01 侧栏、截图中的分组平铺结构、账号可见性、完整官网基础层对齐，以及 Daily 展示查询条件和缺省表格但不接接口。
- 任务规模：当前前端工作项，不修改公共 API、数据库或权限。

### 最终范围

#### 本机视图偏好（用户追加批准）

- chrome.storage.local.ui 保存 view=home/studio，默认 Home；不放云端 settings，不保存账号、Daily 选择或业务数据。
- 启动先读取再挂载 App，刷新/重开浏览器/新标签页恢复最后保存位置；已打开其他标签页不订阅跳转。
- 账号重置保留 ui 区域，其余本地业务数据统一清理；不按菜单增加清理分支。账号业务内容仍按既有会话边界清空。

#### Studio 账号与菜单

- Sidebar 与内容共享 Studio 一次账号读取；未登录左侧使用官方 Empty 显示 Not signed in / Sign in to see your pages.，右侧显示 Sign in to Studio / Sign in to access your personal workspace. 和 Sign in，复用 AccountDialog。
- 账号首次确认显示 Spinner，普通读取失败显示 Alert/Retry，会话过期引导登录，不把失败或未确认身份当成无数据。
- 仅确认登录后显示业务菜单；登录后不自动选择或打开页面，右侧显示 Select a page。退出、换号或同账号重置后旧选择失效，受保护子树按账号 ID 和既有重置版本重建。
- 页面局部状态随子树卸载失效；请求清理、迟到响应、边界外 Provider 和存储继续由所属模块负责，不增加认证 Store、重置总线或菜单级清理清单。
- 采用 dashboard-01 inset/offcanvas、官方尺寸与布局，保留 Exts 品牌、独立 Home、现有账号入口。按用户截图，Activity 是 SidebarGroupLabel 纯文字标题，Daily 是带 NotebookText 图标的平铺 SidebarMenuButton；无折叠箭头或子菜单缩进，不迁入假菜单或示例操作。
- menu.ts 保存前端分组/页面配置，index.tsx 组合菜单选择与面包屑，studio-content.tsx 处理共用账号边界；主动选择 Daily 后面包屑为 Studio / Activity / Daily。

#### Daily 查询与缺省表格

- 用户要求列显示控件位于工具栏最右侧，按钮和菜单标题使用 Columns；工具栏固定文案统一英文，不调整官方控件颜色或状态样式。

- 用户最终要求进入 Daily 即展示日期范围和缺省表格，取代此前整页缺省、不展示表格的方案。登录后仍需用户主动选择 Daily，不自动导航。
- 用户最终要求去掉 Daily Activity 与 Your activity, organized by day.，页面直接展示查询条件和表格；用户另要求删除可见 Daily activity records，保留无障碍名称；复用现有通用 DataTable、官方 Calendar/Popover 日期范围及列控制，列为 Date、Exercise、Reading、Learning、Creation、Sleep。
- 字段沿用既有接口契约：date、exerciseMinutes、readingMinutes、learningMinutes、creationMinutes、sleepMinutes。列定义在 daily/columns.tsx，时长复用原有 formatActivityDuration，NULL 与明确为零保持区分。
- 当前传入真实的空数组，不填模拟记录，不发送接口请求。日期条件只维护本地页面状态；表内官方 Empty 明确说明无记录且数据尚未接入。
- 当前隐藏记录总数和分页区域，不伪造查询统计。DataTable 仅增加可选 emptyContent 与 showPagination，默认行为保持原样，业务文案不进入通用层。

#### Activity 目录整理

- charts/：activity-card.tsx、calendar-grid.tsx、trend-chart.tsx、week-charts.tsx、tooltip-content.tsx、chart-config.ts、provider.tsx、use-activity-today.ts。
- daily/：daily-records.tsx、columns.tsx、daily-empty.tsx。
- data/：types.ts、date.ts、format.ts、calendar.ts、summary.ts、chart-data.ts。
- 根目录保留 background.ts、requests.ts；HTTP 函数继续在 src/api/activity.ts，后端 POST /api/activity/days 不变。
- 保留首页图表、算法、上海跨日展示更新、取消与会话重置行为，迁移同步引用和既有测试，不新增跨日网络请求。

#### 官网基础层与表格规范

- 固定 c257f688cf4de7ec10cc1be84cad29cd4631182c 官方主题/Tailwind 扩展，完整迁入 shadcn-theme.css 与 shadcn.css，核对 70 个标准变量/映射名称及映射目标。
- 补齐官方 base 边框、轮廓、body、data-theme 变体与 tw-animate-css 1.4.0；theme.css 和 index.css 保留已确认的项目取值与旧圆角公式，暗色覆盖优先级正确，不整套覆盖图表灰阶、材质或其他个性化样式。
- 扩展 AGENTS 写简短强制约束，UI 规范写用途及组合，DataTable 文档维护 API，来源文档维护固定版本及差异。官网组件迁入必须一并检查组合、CSS、动画、Token，不能只复制 JSX；确有无法解决问题才说明并等待用户决定，不自行替代。
