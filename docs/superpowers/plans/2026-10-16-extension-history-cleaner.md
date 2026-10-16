# 访问历史自动清理实施 Plan

> 执行方式：使用 superpowers:executing-plans，在当前会话串行实施。仓库禁止子代理、并行任务及未经批准的提交，本 Plan 不采用分任务提交或子代理评审。

**目标：** 提供独立后台历史清理功能，默认关闭，在 Newtab Settings 配置，启用后于配置文件启动和最后窗口关闭时清空全部访问历史。

**架构：** 模块自行管理持久配置、权限、事件和设置区域；WXT 后台入口只注册事件，Newtab 只组合设置区域。清理只调用 removeHistory，不依赖页面存在。

**技术：** 现有 WXT、TypeScript、Chrome API、React、Button、Vitest；不新增依赖。

**Spec：** [已批准设计](../specs/2026-10-16-extension-history-cleaner-design.md)

**Issue：** [工作项](../../changes/issues/2026-10-16-extension-history-cleaner-issue.md)

**状态：** 用户于 2026-10-16 批准；已串行实施、完成自动化并获用户验收，正在准备代码与文档两笔本地提交范围，尚未提交。

## 全局约束

- 仅当前浏览器配置文件的访问历史；不清 Cookie、缓存、下载记录，不处理无痕、崩溃或强制退出。
- 单开关、默认关闭、storage.local 本机保存；启用不立即清理，不新增时间选择、补偿状态或手动清理入口。
- 新增 storage 必需权限及 browsingData 可选权限，保留 tabGroups；不新增 history、tabs 或站点权限。
- 不修改普通书签行为、主题、依赖版本与品牌资源；代码注释中文，设置界面沿用英文。
- 用户验收后明确要求拆分代码与文档两笔提交，Commit 记录对应最终文档结项提交；当前只准备拆分，不执行 commit、push 或真实历史删除。

## 重点核对

1. 授权拒绝或保存失败：不显示已启用，由设置逻辑测试验证。
2. worker 普通唤醒或配置未开启：不能清理，由后台事件测试验证注册本身不触发删除。
3. 多窗口或网页弹窗仍存在：不清理；DevTools 不参与计数，由后台窗口结果测试验证。
4. 同时关闭多个窗口：重叠清理只调用一次；清理失败不重试，由后台异步测试验证。
5. 另一个 Newtab 改配置或权限被撤销：设置同步实际状态；纯逻辑测权限与配置，跨页显示由用户验收，不做 DOM 测试。

## 文件与接口

以下应用文件均以 apps/extension/ 为前缀：

| 文件 | 职责与接口 |
| --- | --- |
| 新增 src/modules/history-cleaner/settings.ts | 固定存储键 historyCleaner.enabled；getHistoryCleanerEnabled(api: typeof chrome = chrome): Promise<boolean>；setHistoryCleanerEnabled(enabled: boolean, api: typeof chrome = chrome): Promise<boolean>，返回实际启用状态，写入失败抛错 |
| 新增 src/modules/history-cleaner/background.ts | registerHistoryCleaner(api: typeof chrome = chrome): void；同步注册启动和窗口移除监听，事件中读配置、权限和窗口并清理，失败记录中文错误 |
| 新增 src/modules/history-cleaner/settings-section.tsx | HistoryCleanerSettings()；读写设置并订阅本机配置与权限变化，渲染唯一开关和就地错误反馈 |
| 新增 src/entrypoints/background.ts | WXT defineBackground 入口只调用 registerHistoryCleaner，不导入 React 或 Newtab |
| 修改 src/modules/newtab/views/bookmarks/dock-settings.tsx | 在 Sheet Header 分隔线后组合 HistoryCleanerSettings，不持有清理业务 |
| 修改 wxt.config.ts | 新增所需权限，不改变资源、路径和稳定发布逻辑 |
| 新增 tests/modules/history-cleaner/settings.test.mjs、background.test.mjs | 用 Chrome API 替身验证纯逻辑及事件行为，不操作真实浏览器 |
| 修改 tests/config/manifest.test.mjs | 在现有配置行为验证中核对必需与可选权限 |

## 实施顺序

### 1. 完成本机开关与权限行为

- [x] 先写 settings.test.mjs：缺省与无效存储值关闭；拒绝授权不写 true；成功授权才持久化 true；关闭不请求授权；保存错误向调用者返回失败；读取时权限缺失视为关闭。
- [x] 运行定向测试确认预期失败，再实现 settings.ts；开启时从用户点击链直接发起权限请求，不先等待异步读取，以保留用户手势。
- [x] 定向测试通过；仅储存用户配置，不保存清理结果、不因切换开关执行删除。

### 2. 完成独立后台行为和入口

- [x] 先写 background.test.mjs：注册不删除、启动开启时清理、关闭或缺权限不清理、仍有窗口不清理、无窗口清理、重叠合并、API 失败仅记录错误。
- [x] 实现 background.ts 与薄 WXT 入口；只监听 onStartup 和 onRemoved，后者限定 normal/popup，getAll 查询剩余 normal/popup；只调用 removeHistory({ since: 0 })。
- [x] 清理前再次读取开关与权限；未开始的清理遵从最新开关，已发起删除不可撤回；无重试、定时器或持久队列。
- [x] 调整 Manifest 和既有配置测试，运行模块及配置定向测试，通过后进入设置接入。

### 3. 接入 Settings 并同步说明

- [x] 使用已有 Button 的 role="switch"、aria-checked 和关联说明实现设置区域，文案严格沿用 Spec；加载、授权及保存时禁用重复操作，失败保留真实状态并显示就地错误。
- [x] 订阅 storage.onChanged 与权限变更，重新读取有效设置；处理组件卸载和过期异步结果，防止旧请求覆盖更新后的状态；Newtab 只引入设置区域。
- [x] 更新 docs/extension/history-cleaner.md、newtab.md、README.md 与 ui.md，并同步 apps/extension/README.md 和 AGENTS.md 的后台目录、Settings 范围及权限说明；不扩大通用 UI 原语清单。

### 4. 阶段完整验证与验收交付

- [x] 完成自查后按以下命令串行运行一次：全量测试、类型检查、生产构建、包体积；失败按仓库熔断规则处理，不修改业务来迎合模拟环境。
- [x] 核对构建 Manifest 保留 Newtab、包含 background.service_worker、storage 与可选 browsingData；后台脚本存在，不申请额外权限，功能在生产产物内完整。
- [x] 运行 git diff --check，核对文档链接，更新 Issue 和 Commit 记录的真实结果；展示改动、限制和用户步骤，停在待验收。

## 验证命令

- 定向：pnpm --filter @exts/extension exec vitest run tests/modules/history-cleaner tests/config/manifest.test.mjs --maxWorkers=1 --no-file-parallelism。
- 全量：pnpm --filter @exts/extension exec vitest run --maxWorkers=1 --no-file-parallelism。
- 类型：pnpm --filter @exts/extension typecheck。
- 构建：pnpm --filter @exts/extension build。
- 体积：pnpm --filter @exts/extension check:bundle-size。

## 用户验收与停止点

使用专用测试浏览器配置文件加载 dist/build/chrome-mv3，避免删除日常配置文件的历史。检查默认关闭、授权拒绝/同意、保存与跨页同步；访问测试网站后关闭一个窗口仍保留历史、最后窗口关闭尝试清理、完整退出后启动再清理；最后关闭开关并确认后续不清理。清理时不打开扩展 worker 调试器，不要求 Newtab 保持打开；Cookie、下载记录及现有 Newtab 应保持正常。

浏览器后台进程可能使“重新开窗口”不触发 onStartup；由用户确认完整退出后再测试启动。最后窗口关闭清理不保证退出前完成，自动化不代替真实生命周期、授权或界面验收。

Spec 或范围需要变化时先暂停并取得批准；阶段验收后未得到本地提交请求，不更新为已完成、不提交、不推送。
