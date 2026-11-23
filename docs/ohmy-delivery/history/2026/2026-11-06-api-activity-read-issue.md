---
date: "2026-11-06"
scope: [api]
status: completed
type: feature
---

# 建立 Activity 数据库与只读接口

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

Activity 当前读取扩展内模拟 JSON。先建立多用户隔离的每日数据源和只读接口，数据由用户直接在数据库维护，为后续扩展接入提供契约。

### 范围与排除项

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

## 唯一下一步

无。

## 交付记录

### 本地阶段验收与云端待执行清单

- 检查 API README、设计与迁移文件；只读预览命令为仓库根执行 dist/.cache/api/venv/Scripts/python.exe -B apps/api/scripts/migrate.py，预期显示 neondb 和一份待执行迁移，不创建表。
- 隔离空 PostgreSQL 库配置 API_TEST_DATABASE_URL 后可执行完整 Python 测试；当前未创建云分支或测试库，不把跳过项记作通过。
- 需另行批准：对 neondb 执行 --apply，创建 public.activity_daily_records、public._exts_migrations、更新时间函数/触发器，并将新连接默认时区由 GMT 改为 Asia/Shanghai；不修改 neon_auth 表结构，不导入历史数据。
- 需另行批准：Vercel 服务端配置 DATABASE_URL、NEON_AUTH_ISSUER、API_RESOURCE、独立 CRON_SECRET 并部署。部署会启用一个 UTC 16:00 每日任务，运行时为所有用户创建当天缺失行；必须先完成迁移。
- 云端后验收：无凭据 401；合法用户范围查询 200、数据仅属于本人、空值和 0 区分；两账号隔离；错误响应 requestId/no-store；内部任务重复执行不覆盖手工值。前端仍为模拟 JSON，由下一 Issue 接入，不代表端到端已完成。

### 已批准迁移执行结果

- 2026-11-06：运行 scripts/migrate.py --apply 成功，目标 neondb，应用 0001_activity_daily_records.sql。
- 新管理连接默认 TimeZone 为 Asia/Shanghai；API 池化连接的实际只读事务同样为 Asia/Shanghai，transaction_read_only=on。
- 只读核对 9 个字段、联合主键、neon_auth.user UUID 外键、五个非负约束与启用的 activity_update_timestamp 触发器；迁移版本校验和与本地一致。
- activity_daily_records 行数为 0；没有运行每日任务或插入用户业务记录，没有改动认证表结构、Vercel 配置或部署。
- 此次核对仅确认结构与配置；触发器更新行为、真实用户查询和并发任务仍待实际验收，不把此前跳过的隔离测试改记为通过。

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-06-api-activity-read-issue.md)

#### 预期交付边界

多用户每日表、迁移、统一建行任务、认证及公共 API 响应规范、Activity 日期范围只读接口。本地实现及 Neon 0001 写入迁移已获批准；Vercel 配置部署、运行任务与 Git 提交未获批准。

#### 实际交付

已按确认设计完成本地实现：core 公共配置/认证/连接/响应，Activity 模块路由/模型/业务/参数化 SQL，内部每日任务，SQL 迁移和默认只读预览的管理命令。保留公开文档与根跳转；业务响应 no-store，错误含 requestId，不接受调用方指定用户。

表与更新时间触发器保存在 0001 迁移，UUID 外键关联 Neon 用户；迁移版本与规范化校验和同事务登记，锁等待有超时。用户于 2026-11-06 明确批准后，已成功对 neondb 应用迁移并设置 Asia/Shanghai。Vercel 配置一个 UTC 16:00 每日任务的本地文件尚未部署、未启用或运行任务。前端仍未接入，其他两项仅排队。

依据用户后续要求，日期可选且不传查本人全部历史；每日响应增加 userId、createdAt、updatedAt，时间戳携带偏移。只修改查询返回列与模型，表结构及迁移无需变化。

用户追加开发自动重载与文档一致性要求：开发启动器增加 --reload，文档使用实际响应模型生成完整已填写示例，不单独维护结构。框架会过滤示例的 null 字段，已停止并撤回未生效的生成器定制，保留官方生成和非空示例；实际字段可空规则与实际 null 返回不变。重启旧开发进程后生效，文档页需手动刷新。

#### 验证与限制

- Python 完整测试：28 项中 25 通过、3 项实库测试因无显式隔离连接跳过；覆盖 JWT 真实签名与错误身份/声明、可选日期/单边界/不传查全部、参数与空值、统一错误、任务授权、迁移预览/校验/回滚边界及锁超时。依据用户最新要求取消日期必填，OpenAPI 和参数化 SQL 已同步。
- Node 启动器测试 7 项通过；pip check、Python 语法及 Cron JSON 检查通过，diff 检查通过。
- 精确新增 PyJWT 2.15.1、cryptography 50.0.2、cffi 2.1.1、pycparser 3.12、tzdata 2026.6；requirements-dev.txt 通过 -r 复用生产锁定。既有虚拟环境无 pip，补齐 pip 后安装成功；不改系统 Python、不升级无关依赖。
- 本机代理初次阻止 HTTP 请求；使用明确获准的进程网络权限后，公开 OIDC metadata 与 JWKS 只读核对成功，issuer/地址匹配、算法 EdDSA。未读取用户或令牌。
- 迁移先只读预览成功，随后在用户明确批准后执行 --apply 成功：neondb 的 Activity 表、迁移版本表、更新时间函数/触发器及上海默认时区已建立。只读核对 9 个字段、联合主键、UUID 外键、五个非负约束、触发器启用状态及校验和一致。
- 新管理连接及 API 池化连接事务均为 Asia/Shanghai，API 查询事务 readonly=on。Activity 表行数为 0；未执行首次建行、用户数据导入、认证表修改或 Vercel 操作。
- 迁移后用户手动维护阶段只读确认表已有 1 条记录；未读取记录内容。用户批准后补齐本地忽略环境文件的两个公开认证配置并验证新进程加载一致，数据库凭据不变；清理写入失败的临时文件并恢复环境文件只读属性。实际 Bearer 查询尚待用户本地验证，不读取或输出令牌。
- 未执行 PostgreSQL 约束/触发器/并发的真实写入验证，未完成真实用户访问令牌调用、云端任务或部署验收。保留现有 TestClient/httpx 弃用提示，不为此升级测试依赖。

#### 用户验收

用户于 2026-11-06 明确选择「先本地提交后端，再开始前端 Issue」，按批准完结。真实令牌与多用户联调、触发器行为和任务运行尚未验收，不因本地提交改记为通过；前端将连接本地 API 继续联调，Vercel 配置部署另行批准。

#### 提交方案

代码边界：apps/api/app.py、core/、modules/activity/、jobs/、migrations/、scripts/migrate.py、scripts/dev.mjs、vercel.json、requirements.txt、.env.example 和相关 Python/启动器测试。diff 为只读 API、认证与公共响应、每日任务、版本化表结构及开发重载。

```text
feat(api): 建立 Activity 只读接口与版本化数据库结构

- 分层实现用户认证、日期查询和统一响应异常
- 增加每日建行任务及可预览的 SQL 迁移
```

文档边界：apps/api/README.md、当前 Issue/设计/Plan/Commit 记录、工作台及此前批准的后两项排队 Issue/Commit 初始记录；分别记录实际交付及未执行的云端验证，不把排队项写为已实施。

```text
docs(api): 记录 Activity 后端设计与本地验证

- 记录分层、迁移、任务配置及实际验证限制
- 维护前端接入与初始化重置的后续队列
```

已获用户本地提交批准，代码与文档分开提交；仅 Neon 数据结构已应用，API 未部署，不将本地交付写为实际已上线。

#### 最终提交批准

已批准并完成本工作项：用户于 2026-11-06 明确选择先本地提交后端，再开始前端 Issue；不包含推送、Vercel 配置部署或每日任务运行。

## 关联文档

- [设计](../../../superpowers/specs/2026-11-06-api-activity-read-design.md)
- [实施计划](../../../superpowers/plans/2026-11-06-api-activity-read.md)
- [后续：前端请求与联调](2026-11-06-extension-activity-api-client-issue.md)
- [后续：初始化与重置](2026-11-06-extension-session-reset-issue.md)

## 历史补充

### 元信息

- 当前阶段：用户批准本地提交完结；真实联调在后续前端工作项继续
- 已批准范围依据：用户要求按「接口与数据库 → 前端请求与接口数据库联调 → 初始化与重置」拆分 Issue；本轮仅建档。
- 规模：架构任务，涉及用户身份、数据模型及公共 API 边界。
- 最新确认：数据库和认证在 Neon，API 在 Vercel；本地维护表结构后应用到 Neon；统一 Asia/Shanghai；不做旧业务数据兼容或自动迁移，旧数据由用户手动维护。
- 最新授权：用户要求做好分层抽象封装并开始推进，允许本项设计与后续已确认范围的开发；具体设计先按流程确认，未批准直接执行云端变更。
- 设计确认：用户在确认 Vercel 每日任务配置与云端操作边界后回复「可以」，批准本地实现，不包含 Neon 迁移、部署或 Git 提交。
- 云端迁移批准：用户确认此次仅建表而非定时器后，于 2026-11-06 明确要求「开始吧」；批准对既定 neondb 应用 0001 迁移，创建 Activity/版本表及更新时间函数和触发器，设置 Asia/Shanghai。不包含运行建行任务、修改认证表、Vercel 配置部署或 Git 提交。

### 只读核查事实

- 2026-11-06 使用现有环境连接，只执行只读查询：当前连接数据库为 neondb，会话 TimeZone 为 GMT；public/neon_auth 范围内仅发现 neon_auth 托管表，未发现 public 业务表。
- neon_auth.user.id 为 uuid，createdAt 为 timestamptz；每日表 user_id 拟采用 UUID 并关联此主键，仍需验证 OIDC 访问令牌身份与该主键一致。
- 扩展已使用 OIDC 授权码 + PKCE，resource 为 https://api.exts.linguio.dev；API 现有 psycopg 3.3.6。未读取用户行、凭据或访问令牌。
- 当前会话未发现可用 Neon MCP。OIDC discovery 请求因 URLError 未完成，未据此认定令牌验证机制；后续定位连接原因后核对官方元数据，不为此改现有登录。
- 未修改云端时区、表、认证配置或定时任务。
- 后续核查：官方 OAuth Provider 文档确认发送 resource 时为 EdDSA JWT，需验证精确 iss 与 aud 包含 API resource；本机元数据连接失败原因为 HTTP(S) 代理本机端口拒绝连接，停止同路径重试。设计提议每日建行复用 Vercel Cron，不新增 Neon Function 服务，小时级触发窗口和漏跑历史不自动回填限制待确认。
- 用户确认后已按获准的网络权限只读访问项目公开元数据：issuer/JWKS 地址匹配，公开 OKP 密钥算法 EdDSA；未读取用户令牌。
- 日期可选修正后的 Python 测试 28 项：25 通过、3 项因无 API_TEST_DATABASE_URL 跳过；7 项启动器测试沿用通过结果。安装、pip check、Cron JSON 和只读迁移预览沿用有效结果，neondb 待应用 0001_activity_daily_records.sql，未执行 --apply。

### 本地真实查询准备

- 用户在解释用途和审批范围后明确要求继续，已补齐 Git 忽略的本地环境文件中的 NEON_AUTH_ISSUER/API_RESOURCE，值与公开发行方及现有 API resource 一致；新进程加载校验通过，未输出或变更数据库凭据。
- 环境文件只读属性导致写入失败，定位后仅临时解除指定文件属性，原位更新并恢复原属性；两份失败产生的临时文件已清理并检查不存在。
- 此前只读检查 Activity 表已有 1 条记录，不读取用户数据内容。运行中的本地 API 需要重启以加载环境配置；真实查询仍须调用方提供有效 Bearer 访问令牌，不以用户 ID 或历史 API_ACCESS_TOKEN 代替。未读取用户令牌，未修改 Vercel。

### 历史后续事项

无；用户于 2026-11-06 明确选择先本地提交后端、再开始前端 Issue。真实令牌查询、Vercel 部署及任务运行未验收，沿用已有验证并如实保留限制。
