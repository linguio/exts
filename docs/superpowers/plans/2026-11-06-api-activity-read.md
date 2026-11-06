# Activity 数据库与只读 API 实施计划

> 使用 executing-plans 串行执行；仓库禁止子代理、并行任务和自动提交。复用用户当前批准的 checkout，不移动既有文档改动。

**目标：** 交付本地可验证的认证只读 API、版本化迁移和统一每日建行任务。

**架构：** FastAPI 装配公共基础能力与 Activity 模块；路由调用业务，业务调用参数化 SQL 仓储。迁移管理命令与定时适配复用数据库连接，不在请求启动时迁移。

**技术：** 现有 Python/FastAPI/psycopg；成熟 EdDSA JWT 库与必要时区数据依赖精确锁定。

**Spec：** [设计](../specs/2026-11-06-api-activity-read-design.md)

## 全局约束

- 仅当前后端工作项；不修改前端，不运行 Neon DDL、不部署、不提交。
- 所有注释中文，UTF-8；依赖固定精确版本；新依赖安装与 API 全量测试记录实际结果。
- 日期统一 Asia/Shanghai，公开路径 /api/activity/days；按用户最新要求 startDate/endDate 可选，不传查询本人全部历史、单独传入按对应边界筛选，不分页。
- HTTP 成功 data、失败 error；失败真实状态码，业务响应 no-store。
- 真实 PostgreSQL 只能使用明确隔离测试连接；无该连接时跳过并记录，不能写生产认证库。

## 1. 公共 HTTP 与 Activity 查询

- [x] 先写 tests/test_activity.py：无凭据返回 401、非法日期返回 422、空数据 200、保留 NULL/0、传入认证 UUID 过滤、异常 requestId/no-store；先观察缺接口失败。
- [x] 新建 core/config.py、responses.py、database.py；连接/事务在上下文内释放，查询只读并设置事务内时区及超时。
- [x] 新建 modules/activity/{schemas,repository,service,router}.py：日期模型和字段别名、列表查询、业务编排及依赖注入。
- [x] 修改 app.py 仅负责装配；现有文档/根跳转保留，统一框架异常与未知错误。

## 2. 身份验证

- [x] 核实 JWT 及 EdDSA 依赖版本，更新两份精确依赖清单并安装，不升级无关包。
- [x] 先写 tests/test_auth.py：用临时 Ed25519 密钥生成测试 token，覆盖正确身份与错误签名/issuer/audience/过期/UUID/算法及公开密钥服务故障。
- [x] core/auth.py 提供 CurrentUser 与 FastAPI 认证依赖；固定 issuer、resource、JWKS URL，使用库验签，不暴露 token；确认认证用户存在。
- [x] 只复用公开 JWKS，不缓存认证结果或业务数据；完善 401/503 区分及 Bearer OpenAPI。

## 3. SQL 迁移与每日任务

- [x] 先写迁移/任务行为测试：预览不写入、校验和变化拒绝、失败事务回滚、密钥拒绝、同日任务跳过已有行；实库用显式隔离连接测试。
- [x] migrations/0001_activity_daily_records.sql 保存联合主键、UUID 外键、非负约束、时间戳触发器；默认时区设置随迁移执行。
- [x] scripts/migrate.py 使用管理连接与事务锁，保存版本/校验和；默认预览，--apply 显式执行，错误仅输出安全分类。
- [x] repository/service 增加仅写 user_id/date 的批量建行；jobs/activity_days.py 校验独立 CRON_SECRET。
- [x] vercel.json 添加一个每日 UTC 16:00 的内部 GET 任务，内部路由不进入公开 OpenAPI。

## 4. 交付与检查

- [x] 调整 tests/test_app.py 的 OpenAPI 契约断言，保留原文档/探针回归；API 完整 unittest、安装依赖一致性检查和必要语法构建检查串行执行。
- [x] 若无隔离 PostgreSQL，记录外键/触发器/实际事务仍待验证；不扩大安装 Docker/Postgres 或创建云分支。
- [x] README/.env.example 记录接口、依赖、迁移预览/apply、时区与 Cron 配置；不写真实凭据。
- [x] 自查身份隔离、认证错误优先级、参数化 SQL、任务幂等及异常日志；按仓库规则不委派审查。
- [x] 更新 Issue、交付记录与工作台至待验收，展示 Neon 迁移及 Vercel 部署前的具体待执行操作；用户验收前不自动进入下一 Issue。

## 执行记录

- 2026-11-06：用户确认设计和 Vercel 每日任务，开始本地实现。云端操作仍单独展示批准。

- 2026-11-06：本地实现完成。Python 23 项通过、隔离实库 3 项跳过；启动器 7 项通过。安装及依赖一致性、语法、Cron 配置与迁移只读预览成功；项目公开 JWKS 已核对。未执行写入迁移、部署或提交，停在本地阶段验收。
- 2026-11-06：按用户最新要求改为可选日期，未传查本人全部历史、单参数筛选对应边界；查询与 OpenAPI 同步，Python 更新为 24 项通过、实库 3 项跳过。无需调整表结构或迁移。
- 2026-11-06：按用户要求增加 userId、createdAt、updatedAt 响应字段，时间戳保留偏移；表中已有这些列，无需新增迁移。
- 2026-11-06：用户明确批准仅执行 Neon 迁移；--apply 成功，随后只读核对结构、校验和及默认/事务时区。Activity 为 0 行，没有运行任务或部署 Vercel，等待手动录入与接口验收。
