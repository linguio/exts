---
date: "2026-11-05"
scope: build
status: completed
type: task
---

# 准备 2.0.0 版本并更新官网日志

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

当前根产品版本为 1.9.0，官网最新条目 account-login-v190 的日期为 2026-11-05。已交付扩展功能目录迁移、轻量矢量 Logo、workflow-tests Skill 和版本变化触发草稿 Release 的配置，需要按用户指定日期整理为 2.0.0 的官网变化说明。

### 范围

- 将根 package.json 的唯一产品版本从 1.9.0 调整为 2.0.0；核对现有版本读取机制，不新增应用独立版本源，不升级依赖。
- 在 apps/website/src/pages/changelog/data.ts 顶部新增 2026-11-05 条目，内容分组为 Extension、Skills、Build，沿用现有结构与页面样式。
- 最终文案一（Extension）：重构扩展整体架构，按页面、业务功能与公共组件组织代码。
- 最终文案二（Skills）：新增 workflow-tests Skill，按变更影响范围选择检查、复用验证结果，避免重复验证。
- 最终文案三（Build）：优化部署与发布流程，版本变化时自动生成 Release 草稿。
- 按用户最终文案不再增加包体积、手动入口等额外说明，不将尚未执行的远端 Actions 或发布写成已成功验证。
- 将现有 account-login-v190 条目日期从 2026-11-05 改为 2026-11-04，保留其 id、标题和账户登录内容；新增条目继续使用 2026-11-05，不改其他历史日期。
- 用户追加批准：Release 草稿正文仅取官网最新条目的 changes，按分类和条目原顺序输出 Markdown 无序列表；不含日期、标题、分类或安装说明。仅 Release job 调用，官网普通部署不生成正文；标题、Tag、附件与触发规则保持不变。
- 用户追加批准：仓库原 tests Skill 改名为 skills/workflow-tests，元数据、默认提示、工作流衔接、现行规范和官网产品介绍及本次 changelog 同步改名；不安装全局副本，不修改历史交付记录。

### 排除项

- 不新增功能、不调整官网布局、不升级依赖、不改 Git 历史或旧 Issue 日期。
- 不再次实施架构迁移、SVG 优化或修改部署触发逻辑；发布改动限于正文来源和对应验证。
- 不创建 Tag、Release，不推送、部署或触发外部 Actions，不执行 macOS 全端构建。
- 不自动 Git Commit；开发完成停在用户验收。

## Todo

- [x] 调整根版本并核对现有版本读取与传播方式。
- [x] 新增 11 月 5 日三组日志，将原账户条目调整为 11 月 4 日。
- [x] 检查版本、日志原文、日期、唯一标识和官网类型；未运行应用构建或扩展测试。
- [x] 记录实际交付与未验证事项，提供官网日期顺序和根版本验收步骤。
- [x] 实现最新 changelog 到无序列表的 Release 正文生成，3 项行为测试通过，仅接入 Release job。
- [x] 同步 workflow-tests 命名与官网介绍，官网类型检查通过，更新交付记录并停在验收。

## 验收标准

- 根产品版本为 2.0.0，现有消费者继续从根版本读取，不产生第二版本源。
- 官网 changelog 最新条目为 2026-11-05，准确介绍 Extension、Skills、Build 三组变化；原账户登录条目显示 2026-11-04，其余历史内容不变。
- 最终三点使用用户确认原文，不声称本次已公开发布或远端验证通过。
- 草稿正文只包含当前最新条目的 Markdown 无序列表；新名称 workflow-tests 在 Skill 和官网现行引用保持一致。普通官网部署逻辑不变。
- 自动化检查结果与未执行项目如实记录；用户可在官网 changelog 检查日期、内容、排序及由根版本控制的展示。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-05-repo-v200-changelog-issue.md)

#### 预期交付边界

根版本调整为 2.0.0，官网新增 2026-11-05 三点日志，原账户条目改为 2026-11-04；按用户追加批准，将 Release 正文改为读取最新 changelog 无序列表，tests Skill 统一改名 workflow-tests 并同步官网和现行引用。不改发布触发条件、不推送或发布。

#### 实际交付

- 根版本为 2.0.0，官网新增 2026-11-05 条目“优化扩展架构与开发流程”；三点使用用户确认原文，第二点按后续要求改名 workflow-tests。原账户日志日期为 2026-11-04，其他历史内容保留。
- 新增 scripts/release-notes.mjs：读取 changelogEntries 第一条，按分类原顺序输出更新内容的无序列表，不包含其他信息；空内容或无效更新点拒绝生成。
- Release job 在 Tag 操作前生成正文文件，替换旧固定安装说明，现有 gh release create 继续读取 notes-file；官网 job、触发规则、标题、Tag 与附件规则保持不变。Release 逻辑测试步骤加入正文行为测试。
- 仓库 skills/tests 重命名为 skills/workflow-tests，元数据与默认提示同步；官网产品介绍名称和源码链接、本次日志、根规范、验证规范及 workflow-change 引用同步，历史交付记录不改写。未全局安装或修改依赖、页面布局。

#### 验证与限制

- node scripts/version.mjs 输出 2.0.0；官网 tsc --noEmit 通过。
- 初始日志阶段直接加载数据核对原文、日期与唯一 id 通过；后续仅将第二点 Skill 名称按用户要求改为 workflow-tests，官网类型检查再次通过。
- 新增正文行为测试先因无实现失败，实现后 3 项通过：只取最新条目并顺序展开、拒绝空正文、拒绝空值或多行更新点。node scripts/release-notes.mjs 的实际输出为当前三点无序列表。
- 初次合并核对命令中 Node 调用 Git 被 spawnSync EPERM 拒绝；拆开数据核对和 Git diff 后完成检查，未改代码规避限制、未安装依赖。
- 未运行应用测试、官网/扩展构建、macOS 全端构建或浏览器检查；现存构建产物仍是旧版本/日志，不作为本次结果。未推送、部署、创建 Tag 或 Release。
- 工作流与 Skill 元数据采用静态核对，当前环境没有 YAML 解析依赖，未安装新依赖或宣称自动 YAML 校验通过；仓库 Skill 文件重命名不等于全局副本已更新。

#### 用户验收

用户明确要求“其他的也提交了”，据此批准本工作项完结及代码、文档两笔本地提交；未追加验证，不核实用户是否实际浏览器验收。版本、日期、正文内容已有结果与未验证事项保持如实记录，未创建真实草稿。

#### 提交方案

- 代码提交：package.json、apps/website/src/pages/changelog/data.ts、apps/website/src/shared/products/categories.ts、.github/workflows/exts-deploy.yml、scripts/release-notes.mjs、tests/release-notes.test.mjs。完整消息：

```text
chore(repo): 准备 2.0.0 版本并同步发布说明

- 更新版本、日志日期与 workflow-tests 官网介绍
- 使用最新 changelog 无序列表生成 Release 草稿正文
```

- 文档提交：本 Issue、Commit 记录、docs/ohmy-delivery/readme.md、docs/build-release.md、AGENTS.md、docs/verification.md、skills/workflow-change/SKILL.md、skills/tests 到 skills/workflow-tests 的目录重命名及元数据修改。完整消息：

```text
docs(repo): 同步发布正文规则与 workflow-tests 命名

- 记录版本日志、草稿正文规则与验证结果
- 统一验证 Skill 的名称与现行规范引用
```
- 上述两笔完整消息、文件边界、diff 摘要、已有验证及限制已展示；用户要求本地提交，代码已提交，随文档提交将本 Issue、交付记录与工作台同步为已完成。

#### 最终提交批准

已批准并执行代码、文档两笔本地提交；未推送、部署或发布。

## 关联文档

- [工作台](../../readme.md)
- [构建与分发规范](../../../build-release.md)
- [扩展目录迁移](2026-11-05-extension-feature-structure-issue.md)
- [轻量 Logo](2026-11-05-extension-lightweight-logo-issue.md)
- [workflow-tests Skill](2026-11-05-repo-scoped-verification-issue.md)
- [版本变化自动生成 Release 草稿](2026-11-05-repo-auto-release-on-version-issue.md)

## 历史补充

### 元信息

- 当前阶段：用户批准剩余内容本地提交，代码已提交，随文档提交完结
- 规模：小型任务，一个 Issue，不另建 Spec 或 Plan。
- 批准依据：用户建档后逐条确认三点最终文案，并回复“可以”，批准根版本 2.0.0、新增 11 月 5 日日志、原账户条目改为 11 月 4 日；不提交或推送。

### 历史后续事项

用户已要求“其他的也提交了”，按批准完结全部剩余代码、文档与 Skill 改名；真正 Release 的 Tag、附件与草稿创建留待用户明确发布，不自动推送或部署。
