---
date: "2026-11-17"
scope: extension
status: completed
type: feature
---

# 在 Home Actions 快捷编辑最新 Daily 记录

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

目前 Home Dock 的 Actions 只有占位项。用户希望在 Home 点击一个快捷操作，直接编辑 Daily 最新已有记录，不进入 Studio。

复用已有动态列配置、编辑 Sheet、校验与查询更新接口；业务连接逻辑留在 Daily 模块，不抽离或重组 QueryDataTable 内部编辑状态。

### 范围

- 验收补充批准：用户反馈点击登录即出现 `Session changed. Please try again.`，批准修复登录前核验。仅在主动登录前重新核验账号及读取后台当前会话标识；保留后台会话校验，不自动重试登录或退出，不改变 Daily 写入隔离。公共认证修改仅限这一补充范围。

- 在 `apps/extension/src/pages/dock/actions-entry.tsx` 增加快捷菜单项及打开状态；Actions 只负责入口。菜单文案确定为 `Edit Daily`，图标沿用 Studio Daily 的 `notebook-text`；业务组件名为 `DailyQuickEdit`。
- 在 `apps/extension/src/features/activity/daily/daily-quick-edit.tsx` 新增薄业务组件，通过 `open` / `onOpenChange` 连接 Actions，负责当前账号、最新记录查询、请求防重、取消和迟到响应隔离，以及查询失败与无记录提示。
- 复用 `queryDailyRecords`：第一页、每页一条、日期倒序，打开最新已有记录，不受 Studio 临时筛选和排序影响；不保证记录日期为今天，不自动创建记录。
- 直接组合公共 `DataTableEditSheet`，传入记录、`dailyColumns`、行 ID 和现有 Daily 更新函数，启用局部更新；沿用动态字段解析、草稿、校验、保存防重、失败保留输入、成功反馈及放弃修改确认。
- 查询成功后才显示编辑 Sheet；关闭后保留 Home。Actions 入口及菜单项保留，各业务自行判断登录要求，不在 Actions 增加统一权限拦截。
- DailyQuickEdit 使用现有 `useAccount()` 状态判断账号；未登录时通过现有 Sonner 提示 `Please sign in to edit daily records.`，不查询、不打开编辑 Sheet，不新增登录判断接口。账号状态仍在加载时不误判为未登录，不发送业务请求。退出、换号或会话重置时取消请求并清理旧账号记录；服务端继续使用现有认证校验，登录过期沿用既有错误处理。
- 保存后沿用现有 Studio Activity 显示恢复时重新运行查询 Effect 的机制，不新增刷新通知或修改通用表格。此结论来自源码调查，实际切换与数据更新结果仍由用户浏览器验收。

### 排除项

- 不跳转、隐藏挂载或调用 Studio / DailyRecords 的组件实例。
- 不修改通用表格行为，不迁移其内部编辑状态，不重写动态列解析，不新增 data-form、全局事件总线或通用 CRUD 管理层。
- 不新增后端接口，不修改数据模型、依赖、产品版本或其他 Actions 功能。
- 不重新设计编辑 Sheet，不批量改造其他业务入口，不执行浏览器视觉或交互自动化验收。
- 不执行产品发布或部署；代码实施、本地提交和推送按用户后续明确批准执行。

## Todo

- [x] 按本 Issue 已确认方案取得代码实施批准（用户明确要求“开始吧”）。
- [x] 新增 DailyQuickEdit，复用查询接口与现有 DataTableEditSheet，接入 Actions。
- [x] 接入现有更新函数，完成请求取消、账号隔离、未登录提示、空记录和错误处理，沿用现有页面恢复查询机制；浏览器实际行为待用户验收。
- [x] 按分级验证规范完成必要逻辑、类型与构建检查，记录实际结果及限制。
- [x] 提供 Chrome/Edge 加载产物与可复现验收步骤，用户明确验收通过并批准提交及推送。

## 验收标准

- 在 Home 打开 Dock Actions 并选择快捷项，查询日期最新的一条 Daily 已有记录，显示与表格行 Edit 相同的字段配置和编辑 Sheet；全过程不进入 Studio。
- 编辑有效字段并保存，调用现有更新接口；成功关闭并沿用现有成功提示，再次打开可看到保存后的值。
- 输入不合法时沿用现有字段校验；保存失败保留输入，未保存关闭沿用放弃确认。
- 重复触发不会产生重叠编辑或重复有效请求；无记录和查询失败给出明确提示，不显示空编辑表单、不创建记录。
- 未登录不请求业务数据；退出、换号或会话重置后不展示或提交旧账号记录，迟到响应不能重新打开旧记录。
- 快捷保存成功后切换回已加载的 Studio Daily，沿用现有查询机制读取更新后的记录；保留当前筛选、排序和分页。刷新期间沿用现有加载规则，失败时沿用现有错误反馈，不把源码分析写成实际验证通过。
- 自动化仅覆盖必要纯逻辑、配置、类型和构建；用户自行在 Chrome 或 Edge 加载提供的构建产物，验收 Home 主流程、保存、取消、失败、空记录和账号边界。自动化通过不代表用户验收通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-17-extension-daily-quick-edit-issue.md)

#### 预期交付边界

Home Actions 的 Edit Daily 使用 notebook-text 图标，通过 DailyQuickEdit 打开最新已有 Daily 记录的编辑 Sheet，复用 dailyColumns、公共 DataTableEditSheet 及现有查询更新接口。DailyQuickEdit 使用现有账号状态处理未登录提示，不新增认证判断接口，不隐藏 Actions 或统一拦截其他入口。保存后沿用现有 Studio 恢复显示时的查询机制；不进入 Studio、不改通用表格行为、不新增 data-form、后端接口或刷新通知。

用户已批准实施及登录前核验修复，并明确表示“验收通过 push”，批准本地提交及推送 origin/main。

#### 实际交付

- 新增 DailyQuickEdit，Actions 移除占位项并展示 notebook-text 图标的 Edit Daily；查询期间该菜单项禁用，成功取到最新已有记录后打开公共编辑 Sheet。
- query.ts 增加最新记录查询入口，复用 queryDailyRecords，以第一页、每页一条、日期倒序读取；不继承 Studio 临时条件，不新增后端接口。
- 使用现有账号状态和会话重置订阅；未登录提示、账号核验失败提示、空结果提示、查询失败提示均复用 Sonner。查询清理中止请求并屏蔽迟到结果；账号作用域改变后清理记录并卸载旧编辑实例，使已有提交生命周期取消旧请求。
- 编辑复用 dailyColumns、DataTableEditSheet、toActivityDayUpdate 和 requestDailyUpdate，启用 partialUpdates；未改通用表格、动态表单解析、Studio 或刷新机制。
- 主动登录前重新核验后台账号、读取当前后台会话标识，避免页面缓存旧标识时在授权前被拒绝；已有账号、核验失败或核验期间会话变化时停止，过期账号允许重新登录，不自动重试，不改变后台校验及业务写入隔离。

#### 验证与限制

- 新增最新记录查询行为测试，先执行确认因函数未实现失败，再实现并执行相关测试。
- `pnpm --filter @exts/extension test tests/features/activity/daily.test.ts tests/features/activity/daily-update.test.ts tests/features/activity/requests.test.ts`：3 个文件、7 项测试通过，覆盖最新记录请求与空结果、错误传递和既有更新/取消边界。
- `pnpm --filter @exts/extension typecheck`：通过。
- 登录修复先以回归测试复现页面旧标识被后台拒绝，再修复；最终 `pnpm --filter @exts/extension test`：46 个文件、187 项测试全部通过，含 4 项登录前核验测试。修复后重新执行 Extension 类型检查及正式构建，均通过。
- `pnpm ext:build`：通过，产物为根 `dist/build/chrome-mv3`。构建提示 theme-init.js 非 module 脚本及大于 500 kB 的 chunk 警告，未在本工作项修改相关构建配置。
- 代理未执行浏览器视觉、交互、真实账号与 API 联调；用户已确认验收通过，未逐项提供操作结果，不据此声称代理完成这些验证。不引入假 DOM、交互自动化或额外全局刷新机制。

#### 用户验收

2026-11-17 用户明确表示“验收通过 push”。以下保留可复现验收步骤，不表示每一项均由代理执行。

1. Chrome/Edge 扩展管理页加载或重新加载根 `dist/build/chrome-mv3`，打开 New Tab Home。
2. 已登录时打开 Dock Actions，确认仅保留 Edit Daily 快捷项和 Daily 图标；点击后留在 Home，编辑日期最新已有记录，字段与 Studio Daily 的 Edit 一致。
3. 修改有效时长并保存，确认成功提示与关闭；再次打开检查值，再切回 Studio Daily，等待查询完成后确认保存后的值，筛选/排序/分页仍保留。
4. 修改后取消，确认放弃提示；输入非法值确认校验阻止保存。网络失败时查询提示失败且不弹空表单，保存失败保留输入；恢复后可重试。
5. 未登录点击后确认登录提示，Home 和 Actions 入口保留，不请求 Daily；无 Daily 记录账号点击后提示无记录，不自动创建。
6. 请求或编辑期间退出、换号，确认旧记录关闭、迟到结果不再打开；查询期间重复选择不产生重叠编辑。账号状态加载期间等待核验，不误报未登录。

#### 提交方案

代码按功能与登录修复分别提交，再提交文档，不混合不同类型的结果。

##### 快捷编辑代码

- 文件：`apps/extension/src/features/activity/daily/daily-quick-edit.tsx`、`apps/extension/src/features/activity/daily/query.ts`、`apps/extension/src/pages/dock/actions-entry.tsx`、`apps/extension/tests/features/activity/daily.test.ts`。
- 摘要：新增薄业务入口、最新记录查询及回归测试，替换 Actions 占位项。

```text
feat(extension): 增加首页 Daily 快捷编辑

- 在 Actions 增加 Edit Daily 并复用现有编辑 Sheet
- 查询最新已有记录并处理账号隔离与请求取消
```

##### 登录修复代码

- 文件：`apps/extension/src/features/account/auth-client.ts`、`apps/extension/tests/features/account/login-client.test.ts`。
- 摘要：登录前核验账号与当前后台会话，补充旧标识、账号变化及核验失败测试。

```text
fix(extension): 登录前重新核验后台会话

- 主动登录前核验账号并读取当前后台会话标识
- 保留会话变化拦截并补充旧标识回归测试
```

##### 文档

- 文件：本 Commit 记录、对应 Issue、`docs/ohmy-delivery/readme.md`。
- 摘要：记录实际交付、验证、限制和用户验收；终态更新仅将 Issue 与工作台改为已完成、Todo 收尾、唯一下一步改为无、提交批准记录为已批准。

```text
docs(extension): 完结 Daily 快捷编辑工作项

- 记录快捷编辑与登录修复的交付和验证结果
- 同步用户验收通过及工作台完成状态
```

#### 最终提交批准

已批准。2026-11-17 用户明确要求“验收通过 push”，批准上述本地提交、机械性终态更新及推送 origin/main；不包含发布或部署操作。

## 关联文档

- [工作台](../../readme.md)
- [表格规范](../../../table-conventions.md)
- [分级验证规范](../../../verification.md)
- [构建与分发规范](../../../build-release.md)

## 历史补充

### 元信息

- 当前阶段：用户验收通过，代码与文档按批准范围本地提交完结
- 已批准范围依据：用户确认方案并要求“开始吧”，随后批准登录核验修复；最终明确表示“验收通过 push”，批准本地提交和推送。
- 任务规模：小型任务；一个用户目标，不改变公共 API、数据模型、权限或构建体系，不另建 Spec、Plan 或子 Issue。

### 历史后续事项

无；用户已验收通过并批准本地提交及推送。
