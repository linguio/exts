---
date: "2026-09-19"
scope: [repo]
status: completed
type: task
---

# 建立本地项目管理体系

## 当前阶段

已完成。

## 目标与范围

### 背景

本仓库改用 Git 管理的本地文档记录想法、工作项、设计、实施计划、验收结果和阶段提交。

改造前的 `AGENTS.md` 依赖外部项目管理系统，`docs/project-change-documentation.md` 与最终讨论结果也不一致，`docs/superpowers/` 仍被 Git Ignore。需要通过一次独立改造统一这些规则。

### 目标

建立一套适合个人顺序开发的本地项目管理流程，使代理和用户能够从仓库文档中确定：当前正在做什么、为什么做、按什么顺序实施、怎样验收，以及何时允许创建最终 Git Commit。

### 范围

- 建立 `docs/ohmy-delivery/readme.md` 工作台。
- 使用扁平的 `issues/` 和 `commits/` 目录保存工作项与交付记录。
- 保留 `docs/superpowers/specs/` 和 `docs/superpowers/plans/` 作为正式设计与计划位置，并纳入 Git 管理。
- 使用公共文件名前缀关联 Issue、Spec、Plan 和 Commit 记录。
- 重写根 `AGENTS.md` 中的项目管理、阶段验收和提交规则。
- 将插件级规则中的外部 Issue 术语改为本地工作项术语。
- 移除当前正式规则中对外部项目管理系统的依赖。
- 清理与当前代码或最终流程冲突的历史文档。
- 更新仍具有长期价值但内容已经过时的技术文档。

### 排除项

- 不改写旧 Git Commit。
- 不在本次改造中创建个人 Skill；只保证仓库结构以后适合被 Skill 操作。
- 不引入自动生成索引、优先级、标签、负责人或截止日期系统。

## Todo

### Sub-issues

#### 1. 固化本地文档结构

- 状态：已完成
- 依赖：无
- 交付结果：建立工作台、Issue、Commit、Spec 和 Plan 的职责与关联方式。
- 验收标准：目录没有重复事实来源，命名可以稳定关联同一工作项。

#### 2. 重写仓库工作流规则

- 状态：已完成
- 依赖：Sub-issue 1
- 交付结果：`AGENTS.md` 以本地文档为唯一项目管理方案，并适配 Superpowers。
- 验收标准：现行规则不再要求外部项目管理系统，批准、验收和 Commit 门槛清楚。

#### 3. 清理冲突文档并验证流程

- 状态：已完成
- 依赖：Sub-issue 2
- 交付结果：移除冲突历史文档，更新长期技术说明，检查正式文档结构、链接和 Git Ignore 状态。
- 验收标准：文档链接有效，`git diff --check` 通过，正式目录可用于下一个真实 Issue。

## 验收标准

- `docs/ohmy-delivery/readme.md` 能显示想法、当前唯一 Issue、队列和完成记录。
- 一个主 Issue 只使用一份 `-issue.md` 和一份 `-commit.md`。
- Sub-issue 只存在于主 Issue 内部。
- Issue、Spec、Plan 和 Commit 记录使用相同公共前缀并互相链接。
- Issue 与 Commit 记录在工作项开始时同步创建，并始终一一对应。
- Issue 记录预期验收标准，Commit 记录实际验证和用户验收结果。
- Spec 和 Plan 不复制到 `changes/`。
- 当前 Issue 的交付 Commit 完成前不能开启下一个 Issue。
- Plan 批准、规划 Commit 批准、用户验收和最终 Commit 批准是相互独立的用户授权。
- `docs/superpowers/` 纳入 Git 管理。
- 仓库现行工作流不再依赖外部项目管理系统。
- 不修改业务代码。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-19-repo-local-project-management`
- 对应 Issue：[建立本地项目管理体系](2026-09-19-repo-local-project-management-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已批准
- 创建日期：2026-09-19
- 最近更新：2026-09-19

#### 预期交付边界

- 用 Git 管理的本地文档完全取代仓库内的外部项目管理规则。
- 建立一一对应的 Issue 与 Commit 记录，以及按需使用的 Spec 和 Plan。
- 清理失效历史文档并同步仍在使用的技术说明。
- 不修改业务代码或仓库外部状态。

#### 实际完成内容

- 建立本地工作台、Issue、Commit 记录、Spec 和 Plan 的正式结构与命名规则。
- 将根项目规范改成本地文档唯一管理方案，并明确单活动 Issue、用户验收和最终提交批准门槛。
- 更新 My Tabs 与 WXT 长期文档，使 React、DropdownMenu、Tooltip、资源目录和验证职责与当前实现一致。
- 删除旧项目变更方案、迁移历史、失效 Popover 决策、空子项目规则和旧编号的历史 Spec/Plan。
- 将 `docs/superpowers/` 纳入 Git 管理，并从根 README 提供项目管理入口。

#### 验证结果

- Issue/Commit 配对检查通过：1 份 Issue 对应 1 份 Commit 记录。
- 仓库 Markdown 相对链接检查通过，没有失效本地链接。
- Markdown 代码块检查通过，没有未闭合围栏。
- 旧外部系统名称、旧编号和失效迁移措辞检索无残留。
- `git diff --check` 通过。

#### 未验证事项与限制

- 本次只修改项目文档，不运行扩展测试、类型检查或构建。
- 本流程首次建立，实际使用中的改进应通过后续新 Issue 处理，不在当前交付中预先扩展。

#### 用户验收

- 结果：通过
- 说明：用户确认文档整理结果可以提交。

#### 最终 Commit message

```text
docs(repo): 建立本地项目管理流程

- 使用 Issue 与 Commit 记录统一本地任务状态和验收流程
- 纳入 Spec 和 Plan，并清理失效历史文档
- 同步 My Tabs 与 WXT 的长期说明
```

#### 最终提交批准

- 状态：已批准
- 说明：用户已明确要求执行最终 Git Commit。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 类型：架构
- 当前阶段：最终交付
- 最近更新：2026-09-19

### 文档

- [正式设计](../../../superpowers/specs/2026-09-19-repo-local-project-management-design.md)
- [实施计划](../../../superpowers/plans/2026-09-19-repo-local-project-management.md)

### 历史后续事项

### 下一步

本 Issue 已由用户验收并批准最终提交。后续独立需求创建新的 Issue 和 Commit 记录。
