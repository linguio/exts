---
date: "2026-11-07"
scope: extension
status: completed
type: feature
---

# 为图表增加共用区域加载状态

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

Activity 请求期间当前只清空记录，图表容易先显示空图。为图表提供明确的区域加载反馈，共享请求复用业务状态，不增加请求或全局布尔状态。

### 范围与排除项

- 范围：迁入固定官方 Spinner 与 Skeleton，保持官方默认样式；共用 LoadingRegion 只按上次成功结果自动选择首次 Skeleton / 后续 Spinner，并提供区域占位与可访问语义；Activity Provider 在同一账号下保留各视图上次成功数据，日历、趋势及 Summary 的两个图表各自显示加载区域；维护组件来源与 UI 文档。
- 官方来源：沿用现有 shadcn 固定基线 c257f688cf4de7ec10cc1be84cad29cd4631182c 的 new-york-v4/ui/spinner.tsx 与 skeleton.tsx；现有 lucide-react 已提供图标，无新增依赖。
- 保留：原有图表尺寸、标题、切换入口、主题 Token、请求/取消/账号隔离和失败 Toast；当前 Activity 四个区域使用共用自动选择，无新建加载专用 Token。加载成功但无记录继续原有空图；失败结束 Loading 并沿用既有提示，不新增错误布局。
- 排除：不做整页遮罩、毛玻璃/透明度/模糊样式、额外主题 Token、全局请求管理器或计时器，不改图表配色或数据、不改 API、不新增 DOM/视觉/交互测试，不提交 Git。
- 规模：单一界面目标，使用本 Issue 的 Todo，不另建 Spec、Plan 或子 Issue。

## Todo

- [x] 迁入固定官方 Spinner 与 Skeleton，建立共用 LoadingRegion。
- [x] Activity Provider 暴露请求状态及同账号各视图上次成功结果，接入四个区域。
- [x] 区域组件自动选择首次官方 Skeleton / 后续官方 Spinner，撤销毛玻璃、模糊、透明度和额外样式。
- [x] 移除临时 3 秒延迟，完成必要验证并同步来源、UI 与交付文档。
- [x] 在扩展 UI 规范记录 LoadingRegion 的适用场景、数据责任与表格等结构边界。
- [x] 用户明确要求本地提交并按项目规则完结；浏览器实际验收未单独确认。

## 验收标准

- 请求进行时，Activity 的日历、趋势及 Summary 左右两区若无该账号该视图的上次成功结果，显示一整块官方基础 Skeleton；已有结果时保留旧图表并居中显示官方 Spinner。标题和切换入口保留，不新增请求。
- 共用 LoadingRegion 自动选择上述两种展示，不提供毛玻璃、透明度或自定义视觉模式；不新建加载专用主题 Token。
- 返回成功、失败、取消或切换账号时不遗留旧请求的 Loading 或数据；未登录不发业务请求，保留原展示。
- 明暗主题沿用现有 Token，减少动画偏好生效；不宣称未经用户确认的视觉验收已通过。
- 用户在 Chrome/Edge 加载构建产物，使用 Network 节流观察三个视图及 Summary 两区，核对成功/失败后的展示与尺寸。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-07-extension-chart-loading-issue.md)

#### 预期交付边界

官方 Spinner 与 Skeleton、共用 LoadingRegion、Activity 请求状态及各图表区域接入；复用现有主题与请求，不改 API 或图表数据。

#### 实际交付

- 从既有固定官方版本迁入 Spinner 与 Skeleton；Spinner 沿用 Loader2Icon、role、aria-label、size-4、animate-spin，Skeleton 沿用 data-slot、animate-pulse、rounded-md、bg-accent；两者只适配 cn 导入路径与仓库格式，保留官方默认样式。
- 共用 LoadingRegion 根据是否有上次成功结果自动选择首次 Skeleton、后续 Spinner；只负责区域占位、可访问语义和居中布局。按最新要求移除毛玻璃、透明度、模糊、颜色覆盖、额外组件动画类与临时 3 秒延迟，不新增 Design Token。
- Activity Provider 维护请求状态和同一账号、各视图上次成功结果；成功空结果也算已加载。再次请求保留旧图表并显示 Spinner，切换账号或刷新页面从首次加载开始，旧请求取消。
- 日历和趋势各使用区域容器，Summary 左右两区分别显示同一请求的 Loading，不新增请求；未登录、成功空记录及失败 Toast 保留。
- 来源、扩展 UI 与工作台同步；无 API、主题 Token、依赖版本或请求客户端变化。
- 扩展 UI 规范补充 LoadingRegion 适用的整块区域、调用方状态责任，以及表格等语义结构不直接套用的边界；本轮无新增代码抽象。

#### 验证与限制

- 样式还原与延迟移除后执行 `pnpm --filter @exts/extension exec vitest run tests/features/activity`：5 个文件、20 项通过；现有测试覆盖数据和请求逻辑，不覆盖 React 区域呈现。
- 执行 `pnpm --filter @exts/extension typecheck` 与 `pnpm --filter @exts/extension build`：均通过；正式产物在根 `dist/build/chrome-mv3`。保留既有 theme-init.js 非 module 提示和大于 500kB 分块警告。
- 静态核对组件职责、Hook 依赖、状态取消边界及可访问语义；未新增测试专用生产逻辑、假 DOM 或结构/样式断言。
- 最新文档本地链接与 `git diff --check` 复核通过；开发服务器返回的 LoadingRegion 已无毛玻璃、透明度参数或额外模式，自动切换的实际视觉仍待用户确认。
- 未做浏览器视觉/布局/交互验收；当前自动切换、明暗主题、减少动画和切换/失败流程需用户确认。试用阶段临时启动的 `pnpm ext:dev` 仍运行，稳定开发产物位于 `dist/dev/chrome-mv3-dev-stable`，页面脚本依赖本机 WXT 服务器。

#### 用户验收

用户最新要求撤销所有加载区域样式定制与延迟，只保留首次 Skeleton、已有成功结果后 Spinner 的共用组合。用户于 2026-11-07 明确要求本地提交并按项目规则批准完结；浏览器实际验收未单独确认，自动化通过不代表视觉验收。

1. 在 Chrome/Edge 扩展管理页加载或重新加载 `/Users/kevin/Documents/GitHub/exts/dist/dev/chrome-mv3-dev-stable`，保持当前 WXT 开发服务及所需 API 服务运行，并打开 Newtab；正式构建在 `dist/build/chrome-mv3`，默认使用正式 API。两种构建均无试用延迟。
2. 已登录时刷新 Newtab，Calendar 首次请求显示一整块基础 Skeleton，标题和切换入口保留；成功后显示原日历。
3. 依次首次加载 Trends、Summary，两图区域各自显示基础 Skeleton；再切回已加载的 Calendar、Trends 或 Summary，保留旧图并居中显示官方 Spinner，无毛玻璃或模糊。四区共享相应请求状态，不为 Summary 多发请求。
4. 快速切换视图或账号，旧请求取消后不能覆盖新数据或遗留 Loading；换账号或刷新页面重新从 Skeleton 开始。未登录保持原展示；成功空记录显示原空图；失败后加载状态结束并沿用失败 Toast。
5. 在浅色、深色和系统主题下确认区域占位、官方默认样式及尺寸；减少动态效果由应用现有全局规则处理。

#### 提交方案

##### 代码提交

文件：`apps/extension/src/components/ui/spinner.tsx`、`apps/extension/src/components/ui/skeleton.tsx`、`apps/extension/src/components/custom/loading-region.tsx`、`apps/extension/src/features/activity/provider.tsx`、`apps/extension/src/features/activity/activity.tsx`、`apps/extension/src/features/activity/week-charts.tsx`。

摘要：官方 Spinner 与 Skeleton、共用区域组件及 Activity 请求状态和分区接入。

```text
feat(extension): 为活动图表增加区域加载反馈

- 组合官方 Spinner 与 Skeleton 区分首次及后续加载
- 四个活动区域按首次与后续请求自动切换反馈
```

##### 文档提交

文件：`docs/web-ui-sources.md`、`docs/extension/ui.md`、`docs/ohmy-delivery/readme.md`、本 Issue 与本 Commit 记录。

摘要：维护来源、主题适配、职责边界、验证结果和浏览器验收步骤。

```text
docs(extension): 记录图表区域加载方案与验收

- 记录官方来源和区域加载职责
- 保存验证结果与浏览器验收步骤
```

用户已明确批准本地提交；代码与文档分开提交，工作台将当前 Issue 移入已完成。未追加检查、推送或发布。

#### 最终提交批准

已批准本地提交；不推送。

## 关联文档

- [Web UI 来源](../../../web-ui-sources.md)
- [扩展 UI](../../../extension/ui.md)

## 历史补充

### 元信息

- 当前阶段：代码与文档分开本地提交完结；浏览器实际验收未单独确认
- 已批准范围依据：用户最新明确要求还原所有额外样式，只保留共用 LoadingRegion 及首次 Skeleton、后续 Spinner 的交互；此前毛玻璃和 3 秒试用延迟不再属于当前交付。

### 历史后续事项

无。用户于 2026-11-07 明确要求本地提交，批准当前工作项完结；未推送。
