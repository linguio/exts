# Activity 数据库与只读 API 设计

## 状态与依据

- 状态：用户于 2026-11-06 确认本地设计，后续单独批准 Neon 0001 迁移，已成功应用并只读核对；Vercel 部署与每日任务未执行。
- [Issue](../../changes/issues/2026-11-06-api-activity-read-issue.md) · [交付记录](../../changes/commits/2026-11-06-api-activity-read-commit.md)
- 用户已确定：Neon 数据库及认证、Vercel FastAPI、Asia/Shanghai、本地维护结构、多用户、只读 API、无 Activity 缓存；旧业务数据由用户手动维护。
- 此项只交付后端与数据库；前端请求、初始化重置按后续 Issue 顺序执行。

## 方案选择

- 采用现有 psycopg + 版本化 SQL 迁移；不引入 ORM、通用 CRUD 基类或仓储继承体系。当前表和查询固定，直接 SQL 易于审核权限、用户过滤及数据库触发器。
- 使用成熟 JWT 库支持 EdDSA，不手写密码学、JWT 验签或直接相信解码后的 sub。依赖精确版本及传递依赖在实施时按仓库规则锁定并验证，不在本设计伪造未核实版本。
- 建行任务建议复用 Vercel API 部署和 Python 数据访问层；一个每日 Cron，UTC 0 16 * * *，对应上海次日 00:00。无需新增 Node/Neon Functions 服务。此调度位置是本设计提案，尚未配置。
- 若不接受 Vercel Hobby 的小时级触发窗口，再另行确认 Neon Function Trigger；本期不同时维护两种调度后端。

## 分层与目录

| 位置 | 唯一职责 |
| --- | --- |
| apps/api/app.py | 应用装配、注册路由/中间件/异常处理，保留 /、/docs 与 /openapi.json |
| apps/api/core/config.py | 读取并校验服务端配置、统一时区常量；文档页不因缺业务凭据而无法启动 |
| apps/api/core/auth.py | Bearer 解析、JWKS 验签、发行方/受众/期限校验、生成 CurrentUser UUID |
| apps/api/core/responses.py | 泛型成功模型、统一错误模型、异常处理与响应头，不处理业务 SQL |
| apps/api/core/database.py | psycopg 连接与事务生命周期、超时及上海时区，不拼接业务 SQL |
| apps/api/modules/activity/router.py | 查询参数、认证依赖和业务调用，不计算汇总或直接访问数据库 |
| apps/api/modules/activity/schemas.py | 日期范围与每日返回结构；snake_case 存储映射 camelCase API |
| apps/api/modules/activity/service.py | 编排日期查询、当前用户边界与每日任务；不接收任意用户 ID 的 HTTP 输入 |
| apps/api/modules/activity/repository.py | 参数化 SQL、固定排序、每日空行插入；不依赖 HTTP 对象 |
| apps/api/jobs/activity_days.py | 内部 Cron 路由适配及独立任务密钥验证，调用同一 Activity 业务能力 |
| apps/api/migrations/*.sql | 按顺序维护 DDL、约束、触发器与数据库时区 |
| apps/api/scripts/migrate.py | 仅人工/管理命令执行迁移，追踪版本与校验和 |
| apps/api/vercel.json | 仅添加已核对现有部署配置的每日 Cron 定义 |

调用关系：路由 → 业务 → 数据访问 → 共用连接。认证是路由依赖；模型定义边界。业务层只保留当前规则，不为凑层级增加 DTO 转换层、接口基类或插件机制。

## 数据结构

- public.activity_daily_records：user_id UUID、date DATE，联合主键；外键引用 neon_auth.user(id)，不复制用户表，也不管理认证表的建表或生命周期。默认外键删除限制，不主动增加账号删除逻辑。
- exercise_minutes、reading_minutes、learning_minutes、creation_minutes、sleep_minutes：INTEGER NULL DEFAULT NULL，分别 CHECK 非负。NULL=未填写，0=明确为零；不设无依据的每日上限或指标相加限制。
- created_at、updated_at：TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP。BEFORE UPDATE 触发器维护 updated_at，支持 SQL Editor 手工修改，不更改 created_at。
- 无 note、growth、单独记录 ID、完成状态、汇总或用户配置表；主键已支持按用户和日期范围查询，不重复创建相同用途索引。
- 本地迁移只维护应用表；用户历史数据从 2026-11-01 起手动填写，不自动导入或重建 neon_auth。

## 认证与连接

- 复用扩展 OIDC issuer 配置和 API resource https://api.exts.linguio.dev；路径增加 /api 不改变 OAuth resource 标识。
- 官方 OAuth Provider 文档明确：发送 resource 时访问令牌为 EdDSA JWT，JWKS 为发行方的 /.well-known/jwks.json。
- 固定允许的算法 EdDSA；校验签名、精确 iss、aud 包含既有 API resource、必需 exp/sub 及适用的 nbf；sub 必须是合法 UUID。拒绝无资源 opaque token、错误分支、错误受众及无效/过期 token；不接受 id_token 替代。
- 验签后的 sub 对应 neon_auth.user.id；查询以该用户为唯一作用域，并确认用户存在。不存在用户拒绝认证，不把任意 UUID 当已注册用户。
- JWKS 只从服务端固定配置获取，不使用 token 提供的任意 URL。可短时复用公开验签密钥及密钥轮换刷新；不缓存令牌验证结果、用户资料或 Activity 数据。网络不可用/验签服务失败与无效凭据区分，前者返回统一 503。
- 普通 API 使用 DATABASE_URL 池化连接；迁移使用 DATABASE_URL_UNPOOLED。连接/事务有界并在结束时释放；查询只读事务，任务显式写事务。
- 服务端统一 Asia/Shanghai，池化连接在事务内显式设置时区；迁移配置数据库新连接默认时区。事务内设置避免连接池复用时依赖旧会话状态。
- 密钥、连接串、用户数据和令牌不进入日志；共用连接只输出固定错误分类和 requestId。不在此阶段引入用户资料 info 接口。

## HTTP 契约

- GET /api/activity/days；Bearer 必需。startDate/endDate 可选，都不传查询当前用户全部历史；仅传一个时按该日期下限或上限筛选。传入值须为 YYYY-MM-DD 的真实日期，两者都传时 startDate <= endDate，两端包含，无隐式日期范围及分页。示例：?startDate=2026-11-01&endDate=2026-11-06。
- 允许查询跨越无数据/未来日期，只返回实际存在的行，不合成日期或写数据库；不加未批准的固定查询天数限制。
- 200：data.days 数组，按 date 升序；每天包含 userId、date、exerciseMinutes、readingMinutes、learningMinutes、creationMinutes、sleepMinutes、createdAt、updatedAt，空值原样保留；无记录为 data.days=[]。用户最新要求返回所属用户和创建/更新时间，时间戳为带偏移 ISO 8601，不返回用户名/邮箱等账号资料。
- 公共业务成功格式为 {data: ...}；错误为 {error: {code, message, requestId}}；不重复添加 success/status 或全部返回 200。
- 缺失/无效凭据 401，附 WWW-Authenticate: Bearer；明确权限不足 403；日期参数 422；未知路由 404、错误方法 405；数据库/密钥服务暂不可用 503；未预期异常 500。参数错误也归入共用格式，不回传含 token 或原始输入的异常详情。
- 每次请求生成服务端 requestId，响应 X-Request-ID，失败体含同值；不信任任意客户端 ID。/api 与内部任务响应统一 Cache-Control: no-store，不发 ETag/304，不加入 CDN 结果缓存。
- OpenAPI 显示 Bearer、可选日期、成功/失败模型及 NULL 语义；文档与根跳转继续公开，保留原路径。
- 本期客户端为受信扩展后台，不引入 Cookie 认证或宽泛 credentials CORS；是否需要额外 CORS 配置依据实际调用源确认。

## 每日任务

- 一个内部 GET /internal/jobs/activity-days 适配 Vercel Cron；不属于公开 REST 业务资源，exclude from OpenAPI，禁止缓存。不开放建表、用户写入或删除 API。
- 使用单独 CRON_SECRET 并做固定时间比较；不将用户访问令牌或旧 API_ACCESS_TOKEN 当作任务密钥。缺密钥配置时拒绝执行，不允许匿名触发。
- 按 Asia/Shanghai 计算运行当天，从 neon_auth.user 批量选择用户，INSERT user_id/date，ON CONFLICT DO NOTHING。新增用户等下一次任务，既有时长与时间戳不被覆盖。
- 本期仅建运行当天，不额外引入每用户补建起点、水位表或历史回填。漏跑的历史日期暂留缺失，用户可手工补；这一限制需验收确认，不宣称定时器保证无遗漏。
- 执行事务失败回滚；重复调用、同日并发不重复行；日志只记执行结果及数量，不列出用户明细。
- Vercel Hobby 的每日 Cron 可能在设定时间后一小时内运行，不保证零点立刻建行；API 允许今天无数据。调度及生产环境变量在云端步骤获批后配置。

## 迁移与执行边界

- 迁移以版本号顺序执行，追踪表保存文件名及校验和；已应用文件不原地修改，新增变更通过新迁移。
- 管理命令使用事务与数据库锁防重复并发；迁移成功和版本登记一起提交，失败回滚。数据库名来自连接，标识符安全引用，不写死线上名称或打印连接串。
- 默认展示待执行迁移与目标的非敏感名称，显式 apply 才执行；不在普通请求、应用导入或 Vercel 启动时自动迁移。
- 当前只生成/验证本地代码及迁移；执行 Neon DDL/时区修改、配置 CRON_SECRET、部署及启用 Cron 前，展示具体操作和目标并取得对应批准。用户说不做旧数据兼容不代表允许删除托管认证表。

## 必要验证与停止点

- 测试真实边界：两用户隔离、JWT 签名及 iss/aud/期限/UUID、日期合法性/空值、统一错误头体、查询无写入、任务授权与幂等、迁移失败不登记成功。
- 使用实际 PostgreSQL 测试库/获批测试分支验证 DDL、外键、更新时间触发器及 ON CONFLICT；无可用隔离数据库时记录未验证，不用 SQLite 假装等价，也不自动写入认证生产库。
- 保留并调整现有 /、/docs、移除探针的测试；业务安全用定向测试，阶段结束按所属 API 风险执行完整测试，不跑前端测试。
- 不读取或输出真实用户令牌和认证记录；真实登录连通与云端执行结果单独验收。开发阶段不进行视觉交互验收。
- 设计确认后才创建执行 Plan、锁定必要依赖并进入实现；本项代码与文档最终分开提交，无自动 Git 提交、推送或部署。

## 核查限制与来源

- 既有只读 DB 核查：数据库 neondb、当前连接 GMT、neon_auth.user.id UUID；无 public 业务表。
- 初次 HTTP(S) 代理请求报 WinError 10061，停止同路径重试；后续使用明确获准的进程网络权限只读核对公开 metadata/JWKS 成功，issuer/地址一致，公开密钥算法 EdDSA。未读取真实用户令牌，真实登录调用仍待云端验收。
- 实施锁定 PyJWT 2.15.1、cryptography 50.0.2、cffi 2.1.1、pycparser 3.12、tzdata 2026.6；未引入 ORM 或修改既有认证客户端。
- [Neon OAuth Provider](https://neon.com/docs/auth/guides/plugins/oauth-provider)：JWT、EdDSA、发行方及受众验证。
- [Vercel Cron 限制](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing)：Hobby 每日频率及时间精度。
- [PostgreSQL ALTER DATABASE](https://www.postgresql.org/docs/current/sql-alterdatabase.html)：数据库默认设置适用于新连接。
