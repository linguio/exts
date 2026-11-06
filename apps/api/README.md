# Exts API

FastAPI 后端。`GET /` 通过 307 临时重定向跳转到 `/docs`，文档无需令牌、不连接数据库。业务接口为当前用户的 Activity 日期查询；临时 `/hello` 已移除。本地源码不代表已部署或已执行 Neon 迁移。

## 接口文档

`/docs` 使用官方 `scalar-fastapi==1.9.1`，读取当前服务的 `/openapi.json`。默认 Swagger 与 ReDoc 页面关闭，只保留这一份文档入口。列表展示 Activity 只读接口及 Bearer 认证，根路由、文档与内部定时任务不加入业务接口列表。

Scalar 浏览器资源固定为 `https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.76.4/dist/browser/standalone.js`，需要浏览器可访问 jsDelivr；不使用浮动 CDN 版本。沿用官方默认样式，关闭 Agent 与遥测，不设置请求代理、不预填令牌、不默认持久保存令牌。在线调试请求直接发往当前 API 服务。

文档与实际 API 共用响应模型，示例也通过该模型校验与序列化，包含 userId 和创建/更新时间。示例展示一条已填写记录，不代表数据库默认值或真实查询结果；未填写时长实际返回 null，Schema 同样允许 null。点击 Test Request 才是调用实际接口。框架会过滤示例中的空值键，因此不额外定制 OpenAPI 生成器，采用完整的非空示例并保留真实空值模型契约。

服务部署后的正式根地址为 `https://api.exts.linguio.dev/`，根路由跳转至 `/docs`；官网页头 API 文档入口直接打开 `https://api.exts.linguio.dev/docs`。本地修改不会自动更新线上页面，部署和实际可用性需分别验证。

## 本机准备

Python 固定为 `.python-version` 中的 3.12.13；应用产品版本仍以根 package.json 为准。以下命令从仓库根目录执行：

生产依赖与其传递依赖直接以精确版本列在 `requirements.txt`，不引用额外约束文件，以避免部署预解析阶段的引用文件错误。`requirements-dev.txt` 引入生产清单并额外固定测试专用依赖；调整依赖时同步维护两份清单，不使用浮动版本。

### macOS / Linux

先安装上述固定版本 Python，再执行：

```sh
python3.12 -m venv dist/.cache/api/venv
dist/.cache/api/venv/bin/python -m pip install -r apps/api/requirements-dev.txt
pnpm install
```

### Windows（PowerShell）

先准备可用的 Python 3.12.13。注意：[该版本官方发布说明](https://www.python.org/downloads/release/python-31213/)明确不提供二进制安装包，不能直接下载对应的 Windows exe 安装器；无 Python 的机器需要先通过源码构建或另行确认的运行时管理工具准备该精确版本。本项目不自动安装工具或改用其他 Python 版本。

如果已安装 Windows Python Launcher 且已注册该解释器，执行 `py -3.12 --version`，确认输出为 `Python 3.12.13`；只有 WindowsApps 下的 `python.exe` 应用执行别名并不代表已安装 Python。再从仓库根目录执行：

```powershell
py -3.12 -m venv dist/.cache/api/venv
& .\dist\.cache\api\venv\Scripts\python.exe -m pip install -r apps/api/requirements-dev.txt
pnpm install
```

无需激活虚拟环境，也无需修改 PowerShell 执行策略。若 `py` 不可用，可用已安装的 Python 3.12.13 的完整解释器路径替代第一条命令中的 `py -3.12`，例如 `& "C:\实际安装目录\python.exe" -m venv dist/.cache/api/venv`；不要将此示例路径直接执行。不要在不同系统之间复制虚拟环境；更换系统后按对应步骤重新创建。

本地运行 API 必须准备 Python；只开发官网或扩展且不启动本地 API 时无需安装。启动脚本不会自动安装 Python 或依赖。

`apps/api/neon.ts` 管理服务，私有 `apps/api/.neon` 绑定项目及分支，Node 配置依赖维护在 `apps/api/package.json`。Neon 命令在 API 目录执行：

```sh
cd apps/api
neon deploy
```

Neon CLI 已安装时可直接使用 `neon`；本次安装版本为 8.15.1。新机器需先登录并绑定同一项目再部署，不要重新创建项目。用户级 Neon skills 与 MCP 属于开发工具配置，继续保留在用户目录，不复制到仓库。

CLI 将连接变量拉入 `apps/api/.env.local`，API 目录已有 `.env` 时写入 `.env`。应用只读取 API 目录的环境文件，已有进程环境变量优先。`apps/api/.env.example` 仅提供模板。Activity 使用 Neon 用户访问令牌，内部任务使用独立 CRON_SECRET；历史 API_ACCESS_TOKEN 保留但不参与认证，不删除或轮换既有凭据。

`DATABASE_URL` 使用池化连接供业务查询与每日任务；`DATABASE_URL_UNPOOLED` 仅用于显式管理迁移。`NEON_BRANCH` 为 CLI 上下文元信息，不参与数据库认证。实际凭据不提交，不嵌入 Extension、Desktop 或官网。

## 运行与验证

从仓库根目录启动（转发到 API 子项目的 dev 命令）：

```sh
pnpm api:dev
```

启动器按系统自动选择根 `dist/.cache/api/venv` 下的 Windows `Scripts/python.exe` 或 macOS/Linux `bin/python`，固定以 API 目录启动 Uvicorn 并开启 --reload，保存 Python 文件后自动重启服务；浏览器 /docs 页面仍需刷新以重新读取 OpenAPI。首次增加自动重载后要先重启旧进程。缺少虚拟环境时返回非零退出码并提示准备步骤；已有虚拟环境但缺少依赖时，解释器会输出相应错误，需要按本机准备步骤重新安装依赖。按 Ctrl+C 停止服务。

API 监听 `http://127.0.0.1:8000`。打开根地址预期进入 `/docs`；Activity 查询需要先完成迁移及服务端认证配置，文档本身不需要。访问 `/hello` 预期 404。浏览器导航与文档实际加载由用户验收，文档成功不代表数据库业务已验证。

开发验证由代理按需直接执行，不配置根 package.json 快捷命令：

```sh
dist/.cache/api/venv/bin/python -B -m unittest discover -s apps/api/tests -v
```

Windows PowerShell 对应命令：

```powershell
& .\dist\.cache\api\venv\Scripts\python.exe -B -m unittest discover -s apps/api/tests -v
```

启动器的跨平台逻辑验证无需 Python：

```sh
node --test --test-isolation=none apps/api/tests/dev.test.mjs
```

逻辑测试覆盖文档回归、JWT 安全边界、日期/空值、统一响应、任务认证与迁移行为。实库测试只读取进程显式提供的 API_TEST_DATABASE_URL，要求隔离空 PostgreSQL 库，所有夹具和 DDL 在结束时回滚；不配置就跳过，不回退使用生产连接。

## 分层与只读接口

- app.py 只装配；core 持有配置、认证、响应和数据库事务；modules/activity 内路由 → 业务 → 仓储，SQL 只在仓储和迁移中维护。
- GET /api/activity/days：startDate/endDate 都可选，不传时查询当前用户全部历史；仅传 startDate 或 endDate 时按对应下限或上限筛选。两端都传时包含首尾且开始不得晚于结束，升序、无分页，只返回本人已有的行。示例筛选：?startDate=2026-11-01&endDate=2026-11-06。
- 成功结构为 data.days；每天包含 userId、date、五项 camelCase 分钟字段、createdAt、updatedAt。时间戳带时区偏移；NULL 与 0 区分，无记录为空数组。不返回用户名/邮箱等资料、时区配置、备注或汇总。
- 失败结构为 error.code/message/requestId；401 登录失效、422 参数错误、503 上游暂不可用、500 未预期异常。X-Request-ID 对应服务端排错标识，业务与任务响应均 Cache-Control: no-store。
- NEON_AUTH_ISSUER 必须是对应分支的实际 Auth URL；API_RESOURCE 保持 https://api.exts.linguio.dev，不因 /api 路径而改变。只接受 EdDSA 访问 JWT，验证签名、发行方、受众、期限和 UUID，并核实用户存在。不使用 ID token 或网页 Cookie 代替。
- 公开验签密钥短时复用，不缓存用户、认证结果或 Activity 数据。密钥服务实际不可达返回 503，不伪装为用户无数据。

## 本地维护与应用数据库结构

结构唯一来源为 migrations 下的版本化 SQL。修改已有云端结构时新增迁移，不改已执行文件；校验和按 UTF-8 与 LF 规范化，避免 Windows 换行造成差异。查询和 API 启动均不自动建表。

Windows 从仓库根执行只读预览：

```powershell
& .\dist\.cache\api\venv\Scripts\python.exe -B apps/api/scripts/migrate.py
```

明确批准目标及差异后才添加 --apply：

```powershell
& .\dist\.cache\api\venv\Scripts\python.exe -B apps/api/scripts/migrate.py --apply
```

macOS/Linux 使用对应的 dist/.cache/api/venv/bin/python。迁移使用管理连接、事务锁与 public._exts_migrations 版本登记；失败回滚。首份迁移创建 public.activity_daily_records、UUID 外键、联合主键、非负约束、更新时间触发器，并设置当前数据库新连接默认时区 Asia/Shanghai。依赖已存在的 Neon 管理用户表，不复制或重建认证表，不导入用户历史数据。

## 每日任务与部署前配置

vercel.json 定义一个每日 UTC 16:00 的 Cron，对应北京时间次日 00:00。Vercel 调用 GET /internal/jobs/activity-days，并使用服务端 CRON_SECRET 认证。任务为所有 Neon 用户插入上海当天的 user_id/date；冲突跳过，不覆盖已有数据或触发更新时间修改。

上线前在 Vercel 配置 DATABASE_URL、NEON_AUTH_ISSUER、API_RESOURCE、独立随机 CRON_SECRET。迁移管理连接只需在管理环境使用，不要求放入 Vercel。不要把密钥放入 URL、前端环境或文档。部署会启用 Cron，因此必须和生产迁移顺序一起审批，先迁移再启用实际部署。

Hobby 任务可能在设定时间后一小时内触发；仅建运行当天，漏跑历史日期不自动回填。新用户等下一次任务，无注册建行分支。数据库、连接及任务统一上海日期；TIMESTAMPTZ 仍保存绝对时刻，数据库默认时区仅对新连接生效。前端日期适配在后续工作项执行。

根 `npm run build` 继续构建官网、扩展与桌面，不替代 Python 接口验证。Python 源码无需编译为独立二进制。所有可配置缓存与虚拟环境位于根 dist，不在应用内部生成构建目录。

## 后续 Vercel 配置

已有 Vercel API 项目根目录为 `apps/api`，使用 FastAPI 入口 `app.py` 与 `requirements.txt`，安装命令已显式设为 `uv pip install -r requirements.txt`，避免根 Turbo 的 Node 安装默认值遗漏 Python 依赖。Scalar 已列入该清单，后续获批推送并部署时一并安装，无需 Scalar 账号。私有 `DATABASE_URL` 与 `API_ACCESS_TOKEN` 继续使用 Vercel 环境变量，Neon 本地 env 拉取不会自动设置它们。本轮不推送、部署或修改云端设置。

驱动选型依据：[Neon Python 指南](https://neon.com/docs/guides/python)；部署入口依据：[Vercel FastAPI 文档](https://vercel.com/docs/frameworks/backend/fastapi)。
