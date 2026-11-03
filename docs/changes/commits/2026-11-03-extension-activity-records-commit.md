# 两日活动记录与创作周目标交付记录

- Issue：[更新两日活动记录与创作周目标](../issues/2026-11-03-extension-activity-records-issue.md)
- 状态：已完成
- 用户验收：用户明确要求本地提交，按批准完结；未核实浏览器实际验收
- 最终提交批准：已批准（2026-11-03明确要求本地提交）

## 实际交付
- 固定活动JSON仅保留2026-11-01和2026-11-02，两日睡眠均330分钟、阅读0/0、运动0/30、学习0/60、创作0/0分钟。
- 按用户最新批准，周目标设为运动180/阅读300/学习1200/创作180分钟（3/5/20/3h），图表规则保持。
- 三个视图按钮提示与可访问名称按模块统一为 Check-ins / Trends / Summary，切换行为保持。
- 睡眠名称与周投入空状态统一为 Sleep / No activity this week，零成长日历提示行为保持；周投入标题按最新批准简化为 W<周号> Spent。
- 同步扩展UI文档中的当前记录范围、周目标与入口命名。

## 验证与限制
- 数据核对通过：JSON仅两日、全部分钟值匹配（按用户最新更正，两日睡眠均330分钟、创作均0分钟），两日成长0h/1.5h、创作累计0h。
- pnpm --filter @exts/extension test：15文件、80测试通过。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过，产物dist/build/chrome-mv3。
- git diff --check：通过。
- 保留theme-init.js非模块打包提示及超过500kB的chunk警告。
- 两日睡眠与创作按用户更正完成；最新周目标3/5/20/3h、视图入口模块名称及睡眠/空状态英文文案调整后，80项测试、类型检查和构建重新通过。
- Chrome/Edge视觉与交互未由代理执行；用户明确要求本地提交完结，沿用已有结果，不追加验证；代码与文档分开本地提交，未推送。

## 文件边界与完整 Commit message
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

文档：本Issue、Commit记录、docs/changes/README.md、docs/extension/ui.md、docs/web-ui-sources.md。

```text
docs(extension): 记录活动数据与周目标调整

- 同步两日记录和创作周目标说明
- 记录验证结果与浏览器验收边界
```

本次按用户明确本地提交批准同步终态：Issue与本记录已完成、批准字段已批准、工作台移入已完成索引；不推送。
