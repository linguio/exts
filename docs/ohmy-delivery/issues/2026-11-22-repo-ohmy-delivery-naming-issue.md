# 统一自维护 Skill 命名与交付文档目录

## 元信息

- 工作项：2026-11-22-repo-ohmy-delivery-naming
- 状态：已完成
- 当前阶段：入口改名和文档迁移已交付，用户批准本地提交
- 已批准范围依据：用户确认整理 `ohmy-<职责>` 命名、交付文档迁移及 Superpowers 协作规则为本地 Issue，并明确要求开始实施。

## 背景与目标

统一 `exts` 自维护 Skill 的命名和项目记录位置。当前唯一自维护 Skill 是 `workflow-delivery`，交付记录位于 `docs/ohmy-delivery/`。

## 拟议范围与排除项

- 自维护 Skill 统一使用 `ohmy-<职责>`。将 `workflow-delivery` 改为 `ohmy-delivery`，同步源码目录、入口元数据、Codex 展示配置和现行引用。
- Skill 源码、通用流程及模板位于 `.agents/skills/ohmy-<职责>/`。确有项目记录时，使用 `docs/ohmy-<职责>/`；交付工作台、Issue 和 Commit 记录迁至 `docs/ohmy-delivery/`。保持现有工作项标识及历史状态。
- 旧工作台入口保留迁移指引；更新仓库内受影响的链接。旧工作台迁移指引经用户要求删除，外部旧链接需更新。
- Superpowers 保留原有名称和调用入口，按需用于专项设计、排错、计划或验证，复用同一 Issue 与已有设计文档。交付 Skill 继续负责建档、验收和提交；沿用仓库的串行与子代理限制。
- GitHub Issue 归档、元数据同步实现、第三方 Skill 改名与全局安装排除在本工作项外。

## Todo

- [x] 核对自维护 Skill 与现行引用，更新命名规范并迁移 Skill 入口。
- [x] 验证新会话能发现并调用 `$ohmy-delivery`。
- [x] 迁移交付文档及工作台，更新受影响链接并保留旧入口指引。
- [x] 核对文档链接、历史状态、模板及 Superpowers 分工，交付用户验收。

## 验收标准

- 新会话可调用 `$ohmy-delivery`，自维护 Skill 的目录、元数据和现行引用命名一致。
- 从新工作台能打开现有 Issue 及关联 Commit 记录，已取消和已完成事项都可查询；旧工作台入口可以找到新位置。
- 日常交付可使用 `ohmy-delivery` 独立完成，专项任务可按需使用 Superpowers 并沿用同一工作项记录。

## 关联文档

- [Commit 记录](../commits/2026-11-22-repo-ohmy-delivery-naming-commit.md)

## 唯一下一步

无。
