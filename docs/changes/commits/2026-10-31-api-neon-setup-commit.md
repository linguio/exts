# 初始化 Neon 并连接后端交付记录

- 对应 [Issue](../issues/2026-10-31-api-neon-setup-issue.md)
- 状态：已完成；用户已确认本地可用并明确批准代码、文档两笔本地提交，完成状态随文档提交归档。

## 预期交付边界

- 代码：apps/api 下的接口、测试、Neon 配置与依赖；根 package.json、pnpm-workspace.yaml、pnpm-lock.yaml 和 .gitignore 中必要的 Workspace 接入。
- 文档：本 Issue、Commit 记录、工作台和必要接入说明。
- 私有环境文件不提交，不记录真实密钥。

## 实际交付

- 已安装 Neon CLI 8.15.1，完成用户指定项目与 production 分支初始化、Postgres 配置核对及环境拉取；实现受个人令牌保护的 FastAPI GET /hello 只读探针和对应验证脚本。
- 按用户最新要求移除根 package.json 的 api:test 与 api:verify，保留 api:dev；API README 改为直接执行验证脚本。
- 按用户进一步批准，将 Neon 配置、私有项目绑定、私有环境文件和环境模板归入 apps/api；原有私有文件移动前后内容校验一致。专用 Node 依赖移入 API 子项目，根 api:dev 转发至子项目，读取与验证路径同步调整；虚拟环境和缓存保持在统一根 dist。

## 验证、失败与限制

- 迁移后 4 项接口逻辑测试通过；Neon 依赖在 API 子项目解析成功；根目录无 Neon 配置与专用依赖，应用从 API 目录读取非空私有配置；私有文件继续被 Git 忽略；git diff --check 通过。
- 私有 .neon 与 .env.local 移动前后内容校验一致，未重置令牌、重新绑定项目或重新部署云服务。
- 离线依赖安装因本机缓存缺少既有包失败，联网安装成功；未升级依赖。Starlette 对 httpx 的弃用提示仍存在，不影响本次 4 项测试。
- 之前三端 build 因沙箱 DNS 失败而中断；本次仅后端配置迁移，不再运行无关构建。用户在配置迁移后反馈“可以了”，确认本地接口可用；代理未独立完成真实数据库 HTTP 验证，不将用户反馈记为代理自动化验证。
- 用户已明确批准本地提交，提交阶段不追加测试或构建。代理未进行浏览器验收；Vercel 部署、DNS 配置和推送未执行。

## 完整 Commit message

### 代码提交

文件：根 .gitignore、package.json、pnpm-workspace.yaml、pnpm-lock.yaml，以及 apps/api 下除 README.md 和被忽略私有文件之外的实现、配置与测试。

```text
feat(api): 接入 Neon 并提供令牌鉴权接口

- 新增 FastAPI 只读联通接口与接口验证
- 将 Neon 配置和专用依赖集中到 API 子项目
- 保留根目录 API 开发启动入口
```

### 文档提交

文件：apps/api/README.md、本 Issue、Commit 记录、Plan 和 docs/changes/README.md。

```text
docs(api): 记录后端接入与本地验收结果

- 补充 API 配置与运行说明
- 记录 Neon 接入交付和实际验证限制
- 完结当前 Issue 并更新工作台
```

### 已批准终态更新

代码已提交；Issue 和本记录切换为已完成，工作台当前 Issue 清空并加入已完成索引，Plan 同步用户验收与提交收尾结果。上述终态随本次文档提交归档，不推送远端。
