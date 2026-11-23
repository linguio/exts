---
date: "2026-10-31"
scope: [build, website]
status: completed
type: task
---

# 启用官网 main 自动部署

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

现有 Exts Publish 仅支持 workflow_dispatch，Website 和 Release 均限制 main。API 的 Vercel 生产分支为 main。本轮让官网也在推送 main 后自动部署。

### 范围与排除项

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

## 唯一下一步

无。

## 交付记录

### 历史交付记录

- [Issue](2026-10-31-website-auto-deploy-issue.md)
- 状态：已完成；用户于 2026-10-31 明确批准本地提交完结，代码与文档分开提交，未推送。

#### 预期交付边界

- 代码配置：.github/workflows/exts-deploy.yml。
- 文档：发布说明、官网 README、本 Issue、Commit 记录与工作台。

#### 实际交付和验证

- 官网工作流增加 main push 触发；自动与手动 Website 共用名称和并发组，保留手动 Website 与 Release，Release 明确限制手动事件。
- 同步官网 README 与发布说明。
- YAML 语法检查通过；6 组事件、分支和目标组合均符合预期，并发组检查通过。
- `node --test tests/build-release.test.mjs`：19 项通过、0 失败。
- `git diff --check` 通过。
- 未运行应用构建，本轮未修改应用代码或依赖；远端 Actions 尚未运行，未验证真实自动部署与线上页面。提交阶段未追加验证，未推送。

#### 用户验收步骤
1. 检查工作流中 push 分支为 main，Website 允许 push，Release 仅允许 workflow_dispatch。
2. 批准提交并自行推送到 main 后，打开 GitHub Actions → Exts Publish，确认本次由 push 触发，Website 构建与部署成功，Release 跳过。
3. 访问 https://exts.linguio.dev/ 确认线上更新。既有 github-pages 环境审批规则仍可能要求用户批准。

#### 完整 Commit message

代码配置提交（仅 `.github/workflows/exts-deploy.yml`）：

```text
ci(website): 启用 main 推送后自动部署官网

- 保留手动官网部署与安装包发布入口
- 隔离自动官网部署与手动 Release 触发条件
```

文档提交（发布说明、官网 README、Issue、Commit 记录及工作台）：

```text
docs(website): 记录官网自动部署规则与验证结果

- 同步 main 自动部署与手动发布说明
- 记录配置检查结果和远端验收步骤
```

用户已明确批准本地提交；随文档提交将 Issue、Commit 记录和工作台同步为已完成，远端未验证事项保持如实记录，不推送。

## 关联文档

- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：用户于 2026-10-31 明确要求本地提交完结；代码与文档分开提交，未推送或验证远端部署。
- 批准依据：用户明确要求官网允许自动部署，并确认监听的分支。
- 任务规模：小型配置任务。

### 历史后续事项

本工作项已按用户本地提交指令完结；用户自行推送到 main 后，在 Actions 确认自动运行 Website、跳过 Release，部署成功后访问官网验证。
