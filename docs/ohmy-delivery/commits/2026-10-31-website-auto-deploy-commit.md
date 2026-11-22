# 官网自动部署交付记录

- [Issue](../issues/2026-10-31-website-auto-deploy-issue.md)
- 状态：已完成；用户于 2026-10-31 明确批准本地提交完结，代码与文档分开提交，未推送。

## 预期交付边界

- 代码配置：.github/workflows/exts-deploy.yml。
- 文档：发布说明、官网 README、本 Issue、Commit 记录与工作台。

## 实际交付和验证

- 官网工作流增加 main push 触发；自动与手动 Website 共用名称和并发组，保留手动 Website 与 Release，Release 明确限制手动事件。
- 同步官网 README 与发布说明。
- YAML 语法检查通过；6 组事件、分支和目标组合均符合预期，并发组检查通过。
- `node --test tests/build-release.test.mjs`：19 项通过、0 失败。
- `git diff --check` 通过。
- 未运行应用构建，本轮未修改应用代码或依赖；远端 Actions 尚未运行，未验证真实自动部署与线上页面。提交阶段未追加验证，未推送。

## 用户验收步骤
1. 检查工作流中 push 分支为 main，Website 允许 push，Release 仅允许 workflow_dispatch。
2. 批准提交并自行推送到 main 后，打开 GitHub Actions → Exts Publish，确认本次由 push 触发，Website 构建与部署成功，Release 跳过。
3. 访问 https://exts.linguio.dev/ 确认线上更新。既有 github-pages 环境审批规则仍可能要求用户批准。

## 完整 Commit message

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
