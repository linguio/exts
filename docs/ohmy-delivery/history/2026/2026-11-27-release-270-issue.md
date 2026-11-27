---
date: "2026-11-27"
scope: [build, website]
status: completed
type: task
---

# 准备 Exts 2.7.0 版本

## 当前阶段

用户已确认验收通过并批准结项。发布验证仍有失败及待验证项。

## 目标与范围

以 v2.6.0 为基线，更新根产品版本及用户审定的官网更新日志，按发布规范执行验证。本阶段停在验收。

## Todo

- [x] 确认版本号、标题、分类和五条日志正文。
- [x] 写入产品版本与官网日志。
- [x] 执行本机可运行的发布验证并记录结果。
- [ ] 后续发布待处理。修复 API 测试失败并补齐未执行的检查。

## 验收标准

- 根版本为 2.7.0，官网日志展示获准标题及五条更新。
- 记录全量发布检查的实际结果和平台限制。

## 唯一下一步

本工作项已结项。后续正式发布前处理 API 路由测试并补齐发布验证。

## 交付记录

用户已批准 2.7.0 及修订后的五条日志。

- 根版本与 Chrome 正式构建 Manifest 均为 2.7.0。官网日志暂用北京时间 2026-11-27 作为条目日期。
- 按 Release 流程列出的 Node 测试入口执行，76 项通过，覆盖根构建与发布、官网逻辑、Desktop 启动脚本、API 启动脚本和 npm 发布工具。扩展全量 Vitest、扩展及官网类型检查、官网构建与 Chrome 扩展构建通过。
- wxt-stable-output 的 Vitest（10 项）、类型检查和真实包集成通过。Exts UI 的 Vitest（7 项）、类型检查、构建和真实包验证通过。最初尝试用 Node 测试运行这两个包时选错了运行器，已按包的 Vitest 入口重新执行。
- API unittest 执行 69 项，59 项通过、1 项失败、9 项跳过。test_app.DocumentationTests.test_openapi_documents_activity_and_bearer_without_internal_jobs 的预期路由集缺少已发布到代码的 `/api/accounts/list`。建议保留公开路由及隐藏内部任务的契约测试，并补上 Accounts 路由。API 测试范围未修改。
- Accounts 的分页后角色联查在现有 API 测试目录未找到专项覆盖，可用隔离 PostgreSQL 补充 Admin、未分配及空页保留总数的行为验证。没有配置隔离测试库，Release 工作流也将 API_TEST_DATABASE_URL 置空。
- Windows 无法执行 Desktop 原生测试或双端 Release ZIP / DMG 打包。仓库 Release 工作流提供 macOS 原生测试与双端打包入口，本次尚未运行。
- Git 差异检查通过。本阶段验证时尚未提交、推送或发布。


用户确认全部验收通过，并批准提交和推送。结项沿用原验证结果。API 测试仍有一项失败，隔离 PostgreSQL、macOS 原生测试和发布打包尚未验证。

版本提交 a3c122a 包含 package.json 和 apps/website/src/pages/changelog/data.ts。

    build(build): 更新产品版本至 2.7.0

    - 更新根产品版本与官网更新日志

文档提交仅含本归档 Issue。

    docs(build): 归档 2.7.0 发布准备工作项

    - 记录发布验证结果、已知缺口和验收

## 关联文档

[发布验证](../../../verification.md)
