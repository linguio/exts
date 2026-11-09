# Activity 小时字段同步实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 Activity API 与 Extension 对齐用户已修改的小时数据库列，并支持 0.5 小时编辑。

**Architecture:** API 公共契约为 `*Hours` JSON；物理列为 NUMERIC `*_minutes` 存小时值，仓储排序/UPDATE 只引用 `*_minutes`。Extension 类型、图表与 Daily 直接使用小时语义。

**Tech Stack:** FastAPI/Pydantic、psycopg/PostgreSQL、React、TanStack Table、现有 shadcn Input。

**Spec:** `docs/superpowers/specs/2026-11-09-extension-toast-daily-validation-hours-design.md`

## Global Constraints

- 数据库已由用户手动迁移；不得创建、执行或修改数据库迁移。
- 公共 JSON 仅 `*Hours`；物理 `*_minutes` 列存小时，不做历史分钟换算。
- 更新请求保持扁平 JSON，`id` 加至少一个 `*Hours` 字段。
- 五项小时值为非负 0.5 倍数，`0` 有效；读取中的 `null` 保留为未填写。
- Cursor 使用 `composer-2.5` 串行实施；不提交、推送或部署。

## Review Focus

- 分页查询为空或有记录时均不引用旧分钟列；相关 API 测试覆盖 OpenAPI/查询字段。
- 0、0.5、1 都能保存，0.25、负数和空值不能越过前端或后台校验。
- 排序字段、行类型、图表汇总和 Daily 列使用相同 `*Hours` 名称，不能混用分钟名。
- 小时格式化不再除以 60，图表目标阈值按等价小时数调整。
- 浏览器原生数字步进是否可见和 Sheet 实际提交由用户在 Chrome/Edge 验收。

### Task 1: API 小时读写契约

**Files:** `apps/api/modules/activity/{schemas,repository,service,router}.py`、`apps/api/tests/test_{activity,app,postgres}.py`、`apps/api/README.md`、`docs/api-conventions.md`

- [ ] API 测试：`mock/行字典` 使用 `*_minutes` 键；HTTP/OpenAPI 断言 `*Hours`。
- [ ] 将 Pydantic 模型、SQL 白名单/更新映射与示例同步为小时；严格拒绝非非负 0.5 倍数，保留 `null` 读取和扁平更新请求。
- [ ] 运行可用的聚焦 API 测试；若本机仍缺 pytest，如实记录限制。

### Task 2: Extension 小时业务与 Daily 编辑

**Files:** `apps/extension/src/api/activity.ts`、`src/features/activity/{background.ts,data/**,daily/**,charts/**,requests.ts}` 及对应 `tests/features/activity/**`

- [ ] 先把 Activity 数据、转换、图表和请求测试改为 `*Hours`，覆盖 `0.5`、0 和非法 0.25。
- [ ] 将 API 类型、后台校验、格式化、汇总阈值、Daily 列和扁平保存请求改为小时；数字输入设置 0.5 步进并展示 `h`。
- [ ] 运行 Extension `pnpm test`、`pnpm typecheck` 与 `pnpm build`，不做浏览器视觉或交互自动化测试。

### Task 3: 工作项记录与审查

**Files:** 当前 Issue、Commit 记录、`docs/extension/ui.md`、`docs/table-conventions.md`（仅在现有分钟规则需更正时）

- [ ] 记录实际字段、验证结果和未验证的浏览器/API 部署限制；不把未运行 API 测试写为通过。
- [ ] Codex 审查 Cursor 实际 diff、`git diff --check` 与检查证据，停在用户 Chrome/Edge 验收。
