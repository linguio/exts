# 删除周计划雷达图交付记录

- Issue：[删除周计划雷达图并检查 Tooltip 宽度](../issues/2026-11-03-extension-remove-radar-issue.md)
- 状态：已完成
- 用户验收：用户明确要求本地提交，按批准完结；未核实浏览器实际验收
- 最终提交批准：已批准（2026-11-03明确要求本地提交）

## 实际交付
- 删除雷达 JSX、Radar/RadarChart/PolarGrid/PolarRadiusAxis 导入及仅雷达引用的 progress 配色配置。
- 按用户后续批准改为左右两列等宽、各自居中，保留图形半径、高度与参数，共用 progress 数据仍供计划环使用，不删除 Recharts 依赖。
- 同步现行 UI 与来源说明，保留历史 Issue/Commit 记录。
- 初次只读检查活动应用和归档 Tooltip（调整前）：普通提示 width:fit-content，无显式最小/最大宽度；帮助提示另有 max-width:280px；文件名 max-width:min(32rem,calc(100vw - 2rem))、word-break:break-all；图表内容 width:auto、min-width:8rem、无显式最大宽度；日历外层 fit-content、内层复用图表；归档 Tooltip width:auto，无显式宽度约束。以上 white-space 均未显式设置，当前普通继承链为 normal。图表数据行 flex-wrap，帮助说明 p 段落独立分行。没有统一固定宽度。
- Radix 定位包装器 min-width:max-content；当前 Recharts Tooltip 包装器没有 nowrap。普通 Tooltip 与调用方样式保持；用户随后明确批准共用数据 Tooltip 调整，见下项。
- 共用 ChartTooltipContent 移除 min-w-[8rem]，以 w-max 随内容取宽、min-w-[120px] 统一最小宽度，不设固定宽高；whitespace-nowrap 禁止文字自动换行、移除数据行 flex-wrap，标题和各数据行仍独立显示。内边距从左右10px/上下6px 改为全局 p-4（当前16px）。日历与各图表共用，不在业务层覆盖。

- 分类名称改为 Exercise/Reading/Learning/Creation；日历与趋势提示仅显示 MM-DD，数据日期键保留年份。周标题为 W<周号> Time Spent / W<周号> Plan，两图使用同一实际周号；周日开周、含元旦为第1周，统计范围不变。

## 验证与限制
最小宽度与英文/日期/周号调整后执行测试、类型检查、生产构建与差异检查，结果如下。
- pnpm --filter @exts/extension test：15 文件、80 测试通过；新增周号测试先失败后通过，覆盖同周、下一周与元旦边界。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过，产物 dist/build/chrome-mv3。
- git diff --check：通过；活动源码无 Radar/PolarGrid/PolarRadiusAxis/color-progress 残留。
- 类型检查初次发现测试数组被推断为可缺项，增加只读元组声明后重试通过；未改变业务代码。
- 保留 theme-init.js 非模块打包提示与 chunk 超过 500 kB 警告。
- 浏览器视觉/布局/交互未由代理验证；用户明确要求本地提交完结，沿用已有结果，不追加验证；代码与文档分开本地提交，未推送。

## 文件边界与完整 Commit message
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

文档：本 Issue、Commit 记录、docs/changes/README.md、docs/extension/ui.md、docs/web-ui-sources.md。

```text
docs(extension): 记录雷达图移除与 Tooltip 宽度检查

- 同步现行图表规范及来源说明
- 记录删除范围、Tooltip 检查与验证限制
```

本次按用户明确本地提交批准同步终态：Issue 与本记录已完成，批准字段已批准，工作台移入已完成索引；不推送。
