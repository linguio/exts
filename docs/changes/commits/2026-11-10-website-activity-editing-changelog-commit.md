# 更新官网 Activity 编辑日志与产品版本：交付记录

## 对应工作项

- [Issue](../issues/2026-11-10-website-activity-editing-changelog-issue.md)

## 预期交付

- 官网新增 Activity 编辑、更新接口和 Cursor 工作流三条 Changelog。
- 根产品版本更新为 2.2.0。

## 实际交付

- 根 `package.json` 产品版本由 2.1.0 更新为 2.2.0。
- 官网 Changelog 顶部新增 2026-11-10 条目，含 Extension、API、Skills 三个标签及用户确认的三条文案。

## 验证与限制

- `git diff --check -- package.json apps/website/src/pages/changelog/data.ts`：通过。
- `pnpm --filter @exts/website typecheck`：未完成；本机缺失依赖后 pnpm 尝试访问 npm registry，DNS 解析失败。未修改 lockfile 或安装依赖。

## 用户验收

用户验收通过。

## 提交方案

代码：`feat(website): 更新 Activity 编辑日志与产品版本`

文档：`docs(repo): 记录官网 Activity 编辑更新`

## 最终提交批准

用户已明确批准本地提交；不推送、不部署。
