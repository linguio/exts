---
date: "2026-11-09"
scope: extension
status: completed
type: task
---

# 优化配置驱动的业务查询表格

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

Daily 原先自行编排草稿、请求生命周期及工具栏。本次统一业务查询入口，页面只提供列、筛选、查询函数和必要资源信息，共同流程只维护一份。

### 排除项

不做新增/编辑/删除、多选或批量操作，不新增依赖、后端接口或数据库结构；不预建 CRUD/插件/缓存/全局请求框架，不删除低层既有能力。不自动提交、推送或部署。

## Todo

- [x] 明确规范、配置契约、组件与内部设计
- [x] 实现共同查询状态、生命周期和工具栏
- [x] 迁移 Daily 并删除被替代的编排，保持低层兼容
- [x] 完成自动化、用法和验收说明
- [x] 用户明确验证没问题，验收通过

## 验收标准

- 普通查询页面主要提供 columns、filters、queryFn、getRowId、caption 及必要 scopeKey/enabled，不自行编排请求状态或工具栏。
- Query/Reset/排序/分页符合表格规范，Reset 保留条数与列显隐且仅请求一次；空排序由后端兜底。
- 首次/刷新 body 中央无文字 Spinner，成功空结果与失败区分，旧结果不覆盖新查询或跨账号展示。
- 资源侧只保留业务参数映射、安全请求及数据校验，共同能力不获取账号/令牌或写死 Activity 接口。

## 唯一下一步

无。

## 交付记录

### 范围与实际交付

- 补充仓库级配置驱动和单一维护规范，区分当前查询能力与未来 CRUD 目标。
- 新增 QueryDataTable、内部查询 Hook 和实例级请求执行函数，复用原 DataTable 渲染、表头、分页、日期和列显隐组件。
- Toolbar 补受控草稿和 Query/Reset 模式；初始化/Reset 应用配置默认值，排序/分页只用已生效筛选，原即时模式兼容。
- 统一分页/排序参数、rows/total 接入、loading/error/retry、取消、迟到结果防护和 scopeKey 作用域隔离。
- Daily 已迁入，仅保留配置与资源适配；旧 daily/state.ts、请求 Effect、取消控制器、loading/error 和手写工具栏已移除。保留原安全后台请求和响应校验。

### 验证与限制

- 扩展完整测试：33 文件、140 项通过。
- 扩展类型检查通过；VITE_API_BASE_URL=http://127.0.0.1:8000 pnpm ext:build 通过，产物 dist/build/chrome-mv3。
- 请求边界采用纯异步测试，无假 DOM 或视觉/布局/指针测试。代理未执行浏览器和真实 API 联调，后端未变，未重跑 API/官网/桌面检查。
- 用户于 2026-11-09 明确“我验证了下，没问题”，验收通过；具体逐项覆盖未单独提供，不声称所有理论边界均已实测。
- 已按用户批准完成本地代码与文档提交；未推送或部署。

### 历史交付记录

- [唯一 Issue](2026-11-09-extension-data-table-reuse-issue.md)
- 状态：已完成
- 用户验收：2026-11-09 明确验证没问题，验收通过
- 最终提交批准：2026-11-09 已批准代码与文档两笔本地提交；未推送、未部署

#### 实际交付
- 新增 QueryDataTable，普通业务仅提供列、筛选、queryFn、行标识和名称等配置；底层 DataTable 继续兼容。
- 共同维护草稿/生效条件、默认值、Query/Reset、排序/分页联动、loading/error/retry、取消/迟到防护及作用域隔离。
- Toolbar 沿用同一份筛选控件渲染，补受控查询模式，无新增官方原语、主题或依赖。
- Daily 迁入配置入口，资源侧 query.ts 保留业务映射、安全请求和数据校验；删除旧 daily/state.ts、请求 Effect、手写工具栏和页面状态。
- 标准查询返回 rows/total，分页排序统一转换；安全文案使用 DataTableQueryError，未知异常显示通用提示，避免泄漏原始异常。
- 更新根规范、表格规范、组件说明及设计/计划。CRUD、多选和批量操作留待以后按需实施。

#### 实际验证
- pnpm --filter @exts/extension exec vitest run --maxWorkers=1：33 文件、140 项通过。
- pnpm --filter @exts/extension typecheck：通过。
- VITE_API_BASE_URL=http://127.0.0.1:8000 pnpm ext:build：通过，产物 dist/build/chrome-mv3。
- 先有失败行为验证，再实现公共状态/异步请求和 Daily 适配；两处测试 Promise 缺少返回类型已补齐，最终类型检查通过。
- 遵守串行和无假 DOM 约束，取消/迟到/异常采用纯异步测试；直接审查 diff，未启用子代理。

#### 验收与限制
- 用户明确验证没问题，验收通过；具体手动覆盖清单未单独提供。
- 代理未执行真实浏览器视觉/布局/交互或真实 API 联调；Daily 实际只使用日期筛选，未新增第二张真实业务表格。
- 后端未修改，本轮未执行 API/官网/桌面检查；未部署，最终本地产物指向 127.0.0.1:8000。
- 构建保留非 module 脚本与大于 500kB chunk 提示，退出码 0；未扩展构建优化范围。

#### 提交方案（已批准）
代码和文档分别提交，文件边界、摘要、验证及完整消息已展示；用户明确要求本地提交，代码已成功提交，文档与终态纳入第二笔。

代码消息：
```text
refactor(extension): 统一业务表格查询接入与生命周期

- 封装配置驱动查询入口并复用现有表格和工具栏
- 集中查询状态与取消防护并迁移 Daily 配置调用
- 验证草稿生效隔离、重置及请求边界
```

文档消息：
```text
docs(repo): 完善查询表格复用规范与接入说明

- 明确配置驱动和单一维护职责及渐进升级边界
- 记录统一查询入口、Daily 迁移和验收结果
```

用户已批准本地提交，Issue、工作台、本记录及设计/计划的完成状态随文档提交同步；两笔全部成功后完结。

#### 本次代码文件边界
- apps/extension/src/components/custom/data-table/index.ts
- apps/extension/src/components/custom/data-table/state.ts
- apps/extension/src/components/custom/data-table/toolbar.tsx
- apps/extension/src/components/custom/data-table/types.ts
- apps/extension/src/components/custom/data-table/query-data-table.tsx
- apps/extension/src/components/custom/data-table/query-request.ts
- apps/extension/src/components/custom/data-table/use-data-table-query.ts
- apps/extension/src/features/activity/daily/daily-records.tsx
- apps/extension/src/features/activity/daily/state.ts（删除）
- apps/extension/src/features/activity/daily/query.ts
- apps/extension/tests/features/activity/daily.test.ts
- apps/extension/tests/components/query-data-table.test.ts

#### 本次文档文件边界
- AGENTS.md
- docs/ohmy-delivery/readme.md
- docs/ohmy-delivery/history/2026/2026-11-09-extension-data-table-reuse-issue.md
- docs/ohmy-delivery/history/2026/2026-11-09-extension-data-table-reuse-issue.md
- docs/extension/data-table.md
- docs/extension/ui.md
- docs/table-conventions.md
- docs/web-ui-sources.md
- docs/superpowers/plans/2026-11-09-extension-data-table-reuse.md
- docs/superpowers/specs/2026-11-09-extension-data-table-reuse-design.md

#### 本地提交批准
用户于 2026-11-09 在验收通过后明确要求 commit，批准上述代码与文档两笔本地提交及工作项完成状态更新；不推送、不部署，不追加验证。任一提交失败保留已成功提交，未完成部分恢复待提交/待批准。

## 关联文档

- [表格规范](../../../table-conventions.md)
- [接入及验收说明](../../../extension/data-table.md)
- [设计说明](../../../superpowers/specs/2026-11-09-extension-data-table-reuse-design.md)
- [实施计划](../../../superpowers/plans/2026-11-09-extension-data-table-reuse.md)

## 历史补充

### 元信息

- 当前阶段：用户验收通过并批准代码、文档两笔本地提交完结
- 用户批准：2026-11-09 确认实施、验收通过并明确要求 commit；批准两笔本地提交，不推送。

### 历史后续事项

无，已按用户批准本地提交完结；未推送或部署。
