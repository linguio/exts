# 统一提示反馈并修复 Daily 保存校验

## 元信息

- 工作项：2026-11-09-extension-toast-daily-validation
- 状态：已完成
- 当前阶段：本地提交
- 已批准范围依据：Toast 英文与复制；Daily 小时字段 `0.5` 步进与非负校验；公共 `*Hours` 与生产 NUMERIC `*_hours` 对齐。
- 规模：Extension + API 契约同步；补充小时字段设计与计划。
- 执行分工：Codex 审查与验证证据；Cursor `composer-2.5` 实施，不自行提交。

## 背景与目标

Toast 与 Daily 保存已交付；用户已将数据库改为小时列，需消除查询 500，并以小时为唯一单位贯穿读取、排序、图表与编辑。

## 范围与排除项

- Toast 与点击隔离：已完成，本阶段不重做。
- Activity `*Hours` 扁平更新、Daily `type="number"` `min=0` `step=0.5`、图表与汇总目标按小时。
- 排除：迁移与生产数据写入、分钟兼容、部署/提交。

## Todo

- [x] Toast 与 Daily 整数阶段交付与验证。
- [x] API 查询/更新/排序/OpenAPI：`*Hours` 公共契约，SQL `*_hours`，0.5 校验。
- [x] Extension 类型、表格、图表、后台校验与测试对齐小时。
- [x] 运行约定自动化检查并停在用户验收。

## 验收标准

- Toast 行为保持 Issue 初版标准。
- Daily 五项必填、拒绝 `0.25` 与负数、`0`/`0.5` 可保存；扁平 `{ id, exerciseHours?, … }`。
- Activity 查询/排序 SQL 使用 `*_hours` 列；响应与 UI 使用 `*Hours` 与 `h`。
- Chrome/Edge 视觉与步进控件由用户验收。

## 关联文档

- [交付记录](../commits/2026-11-09-extension-toast-daily-validation-commit.md)
- [小时设计](../../superpowers/specs/2026-11-09-extension-toast-daily-validation-hours-design.md)
- [小时计划](../../superpowers/plans/2026-11-09-extension-toast-daily-validation-hours.md)

## 实施结果与验证

- API：Pydantic `exercise_hours` ↔ JSON `exerciseHours`；SQL 排序/UPDATE 仅 `*_hours`；0.5 小时校验；OpenAPI 示例为 `*Hours`。修复表列改名后响应模型仍读取 `*_minutes` 导致的 500。
- Extension：Daily 列与 Sheet 为 `number` + `h`；`formatActivityDuration` 直接格式小时；周目标 3/5/20/3h，睡眠分档 6/7/9h；后台与 `parseActivityDayUpdate` 拒绝 `0.25`。
- 未改 `apps/api/migrations/*`；`test_postgres` 在隔离库将迁移创建的 `*_minutes` 转为浮点并重命名为 `*_hours`，模拟生产表。
- 验证见 Commit 记录；浏览器与真实 API 保存由用户验收。

## 唯一下一步

无。用户已验收并要求本地提交。
