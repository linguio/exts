# 集中维护扩展 API：交付记录

## 对应工作项

- [Issue](../issues/2026-11-08-extension-api-directory-issue.md)

## 预期交付边界

将共用客户端及现有 Activity、Settings HTTP 接口集中到 src/api，更新消费者、既有测试引用和现行文档，保持业务行为。

## 实际交付

- 用户补充批准统一 Account 后台命名：account-background.ts 原样迁为 background.ts，更新后台入口及两份账号测试的导入。

- src/lib/api/client.ts、config.ts 迁至 src/api；客户端仅新增导出 ApiClient 类型，运行行为不变。
- src/api/activity.ts 集中 Activity 日期参数类型及查询调用；settings.ts 集中设置读取与更新调用，复用既有 SettingsPatch 类型。
- Activity 与 Settings 后台继续管理会话、消息来源校验、取消及状态；页面和测试引用已更新，原有行为测试完整保留。
- 同步扩展 AGENTS、业务 API 规范与性能文档中的现行目录和职责，历史工作项保持原交付记录。

## 验证与限制

- Account 重命名后再次串行运行扩展完整测试（116 项）、类型检查与生产构建，均通过；警告不变。

- pnpm --filter @exts/extension test --no-file-parallelism --maxWorkers=1：28 个测试文件、116 项测试通过，串行执行。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过，产物根 dist/build/chrome-mv3；保留 theme-init 非 module 脚本与大于 500 kB 分块警告。
- git diff --check：通过；当前源码、测试和现行 API 文档不再引用 lib/api。
- 代理未执行真实浏览器、线上或数据库联调，未更新 dist/dev 的稳定开发目录；未新增测试、依赖、接口或权限。

## 用户验收

用户于 2026-11-08 明确表示验收通过，工作项已完成；具体浏览器操作细节未单独记录。

## 提交方案

### 代码

- 文件：src/api/{client,config,activity,settings}.ts；原 src/lib/api/{client,config}.ts；features/account 后台重命名；entrypoints/background.ts；features/activity/{background,data,provider,requests}；features/settings/background.ts；tests/features/account/{account-background,account-reset}.test.ts；tests/features/activity/api-client.test.ts，均位于 apps/extension 下。
- 摘要：集中接口与客户端，更新后台和测试引用，保持业务行为。

```text
refactor(extension): 集中维护 API 并统一账号后台命名

- 将请求客户端与 Activity、Settings 接口集中到 src/api
- 统一账号后台入口命名并同步引用和既有测试
```

### 文档

- 文件：apps/extension/AGENTS.md、docs/api-conventions.md、docs/api-performance.md、docs/changes/README.md、本 Issue 与 Commit 记录。
- 摘要：同步现行目录职责及验证验收记录。
- 终态更新：Issue 与交付记录标为已完成、本地提交批准标为已批准、工作台清空当前 Issue 并移入完成索引。代码提交成功后执行这些更新；文档提交失败时恢复待提交状态。

```text
docs(extension): 记录 API 目录整理与验收结果

- 同步 API 目录职责和现行文档路径
- 记录验证、用户验收与工作项完成状态
```

## 最终提交批准

状态：已完成。用户于 2026-11-08 明确要求 commit，已批准两笔本地提交及上述机械性终态更新；未批准推送或发布。
