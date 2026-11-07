# 为图表增加共用区域加载状态

## 元信息

- 工作项：2026-11-07-extension-chart-loading
- 状态：已完成
- 当前阶段：代码与文档分开本地提交完结；浏览器实际验收未单独确认
- 已批准范围依据：用户最新明确要求还原所有额外样式，只保留共用 LoadingRegion 及首次 Skeleton、后续 Spinner 的交互；此前毛玻璃和 3 秒试用延迟不再属于当前交付。

## 背景与目标

Activity 请求期间当前只清空记录，图表容易先显示空图。为图表提供明确的区域加载反馈，共享请求复用业务状态，不增加请求或全局布尔状态。

## 范围与排除项

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

## 关联文档

- [交付记录](../commits/2026-11-07-extension-chart-loading-commit.md)
- [Web UI 来源](../../web-ui-sources.md)
- [扩展 UI](../../extension/ui.md)

## 唯一下一步

无。用户于 2026-11-07 明确要求本地提交，批准当前工作项完结；未推送。
