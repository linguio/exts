---
date: "2026-10-01"
scope: repo
status: completed
type: task
---

# 补充本地 Commit 正文换行规范

## 当前阶段

已完成。

## 目标与范围

### 背景

现有本地 Commit 规范规定了 Conventional Commits 格式和正文内容，但没有明确正文必须使用真实换行，导致部分提交把字面量 `\n` 写入 Git Commit message。

### 目标

补充可执行的 Commit 正文换行规则，避免后续提交出现不可渲染的字面量 `\n`。

### 范围

- 更新根目录 `AGENTS.md` 的 Git Commit 规范。
- 更新 `skills/local-issue-commit-workflow/SKILL.md` 的提交硬门槛说明。
- 明确真实 LF 换行与 `\n` 字面量的区别，并给出安全的提交方式。

### 排除项

- 不修改已有 Git Commit 历史或 Commit SHA。
- 不修改现有 Issue、Commit 记录的正文格式。
- 不改变 Conventional Commits 的类型、scope 或标题规则。

## Todo

- [x] 在 `AGENTS.md` 补充正文换行规则。
- [x] 在本地工作流 Skill 补充同一规则和提交方式。
- [x] 检查文档差异与规则表述一致性。
- [x] 用户验收通过并完成本地 Git Commit。

## 验收标准

- 两个规范来源都明确要求使用真实换行，不得写入字面量 `\n`。
- 两个规范来源都给出使用多个 `-m` 或 `-F` 生成多行正文的可执行建议。
- 不修改历史 Git Commit，文档差异检查通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-10-01-repo-commit-message-format`
- 对应 Issue：[补充本地 Commit 正文换行规范](2026-10-01-repo-commit-message-format-issue.md)
- 状态：已完成
- 用户验收：用户已确认通过
- 最终提交批准：用户已明确批准本地提交
- 创建日期：2026-10-01
- 最近更新：2026-10-01

#### 预期交付边界

- 在根目录规范和本地工作流 Skill 中补充真实换行规则。
- 保留现有 Conventional Commits 约束，不修改历史提交。

#### 实际完成内容

- `AGENTS.md` 增加真实 LF 换行规则，禁止把字面量 `\n` 写入 Commit 正文。
- `skills/local-issue-commit-workflow/SKILL.md` 增加多个 `-m`、`-F` 和提交后检查建议。
- 保留现有 Conventional Commits 类型、scope、标题和正文条数规则，不修改历史 Commit。

#### 验证结果

- `git diff --check`：通过。
- 文档静态检查：确认两个规范来源均包含真实换行约束和可执行提交方式。

#### 未验证事项与限制

- 用户已确认规范变更并要求提交到本地 Git。

#### 用户验收

- 结果：通过。

#### 最终 Commit message

`docs(repo): 补充 Commit 正文换行规范`

#### 最终提交批准

- 状态：已批准并已提交本地 Git。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 类型：小型任务
- 当前阶段：用户验收通过，已提交本地 Git
- 最近更新：2026-10-01

### 历史后续事项

已完成规范更新与本地提交；无需后续步骤。
