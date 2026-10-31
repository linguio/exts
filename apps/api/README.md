# Exts API

最小 FastAPI 后端。`GET /hello` 先验证个人 Bearer 令牌，再通过 psycopg 对 Neon 执行 `SELECT 1`，成功返回 `{"message":"hello","database":"ok"}`。不创建业务表或写入业务数据。

## 接口文档

`/docs` 使用官方 `scalar-fastapi==1.9.1`，读取当前服务的 `/openapi.json`。默认 Swagger 与 ReDoc 页面关闭，只保留这一份文档入口。说明包含中文用途、Bearer 授权步骤、成功模型及 401／503 示例。

Scalar 浏览器资源固定为 `https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.76.4/dist/browser/standalone.js`，需要浏览器可访问 jsDelivr；不使用浮动 CDN 版本。沿用官方默认样式，关闭 Agent 与遥测，不设置请求代理、不预填令牌、不默认持久保存令牌。在线调试请求直接发往当前 API 服务。

正式入口为 `https://api.exts.linguio.dev/docs`，官网 Header 的 API 文档图标在新标签页打开该地址。本地修改不会自动更新线上页面。

## 本机准备

Python 固定为 `.python-version` 中的 3.12.13；应用产品版本仍以根 package.json 为准。以下命令从仓库根目录执行：

生产依赖与其传递依赖直接以精确版本列在 `requirements.txt`，不引用额外约束文件，以避免部署预解析阶段的引用文件错误。`requirements-dev.txt` 引入生产清单并额外固定测试专用依赖；调整依赖时同步维护两份清单，不使用浮动版本。

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

API 监听 `http://127.0.0.1:8000`。访问 `/docs`，在 Scalar 的认证栏填写本机私有文件中的令牌，仅填令牌值，不带引号或 Bearer 前缀；打开 `GET /hello` 的 Test Request 发送请求，预期 200 与 `database: ok`；清除或填入错误令牌后预期 401。缺少服务端配置或数据库不可用时返回 503，不返回数据库错误细节。视觉、导航及实际在线调试由用户在 Chrome 或 Edge 验收。

开发验证由代理按需直接执行，不配置根 package.json 快捷命令：

```sh
dist/.cache/api/venv/bin/python -B -m unittest discover -s apps/api/tests -v
dist/.cache/api/venv/bin/python -B apps/api/tests/verify_live.py
```

第二条命令会临时启动独立本地端口，真实请求 `/hello` 验证两种鉴权失败和 Neon 查询，结束后自动关闭服务；需要访问 Neon 的网络权限，日志在 `dist/.cache/api/verify-live.log`。

根 `npm run build` 继续构建官网、扩展与桌面，不替代 Python 接口验证。Python 源码无需编译为独立二进制，运行 HTTP 探针验证其真实执行。所有可配置缓存与虚拟环境位于根 dist，不在应用内部生成构建目录。

## 后续 Vercel 配置

已有 Vercel API 项目根目录为 `apps/api`，使用 FastAPI 入口 `app.py` 与 `requirements.txt`，安装命令已显式设为 `uv pip install -r requirements.txt`，避免根 Turbo 的 Node 安装默认值遗漏 Python 依赖。Scalar 已列入该清单，后续获批推送并部署时一并安装，无需 Scalar 账号。私有 `DATABASE_URL` 与 `API_ACCESS_TOKEN` 继续使用 Vercel 环境变量，Neon 本地 env 拉取不会自动设置它们。本轮不推送、部署或修改云端设置。

驱动选型依据：[Neon Python 指南](https://neon.com/docs/guides/python)；部署入口依据：[Vercel FastAPI 文档](https://vercel.com/docs/frameworks/backend/fastapi)。
