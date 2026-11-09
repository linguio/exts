# 每日活动真实更新：交付记录

## 对应工作项

- [Issue](../issues/2026-11-09-activity-days-update-issue.md)

## 预期交付边界

为 Daily 与 Settings 两张表新增稳定 ID 并保留业务唯一约束；提供只更新本人既有 Daily 记录的业务 POST 接口，Extension 从临时预览切换为真实保存并限制数字输入。并发依赖 PostgreSQL UPDATE 自动行锁，不新增 version 或应用锁。

## 实际交付

Cursor Agent CLI composer-2.5 实施 0004 迁移、Activity 更新 API、Settings ID 响应、Extension Daily 真保存及相关行为测试；Codex 审查并交回 SQL 列名错误、响应元数据回归与 OpenAPI 测试预期，均已修正。用户验收反馈后，共用表格查询失败改为空表格、右下角中文 Toast，保留失败页码与可重试条件，规则同步表格规范。目标库 `neondb` 的 0004 已应用，Daily 9 行与 Settings 1 行全部回填唯一 ID；两表主键均为 `id`，原业务唯一约束保留。

## 验证与限制

Activity、Settings 与 OpenAPI 的 API 针对性测试共 31 项通过；查询反馈修正后的 Extension 相关测试 39 项通过、类型检查和生产构建通过。API 全套测试共 63 项中，除环境临时目录权限错误外无业务失败；同类环境错误两次后停止重试。显式隔离 PostgreSQL 测试库未配置，迁移/并发实库自动化测试跳过；目标库迁移已只读核对行数、ID 唯一性与约束。尚未部署新 API，也未做 Chrome/Edge 用户交互验收；未推送。

## 用户验收

用户提出查询失败提示问题，已按反馈修正；其后明确要求本地提交，按仓库规则批准完结。Chrome/Edge 实际验收未执行。

## 提交方案与消息

代码边界：`apps/api/migrations/0004_record_uuid_ids.sql`、`apps/api/modules/activity`、`apps/api/modules/settings`、相关 API 测试，`apps/extension/src/api/activity.ts`、`apps/extension/src/components/custom/data-table`、`apps/extension/src/features/activity` 与相关 Extension 测试。代码提交 35 个文件，新增 635 行、删除 64 行。

```text
feat(exts): 接入 Daily 真实更新与记录主键

- 为 Daily 和 Settings 增加 UUID 主键并保留业务唯一约束
- 接入 Daily 更新接口、数字输入与服务端刷新
- 查询失败保持空表格并使用中文 Toast
```

文档边界：`apps/api/README.md`、`docs/api-conventions.md`、`docs/extension/data-table.md`、`docs/table-conventions.md`、本 Issue、Commit 记录与工作台。

```text
docs(repo): 完结 Daily 更新与表格错误反馈规范

- 记录数据库迁移、验证结果与未验收事项
- 统一表格查询失败的空状态和中文提示
```

## 最终提交批准

用户已明确批准本地提交；代码与文档分笔提交。不推送或发布。
