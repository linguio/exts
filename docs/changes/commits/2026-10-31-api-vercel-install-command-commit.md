# Vercel Python 安装命令交付记录

- [Issue](../issues/2026-10-31-api-vercel-install-command-issue.md)
- 状态：已完成；用户确认线上验证通过并明确批准本地文档提交，完成状态随提交归档。

## 预期交付边界

- 外部配置：Vercel api 项目安装命令、构建命令与无缓存重新部署。
- 仓库：本 Issue、Commit 记录和工作台，无代码变更。

## 实际交付与验证

- 已在 Vercel 保存 Install Command = uv pip install -r requirements.txt，Build Command 为空且覆盖启用；界面显示 Build and development settings updated。
- 已选择 Production 无缓存重新部署，Vercel 二次认证由用户本人完成，代理未读取或记录验证码，真实凭据未修改。
- 用户完成二次认证后，新生产部署 5vr62rosHf7ALqiNCDu9qM7Lh43E 已 Ready；构建日志明确记录跳过旧缓存、执行 uv pip install -r requirements.txt、成功安装 17 项 Python 依赖。
- 生产域名 /docs 已正常显示 Exts API 与 GET /hello；无令牌 HTTP 请求返回 401，响应为 Unauthorized，原 psycopg 导入失败已不再阻止应用启动。
- 实际日志仍显示 Turbo 自动检测将空白构建命令替换为 turbo run build，执行 0 项任务。完全停用 Turbo 的验收项尚未达成，当前空跑不阻塞接口；不在未批准时改为其他构建命令。
- 用户明确反馈线上验证通过；该结果属于用户验收，代理未使用令牌执行数据库查询。
- 未改代码、依赖版本、环境变量或域名。本轮按用户批准仅提交三份管理文档，不需代码提交，不推送 Git；提交阶段沿用已有验证，不追加检查。

## 完整 Commit message

文件：docs/changes/README.md、本 Issue 与 Commit 记录。

```text
docs(api): 记录 Vercel 安装命令修复与线上验收

- 记录 Python 依赖安装命令与无缓存部署结果
- 保存线上验收结果和 Turbo 空跑限制
```

用户已明确批准提交；Issue、Commit 记录更新为已完成，工作台当前 Issue 清空并加入已完成索引，随同一笔文档提交归档；不推送远端。
