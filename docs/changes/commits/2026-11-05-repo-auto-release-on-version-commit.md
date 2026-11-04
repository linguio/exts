# 版本变化后自动生成 Release 草稿：交付记录

## 对应工作项

- [Issue](../issues/2026-11-05-repo-auto-release-on-version-issue.md)

## 预期交付边界

现有 Exts Publish 增加根版本变化触发 Release 的条件，并同步发布规范；不自动公开或推送。

## 实际交付

Exts Publish 增加版本变化检查：推送 main 后比较推送前后根 package.json 的 version，仅值变化时运行原有 Release job；手动 Website／Release 选择与官网推送自动部署保留。发布规范同步说明自动草稿行为。

## 验证与限制

工作流 YAML 解析通过；以当前版本与旧版本执行工作流实际比较脚本，分别得到跳过与放行；手动 Website／Release 脚本分别得到跳过与放行；现有构建发布逻辑测试 19 项通过，`git diff --check` 通过。未推送，不声称 GitHub Actions、xcode-27 构建、Tag 或草稿 Release 已实际运行。

## 用户验收

用户明确要求“直接改，改完提交验证”，据此执行本地提交；线上 Release 验证仍须推送后进行。

## 提交方案

配置提交：`.github/workflows/exts-deploy.yml`。Diff 增加版本比较 job，依据其输出放行现有 Release，保留官网和手动入口。

完整消息：

```text
ci(repo): 版本变化时自动生成 Release 草稿

- 比较 main 推送前后的产品版本
- 保留官网自动部署与手动发布入口
```

文档提交：`docs/build-release.md`、`docs/changes/issues/2026-11-05-repo-auto-release-on-version-issue.md`、`docs/changes/commits/2026-11-05-repo-auto-release-on-version-commit.md`、`docs/changes/README.md`。Diff 记录触发规则、验证与限制；配置提交成功后将 Issue 和工作台更新为已完成、最终提交批准标记为已执行。

完整消息：

```text
docs(repo): 完结版本自动触发 Release 工作项

- 记录自动草稿规则、验证结果与线上限制
```

## 最终提交批准

用户要求“改完提交验证”，上述两笔本地提交及机械性终态更新已批准并执行；未推送或公开 Release。
