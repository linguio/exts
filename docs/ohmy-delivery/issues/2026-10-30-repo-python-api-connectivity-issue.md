# 明确 Python API 上线前置与手动配置

## 元信息

- 工作项：2026-10-30-repo-python-api-connectivity
- 状态：已完成
- 当前阶段：前置方案与手动清单已整理；实际开发和云端配置留待后续独立 Issue。
- 批准依据：用户确认 Python FastAPI、Vercel 自动部署、Neon、Namecheap 域名及 GitHub 托管，并要求本轮只做前置建档、本地提交；开发类工作另开 Issue。
- 任务规模：纯文档的小型工作项。

## 背景与目标

官网 `exts.linguio.dev` 现由 GitHub Pages 手动部署，仓库包含 Extension 和 Desktop。目标是先把未来 API 连接链路的选择、用户需手动完成的账号及密钥操作、开发阶段的验收边界写清楚，避免把前置准备误记为已完成的 API 功能。

## 本轮范围

- 确认 API 使用 Python FastAPI，代码拟放在仓库 `apps/api`；GitHub 托管源码，Vercel 独立项目连接仓库并从 `main` 自动部署 API。
- 确认数据库使用 Neon PostgreSQL，域名使用 `api.exts.linguio.dev`，由 Namecheap 管理的域名所使用的实际权威 DNS 添加记录；官网继续留在 GitHub Pages，双包 Release 继续手动运行。
- 确认后续最小联通接口为受个人令牌保护的 `GET /hello`，无需 `/v1`、`/v2` 前缀；验证令牌后执行 Neon 只读查询。开发构建请求本机 API，正式 ZIP／DMG 请求 API 子域名；安装包不内置令牌或数据库密码。
- 列出用户后续需要亲手完成的账号、密钥、DNS 与安装验收操作，供开发 Issue 使用。

## 用户后续需手动完成

以下是后续开发与部署阶段的待办，本次仅整理清单，尚未执行；不要在聊天中发送密码、令牌或数据库连接串。

1. 确认拥有 GitHub 仓库、Vercel、Neon 和 `linguio.dev` 当前权威 DNS 的管理权限；若还没有 Neon 项目，在实施阶段创建 PostgreSQL 项目。
2. 将 Neon 连接串分别配置在本机被 Git 忽略的私有环境文件与 Vercel Production 环境变量；生成并安全保管个人 API 访问令牌，在 Vercel 配置服务端值。
3. 在 Vercel 授权 GitHub 仓库，核对 API 项目根目录 `apps/api`、生产分支 `main` 及 Git 自动部署；推送代码另按仓库批准流程执行。
4. 在 Vercel 添加 `api.exts.linguio.dev`，按控制台给出的实际 CNAME 目标到权威 DNS 添加 `api.exts` 记录，等待域名验证和 HTTPS 生效；不修改现有官网 DNS。
5. 后续下载并实际加载 Extension ZIP、安装 Desktop DMG，在两端本机输入个人令牌，检查正常连接和错误令牌拒绝。Chrome／Edge 与 macOS 的视觉、交互和实际网络行为由用户验收。

## 排除项

- 本轮不创建 FastAPI 代码、依赖、数据库、Vercel 项目、DNS 记录或客户端配置，也不运行接口测试、构建、推送或部署。
- 不新增业务接口、业务表、网站数据功能、用户注册或公开分发方案。
- 不修改官网 GitHub Pages 和双包 Release 的手动发布流程。
- 不在本轮创建后续开发 Issue；当前文档提交完成后再按批准范围建立新工作项。

## Todo

- [x] 确认平台、代码位置、部署触发方式与域名分工。
- [x] 确认 `/hello`、鉴权、数据库只读探针及开发／正式客户端地址边界。
- [x] 列出用户需手动完成的云账号、密钥、DNS 和实际安装操作。
- [x] 创建配套 Commit 记录并更新工作台；按用户要求本地提交本轮文档。

## 验收标准

- 本 Issue 可直接回答平台、API 域名、自动部署范围、最小探针和两端地址如何选择。
- 手动操作清单明确区分当前已完成的建档与后续尚未执行的云端及安装步骤，不包含任何真实密钥。
- 未来开发工作可据此另立 Issue；实际 `/hello`、Neon、Vercel、DNS 和安装包连通不作为本轮已交付结果。

## 关联文档

- [Commit 记录](../commits/2026-10-30-repo-python-api-connectivity-commit.md)
- [工作台](../README.md)
- [构建与分发](../../build-release.md)
- [官网部署说明](../../../apps/website/README.md)

## 唯一下一步

本轮文档提交完成后，再按用户批准范围建立实际开发与部署 Issue；用户在其实施阶段按上述清单完成需要本人操作的步骤。
