# Exts API

最小 FastAPI 后端。`GET /` 通过 307 临时重定向跳转到 `/docs`，无需令牌、不连接数据库。临时 `/hello` 联通验证接口已移除，当前尚未开放业务接口。

## 接口文档

`/docs` 使用官方 `scalar-fastapi==1.9.1`，读取当前服务的 `/openapi.json`。默认 Swagger 与 ReDoc 页面关闭，只保留这一份文档入口。根路由与文档路由不加入 OpenAPI 接口列表，当前列表为空，不展示已移除探针的模型与鉴权说明。

Scalar 浏览器资源固定为 `https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.76.4/dist/browser/standalone.js`，需要浏览器可访问 jsDelivr；不使用浮动 CDN 版本。沿用官方默认样式，关闭 Agent 与遥测，不设置请求代理、不预填令牌、不默认持久保存令牌。在线调试请求直接发往当前 API 服务。

本次获批部署后，访问正式根地址 `https://api.exts.linguio.dev/` 将自动跳转至 `/docs`；官网 Header 的 API 文档图标仍直接打开 `https://api.exts.linguio.dev/docs`。本地修改不会自动更新线上页面。

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

CLI 将连接变量拉入 `apps/api/.env.local`，API 目录已有 `.env` 时写入 `.env`。应用只读取 API 目录的环境文件，已有进程环境变量优先。`apps/api/.env.example` 仅提供变量模板，不含真实值。现有数据库变量与历史 `API_ACCESS_TOKEN` 配置保留，本次不删除或轮换凭据；移除 `/hello` 后，当前路由不使用个人令牌或数据库连接，也没有启用用户登录。

`DATABASE_URL` 使用池化连接；`DATABASE_URL_UNPOOLED` 留给后续迁移等管理用途，本阶段不使用。`NEON_BRANCH` 为 CLI 上下文元信息，不参与数据库认证。实际凭据不提交，不嵌入 Extension、Desktop 或官网。

## 运行与验证

从仓库根目录启动（转发到 API 子项目的 dev 命令）：

```sh
pnpm api:dev
```

API 监听 `http://127.0.0.1:8000`。在 Chrome 或 Edge 打开根地址，预期自动进入同一服务的 `/docs` 并加载 Scalar；文档暂时没有业务接口。访问 `/hello` 预期 404。浏览器导航与文档实际加载由用户验收，文档响应成功不代表已验证数据库连接。

开发验证由代理按需直接执行，不配置根 package.json 快捷命令：

```sh
dist/.cache/api/venv/bin/python -B -m unittest discover -s apps/api/tests -v
```

逻辑测试覆盖根路径重定向、无需令牌或数据库、文档响应、旧探针移除与 OpenAPI 配置。原有 `verify_live.py` 依赖已移除的 `/hello`，已同步删除；本阶段不启动服务或执行真实数据库查询。

根 `npm run build` 继续构建官网、扩展与桌面，不替代 Python 接口验证。Python 源码无需编译为独立二进制。所有可配置缓存与虚拟环境位于根 dist，不在应用内部生成构建目录。

## 后续 Vercel 配置

已有 Vercel API 项目根目录为 `apps/api`，使用 FastAPI 入口 `app.py` 与 `requirements.txt`，安装命令已显式设为 `uv pip install -r requirements.txt`，避免根 Turbo 的 Node 安装默认值遗漏 Python 依赖。Scalar 已列入该清单，后续获批推送并部署时一并安装，无需 Scalar 账号。私有 `DATABASE_URL` 与 `API_ACCESS_TOKEN` 继续使用 Vercel 环境变量，Neon 本地 env 拉取不会自动设置它们。本轮不推送、部署或修改云端设置。

驱动选型依据：[Neon Python 指南](https://neon.com/docs/guides/python)；部署入口依据：[Vercel FastAPI 文档](https://vercel.com/docs/frameworks/backend/fastapi)。
