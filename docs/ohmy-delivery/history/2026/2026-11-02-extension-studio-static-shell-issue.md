---
date: "2026-11-02"
scope: extension
status: completed
type: feature
---

# 搭建 Studio 侧栏与静态账户登录框

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

当前 Studio 只有标题与空状态，Dock 常驻。将其替换为基于官方 sidebar-07 的可折叠工作台，访客直接进入；账户入口打开基于 login-03 简化的静态 Dialog，为后续真实认证保留明确入口，但不模拟登录状态。

### 范围

- 复用现有 React Activity 保留 Home 与 Studio 状态；Home 显示原 Dock，Studio 占满页面且不保留 Dock 空行或首页外圈留白。每个新标签页仍默认 Home，不新增路由或视图持久化。
- 使用官方 sidebar-07 的 SidebarProvider、可折叠侧栏、顶部导航结构与底部账户入口；替换示例品牌、用户和业务菜单，不引入团队切换、假项目、假统计或未实现的功能页面。
- 侧栏品牌头部保留官方 32px 标识与两行文字比例，改为非交互品牌展示，Logo 和文字没有点击事件、链接或按钮角色。右侧单独组合官方 Button ghost/icon-sm、Tooltip 与 Lucide House 返回首页；收起时隐藏品牌文字/Logo，保留该独立图标按钮，不能把 Logo 作为回退入口。窄屏通过官方侧栏触发器打开侧栏后访问该图标。
- 左侧不放 Overview 或假菜单，改为官方 Empty 的图标、标题和说明，侧栏收起时隐藏该文字缺省区；正文去掉 Overview 标题、ActivityCard 与 Overview 面包屑，仅保留 Studio 当前页及官方侧栏触发器。
- 右侧内容同样使用官方 Empty，显示暂无内容的缺省图标与说明，不自行维护缺省面板样式或提供尚未实现的操作；Home 原 ActivityCard 与其他行为保留，下载、设置、Actions 业务不变。
- 侧栏底部显示 UserRound 与 Account / Not signed in；点击打开官方 Dialog，采用 login-03 的官方 Welcome back 标题与 CardHeader text-center，移除登录框首行 Logo/Exts 品牌展示，说明固定为 Login with your Github or Google account，仅保留 Login with GitHub / Login with Google 两个按钮。不自行改写标题、文案或为品牌另加布局。
- 两个登录按钮均可点击，使用共用 Sonner toast.info 分别提示 GitHub/Google 登录未接入；Google 不 disabled，不请求网络、不跳转 OAuth、不建立假用户或会话。不含邮箱、密码、注册、忘记密码及其他登录方式。
- 沿用应用主题、字体、焦点和通用图标约束，静态导入所用 Lucide 图标；官方组件只迁入实际需要部分，固定官方源码版本并登记必要差异，不覆盖已确认的共用组件效果、不升级依赖。
- 单独建立真实 GitHub 登录的排队 Issue 与 Commit 记录；现有图标管理工作项维持暂停且保留已知文档改动。

### 排除项

- 不配置 Neon Auth、GitHub OAuth、域名或任何外部系统，不建表、不新增接口/SDK/鉴权/持久登录，不引入网络请求或密码。
- 不迁移、重设计或修改 Media Download、Settings、Actions，不恢复暂停的图标存储与管理工作。
- 不使用 latest 安装或升级依赖，不批量覆盖现有 UI；不启动 dev server、浏览器或视觉/交互自动化测试，不提交或推送。

## Todo

- [x] 固定并核对 sidebar-07、login-03 与必要 UI 官方来源，写入最小本地差异。
- [x] 按最新反馈完成非交互 Logo、独立 House 返回按钮及左右官方 Empty，移除 Studio 的 Overview/Activity，保留首页现状。
- [x] 完成官方 Dialog 静态登录框和两个未接入提示，不引入认证或接口。
- [x] 同步 UI 来源、应用规则、Plan 与真实登录排队记录，保留暂停工作项。
- [x] 最新反馈修正完成后运行本轮一次扩展全量逻辑测试、类型检查与构建，77 项全部通过，现停在用户验收。

## 验收标准

- 在 Chrome/Edge 加载 dist/build/chrome-mv3（以实际构建报告为准），新标签页仍显示原首页和 Dock；点击 Studio 后展示侧栏框架，Dock 与对应空白消失。
- Studio 左侧菜单区和右侧内容区显示官方 Empty 的缺省图标、标题及说明，不再显示 Overview/Activity，不出现假菜单或假数据；Home 原 Activity 卡片和书签状态保留。
- 点击 Logo/Exts/Studio 文字没有操作，仅右侧独立 House 图标按钮返回首页；折叠后保留该图标按钮而非可点击 Logo，窄屏先打开侧栏可访问同一按钮。返回后原首页与 Dock 恢复，再次进入 Studio 可继续使用。
- Account 打开可关闭的登录弹框，Studio 仍为背景；弹框只提供 GitHub 和 Google，两个按钮可点且分别提示未接入，不导航、不联网、不创建会话；关闭后继续浏览，键盘与焦点沿用官方 Dialog 行为，由用户实际验证。
- Media Download、Settings 和 Actions 保留原 Dock 入口及行为，不迁入 Studio；未接入真实登录明确独立排队。
- 代理仅验证纯逻辑、类型、构建与必要资源边界；浏览器布局、滚动、折叠、Dialog/菜单、键盘及焦点由用户验收，不写模拟 DOM 或截图测试。

## 唯一下一步

无。

## 交付记录

### 最新反馈与处理结果（2026-11-02）

- 用户明确要求更新根规范：只搬入官方模板，仅适配已有全局样式规范与用户逐项指定的修改，不允许代理提前决定结构、文案、材质或间距。已写入根 AGENTS.md；随后用户明确要求实施恢复。
- 已恢复官方 sidebar-07 NavUser 的 h-8/w-8 Avatar/Fallback、双行文字、尾部 ChevronsUpDown 及官方打开状态类，移除代理额外的副标题颜色和折叠隐藏类；Footer p-2 与 MenuButton lg/h-12/p-2 始终沿用官方。静态未登录的 AvatarFallback 内使用用户已确认的 UserRound，不造假头像或用户。
- 已恢复 login-03 的 form/FieldGroup/Field、CardTitle/Description 和完整 Card 边框/阴影；Dialog 默认恢复官方 shadow-lg，账户定位外壳透明、无边框/阴影，让官方 Card 负责唯一外框。DialogTitle/Description 通过 asChild 提供可访问语义，不改官方 Card 标题样式。
- Button outline 已在共用 variant 补 border-border，复用现有边框 Token，不在登录调用方复制样式。已有 background/radius 等全局主题值未修改，背景等差异仍受用户全局规范控制；视觉一致与否由用户验收，不将源码恢复等同截图一致。
- 当前用户已指定的差异继续有效：独立 House 返回且 Logo 不可点、左右 Empty、无登录首行 Logo、指定说明、GitHub/Google 仅提示未接入、纯前端及 Media Download 不动。不能借“恢复官方”撤销这些明确要求。

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-02-extension-studio-static-shell-issue.md)

#### 预期交付边界

官方 sidebar-07 工作台、左右官方 Empty 缺省、不可点击 Logo 右侧独立 House 图标返回、Studio 隐藏 Dock与精简 login-03 Dialog。GitHub/Google 都只提示未接入，真实登录单独排队；无接口、数据及外部配置变更，Media Download 不动。

#### 实际交付

- 最新状态：用户于 2026-11-02 明确要求 commit，批准本地代码与文档提交完结。沿用已恢复官方结构后的自动化结果，不追加验证；浏览器样式与交互未由代理验收，不写成通过。

- 固定 shadcn/ui 源码 c257f688cf4de7ec10cc1be84cad29cd4631182c，按 sidebar-07 组合 Studio 侧栏与底部 Account，去掉示例团队、项目与假用户。按用户最新反馈，菜单区与右侧内容都直接组合官方 Empty，分别使用 List / PanelsTopLeft 图标与默认标题、说明样式；不保留 Overview、Studio Activity、正文 Scroll Area 或自写缺省面板，Home 原 Activity 保留。
- 品牌头部保留官方 32px Exts 标识与两行文字比例，采用普通非交互业务排版，不带点击、链接或按钮角色。只有右侧独立官方 Button ghost/icon-sm 与 House 执行 Home 返回，折叠时隐藏品牌并保留该按钮，窄屏打开侧栏后访问。正文 header 沿用官方触发器、分隔线与 Studio 当前页，无 Overview、Home 文字按钮或额外边框。
- App 保留 React Activity 切换，将 Dock 放入 Home 的布局区域；Studio 独占视口，Home 保留原网格与留白，无需修改 newtab.css。返回操作恢复 Home，未增加路由、浏览器历史或持久化视图。
- Account 恢复官方 Avatar/Fallback 的 32px 区域、原双行文字及尾部 ChevronsUpDown，原 Footer/MenuButton 边距不变；Fallback 内静态 UserRound，无假用户。点击仍打开用户指定的登录 Dialog。
- login-03 恢复官方 form/FieldGroup/Field、CardTitle/Description 与完整 Card 边框/阴影，DialogTitle/Description asChild 保留可访问性；定位外壳不再承担另一套卡片材质。用户指定删除的首行 Logo/表单字段继续删除，Welcome back、text-center 和指定说明保留；GitHub/Google 均可点且仅提示未接入。原 Media Download、Settings、Actions 业务文件没有改动。
- 新增必要官方 Sidebar/Dialog/Breadcrumb/Empty/Avatar/Field 与移动断点 Hook，Card 根实现不变，补官方 Header/Content/Title/Description 导出。Button outline 在共用 variant 补 border-border，不变更背景、圆角等主题值；现有 Telegram 对应按钮原已显式使用同一边框类，不修改其调用。新图标显式导入，无依赖、权限或云端配置变化。
- 同步扩展规则、UI 文档、来源与当前交付记录；真实 GitHub 登录单独建档排队，已知图标管理文档保持暂停，不恢复实施。

#### 验证与限制

- 用户明确要求恢复后，本轮已修正 Account Avatar/文字/尾部图标、登录 Field/Card 组合及 Button border-border；未改全局主题值。源码和构建核对不代表实际视觉一致，仍须用户 Chrome/Edge 验收。

- 最新一轮用户反馈修正后执行 pnpm --filter @exts/extension test --maxWorkers=1 --no-file-parallelism：15 个文件、77 项测试全部通过，串行执行，不新增截图、布局、菜单、焦点或模拟 DOM 测试。
- 最新官方结构恢复后的 pnpm --filter @exts/extension typecheck：通过。
- 最新 pnpm ext:build：通过，输出 dist/build/chrome-mv3，总体积 1.75 MB，newtab JS 502.73 kB。构建提示单包超过 500 kB，未擅自拆包、提高阈值或改变构建配置；作为非阻塞限制记录。
- 构建提示 theme-init.js 缺少 type=module 的警告；该文件来自已有独立入口，构建已成功，后续确认实际 theme-init.js 存在，未因非阻塞警告改动主题启动逻辑。
- 产物 manifest.json 可解析，检查的 9 个必要入口、内容脚本与图标引用均存在；未新增网络或认证权限。
- git diff --check 通过；Media Download、Settings、Dock 原业务文件没有 diff。新 UI 组合由类型与构建验证，不将此表述为浏览器交互通过。
- 源码下载在受限工具环境首次无法连接；使用获准的网络执行上下文取得同一固定官方版本，只写入根 dist/.cache，不提交下载缓存，不安装 CLI 或任何依赖。
- 未启动 dev server、浏览器或 API。Chrome/Edge 中的视觉、布局、滚动、折叠、Dialog、键盘、焦点及真实下载回归由用户验收；真实登录不在本项范围。

#### 用户验收

用户此前指出样式差异，本轮按要求恢复官方结构后，于 2026-11-02 明确要求 commit，批准本地提交完结，不追加或重复请求验收。未单独确认浏览器视觉与交互通过，不能将自动化或提交批准写成这些检查通过。下列步骤保留为可复现检查说明。

1. 在 Chrome 或 Edge 的扩展管理页开启开发者模式，加载已解压目录 D:\GitHub\exts\dist\build\chrome-mv3；若原来加载其他产物目录，须确认当前验收的是该新产物。
2. 新建标签页，原 Home、书签、Activity 和 Dock 应正常显示；打开过的文件夹和卡片状态在进入 Studio 再返回后应保留。
3. 点击 Dock 的 Studio，左侧菜单区应显示 No pages yet 的官方 Empty，右侧显示 No content yet 的官方 Empty，均含缺省图标与说明；不再出现 Overview 或 Studio Activity。点击头部 Logo 和 Exts/Studio 文字应无操作，只有右侧独立 House 图标按钮返回 Home。折叠时品牌与左侧缺省文字隐藏，House 按钮仍可返回；窄窗口先打开移动侧栏，再访问同一按钮。
4. 点击侧栏底部 Account，应打开无首行 Logo 的登录框，标题为 Welcome back，说明为 Login with your Github or Google account；仅含 GitHub 和 Google 两个按钮，均可点且分别提示对应登录暂未接入，不跳转、不出现假头像或登录状态。测试关闭按钮、Esc、外部点击和焦点恢复，再次打开仍正常。
5. 浅色、深色下检查侧栏、正文与弹框主题；切换或缩窄窗口后不应截断返回入口或登录按钮。返回 Home 后检查原 Download Sheet、Settings 和 Actions 入口仍按原方式工作，Media Download 未迁入 Studio。

#### 提交方案

##### 代码提交

- 文件：apps/extension/src/app/NewtabApp.tsx；modules/studio/index.tsx、components/account-login.tsx、components/studio-sidebar.tsx；shared/hooks/use-mobile.ts；shared/ui/sidebar.tsx、dialog.tsx、breadcrumb.tsx、empty.tsx、avatar.tsx、field.tsx、button.tsx、card.tsx、types.ts、ui-icon.tsx；styles/index.css、theme.css（以上均在 apps/extension/src 下）。
- diff 摘要：官方侧栏工作台与静态账户框，Home/Dock 布局切换，必要官方组件、图标与主题适配；不包含 Media Download、接口或依赖修改。

```text
feat(extension): 搭建 Studio 侧栏与静态账户入口

- 使用官方侧栏布局并提供独立首页返回入口
- 恢复官方账户及登录组合并补齐主题边框适配
```

##### 文档提交

- 文件：根 AGENTS.md、apps/extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md、docs/ohmy-delivery/readme.md、当前 Issue 与 Commit 记录、当前 Plan、真实登录排队 Issue 与 Commit 记录，以及此前已获批建档并暂停的图标管理 Issue 与 Commit 记录。本次已展示上述文档范围，用户明确要求本地提交；真实登录保持排队、图标管理保持暂停，不将其记为功能完成。
- diff 摘要：记录范围、官方来源差异、验证与用户验收步骤，更新唯一活动 Issue、真实登录队列并保留图标管理暂停状态。
- 用户已批准本地提交，机械性终态更新为当前 Issue/工作台改已完成、用户验收如实记录批准完结与限制、当前最终提交批准改已批准；真实登录仍排队、图标管理仍暂停。

```text
docs(extension): 记录 Studio 静态框架交付与登录队列

- 明确模板迁入边界并同步官方组件来源
- 记录交付与验证并保留登录队列和图标管理暂停状态
```

#### 最终提交批准

已批准。用户于 2026-11-02 明确要求 commit，批准已展示的代码与文档两笔本地提交并完结本项；文档包含真实登录排队记录及图标管理暂停记录，不表示批准实施这两个后续工作，不包含推送或部署。

## 关联文档

- [实施 Plan](../../../superpowers/plans/2026-11-02-extension-studio-static-shell.md)
- [真实登录排队 Issue](2026-11-02-extension-github-login-issue.md)
- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：用户明确要求本地 commit 完结，代码已提交，完成状态随文档提交归档；沿用既有验证，浏览器效果未由代理验收，不追加验证、不推送。
- 批准依据：用户指定 sidebar-07、login-03，确认 Studio 隐藏 Dock、Google 不禁用且点击提示未接入，真实登录另建 Issue，本次纯前端且 Media Download 不动；后续明确左侧菜单区域留空，返回首页用 Logo 右侧图标，尽量沿用官方样式。
- 任务规模：小型任务，一个 Issue、五项 Todo；无接口、数据模型、权限、构建体系或核心架构变更。简短实施顺序见关联 Plan，不另建 Spec。

### 历史后续事项

按用户明确批准完成本地代码与文档两笔提交后归档，不推送。真实登录继续排队，图标管理保持暂停；未执行的浏览器视觉与交互检查如实保留，不记为通过。
