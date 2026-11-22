# 搭建 Studio 侧栏与静态账户登录框

## 元信息

- 工作项：2026-11-02-extension-studio-static-shell
- 状态：已完成
- 当前阶段：用户明确要求本地 commit 完结，代码已提交，完成状态随文档提交归档；沿用既有验证，浏览器效果未由代理验收，不追加验证、不推送。
- 批准依据：用户指定 sidebar-07、login-03，确认 Studio 隐藏 Dock、Google 不禁用且点击提示未接入，真实登录另建 Issue，本次纯前端且 Media Download 不动；后续明确左侧菜单区域留空，返回首页用 Logo 右侧图标，尽量沿用官方样式。
- 任务规模：小型任务，一个 Issue、五项 Todo；无接口、数据模型、权限、构建体系或核心架构变更。简短实施顺序见关联 Plan，不另建 Spec。

## 背景与目标

当前 Studio 只有标题与空状态，Dock 常驻。将其替换为基于官方 sidebar-07 的可折叠工作台，访客直接进入；账户入口打开基于 login-03 简化的静态 Dialog，为后续真实认证保留明确入口，但不模拟登录状态。

## 范围

- 复用现有 React Activity 保留 Home 与 Studio 状态；Home 显示原 Dock，Studio 占满页面且不保留 Dock 空行或首页外圈留白。每个新标签页仍默认 Home，不新增路由或视图持久化。
- 使用官方 sidebar-07 的 SidebarProvider、可折叠侧栏、顶部导航结构与底部账户入口；替换示例品牌、用户和业务菜单，不引入团队切换、假项目、假统计或未实现的功能页面。
- 侧栏品牌头部保留官方 32px 标识与两行文字比例，改为非交互品牌展示，Logo 和文字没有点击事件、链接或按钮角色。右侧单独组合官方 Button ghost/icon-sm、Tooltip 与 Lucide House 返回首页；收起时隐藏品牌文字/Logo，保留该独立图标按钮，不能把 Logo 作为回退入口。窄屏通过官方侧栏触发器打开侧栏后访问该图标。
- 左侧不放 Overview 或假菜单，改为官方 Empty 的图标、标题和说明，侧栏收起时隐藏该文字缺省区；正文去掉 Overview 标题、ActivityCard 与 Overview 面包屑，仅保留 Studio 当前页及官方侧栏触发器。
- 右侧内容同样使用官方 Empty，显示暂无内容的缺省图标与说明，不自行维护缺省面板样式或提供尚未实现的操作；Home 原 ActivityCard 与其他行为保留，下载、设置、Actions 业务不变。
- 侧栏底部显示 UserRound 与 Account / Not signed in；点击打开官方 Dialog，采用 login-03 的官方 Welcome back 标题与 CardHeader text-center，移除登录框首行 Logo/Exts 品牌展示，说明固定为 Login with your Github or Google account，仅保留 Login with GitHub / Login with Google 两个按钮。不自行改写标题、文案或为品牌另加布局。
- 两个登录按钮均可点击，使用共用 Sonner toast.info 分别提示 GitHub/Google 登录未接入；Google 不 disabled，不请求网络、不跳转 OAuth、不建立假用户或会话。不含邮箱、密码、注册、忘记密码及其他登录方式。
- 沿用应用主题、字体、焦点和通用图标约束，静态导入所用 Lucide 图标；官方组件只迁入实际需要部分，固定官方源码版本并登记必要差异，不覆盖已确认的共用组件效果、不升级依赖。
- 单独建立真实 GitHub 登录的排队 Issue 与 Commit 记录；现有图标管理工作项维持暂停且保留已知文档改动。

## 排除项

- 不配置 Neon Auth、GitHub OAuth、域名或任何外部系统，不建表、不新增接口/SDK/鉴权/持久登录，不引入网络请求或密码。
- 不迁移、重设计或修改 Media Download、Settings、Actions，不恢复暂停的图标存储与管理工作。
- 不使用 latest 安装或升级依赖，不批量覆盖现有 UI；不启动 dev server、浏览器或视觉/交互自动化测试，不提交或推送。

## 最新反馈与处理结果（2026-11-02）

- 用户明确要求更新根规范：只搬入官方模板，仅适配已有全局样式规范与用户逐项指定的修改，不允许代理提前决定结构、文案、材质或间距。已写入根 AGENTS.md；随后用户明确要求实施恢复。
- 已恢复官方 sidebar-07 NavUser 的 h-8/w-8 Avatar/Fallback、双行文字、尾部 ChevronsUpDown 及官方打开状态类，移除代理额外的副标题颜色和折叠隐藏类；Footer p-2 与 MenuButton lg/h-12/p-2 始终沿用官方。静态未登录的 AvatarFallback 内使用用户已确认的 UserRound，不造假头像或用户。
- 已恢复 login-03 的 form/FieldGroup/Field、CardTitle/Description 和完整 Card 边框/阴影；Dialog 默认恢复官方 shadow-lg，账户定位外壳透明、无边框/阴影，让官方 Card 负责唯一外框。DialogTitle/Description 通过 asChild 提供可访问语义，不改官方 Card 标题样式。
- Button outline 已在共用 variant 补 border-border，复用现有边框 Token，不在登录调用方复制样式。已有 background/radius 等全局主题值未修改，背景等差异仍受用户全局规范控制；视觉一致与否由用户验收，不将源码恢复等同截图一致。
- 当前用户已指定的差异继续有效：独立 House 返回且 Logo 不可点、左右 Empty、无登录首行 Logo、指定说明、GitHub/Google 仅提示未接入、纯前端及 Media Download 不动。不能借“恢复官方”撤销这些明确要求。

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

## 关联文档

- [Commit 记录](../commits/2026-11-02-extension-studio-static-shell-commit.md)
- [实施 Plan](../../superpowers/plans/2026-11-02-extension-studio-static-shell.md)
- [真实登录排队 Issue](2026-11-02-extension-github-login-issue.md)
- [工作台](../README.md)

## 唯一下一步

按用户明确批准完成本地代码与文档两笔提交后归档，不推送。真实登录继续排队，图标管理保持暂停；未执行的浏览器视觉与交互检查如实保留，不记为通过。
