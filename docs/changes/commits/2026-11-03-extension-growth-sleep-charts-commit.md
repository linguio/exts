# 展示成长打卡与睡眠趋势：交付记录

- [Issue](../issues/2026-11-03-extension-growth-sleep-charts-issue.md)
- 状态：已完成
- 用户验收与提交批准：用户明确要求本地commit，并最终确认保留雷达图；按该指令完结，不核实是否执行了浏览器验收。

## 实际交付

- Studio固定JSON提供2026-10-07至11-03共28天模拟记录，无录入、持久化、同步或后端。
- 日历保留本地24周、周日开始与未来留白；运动/阅读/学习/创作每日各满30分钟算一项，颜色按0–4项显示。Tooltip只显示日期与明细，无合计/完成数行。
- 成长和睡眠均展示截至昨天的14个自然日。成长按实际分钟堆叠，虚线为14天日均；睡眠按时长四档显示，固定7小时虚线。点击ChevronsUpDown直接切换，Hover提示Growth/Sleep。
- 周日至周六统计，周视图保留三图：实心投入饼图、计划同心环、四轴计划完成率雷达。顺时针或由内到外固定运动/阅读/学习/创作；目标180/300/600/900分钟。计划图形封顶100%，Tooltip保留超额比例；计划环按每25%完成度切换灰阶。
- 雷达保留44px半径，不显示常驻标题与轴文字；三个图同排。周视图Tooltip标题为本周投入/本周计划，无日期范围或progress字段，始终完整四项，当前项整行加粗。
- 时长用小写h、最多一位小数，零和整数无.0。投入明细如30% / 5h，计划如120% / 10h，斜杠后只显示目标时长。
- 全局chart-1..4是唯一中性灰色源，日历仅别名映射，空轨道用muted；根及应用UI规范记录OKLCH参数、背景和相邻对比核算。柱状图整体外轮廓统一4px，使用官方BarStack与Bar，内部接缝直角。
- 迁入固定基线的官方Chart，精确安装Recharts 3.10.1和react-is 19.3.0，不升级既有依赖。

## 验证与限制

- 此前7项针对性、15文件79项完整纯逻辑测试通过；h格式、百分比/时长、日期窗口、达标与周统计边界有覆盖。
- 最终圆角/Radar版本类型检查、生产构建和diff检查通过；该轮无纯逻辑变化，未重复运行79项测试。
- 最终构建newtab约934.82kB、总产物约2.19MB，保留theme-init非module与大chunk提示。
- 根/应用全局灰阶对比核算按不透明数据色；雷达沿用用户示例0.6透明度，不将其观感宣称为已通过同一对比目标。
- 未由代理执行浏览器视觉、布局、Tooltip或切换交互验收；固定模拟日期不会随当天平移。
- 用户本地提交指令后不追加测试、类型检查或构建，不推送。

## 提交边界

- 代码16文件：apps/extension/package.json；pnpm-lock.yaml；src/shared/ui/chart.tsx；src/styles/index.css、theme.css；Studio activity组件index.tsx、calendar-grid.tsx、chart-config.ts、tooltip-content.tsx、trend-chart.tsx、week-charts.tsx；types/activity.ts；utils/activity/calendar.ts、summary.ts；data/activity/mock-records.json；tests/modules/studio/activity-calendar.test.ts。
- 文档8文件：AGENTS.md；apps/extension/AGENTS.md；docs/extension/ui.md；docs/web-ui-sources.md；本Issue、Commit、Plan及docs/changes/README.md。
- 代码先提交，文档后提交。随文档提交的终态更新：Issue/Commit已完成、当前Issue清空并移入完成索引，记录用户本地提交批准；不记录Commit SHA。两笔均成功后才算完结。

## 完整Commit消息

```text
feat(extension): 展示成长打卡与睡眠趋势

- 使用本地模拟数据展示完成项数日历与十四天成长睡眠趋势
- 增加周投入饼图、计划同心环和四轴雷达图
- 统一图表灰阶、圆角与完整数据提示
```

```text
docs(extension): 完结成长与睡眠图表工作项

- 记录交付范围、验证结果与本地提交批准
- 同步全局图表主题及活动卡片组合规范
```

## 可复现验收

1. Chrome/Edge加载根dist/build/chrome-mv3，新标签页默认24周日历，悬停只显示日期与四项h时长；11-03为完成2项。
2. 点击柱状图，2026-11-03当天应展示10-20至11-02共14天；点右侧双箭头直接切换Growth/Sleep，检查参考线和4px圆角。
3. 周视图三图无常驻标题；投入饼图按分类配色，计划环按完成率分档，雷达为四轴0–100%域且无轴文字。Hover完整四项，当前项加粗，中文标题无日期/技术字段。
4. 切换浅深主题检查统一灰阶、提示及卡片边界。日期越过样本范围后自然出现无记录，不生成或平移假数据。
