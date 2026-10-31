# 修正 Vercel Python 安装命令

## 元信息

- 工作项：2026-10-31-api-vercel-install-command
- 状态：已完成
- 当前阶段：用户确认线上验证通过并明确批准本地提交；完成状态随文档提交归档。空白构建覆盖仍被 Turbo 自动识别替换为空跑任务，保留实际限制记录。
- 批准依据：用户明确要求直接操作已展示方案：安装命令覆盖为 uv pip install -r requirements.txt，构建命令覆盖为空，保存后无缓存重新部署。
- 任务规模：小型部署配置修复。

## 背景与目标

线上 app.py 导入 psycopg 时失败。构建日志显示 Vercel 自动检测 Turbo，执行 pnpm install 与 turbo run build，未安装 Python 依赖。目标是在保留 FastAPI、apps/api 根目录及既有环境变量的前提下恢复 Python 安装流程。

## 范围与排除项

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

## 关联文档

- [Commit 记录](../commits/2026-10-31-api-vercel-install-command-commit.md)
- [工作台](../README.md)

## 唯一下一步

本工作项按用户批准以本地文档提交完结；后续独立配置 api.exts.linguio.dev。Turbo 空跑限制保留，不自动扩大范围、推送或修改域名。
