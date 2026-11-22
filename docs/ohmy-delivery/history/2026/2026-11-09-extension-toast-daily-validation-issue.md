---
date: "2026-11-09"
scope: extension
status: completed
type: bug
---

# 统一提示反馈并修复 Daily 保存校验

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

Toast 与 Daily 保存已交付；用户已将数据库改为小时列，需消除查询 500，并以小时为唯一单位贯穿读取、排序、图表与编辑。

### 范围与排除项

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

## 唯一下一步

无。

## 交付记录

### 实施结果与验证

- API：Pydantic `exercise_hours` ↔ JSON `exerciseHours`；SQL 排序/UPDATE 仅 `*_hours`；0.5 小时校验；OpenAPI 示例为 `*Hours`。修复表列改名后响应模型仍读取 `*_minutes` 导致的 500。
- Extension：Daily 列与 Sheet 为 `number` + `h`；`formatActivityDuration` 直接格式小时；周目标 3/5/20/3h，睡眠分档 6/7/9h；后台与 `parseActivityDayUpdate` 拒绝 `0.25`。
- 未改 `apps/api/migrations/*`；`test_postgres` 在隔离库将迁移创建的 `*_minutes` 转为浮点并重命名为 `*_hours`，模拟生产表。
- 验证见 Commit 记录；浏览器与真实 API 保存由用户验收。

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-09-extension-toast-daily-validation-issue.md)

#### 实际交付

- Toast 英文、Copy 与点击隔离（前序交付，本 diff 保持）。
- 公共契约为 `*Hours`；数据库物理列为 NUMERIC `*_hours`；API、图表和编辑表单均以小时处理，无分钟换算。
- Daily 编辑：`step=0.5`、`unit=h`；扁平更新 `{ id, exerciseHours?, readingHours?, learningHours?, creationHours?, sleepHours? }`。
- 图表目标与睡眠阈值改为等价小时；展示保留 `h` 文案规则。

#### 验证与限制

- `cd apps/extension && pnpm test`：40 文件、165 测试通过，exit 0。
- `pnpm typecheck`：exit 0。
- `pnpm build`：WXT chrome-mv3，约 2.06 MB，`dist/build/chrome-mv3`，exit 0（保留 theme-init 与大分块警告）。
- `python3.12 -m pytest apps/api/tests/test_activity.py apps/api/tests/test_app.py apps/api/tests/test_activity_pagination.py`：未执行（`No module named pytest`）。
- `dist/.cache/api/venv/bin/python -B -m unittest apps.api.tests.test_activity apps.api.tests.test_activity_pagination -v`：17 项通过。
- 本地 API OpenAPI 已确认加载 `exerciseHours`、`readingHours`、`learningHours`、`creationHours`、`sleepHours`。
- 未改迁移或生产数据；`test_postgres` 在隔离库模拟 `*_hours`，仍需 `API_TEST_DATABASE_URL`。
- 未做浏览器视觉/原生 number 步进自动化。

#### 用户验收

用户验收通过。

#### 提交方案

代码：`fix(extension): 统一 Activity 小时字段与保存校验`

文档：`docs(repo): 记录 Activity 小时字段交付`

#### 最终提交批准

用户已明确批准本地提交；不推送、不部署。

## 关联文档

- [小时设计](../../../superpowers/specs/2026-11-09-extension-toast-daily-validation-hours-design.md)
- [小时计划](../../../superpowers/plans/2026-11-09-extension-toast-daily-validation-hours.md)

## 历史补充

### 元信息

- 当前阶段：本地提交
- 已批准范围依据：Toast 英文与复制；Daily 小时字段 `0.5` 步进与非负校验；公共 `*Hours` 与生产 NUMERIC `*_hours` 对齐。
- 规模：Extension + API 契约同步；补充小时字段设计与计划。
- 执行分工：Codex 审查与验证证据；Cursor `composer-2.5` 实施，不自行提交。

### 历史后续事项

无。用户已验收并要求本地提交。
