# Neon 后端接入实施计划

**目标：** 使用已绑定的 Neon production 分支，交付可本地验证的 FastAPI `/hello`。

**依据：** [Issue](../../changes/issues/2026-10-31-api-neon-setup-issue.md) 与用户指定的 CLI 初始化、部署及验证步骤。

**架构：** apps/api/neon.ts 管理 Postgres 服务，同目录私有环境文件提供 DATABASE_URL，专用 Node 依赖归入 apps/api/package.json。apps/api/app.py 导出 FastAPI app，验证个人令牌后通过 psycopg 连接池化地址执行只读 SELECT 1；不创建业务表，不接入前端，不部署 Vercel。

## 约束

- 依赖精确版本；Python 使用本机已有的 3.12.13。
- 不输出私有环境值，不写入客户端，不执行迁移。
- 串行实施，不启动代理，不进行视觉与交互验收，不提交 Git。

## 实施与验证

- [x] 安装 CLI，修复 pnpm 根目录保护，初始化指定项目并运行 neon deploy。
- [x] 添加 apps/api 的依赖声明、入口和 HTTP 行为测试，确认缺失接口时测试失败。
- [x] 实现令牌校验、配置缺失及数据库错误响应，针对性测试通过。
- [x] 将 Neon 配置、绑定、环境文件和专用依赖归入 API 目录，根仅保留 api:dev 转发；缓存仍在 dist/.cache/api。
- [x] 验证迁移后的配置、私有文件忽略和接口逻辑；不运行无关三端 build。
- 代理启动本地 API 的真实 HTTP 验证未执行；用户自行操作后反馈“可以了”，确认本地可用，不将此记作代理自动化验证。
- [x] 更新 Issue 与交付记录；用户确认本地可用并明确批准提交，代码已提交，文档与工作台终态随文档提交完结，不追加验证或推送。

## 文件边界

- apps/api/neon.ts、apps/api/package.json：API 专用 Neon 配置和 Node 依赖。
- 根 package.json、pnpm-lock.yaml、pnpm-workspace.yaml、.gitignore：Workspace 接入与必要开发入口。
- apps/api/app.py、requirements*.txt、constraints.txt、.python-version、tests/test_app.py、README.md：最小后端和验证。
- apps/api/.env.example：变量名与示例，不含真实值。
- docs/changes 下本工作项与工作台，以及本 Plan：真实记录。

## 停止点

认证失败按用户要求提示执行 neon login；未成功的构建或远端验证不得记作通过。阶段完成后不自动提交、推送或配置 DNS。
