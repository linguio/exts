---
date: "2026-10-22"
scope: extension
status: completed
type: feature
---

# 增加 Workout 打卡切换

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

现有 Daily check-in 仅展示固定 JLPT，增加 Workout 并允许切换对应本地记录。

### 范围与排除项

- 增加 Workout 选项，始终保留一个选中项；刷新后默认 JLPT。
- Workout 独立保存相同的 30 天日期，分钟数重新打散并固定保存，仅使用 0/30/60/90；JLPT 不变。
- 复用 24 周日历、分钟格式、零值无 Tooltip 和明暗灰阶；可访问名称与时长文案跟随类型。
- 不增加编辑、计时、同步、选择持久化、依赖或主题与布局调整。

## Todo

- [x] 增加独立 Workout JSON 与单选切换。
- [x] 复用日历和颜色规则，调整当前类型的描述。
- [x] 执行逻辑测试、类型检查、生产构建与数据核对。
- [x] 整理交付与 Chrome/Edge 用户验收步骤，停在待验收。

## 验收标准

- 默认 JLPT，点击 Workout 后仅 Workout 选中，可切回 JLPT，点击当前项不会取消选择。
- 两组日期一致、分钟数不同，切换后按各自记录显示，共用四档灰阶与 Tooltip 规则，类型描述正确。
- 卡片尺寸和布局保持原样，明暗主题由用户在 Chrome/Edge 验收。

## 唯一下一步

无。

## 交付记录

### 实际验证与验收步骤

- 扩展完整逻辑测试 11 个文件、48 项通过；类型检查与生产构建通过。
- 最新数据检查通过：30 天日期一致，Workout 分钟数已打散且仅含 0/30/60/90，JLPT 未修改；生产 Manifest 与入口此前检查通过。
- 构建提示 theme-init.js 非 module 脚本警告，构建成功；未执行浏览器视觉或交互验收。
- 本次使用 React best-practices 核对两个组件的状态与派生数据、静态导入、类型及可访问描述，未增加副作用或额外依赖。
- Chrome/Edge 扩展管理页加载或重新加载根 dist/build/chrome-mv3，打开新标签页。
- 默认选中 JLPT；切换 Workout 再切回，确认始终只有一个选中，再次点击当前项不会取消选择；刷新恢复 JLPT。
- 两组日期一致，切换后部分格子颜色和分钟数不同。正分钟格子显示日期和对应学习/运动时长；0 分钟无 Tooltip。
- 切换明暗主题，确认灰阶沿用原规则，卡片尺寸与布局保持原样。

### 历史交付记录

#### 对应工作项

- [Issue](2026-10-22-extension-workout-check-in-issue.md)

#### 预期交付边界

JLPT 与 Workout 单选切换；独立 Workout JSON 初始复制 JLPT，复用现有日历、Tooltip 和灰阶，保持卡片布局。

#### 实际交付

- 增加 JLPT / Workout 单选切换，默认 JLPT，忽略取消当前项产生的空值。
- 新增独立 workout.json，保留相同的 30 天日期，重新打散并固定保存模拟分钟数，JLPT 未修改。
- 共用日历和灰阶，日历可访问描述与 Tooltip 时长文案跟随类型；保留原有尺寸和布局。

#### 验证与限制

- 数据调整前 pnpm --filter @exts/extension test：11 个文件、48 项通过。
- 数据调整前 pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：成功，产物为 dist/build/chrome-mv3；有 theme-init.js 非 module 脚本警告。
- 最新数据检查通过：30 天日期一致，Workout 分钟数不同且仅含 0/30/60/90，JLPT 未修改；生产 Manifest 与入口此前检查通过。
- 未执行浏览器视觉与交互验收，由用户在 Chrome/Edge 完成；未新增 UI 交互或源码结构测试。

#### 用户验收

用户明确要求 commit，批准当前工作项完结及本地提交；代理未执行浏览器视觉与交互验收。

#### 提交方案

用户已批准本地提交；交付范围为两个卡片 TSX、workout.json、对应 Issue/Commit 记录和工作台，共 6 个文件。

```text
feat(extension): 增加 Workout 打卡切换

- 增加 JLPT 与 Workout 单选切换及独立本地记录
- 共用日历灰阶与时长展示并同步类型描述
```

用户已明确批准本地提交；本次同步 Issue、Commit 记录与工作台的完成终态。

#### 最终提交批准

已批准：用户明确要求 commit；仅提交当前 6 个文件及其终态更新，沿用已有验证，不推送。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 任务规模：小型任务，一个 Issue，不新增 Spec、Plan 或 Sub-issue。
- 当前阶段：用户明确要求本地提交，随最终交付 Commit 完结；沿用已有验证，不推送。
- 已批准范围依据：用户确认 JLPT 与 Workout 单选切换，默认 JLPT，Workout 独立 JSON 保留相同日期，按最新批准打散模拟分钟数，复用日历、Tooltip 和颜色逻辑，保持布局，并明确要求开始。

### 历史后续事项

本地提交完结；没有后续实施步骤。浏览器验收未由代理执行，步骤保留下方供用户复现。
