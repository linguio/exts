---
date: "2026-09-27"
scope: [repo]
status: completed
type: task
---

# 整理仓库 README 项目入口

## 当前阶段

已完成。

## 目标与范围

### 背景

根目录 `README.md` 仍使用较早的仓库结构，只介绍了 My Tabs 和 TG Download，尚未反映 X Download、macOS Helper、官网、公共包和 AI Skills 等现有目录。项目入口也缺少统一的子项目 README 与 Release 导航。

### 目标

将根目录和 `apps/` 下各子项目 README 统一为准确、简洁的三段式入口，让读者可以快速理解每个目录的用途、技术框架和内部结构。

### 范围

- 根 README 只保留“介绍”“项目框架”“本目录项目结构”三个部分，并列出各子项目 README 入口。
- 统一整理以下五个子项目 README：`my-tabs`、`tg-download`、`x-download`、`x-download-helper` 和 `web`。
- TG Download 使用以下介绍：
  > 面向 Telegram Web 的 Chrome 与 Edge 扩展，通过右键菜单保存图片和视频，并在扩展中查看下载进度与历史记录。
- 每个子项目 README 只保留“介绍”“项目框架”“本目录项目结构”三个部分；未知内容使用占位说明。
- `apps/web` 需要编写 README，但不作为产品项目单独展示；`packages`、`skills` 和 `docs` 不纳入子项目 README 整理。

### 排除项

- 不分配或修改任何开发端口。
- 不修改 WXT 配置、开发命令、扩展业务代码或 Manifest。
- 不修改 GitHub Actions、Tag 规则或 Release 自动化。
- 不补写尚未确认的产品功能或安装流程。
- 不修改官网页面内容、目录结构或其他非 README 文档。

## Todo

- [x] 按当前仓库事实重写根 README 的三段式结构和项目入口。
- [x] 按统一三段式模板整理 `my-tabs`、`tg-download`、`x-download`、`x-download-helper` 和 `web` README。
- [x] 写入 TG Download 介绍，并为未确认内容保留明确占位。
- [x] 检查 Markdown 链接、格式与工作区差异。

## 验收标准

- 根 README 只有“介绍”“项目框架”“本目录项目结构”三个主要部分，并反映当前仓库目录。
- 五个 `apps/` 子项目 README 都使用相同的三段式结构，且根 README 的本地链接有效。
- TG Download 使用 Issue 中确认的介绍语；未确认内容明确标记为待补充。
- 不包含端口分配、业务代码、开发配置或 Release 自动化变更。
- 所有新增或调整的相对链接有效，Markdown 格式检查和 `git diff --check` 通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-27-repo-readme-project-navigation`
- 对应 Issue：[整理仓库 README 项目入口](2026-09-27-repo-readme-project-navigation-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已批准
- 创建日期：2026-09-27
- 最近更新：2026-09-27

#### 预期交付边界

- 更新根 README 的“介绍”“项目框架”“本目录项目结构”三段式结构。
- 统一整理 `my-tabs`、`tg-download`、`x-download`、`x-download-helper` 和 `web` 五个子项目 README。
- 完成 TG Download 介绍，其余未确认内容保持明确占位。
- 不涉及端口、业务代码、开发配置或发布自动化。

#### 实际完成内容

- 重写根目录 README，统一为三段式结构并补充五个子项目 README 入口。
- 按三段式结构整理 My Tabs、TG Download 和 X Download README。
- 新增 X Download Helper 与 Web 的项目级 README。
- 使用确认后的 TG Download 介绍语，未确认内容保持占位。
- 保持端口、业务代码、WXT 配置、开发命令和 Release 自动化不变。

#### 验证结果

- `git diff --check` 通过。
- 根 README、五个子项目 README、工作台、Issue 和 Commit 记录共 9 份 Markdown 文件的相对链接检查通过，`broken_links=0`。
- 9 份 Markdown 文件的围栏检查通过，`odd_fences=0`。

#### 未验证事项与限制

- 未运行扩展类型检查、单元测试或构建；本次仅修改 Markdown 文档，不涉及业务代码。
- TG Download v1.0.0 已由用户确认公开发布，根 README 已链接到正式 Release 页面。

#### 用户验收

- 结果：已通过
- 说明：用户明确要求“提交到本地”，表示已验收并批准创建本地 Git Commit。

#### 最终 Commit message

`docs(repo): 整理仓库 README 项目入口`

#### 最终提交批准

- 状态：已批准
- 说明：用户明确要求创建本地 Git Commit；不推送远端。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 类型：文档整理
- 当前阶段：用户已验收并批准本地 Git Commit
- 最近更新：2026-09-27

### 历史后续事项

### 唯一下步

当前工作项已完成，无后续操作。
