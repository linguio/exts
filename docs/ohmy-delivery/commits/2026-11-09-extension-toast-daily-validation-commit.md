# 统一提示反馈并修复 Daily 保存校验：交付记录

## 对应工作项

- [Issue](../issues/2026-11-09-extension-toast-daily-validation-issue.md)

## 实际交付

- Toast 英文、Copy 与点击隔离（前序交付，本 diff 保持）。
- 公共契约为 `*Hours`；数据库物理列为 NUMERIC `*_hours`；API、图表和编辑表单均以小时处理，无分钟换算。
- Daily 编辑：`step=0.5`、`unit=h`；扁平更新 `{ id, exerciseHours?, readingHours?, learningHours?, creationHours?, sleepHours? }`。
- 图表目标与睡眠阈值改为等价小时；展示保留 `h` 文案规则。

## 验证与限制

- `cd apps/extension && pnpm test`：40 文件、165 测试通过，exit 0。
- `pnpm typecheck`：exit 0。
- `pnpm build`：WXT chrome-mv3，约 2.06 MB，`dist/build/chrome-mv3`，exit 0（保留 theme-init 与大分块警告）。
- `python3.12 -m pytest apps/api/tests/test_activity.py apps/api/tests/test_app.py apps/api/tests/test_activity_pagination.py`：未执行（`No module named pytest`）。
- `dist/.cache/api/venv/bin/python -B -m unittest apps.api.tests.test_activity apps.api.tests.test_activity_pagination -v`：17 项通过。
- 本地 API OpenAPI 已确认加载 `exerciseHours`、`readingHours`、`learningHours`、`creationHours`、`sleepHours`。
- 未改迁移或生产数据；`test_postgres` 在隔离库模拟 `*_hours`，仍需 `API_TEST_DATABASE_URL`。
- 未做浏览器视觉/原生 number 步进自动化。

## 用户验收

用户验收通过。

## 提交方案

代码：`fix(extension): 统一 Activity 小时字段与保存校验`

文档：`docs(repo): 记录 Activity 小时字段交付`

## 最终提交批准

用户已明确批准本地提交；不推送、不部署。
