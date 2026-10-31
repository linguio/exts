# Exts API

最小 FastAPI 后端。`GET /hello` 先验证个人 Bearer 令牌，再通过 psycopg 对 Neon 执行 `SELECT 1`，成功返回 `{"message":"hello","database":"ok"}`。不创建业务表或写入业务数据。

## 本机准备

Python 固定为 `.python-version` 中的 3.12.13；应用产品版本仍以根 package.json 为准。以下命令从仓库根目录执行：

```sh
python3.12 -m venv dist/.cache/api/venv
dist/.cache/api/venv/bin/python -m pip install -r apps/api/requirements-dev.txt
pnpm install
```

`apps/api/neon.ts` 管理服务，私有 `apps/api/.neon` 绑定项目及分支，Node 配置依赖维护在 `apps/api/package.json`。Neon 命令在 API 目录执行：

```sh
cd apps/api
neon deploy
```

Neon CLI 已安装时可直接使用 `neon`；本次安装版本为 8.15.1。新机器需先登录并绑定同一项目再部署，不要重新创建项目。用户级 Neon skills 与 MCP 属于开发工具配置，继续保留在用户目录，不复制到仓库。

CLI 将连接变量拉入 `apps/api/.env.local`，API 目录已有 `.env` 时写入 `.env`。在同一文件设置独立随机的 `API_ACCESS_TOKEN`；本次迁移保留原有令牌和数据库凭据。应用只读取 API 目录的环境文件，已有进程环境变量优先。`apps/api/.env.example` 仅提供变量模板，不含真实值。

`DATABASE_URL` 使用池化连接；`DATABASE_URL_UNPOOLED` 留给后续迁移等管理用途，本阶段不使用。`NEON_BRANCH` 为 CLI 上下文元信息，不参与数据库认证。实际凭据不提交，不嵌入 Extension、Desktop 或官网。

## 运行与验证

从仓库根目录启动（转发到 API 子项目的 dev 命令）：

```sh
pnpm api:dev
```

API 监听 `http://127.0.0.1:8000`。访问 `/docs`，在 Authorize 中填入本机私有文件中的令牌，再执行 `GET /hello`，预期 200 与 `database: ok`；无令牌或错误令牌预期 401。缺少服务端配置或数据库不可用时返回 503，不返回数据库错误细节。

开发验证由代理按需直接执行，不配置根 package.json 快捷命令：

```sh
dist/.cache/api/venv/bin/python -B -m unittest discover -s apps/api/tests -v
dist/.cache/api/venv/bin/python -B apps/api/tests/verify_live.py
```

第二条命令会临时启动独立本地端口，真实请求 `/hello` 验证两种鉴权失败和 Neon 查询，结束后自动关闭服务；需要访问 Neon 的网络权限，日志在 `dist/.cache/api/verify-live.log`。

根 `npm run build` 继续构建官网、扩展与桌面，不替代 Python 接口验证。Python 源码无需编译为独立二进制，运行 HTTP 探针验证其真实执行。所有可配置缓存与虚拟环境位于根 dist，不在应用内部生成构建目录。

## 后续 Vercel 配置

本轮不部署 Vercel。后续独立 API 项目根目录选择 `apps/api`，使用 FastAPI 自动识别入口 `app.py` 和 `requirements.txt`，配置私有的 `DATABASE_URL` 与 `API_ACCESS_TOKEN`。Neon 本地 env 拉取不会自动设置 Vercel 环境变量。区域需与实际 Neon 项目区域配套；域名与两端接入另外实施。

驱动选型依据：[Neon Python 指南](https://neon.com/docs/guides/python)；部署入口依据：[Vercel FastAPI 文档](https://vercel.com/docs/frameworks/backend/fastapi)。
