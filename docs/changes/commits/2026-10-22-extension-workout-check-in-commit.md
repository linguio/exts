# 增加 Workout 打卡切换：Commit 记录

## 对应工作项

- [Issue](../issues/2026-10-22-extension-workout-check-in-issue.md)

## 预期交付边界

JLPT 与 Workout 单选切换；独立 Workout JSON 初始复制 JLPT，复用现有日历、Tooltip 和灰阶，保持卡片布局。

## 实际交付

- 增加 JLPT / Workout 单选切换，默认 JLPT，忽略取消当前项产生的空值。
- 新增独立 workout.json，保留相同的 30 天日期，重新打散并固定保存模拟分钟数，JLPT 未修改。
- 共用日历和灰阶，日历可访问描述与 Tooltip 时长文案跟随类型；保留原有尺寸和布局。

## 验证与限制

- 数据调整前 pnpm --filter @exts/extension test：11 个文件、48 项通过。
- 数据调整前 pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：成功，产物为 dist/build/chrome-mv3；有 theme-init.js 非 module 脚本警告。
- 最新数据检查通过：30 天日期一致，Workout 分钟数不同且仅含 0/30/60/90，JLPT 未修改；生产 Manifest 与入口此前检查通过。
- 未执行浏览器视觉与交互验收，由用户在 Chrome/Edge 完成；未新增 UI 交互或源码结构测试。

## 用户验收

用户明确要求 commit，批准当前工作项完结及本地提交；代理未执行浏览器视觉与交互验收。

## 提交方案

用户已批准本地提交；交付范围为两个卡片 TSX、workout.json、对应 Issue/Commit 记录和工作台，共 6 个文件。

```text
feat(extension): 增加 Workout 打卡切换

- 增加 JLPT 与 Workout 单选切换及独立本地记录
- 共用日历灰阶与时长展示并同步类型描述
```

用户已明确批准本地提交；本次同步 Issue、Commit 记录与工作台的完成终态。

## 最终提交批准

已批准：用户明确要求 commit；仅提交当前 6 个文件及其终态更新，沿用已有验证，不推送。
