---
date: "2026-10-31"
scope: api
status: completed
type: bug
---

# 修正 Vercel Python 安装命令

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

线上 app.py 导入 psycopg 时失败。构建日志显示 Vercel 自动检测 Turbo，执行 pnpm install 与 turbo run build，未安装 Python 依赖。目标是在保留 FastAPI、apps/api 根目录及既有环境变量的前提下恢复 Python 安装流程。

### 范围与排除项

- 仅修改 api 项目的安装命令和构建命令，保存并对最新提交无缓存重新部署。
- 检查构建日志及公开 /docs 与无令牌 /hello 响应，真实数据库查询由用户携带令牌验收。
- 不修改接口代码、依赖版本、环境变量、域名、权限或仓库 Turbo 配置；用户最新批准本地文档提交，不推送 Git。

## Todo

- [x] 设置两项命令并保存。
- [x] 无缓存重新部署，核对 Python 依赖安装和构建结果。
- [x] 验证公开文档及无令牌响应，记录结果并停在用户验收。

## 验收标准

- 实际安装命令为 uv pip install -r requirements.txt，构建不再运行 Turbo。
- 部署完成且 /docs 可以打开，无令牌 /hello 返回 401。
- 数据库真实查询未经授权令牌验证前不记为代理验证通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

- [Issue](2026-10-31-api-vercel-install-command-issue.md)
- 状态：已完成；用户确认线上验证通过并明确批准本地文档提交，完成状态随提交归档。

#### 预期交付边界

- 外部配置：Vercel api 项目安装命令、构建命令与无缓存重新部署。
- 仓库：本 Issue、Commit 记录和工作台，无代码变更。

#### 实际交付与验证

- 已在 Vercel 保存 Install Command = uv pip install -r requirements.txt，Build Command 为空且覆盖启用；界面显示 Build and development settings updated。
- 已选择 Production 无缓存重新部署，Vercel 二次认证由用户本人完成，代理未读取或记录验证码，真实凭据未修改。
- 用户完成二次认证后，新生产部署 5vr62rosHf7ALqiNCDu9qM7Lh43E 已 Ready；构建日志明确记录跳过旧缓存、执行 uv pip install -r requirements.txt、成功安装 17 项 Python 依赖。
- 生产域名 /docs 已正常显示 Exts API 与 GET /hello；无令牌 HTTP 请求返回 401，响应为 Unauthorized，原 psycopg 导入失败已不再阻止应用启动。
- 实际日志仍显示 Turbo 自动检测将空白构建命令替换为 turbo run build，执行 0 项任务。完全停用 Turbo 的验收项尚未达成，当前空跑不阻塞接口；不在未批准时改为其他构建命令。
- 用户明确反馈线上验证通过；该结果属于用户验收，代理未使用令牌执行数据库查询。
- 未改代码、依赖版本、环境变量或域名。本轮按用户批准仅提交三份管理文档，不需代码提交，不推送 Git；提交阶段沿用已有验证，不追加检查。

#### 完整 Commit message

文件：docs/ohmy-delivery/readme.md、本 Issue 与 Commit 记录。

```text
docs(api): 记录 Vercel 安装命令修复与线上验收

- 记录 Python 依赖安装命令与无缓存部署结果
- 保存线上验收结果和 Turbo 空跑限制
```

用户已明确批准提交；Issue、Commit 记录更新为已完成，工作台当前 Issue 清空并加入已完成索引，随同一笔文档提交归档；不推送远端。

## 关联文档

- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：用户确认线上验证通过并明确批准本地提交；完成状态随文档提交归档。空白构建覆盖仍被 Turbo 自动识别替换为空跑任务，保留实际限制记录。
- 批准依据：用户明确要求直接操作已展示方案：安装命令覆盖为 uv pip install -r requirements.txt，构建命令覆盖为空，保存后无缓存重新部署。
- 任务规模：小型部署配置修复。

### 历史后续事项

本工作项按用户批准以本地文档提交完结；后续独立配置 api.exts.linguio.dev。Turbo 空跑限制保留，不自动扩大范围、推送或修改域名。
