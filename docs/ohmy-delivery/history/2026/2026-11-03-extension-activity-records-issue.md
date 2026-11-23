---
date: "2026-11-03"
scope: [extension]
status: completed
type: task
---

# 更新两日活动记录与创作周目标

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

活动卡片仅展示用户提供的2026年11月1日和2日记录，清除其他模拟日期记录，周目标按运动3h、阅读5h、学习20h、创作3h计算。

### 范围

修改 Studio 固定活动 JSON 与周目标，同步现行 UI 文档；按用户后续批准，三个视图切换按钮的提示语及可访问名称使用 Check-ins / Trends / Summary。内部继续以分钟存储；用户批准统一睡眠名称与周投入空状态英文文案为 Sleep / No activity this week，零成长日历提示行为保持；用户最新批准 Summary 简称及 W<周号> Spent 周投入标题。

| 日期 | 睡眠h | 运动h | 阅读h | 学习h | 创作h |
| --- | --- | --- | --- | --- | --- |
| 11-01 | 5.5 | 0 | 0 | 0 | 0 |
| 11-02 | 5.5 | 0.5 | 0 | 1 | 0 |

### 排除项

不修改图表布局、颜色、Tooltip样式或统计规则；不引入持久化/录入；不提交、不推送。

## Todo

- [x] 仅保留两日记录，并按小时转换为分钟。
- [x] 周目标按最新要求设为180/300/1200/180分钟，同步现行 UI 文档。
- [x] 按模块名称更新三个切换按钮提示及可访问名称。
- [x] 统一睡眠名称与周投入空状态英文文案，保留零成长日历行为。
- [x] 完成数据核对、扩展测试、类型检查和构建后交付验收。

## 验收标准

- JSON 仅包含2026-11-01与2026-11-02，数值符合上表；其他日期显示无记录。
- 两日成长总计为0h与1.5h，睡眠均为5.5h；创作累计0h，以3h目标计算0%完成率。
- 运动与阅读目标保持，学习20h、创作3h；显示规则保持。
- 三个视图按钮的悬停提示和可访问名称依次为 Check-ins、Trends、Summary。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

- Issue：[更新两日活动记录与创作周目标](2026-11-03-extension-activity-records-issue.md)
- 状态：已完成
- 用户验收：用户明确要求本地提交，按批准完结；未核实浏览器实际验收
- 最终提交批准：已批准（2026-11-03明确要求本地提交）

#### 实际交付
- 固定活动JSON仅保留2026-11-01和2026-11-02，两日睡眠均330分钟、阅读0/0、运动0/30、学习0/60、创作0/0分钟。
- 按用户最新批准，周目标设为运动180/阅读300/学习1200/创作180分钟（3/5/20/3h），图表规则保持。
- 三个视图按钮提示与可访问名称按模块统一为 Check-ins / Trends / Summary，切换行为保持。
- 睡眠名称与周投入空状态统一为 Sleep / No activity this week，零成长日历提示行为保持；周投入标题按最新批准简化为 W<周号> Spent。
- 同步扩展UI文档中的当前记录范围、周目标与入口命名。

#### 验证与限制
- 数据核对通过：JSON仅两日、全部分钟值匹配（按用户最新更正，两日睡眠均330分钟、创作均0分钟），两日成长0h/1.5h、创作累计0h。
- pnpm --filter @exts/extension test：15文件、80测试通过。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过，产物dist/build/chrome-mv3。
- git diff --check：通过。
- 保留theme-init.js非模块打包提示及超过500kB的chunk警告。
- 两日睡眠与创作按用户更正完成；最新周目标3/5/20/3h、视图入口模块名称及睡眠/空状态英文文案调整后，80项测试、类型检查和构建重新通过。
- Chrome/Edge视觉与交互未由代理执行；用户明确要求本地提交完结，沿用已有结果，不追加验证；代码与文档分开本地提交，未推送。

#### 文件边界与完整 Commit message
代码：
- apps/extension/src/modules/studio/data/activity/mock-records.json
- apps/extension/src/modules/studio/utils/activity/summary.ts
- apps/extension/src/modules/studio/components/activity/index.tsx
- apps/extension/src/modules/studio/components/activity/chart-config.ts
- apps/extension/src/modules/studio/components/activity/week-charts.tsx

```text
chore(extension): 更新两日活动记录与创作周目标

- 仅保留十一月一日和二日指定的活动与睡眠数据
- 周目标设为运动三小时、阅读五小时、学习二十小时、创作三小时
- 视图入口使用模块名称，睡眠名称和周投入空状态统一英文
```

文档：本Issue、Commit记录、docs/ohmy-delivery/readme.md、docs/extension/ui.md、docs/web-ui-sources.md。

```text
docs(extension): 记录活动数据与周目标调整

- 同步两日记录和创作周目标说明
- 记录验证结果与浏览器验收边界
```

本次按用户明确本地提交批准同步终态：Issue与本记录已完成、批准字段已批准、工作台移入已完成索引；不推送。

## 关联文档

- [扩展 UI](../../../extension/ui.md)

## 历史补充

### 元信息

- 日期：2026-11-03
- 规模：小型任务
- 批准：用户明确要求仅保留11月1日和2日的数据，创作周目标改为30h；随后更正两天睡眠均为5.5h，并明确确认两日创作均为0h、11月2日学习为1h；最新批准周目标为运动3h、阅读5h、学习20h、创作3h。

### 历史后续事项

用户在Chrome/Edge加载dist/build/chrome-mv3并刷新新标签页：Calendar仅11-01/11-02有记录，分别完成0项/2项；Chart检查Growth合计0h/1.5h、Sleep均为5.5h，其他日成长为0、睡眠无记录；Pie检查Creation累计0h、Plan为0% / 3h；Exercise约17% / 3h、Reading为0% / 5h、Learning为5% / 20h，其他图表样式保持。核对睡眠提示为Sleep、无周投入时为No activity this week；核对三个视图按钮的提示依次为Check-ins、Trends、Summary，切换行为保持。用户于2026-11-03明确要求本地提交，按批准完结；以上保留为可复现验收步骤，未核实浏览器实际验收。不追加验证，不推送。
