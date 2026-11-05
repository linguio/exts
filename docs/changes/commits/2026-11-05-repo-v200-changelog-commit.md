# 准备 2.0.0 版本并更新官网日志：交付记录

## 对应工作项

- [Issue](../issues/2026-11-05-repo-v200-changelog-issue.md)

## 预期交付边界

根版本调整为 2.0.0，官网新增 2026-11-05 三点日志，原账户条目改为 2026-11-04；按用户追加批准，将 Release 正文改为读取最新 changelog 无序列表，tests Skill 统一改名 workflow-tests 并同步官网和现行引用。不改发布触发条件、不推送或发布。

## 实际交付

- 根版本为 2.0.0，官网新增 2026-11-05 条目“优化扩展架构与开发流程”；三点使用用户确认原文，第二点按后续要求改名 workflow-tests。原账户日志日期为 2026-11-04，其他历史内容保留。
- 新增 scripts/release-notes.mjs：读取 changelogEntries 第一条，按分类原顺序输出更新内容的无序列表，不包含其他信息；空内容或无效更新点拒绝生成。
- Release job 在 Tag 操作前生成正文文件，替换旧固定安装说明，现有 gh release create 继续读取 notes-file；官网 job、触发规则、标题、Tag 与附件规则保持不变。Release 逻辑测试步骤加入正文行为测试。
- 仓库 skills/tests 重命名为 skills/workflow-tests，元数据与默认提示同步；官网产品介绍名称和源码链接、本次日志、根规范、验证规范及 workflow-change 引用同步，历史交付记录不改写。未全局安装或修改依赖、页面布局。

## 验证与限制

- node scripts/version.mjs 输出 2.0.0；官网 tsc --noEmit 通过。
- 初始日志阶段直接加载数据核对原文、日期与唯一 id 通过；后续仅将第二点 Skill 名称按用户要求改为 workflow-tests，官网类型检查再次通过。
- 新增正文行为测试先因无实现失败，实现后 3 项通过：只取最新条目并顺序展开、拒绝空正文、拒绝空值或多行更新点。node scripts/release-notes.mjs 的实际输出为当前三点无序列表。
- 初次合并核对命令中 Node 调用 Git 被 spawnSync EPERM 拒绝；拆开数据核对和 Git diff 后完成检查，未改代码规避限制、未安装依赖。
- 未运行应用测试、官网/扩展构建、macOS 全端构建或浏览器检查；现存构建产物仍是旧版本/日志，不作为本次结果。未推送、部署、创建 Tag 或 Release。
- 工作流与 Skill 元数据采用静态核对，当前环境没有 YAML 解析依赖，未安装新依赖或宣称自动 YAML 校验通过；仓库 Skill 文件重命名不等于全局副本已更新。

## 用户验收

用户明确要求“其他的也提交了”，据此批准本工作项完结及代码、文档两笔本地提交；未追加验证，不核实用户是否实际浏览器验收。版本、日期、正文内容已有结果与未验证事项保持如实记录，未创建真实草稿。

## 提交方案

- 代码提交：package.json、apps/website/src/pages/changelog/data.ts、apps/website/src/shared/products/categories.ts、.github/workflows/exts-deploy.yml、scripts/release-notes.mjs、tests/release-notes.test.mjs。完整消息：

```text
chore(repo): 准备 2.0.0 版本并同步发布说明

- 更新版本、日志日期与 workflow-tests 官网介绍
- 使用最新 changelog 无序列表生成 Release 草稿正文
```

- 文档提交：本 Issue、Commit 记录、docs/changes/README.md、docs/build-release.md、AGENTS.md、docs/verification.md、skills/workflow-change/SKILL.md、skills/tests 到 skills/workflow-tests 的目录重命名及元数据修改。完整消息：

```text
docs(repo): 同步发布正文规则与 workflow-tests 命名

- 记录版本日志、草稿正文规则与验证结果
- 统一验证 Skill 的名称与现行规范引用
```
- 上述两笔完整消息、文件边界、diff 摘要、已有验证及限制已展示；用户要求本地提交，代码已提交，随文档提交将本 Issue、交付记录与工作台同步为已完成。

## 最终提交批准

已批准并执行代码、文档两笔本地提交；未推送、部署或发布。
