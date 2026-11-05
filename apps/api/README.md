# Exts API

最小 FastAPI 后端。`GET /` 通过 307 临时重定向跳转到 `/docs`，无需令牌、不连接数据库。临时 `/hello` 联通验证接口已移除，当前尚未开放业务接口。

## 接口文档

`/docs` 使用官方 `scalar-fastapi==1.9.1`，读取当前服务的 `/openapi.json`。默认 Swagger 与 ReDoc 页面关闭，只保留这一份文档入口。根路由与文档路由不加入 OpenAPI 接口列表，当前列表为空，不展示已移除探针的模型与鉴权说明。

Scalar 浏览器资源固定为 `https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.76.4/dist/browser/standalone.js`，需要浏览器可访问 jsDelivr；不使用浮动 CDN 版本。沿用官方默认样式，关闭 Agent 与遥测，不设置请求代理、不预填令牌、不默认持久保存令牌。在线调试请求直接发往当前 API 服务。

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

CLI 将连接变量拉入 `apps/api/.env.local`，API 目录已有 `.env` 时写入 `.env`。应用只读取 API 目录的环境文件，已有进程环境变量优先。`apps/api/.env.example` 仅提供变量模板，不含真实值。现有数据库变量与历史 `API_ACCESS_TOKEN` 配置保留，本次不删除或轮换凭据；移除 `/hello` 后，当前路由不使用个人令牌或数据库连接，也没有启用用户登录。

`DATABASE_URL` 使用池化连接；`DATABASE_URL_UNPOOLED` 留给后续迁移等管理用途，本阶段不使用。`NEON_BRANCH` 为 CLI 上下文元信息，不参与数据库认证。实际凭据不提交，不嵌入 Extension、Desktop 或官网。

## 运行与验证

从仓库根目录启动（转发到 API 子项目的 dev 命令）：

```sh
pnpm api:dev
```

启动器按系统自动选择根 `dist/.cache/api/venv` 下的 Windows `Scripts/python.exe` 或 macOS/Linux `bin/python`，固定以 API 目录启动现有 Uvicorn 参数。缺少虚拟环境时返回非零退出码并提示准备步骤；已有虚拟环境但缺少依赖时，解释器会输出相应错误，需要按本机准备步骤重新安装依赖。按 Ctrl+C 停止服务。

API 监听 `http://127.0.0.1:8000`。在 Chrome 或 Edge 打开根地址，预期自动进入同一服务的 `/docs` 并加载 Scalar；文档暂时没有业务接口。访问 `/hello` 预期 404。浏览器导航与文档实际加载由用户验收，文档响应成功不代表已验证数据库连接。

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

逻辑测试覆盖根路径重定向、无需令牌或数据库、文档响应、旧探针移除与 OpenAPI 配置。原有 `verify_live.py` 依赖已移除的 `/hello`，已同步删除；本阶段不启动服务或执行真实数据库查询。

根 `npm run build` 继续构建官网、扩展与桌面，不替代 Python 接口验证。Python 源码无需编译为独立二进制。所有可配置缓存与虚拟环境位于根 dist，不在应用内部生成构建目录。

## 后续 Vercel 配置

已有 Vercel API 项目根目录为 `apps/api`，使用 FastAPI 入口 `app.py` 与 `requirements.txt`，安装命令已显式设为 `uv pip install -r requirements.txt`，避免根 Turbo 的 Node 安装默认值遗漏 Python 依赖。Scalar 已列入该清单，后续获批推送并部署时一并安装，无需 Scalar 账号。私有 `DATABASE_URL` 与 `API_ACCESS_TOKEN` 继续使用 Vercel 环境变量，Neon 本地 env 拉取不会自动设置它们。本轮不推送、部署或修改云端设置。

驱动选型依据：[Neon Python 指南](https://neon.com/docs/guides/python)；部署入口依据：[Vercel FastAPI 文档](https://vercel.com/docs/frameworks/backend/fastapi)。
