# 启用官网 main 自动部署

## 元信息

- 工作项：2026-10-31-website-auto-deploy
- 状态：已完成
- 当前阶段：用户于 2026-10-31 明确要求本地提交完结；代码与文档分开提交，未推送或验证远端部署。
- 批准依据：用户明确要求官网允许自动部署，并确认监听的分支。
- 任务规模：小型配置任务。

## 背景与目标

现有 Exts Publish 仅支持 workflow_dispatch，Website 和 Release 均限制 main。API 的 Vercel 生产分支为 main。本轮让官网也在推送 main 后自动部署。

## 范围与排除项

- Exts Publish 增加 main push 触发，自动运行官网构建及 Pages 部署，保留手动 Website 入口。
- 自动与手动官网发布使用同一并发组；Release 仅 workflow_dispatch 选择 Release 时运行。
- 不修改 API Vercel 配置、其他分支、产品版本、权限、依赖或官网业务代码，不自动提交、推送或运行远端工作流。

## Todo

- [x] 修改工作流触发、作业条件与显示名称。
- [x] 同步发布文档并核对 main push、手动 Website 和手动 Release 的运行范围。
- [x] 检查工作流语法与现有相关测试，停在用户验收。

## 验收标准

- 推送 main 自动运行官网构建及部署，不运行 Release；其他分支不自动触发。
- 手动 Website 与 Release 各自保持原有行为，仍限制 main。
- 远端发布须推送修改后才能验证，不把本地配置检查记为发布成功。

## 关联文档

- [Commit 记录](../commits/2026-10-31-website-auto-deploy-commit.md)
- [工作台](../README.md)

## 唯一下一步

本工作项已按用户本地提交指令完结；用户自行推送到 main 后，在 Actions 确认自动运行 Website、跳过 Release，部署成功后访问官网验证。
