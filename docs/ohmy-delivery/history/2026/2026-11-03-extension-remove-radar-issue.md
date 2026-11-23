---
date: "2026-11-03"
scope: [extension]
status: completed
type: task
---

# 删除周计划雷达图并检查 Tooltip 宽度

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

移除 2026-11-03 新增的周计划雷达图，不影响日历、成长/睡眠柱图、投入饼图和计划环；汇总项目所有 Tooltip 的宽度与换行规则。

### 范围

删除雷达 JSX、专属导入与配色配置，同步现行 UI/来源文档。按用户最新要求改为左右两列等宽，保留两图半径、高度、共用周统计和依赖。检查活动应用及归档中的 Tooltip；按最新批准在共用 ChartTooltipContent 设置120px最小宽度、禁止自动换行并以全局 p-4 增大内边距；分类显示 Exercise/Reading/Learning/Creation，日期显示 MM-DD；周标题 W<number> Plan / W<number> Time Spent，周日开始且含1月1日的一周为第1周，两个标题使用同一周号。底层日期键与统计范围保持。

### 排除项

不修改普通按钮/帮助/文件名 Tooltip 样式或其他图表的参数与数据；不改历史交付记录；不提交、不推送。

## Todo

- [x] 删除雷达图及确认无消费者的专用配置，更新现行文档。
- [x] 检查所有 Tooltip 的 width、min-width、max-width、white-space 与换行原因。
- [x] 将两个周图改为左右等宽、各自居中。
- [x] 共用数据 Tooltip 按内容适配宽高、不自动换行，内边距改用全局 p-4。
- [x] 数据 Tooltip 最小宽度120px，分类英文、日期无年份、周标题使用同一实际周号及英文。
- [x] 执行扩展逻辑测试、类型检查、生产构建与差异检查，交付用户验收。

## 验收标准

- Pie 视图不再显示雷达，投入饼图和计划环左右均匀分布，图形半径、高度、配置与数据保持。
- Calendar、Growth、Sleep 及其提示行为保持；雷达专属代码无残留。
- 逐类报告 Tooltip 原有宽度与换行规则；数据 Tooltip 最小宽度120px、无固定宽高，标题和数据行不自动换行，p-4 复用全局间距；其他 Tooltip 样式保持；分类英文、日期无年份，周标题与当前周号对应，跨年周号不影响原统计。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

- Issue：[删除周计划雷达图并检查 Tooltip 宽度](2026-11-03-extension-remove-radar-issue.md)
- 状态：已完成
- 用户验收：用户明确要求本地提交，按批准完结；未核实浏览器实际验收
- 最终提交批准：已批准（2026-11-03明确要求本地提交）

#### 实际交付
- 删除雷达 JSX、Radar/RadarChart/PolarGrid/PolarRadiusAxis 导入及仅雷达引用的 progress 配色配置。
- 按用户后续批准改为左右两列等宽、各自居中，保留图形半径、高度与参数，共用 progress 数据仍供计划环使用，不删除 Recharts 依赖。
- 同步现行 UI 与来源说明，保留历史 Issue/Commit 记录。
- 初次只读检查活动应用和归档 Tooltip（调整前）：普通提示 width:fit-content，无显式最小/最大宽度；帮助提示另有 max-width:280px；文件名 max-width:min(32rem,calc(100vw - 2rem))、word-break:break-all；图表内容 width:auto、min-width:8rem、无显式最大宽度；日历外层 fit-content、内层复用图表；归档 Tooltip width:auto，无显式宽度约束。以上 white-space 均未显式设置，当前普通继承链为 normal。图表数据行 flex-wrap，帮助说明 p 段落独立分行。没有统一固定宽度。
- Radix 定位包装器 min-width:max-content；当前 Recharts Tooltip 包装器没有 nowrap。普通 Tooltip 与调用方样式保持；用户随后明确批准共用数据 Tooltip 调整，见下项。
- 共用 ChartTooltipContent 移除 min-w-[8rem]，以 w-max 随内容取宽、min-w-[120px] 统一最小宽度，不设固定宽高；whitespace-nowrap 禁止文字自动换行、移除数据行 flex-wrap，标题和各数据行仍独立显示。内边距从左右10px/上下6px 改为全局 p-4（当前16px）。日历与各图表共用，不在业务层覆盖。

- 分类名称改为 Exercise/Reading/Learning/Creation；日历与趋势提示仅显示 MM-DD，数据日期键保留年份。周标题为 W<周号> Time Spent / W<周号> Plan，两图使用同一实际周号；周日开周、含元旦为第1周，统计范围不变。

#### 验证与限制
最小宽度与英文/日期/周号调整后执行测试、类型检查、生产构建与差异检查，结果如下。
- pnpm --filter @exts/extension test：15 文件、80 测试通过；新增周号测试先失败后通过，覆盖同周、下一周与元旦边界。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过，产物 dist/build/chrome-mv3。
- git diff --check：通过；活动源码无 Radar/PolarGrid/PolarRadiusAxis/color-progress 残留。
- 类型检查初次发现测试数组被推断为可缺项，增加只读元组声明后重试通过；未改变业务代码。
- 保留 theme-init.js 非模块打包提示与 chunk 超过 500 kB 警告。
- 浏览器视觉/布局/交互未由代理验证；用户明确要求本地提交完结，沿用已有结果，不追加验证；代码与文档分开本地提交，未推送。

#### 文件边界与完整 Commit message
代码：
- apps/extension/src/modules/studio/components/activity/week-charts.tsx
- apps/extension/src/modules/studio/components/activity/chart-config.ts
- apps/extension/src/shared/ui/chart.tsx
- apps/extension/src/modules/studio/components/activity/calendar-grid.tsx
- apps/extension/src/modules/studio/components/activity/trend-chart.tsx
- apps/extension/src/modules/studio/utils/activity/summary.ts
- apps/extension/tests/modules/studio/activity-calendar.test.ts

```text
refactor(extension): 移除雷达图并调整周图与数据提示

- 删除雷达图和专用导入与配色配置
- 将两个周图左右等宽排列，保留图形半径与其他图表数据
- 数据提示最小宽120px、禁止自动换行并增大内边距，分类及周标题英文、日期省略年份
```

文档：本 Issue、Commit 记录、docs/ohmy-delivery/readme.md、docs/extension/ui.md、docs/web-ui-sources.md。

```text
docs(extension): 记录雷达图移除与 Tooltip 宽度检查

- 同步现行图表规范及来源说明
- 记录删除范围、Tooltip 检查与验证限制
```

本次按用户明确本地提交批准同步终态：Issue 与本记录已完成，批准字段已批准，工作台移入已完成索引；不推送。

## 关联文档

- [扩展 UI](../../../extension/ui.md)
- [Web UI 来源](../../../web-ui-sources.md)

## 历史补充

### 元信息

- 日期：2026-11-03
- 规模：小型任务
- 批准：用户明确要求删除当日新增雷达图及专属代码；后续明确要求两个周图左右均匀分布，随后批准数据 Tooltip 不换行、宽高随内容适配并增大内边距；最新要求最小宽度120px、分类英文、日期去掉年份、周标题采用周号与英文。

### 历史后续事项

用户于2026-11-03明确要求本地提交，按批准完结；无需后续实施。浏览器视觉交互未由代理验收，检查方式保留为：在 Chrome/Edge 加载 dist/build/chrome-mv3，核对两图左右分布、120px最小宽度、16px内边距、不换行、英文分类、MM-DD日期与同一周号。不推送。
