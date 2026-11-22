---
date: "2026-11-10"
scope: website
status: completed
type: task
---

# 更新官网 Activity 编辑日志与产品版本

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

将近期 Activity 编辑、更新接口和 Cursor 串行开发工作流以三条公开日志记录到官网，并将产品版本更新为 2.2.0。

### 范围与排除项

- 官网 Changelog 新增一个 2026-11-10 条目，包含 Extension、API、Skills 三个标签及用户确认的三条文案。
- 根 `package.json` 产品版本更新为 2.2.0。
- 排除：发布、推送、构建产物、其他文案或功能修改。

## Todo

- [x] 在官网 Changelog 数据新增三标签条目。
- [x] 更新根产品版本为 2.2.0。
- [x] 尝试运行官网范围的最小验证并等待用户验收。

## 验收标准

- Changelog 顶部出现 2026-11-10 的新条目，含 Extension、API、Skills 标签及三条确认文案。
- 根产品版本为 2.2.0。
- 不修改其他日志正文、发布状态或构建产物。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-10-website-activity-editing-changelog-issue.md)

#### 预期交付

- 官网新增 Activity 编辑、更新接口和 Cursor 工作流三条 Changelog。
- 根产品版本更新为 2.2.0。

#### 实际交付

- 根 `package.json` 产品版本由 2.1.0 更新为 2.2.0。
- 官网 Changelog 顶部新增 2026-11-10 条目，含 Extension、API、Skills 三个标签及用户确认的三条文案。

#### 验证与限制

- `git diff --check -- package.json apps/website/src/pages/changelog/data.ts`：通过。
- `pnpm --filter @exts/website typecheck`：未完成；本机缺失依赖后 pnpm 尝试访问 npm registry，DNS 解析失败。未修改 lockfile 或安装依赖。

#### 用户验收

用户验收通过。

#### 提交方案

代码：`feat(website): 更新 Activity 编辑日志与产品版本`

文档：`docs(repo): 记录官网 Activity 编辑更新`

#### 最终提交批准

用户已明确批准本地提交；不推送、不部署。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 当前阶段：本地提交
- 已批准范围依据：用户确认的三条 Changelog 文案及产品版本 2.2.0。
- 规模：小型官网内容与版本更新。
- 执行分工：Codex 审查与验证；Cursor `composer-2.5` 实施，不自行提交。

### 历史后续事项

无。用户已验收并要求本地提交。
