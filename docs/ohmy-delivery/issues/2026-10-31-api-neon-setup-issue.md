# 初始化 Neon 并连接后端

## 元信息

- 工作项：2026-10-31-api-neon-setup
- 状态：已完成
- 当前阶段：用户已反馈本地接口可用并明确批准本地提交；代码已提交，完成状态随文档提交归档。
- 批准依据：用户明确要求安装 Neon CLI、在根目录初始化指定生产分支、部署 postgres 服务、接入环境变量并验证构建与服务联通。
- 任务规模：涉及后端与云服务连接的架构工作项；先核对 CLI 实际生成内容，沿用已确定的 FastAPI 方案。

## 背景与目标

现有仓库包含官网、扩展和桌面应用，尚无 apps/api。此前已确认 Python FastAPI、Neon PostgreSQL 和 Vercel；本轮按用户提供的 Neon 命令完成配置，并以最小后端验证数据库连接。

## 范围与排除项

- 初始化已绑定组织 org-wild-hat-06154944、项目 mute-wave-82373634、production 分支和 postgres 服务；按最新批准将绑定文件、Neon 配置、环境文件、示例与专用依赖归入 apps/api，后续 Neon 命令在该目录执行。
- 执行 neon deploy，私有环境文件保持 Git 忽略，不输出真实连接串。
- 根据实际生成配置和官方说明接入服务；后端沿用 apps/api FastAPI 与受令牌保护的 GET /hello 只读查询方案。
- 后端不需要三端构建；按需运行接口逻辑与配置检查，真实数据库联通的执行结果单独记录，不运行无关的三端 build。
- 不修改现有前端或桌面业务，不推送代码，不配置 DNS；用户最新明确批准本地 Git 提交。
- 用户后续明确要求：根 package.json 仅保留 api:dev 开发入口，不配置 api:test 或 api:verify；验证脚本由代理按需直接执行。
- API 缓存与虚拟环境继续遵守统一产物规范，位于根 dist/.cache/api；用户级 skills 与 MCP 保持原位，不复制进入仓库。

## Todo

- [x] 安装 CLI，完成登录并核对可用命令及相关 Neon skills。
- [x] 初始化指定项目，检查生成差异并部署 postgres 服务。
- [x] 使用环境变量接入最小后端，不向客户端打包数据库凭据。
- [x] 将 API 配置和依赖归入 apps/api，验证迁移后的路径、凭据保留与接口逻辑。
- [x] 整理验证结果与限制；用户反馈本地可用并批准提交，代理未独立完成真实数据库 HTTP 验证。

## 验收标准

- 初始化绑定用户指定项目、production 分支和 postgres 服务。
- 真实密钥只保存在被 Git 忽略的私有文件中。
- API 专用配置集中在 apps/api，根仅保留 api:dev 转发；凭据和生产分支绑定不因迁移改变。
- 服务验证区分真实远端查询与纯逻辑测试，不以三端构建代替后端验证。
- 登录、部署、环境或构建失败如实报告，不把未执行项标为成功。

## 关联文档

- [Commit 记录](../commits/2026-10-31-api-neon-setup-commit.md)
- [前置 Issue](2026-10-30-repo-python-api-connectivity-issue.md)
- [工作台](../README.md)
- [实施计划](../../superpowers/plans/2026-10-31-api-neon-setup.md)

## 唯一下一步

本工作项按用户批准本地提交完结；Vercel 部署、环境变量与域名配置留待后续独立工作项，不自动推送或部署。
