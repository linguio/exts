---
date: "2026-11-05"
scope: [extension]
status: completed
type: task
---

# 按 React 功能模块整理扩展目录

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

当前扩展以 modules、shared 组织代码，部分模块内部重复使用完整项目层级。改为常见 React 功能组织方式，让入口、页面、业务功能与公共能力各有明确职责，同时保持现有行为。

### 范围

- src/entrypoints 保留 WXT 薄入口，只声明配置并调用启动函数，不增加 register/index.ts。Telegram 入口命名为 telegram-page.content.ts、telegram-bridge.content.ts，增加中文职责注释，保留原执行环境、注入时机与匹配范围。
- src/app 负责初始化、Provider 与顶层装配；src/pages 负责 Newtab、Studio、Settings 页面组合。
- 用户最终批准共享 Account 登录框和账号菜单统一归 pages/account，由 Dock 与 Studio 共用；仅 Studio 使用且依赖 Sidebar 的 account-login.tsx 归 pages/studio。OIDC、会话、凭据和用户信息逻辑继续归 features/account，不与 Settings 合并。
- 用户追加要求互换 Dock 中 Settings 与 Account 的位置，其他入口顺序保持不变；该项为明确批准的界面顺序差异，不属于纯目录迁移。
- 用户后续批准将首页专用样式从 app/newtab.css 移至 pages/newtab/newtab.css，保留明确文件名、样式内容与原导入顺序，不改名为 index.css。
- 用户最终确认 GeneralSettings 跟随主题与设置业务保留在 features/settings，与其他业务设置项一致；pages/settings 只组合抽屉和分区。下载记录 Sheet 归 pages/download，业务读写及记录列表保留 feature。检查迁移遗留的冗余、失效文件和变量，只清理已确认无用内容，不扩大至无关功能；不机械按 JSX 与逻辑函数分层。
- src/features 按 bookmarks、activity、account、history-cleaner、media-download 等业务组织；默认平铺，较大功能按 telegram、records 等业务细分，不强制建立 components/hooks/services/utils/types 或转导出文件。
- 各业务设置留在所属 feature；跨功能设置的数据结构、存储与通信统一归入 features/settings，pages/settings 只负责组合。
- 公共内容按职责归入 components/ui、components/custom、hooks、lib、config、styles、assets；只建立实际需要的目录。公共工具可放 lib/utils.ts，功能专用工具、常量与类型留在 feature，不建立顶层 utils、const、types 大杂烩目录。
- 用户后续批准自定义公共组件归 components/custom；BrandIcon、UiIcon、StatusIcon 保持独立，IconSize 与 UiIconName 在 custom/types.ts 集中维护，不让数据类型引用组件实现。components/ui 保留 shadcn 来源组件与已批准适配，含已有对自定义图标的引用。
- 实际职责映射：Dock 现有实现组合账号、下载、设置和 Studio 入口，按用户最新要求整体归入 pages/dock，与 Newtab、Studio 并列，不把业务装配放进公共 components；通用主题偏好解析归入 lib/theme，依赖业务设置的主题运行逻辑归入 features/settings/theme.ts。config 无独立实际内容时不建空目录。
- pages 组合 feature，feature 使用公共代码；公共代码不反向引用业务或页面。现有跨 feature 调用逐处核对，不新增全局管理层。
- modules、shared 全部迁出后移除空目录；同步引用、测试路径、components.json、构建配置中的资源与源码路径及相关文档。
- 保留全局主题和公共组件样式、根品牌源稿位置、各应用根目录的 env 与根 dist 产物规范。

### 排除项

- 不改变功能、界面、权限、公共 API、数据模型、依赖版本或构建产物路径，不新增抽象、依赖或假 DOM。
- SVG 减重、线上文件存储与图标管理不属于本工作项。
- 不执行浏览器视觉或交互验收，不自动提交或推送。

## Todo

- [x] 核对当前职责与引用，确定现有文件到目标目录的对应关系。
- [x] 迁移入口、页面、feature 与公共代码，清理被替代目录并同步配置和文档。
- [x] 调整既有逻辑测试；核对现有 21 个文件均为逻辑或配置测试，无需移除，保留 102 项覆盖。
- [x] 执行扩展完整测试、类型检查与构建；修复 CSS inline 引用后构建重试一次通过。
- [x] 记录交付、限制和可复现的 Chrome/Edge 验收步骤，停在用户验收。

## 验收标准

- src 按已确认职责组织，不残留旧 modules、shared 实现或失效引用；不强制铺设空目录。
- Newtab、Studio、设置、书签、Activity、账号、Dock、历史清理与媒体下载保持迁移前功能和外观；两个 Telegram 入口保留原运行边界。
- 既有有效逻辑测试、类型检查和构建通过；资源引用可解析，产物位置与现有发布规则一致。
- 本次生产构建验收加载 dist/build/chrome-mv3。若沿用开发方式，运行原 pnpm ext:dev 成功后再加载 dist/dev/chrome-mv3-dev-stable；本次未运行开发服务，旧稳定目录不能作为迁移结果。检查上述页面和功能主流程、设置保存与恢复、下载记录及既有失败/禁用边界，预期行为与迁移前一致。
- 自动化结果与用户验收分别记录，未执行项不得记为通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-05-extension-feature-structure-issue.md)

#### 预期交付边界

按已确认方案迁移扩展入口、页面、业务 feature 与公共代码，同步引用、配置、有效逻辑测试和文档；保持功能、外观、权限、依赖及构建产物路径。SVG 减重与线上存储另行处理。

#### 实际交付

- 迁移 132 个源码与测试文件，移除两个不再需要的界面转导出入口；旧 src/modules、src/shared、tests/modules、tests/shared 已移除。
- app/App.tsx 负责顶层装配，pages/dock 持有业务导航；pages/newtab、studio、settings 只组合页面。features 按 bookmarks、activity、account、settings、history-cleaner、media-download 组织；媒体下载按 telegram、records 细分，其余按实际需要平铺。
- 通用 UI、品牌、Hook、工具、存储及主题偏好解析分别归 components、hooks、lib；依赖设置业务的主题运行逻辑归 features/settings，公共目录没有反向导入 feature 或页面。
- Telegram 内容脚本改名为 telegram-page.content.ts、telegram-bridge.content.ts，并增加中文职责注释。启动配置、后台注册顺序、权限与固定 ID 保留，不新增 register 层。
- 更新相对引用、CSS inline 路径、shadcn 别名以及 README、应用规范、现行功能文档和组件来源路径说明。资源、env、依赖和产物路径未修改。
- 按用户后续明确要求，将 Dock 的 7 个文件从 app/dock 移至 pages/dock，与 Newtab、Studio 并列；App 保留顶层组合和全局 Tooltip/Toast，未改变页面显示关系。
- 按用户最终要求，account-dialog、account-menu-content 两个共享界面归 pages/account，Dock 和 Studio 共用；仅 Studio 使用且依赖 Sidebar 的 account-login 归 pages/studio，features/account 保留认证及会话业务。
- 按用户后续明确要求，将 BrandIcon、UiIcon、StatusIcon 归入 components/custom，IconSize 与 UiIconName 合并到 custom/types.ts；移除原 components/brand 目录和 ui/types.ts，ui 目录保留 shadcn 来源组件及其已有项目适配，同步引用与现行说明。
- 将 app/newtab.css 移至 pages/newtab/newtab.css，保留文件名与全部样式规则；App 原位置导入新的路径，保持全局样式导入顺序，同步 UI 规范。
- 按用户要求修正审查发现的现行规范旧路径、Account 归属及 Exts 展示资源说明；Dock 到 Settings 的引用简化为同级页面路径，不改变行为。
- GeneralSettings 最终保留在 features/settings/general-settings.tsx，Settings 页面仅组合各业务设置项；MediaDownloadSheet 移到 pages/download/index.tsx，原位置移除。同步引用及现行文档，修正共享 Account 和 Studio 的旧注释。
- 删除 BrandIcon 中未使用的 name/_name 参数及四处调用传值；图标仍为装饰性图片，可访问名称继续由已有外层文本或控件提供。
- 按用户追加要求互换 Dock 的 Account 与 Settings 展示顺序，工具区为 Studio、Actions、Download、Account、Settings；其他行为不变。仅调整 JSX 排列，不重复运行逻辑测试，视觉由用户验收。

#### 验证与限制

- 扩展 tsc --noEmit 通过；21 个测试文件、102 项测试串行执行通过，既有逻辑覆盖完整保留，未新增测试框架或视觉/交互测试。
- 首次构建定位到改名 CSS 的 ?inline 导入遗漏，修复该路径后仅重试一次生产构建，通过；没有重复运行已通过的逻辑测试。构建保留既有 theme-init 非 module 提示和大于 500 KB chunk 警告。
- Manifest 与迁移前构建比对通过：权限、主机权限、固定 key、content script matches/world/run_at 保留，仅两个 Telegram 输出脚本改名。44 个构建文件共 1712884 字节，约 1.71 MB。
- 旧目录移除、公共代码依赖方向及 git diff --check 检查通过；React 文件审阅限于此次路径与聚合入口调整，不借迁移修改 Hook、布局或交互。
- 未执行 Chrome/Edge 视觉或交互验收，未启动 dev server；dist/dev/chrome-mv3-dev-stable 仍是旧产物。加载本次 dist/build/chrome-mv3 验收，或用户运行原开发命令后再使用稳定目录。
- Dock 二次定位仅调整目录与引用，重新执行所属扩展类型检查及生产构建均通过；复用已通过的 102 项逻辑测试，不重复全量测试，构建警告同前。
- Account 界面迁移后类型检查及生产构建通过，继续复用未变更的认证业务测试结果；浏览器验收和提交仍未执行。
- custom 组件与共享类型分类后类型检查及生产构建通过；此次没有业务逻辑变化，不重复运行全量逻辑测试，既有构建警告保留。
- Newtab CSS 移动后仅执行扩展生产构建，通过；未重跑逻辑测试或类型检查，既有构建警告保留。
- 最后审查修正两处过时规范并简化一个等价导入，扩展类型检查通过；复用既有构建和逻辑测试结果，不追加全量验证。
- 冗余审查：tsc --noEmit --noUnusedLocals --noUnusedParameters 通过；静态扫描未发现自定义源码中无法从入口到达的文件、失效相对/别名导入、无其他引用的导出名或完全重复源码。此为静态检查，不证明所有动态分支均可达，也未清除官方组件的未使用导出。
- General/Download 归属调整及 BrandIcon 无效参数清理后，扩展严格未用变量类型检查与生产构建通过，复用既有逻辑测试；既有构建警告和浏览器验收限制保留。
- 按用户最终要求将 GeneralSettings 保留在 features/settings；该路径与界面内容已在本工作项早期构建通过，本轮严格未用变量类型检查通过，不重复业务测试或构建。
- 用户批准将 Studio 专用 AccountLogin 移至 pages/studio，更新侧栏及共享界面引用；严格未用变量类型检查通过，不重复业务测试或构建。
- 暂停图标管理工作项的文档删除是用户另行批准的未提交改动，不属于本迁移交付；不覆盖或混入提交。

#### 用户验收

用户明确表示“验证通过 commit 把删除issue那条也一起提交了”，据此记录验收通过并批准本地提交；未追加验证，既有检查及未执行事项保持原记录。

1. Chrome/Edge 扩展管理页加载根 dist/build/chrome-mv3；避免同时启用相同 ID 的旧目录。
2. 打开新标签页，确认书签、文件夹、Activity、Dock 与迁移前一致；切换 Studio，再返回首页，原页面状态应保持。
3. 检查设置加载、主题切换、媒体下载总开关及刷新后恢复；关闭媒体下载后 Telegram 不出现新的下载入口，重新开启后恢复。
4. 刷新 Telegram Web，下载一项媒体，确认保存流程与成功提示、下载记录仍正常；账号登录/退出与已有取消或失败处理、历史清理权限和关闭状态保持原行为。历史清理实际删除只在用户专用浏览器环境验收，代理未操作真实历史。

#### 提交方案

- 代码提交：apps/extension/src 的迁移与引用调整、apps/extension/tests 的功能对应迁移、apps/extension/components.json；不包含资源内容或依赖变更。完整消息：

```text
refactor(extension): 按页面与功能整理 React 目录

- 分离页面组合、业务功能与公共组件并同步引用
- 保留脚本运行边界和测试覆盖并清理无效参数
- 按确认顺序排列 Dock 账号与设置入口
```

- 文档提交：本 Issue、Commit 记录、工作台迁移条目、apps/extension/AGENTS.md、apps/extension/README.md、docs/extension/history-cleaner.md、newtab.md、telegram-download.md、ui.md 和 docs/web-ui-sources.md。完整消息：

```text
docs(extension): 记录功能目录迁移与验收结果

- 同步现行目录职责与组件来源路径说明
- 记录验证结果、用户验收及未验证事项
```
- 上述范围、完整消息、验证与未验证事项均已展示，按用户批准将 Issue、交付记录和工作台同步为已完成；代码提交成功，随文档提交完结。
- 用户同时批准独立提交已删除的图标管理工作项；仅包含 docs/ohmy-delivery/issues/2026-11-02-extension-remote-brand-cache-issue.md、对应 commits 文件和工作台索引删除，不混入迁移代码或迁移文档提交。完整消息：

```text
docs(repo): 删除暂停的网站图标管理工作项

- 删除对应 Issue、交付记录与工作台索引
```

#### 最终提交批准

已批准并执行本地代码、文档提交；删除图标管理工作项另笔提交。未推送或部署。

#### 完结后文档修正

用户要求“修改下 然后commit”，批准仅修正 apps/extension/README.md 首条重复的 app 职责说明并本地提交；本 Issue 与 Commit 记录同步保留本次补充说明，完成状态不变。当前 2.0.0、Release 正文和 workflow-tests 改名不混入。

本次仅文案去重，未追加测试、类型检查、构建或其他验证。

文件范围：apps/extension/README.md、本 Issue 与本 Commit 记录。完整消息：

```text
docs(extension): 精简目录职责中的重复说明

- 保留独立的 WXT 入口与应用装配职责说明
```

## 关联文档

- [工作台](../../readme.md)
- [构建与分发规范](../../../build-release.md)

## 历史补充

### 元信息

- 当前阶段：用户验收通过，代码提交成功，随文档提交完结
- 规模：小型任务，一个 Issue，不另建 Spec、Plan 或子 Issue。
- 批准依据：用户确认方案并建档后明确要求开始，随后确认微调和冗余清理，最终表示“验证通过 commit 把删除issue那条也一起提交了”，批准本地提交，不推送。

### 完结后文档修正

用户于 2026-11-05 要求修正扩展 README 重复的 app 职责说明并本地提交。仅将首条改为 WXT 入口说明，app 职责由下一条保留；作为本迁移文档的补充修正，不涉及应用行为，工作项保持已完成。

### 历史后续事项

用户已确认验收通过并要求本地提交；按批准完结工作项，不自动推送。
