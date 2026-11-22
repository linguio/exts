---
date: "2026-11-18"
scope: extension
status: completed
type: bug
---

# 完善快捷编辑加载态并升级 pnpm

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

当前 Edit Daily 等最新记录查询成功后才弹出 Sheet。首次连接耗时较长时，用户点击后看不到明确的等待界面。

目标是点击后先打开原有编辑 Sheet，在内容区显示加载状态，成功取得记录后直接切换为原有表单。加载展示作为公共编辑组件能力维护，不在 Daily 再写一套 Sheet。

### 范围

- 用户追加批准：将 pnpm 从 12.4.2 精确升级到 12.21.0，统一根 packageManager、Volta pnpm 配置、包管理器锁定信息、GitHub Actions 和现行文档；按锁文件安装并验证，不升级 Node.js、业务依赖或产品版本。用户明确要求合并进当前 Issue，沿用当前文件前缀，不另建工作项。
- 公共组件 `apps/extension/src/components/custom/data-table/data-table-edit-sheet.tsx` 增加可选 `loading` 参数，默认 false；记录可在加载期间为 null，不依赖表格实例。
- 加载时保留现有标题、关闭入口及页脚结构，内容区显示现有官方 Spinner，提供读屏加载名称和忙碌状态；不展示旧记录或空白可编辑字段，Save 禁用，提交处理同时阻止加载中保存。
- 加载期间允许关闭或 Cancel，不出现放弃修改确认；数据到达后初始化草稿、校验和基线，再沿用现有保存及未保存修改确认流程，避免旧草稿或空草稿产生误判。
- `features/activity/daily/daily-quick-edit.tsx` 在用户触发后立即打开 Sheet，并传入加载状态；Daily 仍负责账号判断、查询、防重、取消及错误处理。
- 未登录和账号核验失败沿用现有官方 Toast 提示并结束打开流程，不发 Daily 请求；账号尚在核验时显示加载，核验通过后才查询。
- 查询成功后显示最新已有记录。无记录或查询失败时沿用现有 Toast 并关闭 Sheet，不新增重试页面或自动创建记录。
- 加载中关闭、退出、换号或会话重置时取消请求并清理记录，迟到结果不能回填或重新打开；重新打开时重新查询。
- QueryDataTable 不传 loading 时保持原有行编辑、回填、校验、局部保存及放弃确认行为，不改变表格查询流程。
- 实施时将获批共性规则同步到表格规范和必要的扩展表格说明，不批量改造其他调用方。

### 排除项

- 不另建 data-form、独立编辑 Sheet、加载管理层或全局状态机制，不抽离或重组表格内部编辑状态。
- 不改 Daily 查询/更新接口、记录选择规则、后端、数据库、认证流程或 Studio 刷新机制。
- 不调整 Sheet 外观、尺寸、主题、动画、菜单名称或图标，不新增业务依赖、产品版本或发布日志；工具升级仅限追加批准的 pnpm。
- 不新增假 DOM、视觉、焦点、键盘、指针或菜单交互自动化；不顺手清理无关测试。
- 不暂存、提交或推送；Git 操作须另获明确批准。

## Todo

- [x] 将根配置、CI、包管理器锁定信息及现行文档统一到 pnpm 12.21.0，完成安装及受影响构建、测试验证，记录平台与Node版本限制。
- [x] 按本 Issue 取得代码实施批准，核对草稿初始化与加载关闭边界。
- [x] 为公共 DataTableEditSheet 增加可选 loading 状态、提交保护和安全的表单初始化；类型检查通过，默认行编辑的浏览器回归待验收。
- [x] 调整 DailyQuickEdit 先打开再查询，沿用取消、账号隔离、失败及空结果关闭流程；相关逻辑测试通过，浏览器验收待进行。
- [x] 同步相关共性文档，按分级验证规范完成必要纯逻辑、Extension 类型与构建检查，记录默认编辑路径的回归范围。
- [x] 提供产物路径及可复现浏览器验收步骤，停在用户验收，不主动提交 Git。

## 验收标准

- 仓库内 `pnpm --version` 返回 12.21.0，根 packageManager 和 Volta pnpm 配置及CI精确版本一致；按锁文件安装成功，业务依赖不升级，必要测试和构建通过或明确记录平台限制。
- 已登录时点击 Home Actions → Edit Daily，无需等待查询返回就打开现有编辑 Sheet；慢请求期间标题和关闭入口可用，内容区显示 Spinner，Save 不可用且不能提交。
- 查询成功后在同一 Sheet 中显示最新记录，不残留上次数据；未改动时关闭不错误触发放弃确认，有修改后仍沿用原有确认和校验。
- 加载中关闭能立即结束本次流程；响应迟到不回填、不重新打开，重新点击会重新查询。
- 查询失败或无记录时出现现有官方 Toast 并关闭 Sheet；未登录提示登录且不查询，账号核验等待不误报未登录。
- 退出、换号或会话重置不显示或保存旧账号数据，已打开表单的保存和失败保留输入行为不回退。
- Studio Daily 表格原有 Edit 不传 loading，直接显示行数据；校验、Cancel、放弃确认、局部更新、保存反馈及刷新保持原有行为。
- 代理仅验证必要纯逻辑、类型和构建；用户在 Chrome/Edge 加载根 dist 中提供的构建产物，检查慢请求、成功、失败、无记录、关闭重开及原表格 Edit。自动化通过不等同用户验收通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-18-extension-edit-sheet-loading-issue.md)

#### 预期交付边界

为公共 DataTableEditSheet 增加默认关闭的可选 loading 能力，DailyQuickEdit 点击后先打开 Sheet 再加载记录；复用现有表单与接口，保留表格行编辑默认行为，处理加载关闭、迟到响应、账号边界和草稿初始化。查询失败或无记录沿用现有官方 Toast 并关闭 Sheet。

用户追加批准将 pnpm 精确升级到12.21.0并合并当前Issue，同步根配置、CI、包管理器锁定信息与现行文档；不升级Node.js、业务依赖或产品版本。

用户已明确要求“开始吧”，批准按 Issue 实施；未批准 Git 提交。

#### 实际交付

- 公共 DataTableEditSheet 增加可选 loading（默认 false），加载和草稿尚未对应当前记录时显示官方 Spinner，保留标题、关闭与页脚，禁止保存；仅当前草稿就绪后展示字段和判断未保存修改。
- DailyQuickEdit 不再等查询成功才打开 Sheet，账号确认或核验中先展示加载态；继续沿用现有查询取消、账号隔离、错误与空记录反馈，无需改 QueryDataTable 或业务接口。
- 表格规范及扩展表格说明同步公共加载能力和业务边界。
- 根 packageManager 与 volta.pnpm、两份GitHub Actions内三处版本及根README、官网README、构建和npm发布说明统一到12.21.0；历史工作项保留当时版本。pnpm-lock.yaml仅包管理器专用段及pnpm自身平台包更新，业务依赖段无变化。

#### 验证与限制

- 初次检查因依赖目录权限及WXT缺少传递依赖受阻；按用户批准冻结安装后恢复。升级pnpm时使用 `pnpm self-update 12.21.0 --yes` 更新包管理器锁定段；新版本执行 `pnpm install --frozen-lockfile` 成功。
- 沙箱普通调用无法创建包管理器临时目录，会警告并回退12.4.2；获准权限下 `pnpm --version` 确认12.21.0。以下升级后检查均在该权限下使用新版本执行；未改变本机全局Volta默认配置。
- `pnpm --filter @exts/extension test`：46个文件187项通过；Extension与Website各自 `typecheck` 均通过。
- `pnpm ext:build`、`pnpm web:build`：通过，产物分别为 `dist/build/chrome-mv3`、`dist/build/exts-web`。扩展保留 theme-init.js 非module脚本及大于500kB chunk警告。
- `pnpm exec node --test --test-isolation=none tests/build-release.test.mjs tests/extension-release.test.mjs tests/release-notes.test.mjs apps/website/tests/auth-requests.test.mjs apps/website/tests/shared/products/categories.test.ts apps/website/tests/pages/home/showcase/card-pool.test.ts packages/npm-release-tools/tests/publish.test.mjs`：55项通过，没有执行实际发布。
- `pnpm --filter @linguio/wxt-stable-output test`：10项通过；该工具 `typecheck` 通过。
- 执行环境Node为24.18.0，与仓库固定24.16.0不同并产生engine警告；本次未更改Node版本配置。不把这些结果表述为固定Node版本下完整验证通过。macOS原生构建及远端CI未执行。
- 未新增假DOM或视觉/交互测试；浏览器加载关闭、草稿切换、焦点及原表格Edit待用户验收，不把自动化通过记为用户验收。

#### 用户验收

2026-11-18 用户明确表示“现有的验收通过 先commit”，确认当前交付验收通过并批准本地提交。以下保留复现步骤，不代表代理执行过浏览器验收；Toast层级问题尚未实施，不纳入此次交付。

1. 已登录点击 Home Actions → Edit Daily，在首次慢请求或浏览器网络限速时确认 Sheet 立即打开、内容区显示 Spinner，标题与关闭入口可见，Save 禁用。
2. 数据返回后确认同一 Sheet 显示最新记录；未编辑直接关闭不误弹放弃确认。编辑后取消仍弹放弃确认，合法保存与非法值校验保持原有行为。
3. 加载期间使用关闭或 Cancel，确认立即结束且无放弃确认；等待请求返回不重新弹出。重新打开再次查询，不展示上次草稿。
4. 查询失败、无记录或未登录时确认现有 Toast 提示且 Sheet 关闭；退出或切换账号不出现旧账号记录。
5. 进入 Studio Daily，通过行 Edit 检查已有记录回填、校验、放弃确认、保存反馈和刷新，无额外业务查询阶段。
6. 在仓库根目录正常终端执行 `pnpm --version` 确认12.21.0；检查根packageManager与Volta、CI精确版本一致，业务依赖没有升级。代理沙箱回退问题及固定Node版本的验证限制见上文。

#### 提交方案

按功能修复、工具升级与文档分三笔提交，分别记录不同类型的实际结果。

##### 加载态代码

- 文件：`apps/extension/src/components/custom/data-table/data-table-edit-sheet.tsx`、`apps/extension/src/features/activity/daily/daily-quick-edit.tsx`。
- 摘要：公共Sheet加载展示、草稿就绪保护及Daily先打开再查询。

```text
fix(extension): 快捷编辑先打开抽屉再加载记录

- 为公共编辑 Sheet 增加加载态与保存保护
- Daily 快捷入口在查询前打开并保留取消与账号隔离
```

##### 工具配置

- 文件：根`package.json`、`pnpm-lock.yaml`、`.github/workflows/exts-deploy.yml`、`.github/workflows/npm-packages-publish.yml`。
- 摘要：pnpm精确升级12.21.0并同步锁定平台包及CI。

```text
chore(repo): 将 pnpm 固定升级至12.21.0

- 同步根包管理器配置与锁定信息
- 统一部署和 npm 发布工作流版本
```

##### 文档

- 文件：`README.md`、`apps/website/README.md`、`docs/build-release.md`、`docs/npm-release.md`、`docs/table-conventions.md`、`docs/extension/data-table.md`、`docs/ohmy-delivery/readme.md`、本Commit记录与对应Issue。
- 摘要：同步版本说明、公共加载规则及实际交付。机械性终态更新包括用户验收通过、提交批准已批准、Issue与工作台已完成及唯一下一步无。

```text
docs(repo): 完结编辑加载态与 pnpm 升级工作项

- 记录实际交付、验证限制与用户验收结果
- 同步使用说明并将 Issue 和工作台更新为已完成
```

#### 最终提交批准

已批准。2026-11-18用户明确要求本地commit；范围为以上三笔提交及机械性终态更新，不包含Toast层级修改、推送或发布。

## 关联文档

- [前置交付：Daily 快捷编辑](2026-11-17-extension-daily-quick-edit-issue.md)
- [工作台](../../readme.md)
- [表格规范](../../../table-conventions.md)
- [分级验证规范](../../../verification.md)
- [扩展表格说明](../../../extension/data-table.md)

## 历史补充

### 元信息

- 当前阶段：用户验收通过并批准本地提交，加载态代码、工具配置及文档分三笔完结
- 批准依据：用户批准实现及合并pnpm升级，最终明确表示“现有的验收通过 先commit”，批准本地提交；不包含推送或Toast层级调整。
- 任务规模：原为小型Sheet任务；用户明确追加合并跨应用pnpm工具升级，限定公共编辑组件与Daily接入、包管理器版本及对应CI文档，不新增后端接口或业务依赖，不另建Spec/Plan。

### 历史后续事项

无；当前交付已验收并批准本地提交，验证限制保留在Commit记录中，Toast层级调整另行处理。
