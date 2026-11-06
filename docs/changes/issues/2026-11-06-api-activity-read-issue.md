# 建立 Activity 数据库与只读接口

## 元信息

- 工作项：2026-11-06-api-activity-read
- 状态：已完成
- 当前阶段：用户批准本地提交完结；真实联调在后续前端工作项继续
- 已批准范围依据：用户要求按「接口与数据库 → 前端请求与接口数据库联调 → 初始化与重置」拆分 Issue；本轮仅建档。
- 规模：架构任务，涉及用户身份、数据模型及公共 API 边界。
- 最新确认：数据库和认证在 Neon，API 在 Vercel；本地维护表结构后应用到 Neon；统一 Asia/Shanghai；不做旧业务数据兼容或自动迁移，旧数据由用户手动维护。
- 最新授权：用户要求做好分层抽象封装并开始推进，允许本项设计与后续已确认范围的开发；具体设计先按流程确认，未批准直接执行云端变更。
- 设计确认：用户在确认 Vercel 每日任务配置与云端操作边界后回复「可以」，批准本地实现，不包含 Neon 迁移、部署或 Git 提交。
- 云端迁移批准：用户确认此次仅建表而非定时器后，于 2026-11-06 明确要求「开始吧」；批准对既定 neondb 应用 0001 迁移，创建 Activity/版本表及更新时间函数和触发器，设置 Asia/Shanghai。不包含运行建行任务、修改认证表、Vercel 配置部署或 Git 提交。

## 背景与目标

Activity 当前读取扩展内模拟 JSON。先建立多用户隔离的每日数据源和只读接口，数据由用户直接在数据库维护，为后续扩展接入提供契约。

## 范围与排除项

- 按 Activity 模块组织路由、输入输出模型、业务规则和数据访问；SQL 参数化并集中维护，不引入通用 CRUD 基类。
- 沿用 Vercel FastAPI 与 Neon 数据库/认证；验证访问令牌，后端确定 user_id，不信任调用方提供的用户标识。具体令牌校验方式设计后确定，不假设所有访问令牌都是 JWT。
- 统一 /api 前缀、成功 data 与失败 error 格式、HTTP 状态码、参数校验、请求标识及安全日志；不增加无业务用途的 info 或探针接口。
- GET /api/activity/days，startDate/endDate 可选；都不传时查询当前用户全部历史，仅传一个时按对应日期下限或上限查询，两者都传时包含起止日期且起点不得晚于终点。日期升序，仅返回实际存在的行，不分页；暂不增加其他筛选条件。依据用户最新明确要求取消日期必填。
- 每日表 activity_daily_records：user_id、date、exercise_minutes、reading_minutes、learning_minutes、creation_minutes、sleep_minutes、created_at、updated_at。user_id 与现有身份主键匹配；user_id + date 联合唯一；分钟数为非负整数、默认 NULL；创建时间自动填写，修改时间由数据库维护。无 note、growth、派生统计及单独记录 ID。
- API 返回 data.days，单项为 userId、date、五项 camelCase 分钟字段、createdAt、updatedAt，保留 NULL；无数据返回 200 和空数组。依据用户最新要求返回所属用户和创建/更新时间，不返回时区配置或开始日期配置；时间戳使用带偏移的 ISO 8601。
- 用户已确认 Asia/Shanghai；数据库默认、API/任务连接及前端业务日期统一，不设用户时区界面或 Activity 配置表。时间戳采用 timestamptz；定时器若按 UTC 调度则配置等价执行时间，不依赖 Vercel 主机时区。
- 一份统一定时任务为所有用户创建当天缺失行，已有行跳过；新注册用户同样等待任务，不在注册时额外创建。用户从 2026-11-01 开始的历史数据由其手动维护，不做账号特判。
- 表结构、索引和更新时间触发器纳入迁移；自动建行只写 user_id/date，新增可空指标无需修改任务。
- SQL 迁移文件在本地仓库维护并纳入 Git，再使用管理连接按版本应用到 Neon；MCP/CLI 是执行渠道，不取代迁移文件，不新增运行时建表接口，不在 API 启动或普通查询时自动迁移。现有 psycopg 可用于执行，具体迁移命令在设计中确定。
- 不做旧业务表兼容、历史数据导入或自动重写；Neon 托管认证表保留，不属于允许重建的业务表。
- 响应 Cache-Control: no-store，不使用 API/CDN 业务结果缓存。
- 用户追加批准：开发启动命令启用 Uvicorn --reload，便于本地验收接口修改；仅开发环境，不修改生产启动配置。
- 文档响应字段、类型、别名和 NULL 规则与实际 API 共用模型；提供经同一模型序列化的完整示例，并区分示例数据与 Test Request 实际结果，不另外维护一份响应结构。
- 排除项：前端接入、扩展重置、写入/删除接口、备注、动态指标系统、分页及通用 CRUD 框架；仅执行已明确批准的 Neon 0001 迁移，不运行建行任务、不改 Vercel、不部署或 Git 提交。

## Todo

- [x] 确认分层、认证、迁移和任务 Spec 并编写串行执行 Plan；项目 JWKS 实际连通仍待后续验证。
- [x] 实现每日表 DDL、约束、版本化迁移与统一建行任务；已批准并应用 Neon 0001 迁移，任务未运行。
- [x] 实现公共 API 认证、响应/异常规范、数据库访问及 Activity 日期查询。
- [x] 完成认证、日期/空值、任务授权、迁移事务与禁缓存自动检查，隔离实库测试未执行并单独记录。
- [x] 记录本地阶段结果与验收步骤，停在用户验收。
- [ ] Neon 迁移已获批并完成；继续真实接口验收，Vercel 配置部署与每日任务运行仍需批准。

## 验收标准

- 两个不同身份只能读取各自的数据；无效凭据不返回业务数据，错误不泄露令牌或数据库细节。
- 合法范围返回实际数据，空范围结果为 data.days=[]；非法日期或反向范围返回统一 422，身份无效为 401，意外错误为统一 500。
- 手动维护数据后下一次查询返回新值；NULL 与 0 区分，查询不创建数据库行。
- 所有用户使用同一任务，重复执行不覆盖既有值，新用户无需注册侧写入逻辑。
- 不实现前端展示或写入端点；自动验证与云端实际结果分别记录。

## 关联文档

- [交付记录](../commits/2026-11-06-api-activity-read-commit.md)
- [设计](../../superpowers/specs/2026-11-06-api-activity-read-design.md)
- [实施计划](../../superpowers/plans/2026-11-06-api-activity-read.md)
- [后续：前端请求与联调](./2026-11-06-extension-activity-api-client-issue.md)
- [后续：初始化与重置](./2026-11-06-extension-session-reset-issue.md)

## 只读核查事实

- 2026-11-06 使用现有环境连接，只执行只读查询：当前连接数据库为 neondb，会话 TimeZone 为 GMT；public/neon_auth 范围内仅发现 neon_auth 托管表，未发现 public 业务表。
- neon_auth.user.id 为 uuid，createdAt 为 timestamptz；每日表 user_id 拟采用 UUID 并关联此主键，仍需验证 OIDC 访问令牌身份与该主键一致。
- 扩展已使用 OIDC 授权码 + PKCE，resource 为 https://api.exts.linguio.dev；API 现有 psycopg 3.3.6。未读取用户行、凭据或访问令牌。
- 当前会话未发现可用 Neon MCP。OIDC discovery 请求因 URLError 未完成，未据此认定令牌验证机制；后续定位连接原因后核对官方元数据，不为此改现有登录。
- 未修改云端时区、表、认证配置或定时任务。
- 后续核查：官方 OAuth Provider 文档确认发送 resource 时为 EdDSA JWT，需验证精确 iss 与 aud 包含 API resource；本机元数据连接失败原因为 HTTP(S) 代理本机端口拒绝连接，停止同路径重试。设计提议每日建行复用 Vercel Cron，不新增 Neon Function 服务，小时级触发窗口和漏跑历史不自动回填限制待确认。
- 用户确认后已按获准的网络权限只读访问项目公开元数据：issuer/JWKS 地址匹配，公开 OKP 密钥算法 EdDSA；未读取用户令牌。
- 日期可选修正后的 Python 测试 28 项：25 通过、3 项因无 API_TEST_DATABASE_URL 跳过；7 项启动器测试沿用通过结果。安装、pip check、Cron JSON 和只读迁移预览沿用有效结果，neondb 待应用 0001_activity_daily_records.sql，未执行 --apply。

## 本地阶段验收与云端待执行清单

- 检查 API README、设计与迁移文件；只读预览命令为仓库根执行 dist/.cache/api/venv/Scripts/python.exe -B apps/api/scripts/migrate.py，预期显示 neondb 和一份待执行迁移，不创建表。
- 隔离空 PostgreSQL 库配置 API_TEST_DATABASE_URL 后可执行完整 Python 测试；当前未创建云分支或测试库，不把跳过项记作通过。
- 需另行批准：对 neondb 执行 --apply，创建 public.activity_daily_records、public._exts_migrations、更新时间函数/触发器，并将新连接默认时区由 GMT 改为 Asia/Shanghai；不修改 neon_auth 表结构，不导入历史数据。
- 需另行批准：Vercel 服务端配置 DATABASE_URL、NEON_AUTH_ISSUER、API_RESOURCE、独立 CRON_SECRET 并部署。部署会启用一个 UTC 16:00 每日任务，运行时为所有用户创建当天缺失行；必须先完成迁移。
- 云端后验收：无凭据 401；合法用户范围查询 200、数据仅属于本人、空值和 0 区分；两账号隔离；错误响应 requestId/no-store；内部任务重复执行不覆盖手工值。前端仍为模拟 JSON，由下一 Issue 接入，不代表端到端已完成。

## 唯一下一步

无；用户于 2026-11-06 明确选择先本地提交后端、再开始前端 Issue。真实令牌查询、Vercel 部署及任务运行未验收，沿用已有验证并如实保留限制。

## 已批准迁移执行结果

- 2026-11-06：运行 scripts/migrate.py --apply 成功，目标 neondb，应用 0001_activity_daily_records.sql。
- 新管理连接默认 TimeZone 为 Asia/Shanghai；API 池化连接的实际只读事务同样为 Asia/Shanghai，transaction_read_only=on。
- 只读核对 9 个字段、联合主键、neon_auth.user UUID 外键、五个非负约束与启用的 activity_update_timestamp 触发器；迁移版本校验和与本地一致。
- activity_daily_records 行数为 0；没有运行每日任务或插入用户业务记录，没有改动认证表结构、Vercel 配置或部署。
- 此次核对仅确认结构与配置；触发器更新行为、真实用户查询和并发任务仍待实际验收，不把此前跳过的隔离测试改记为通过。

## 本地真实查询准备

- 用户在解释用途和审批范围后明确要求继续，已补齐 Git 忽略的本地环境文件中的 NEON_AUTH_ISSUER/API_RESOURCE，值与公开发行方及现有 API resource 一致；新进程加载校验通过，未输出或变更数据库凭据。
- 环境文件只读属性导致写入失败，定位后仅临时解除指定文件属性，原位更新并恢复原属性；两份失败产生的临时文件已清理并检查不存在。
- 此前只读检查 Activity 表已有 1 条记录，不读取用户数据内容。运行中的本地 API 需要重启以加载环境配置；真实查询仍须调用方提供有效 Bearer 访问令牌，不以用户 ID 或历史 API_ACCESS_TOKEN 代替。未读取用户令牌，未修改 Vercel。
