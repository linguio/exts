# 搭建 Studio 侧栏与静态账户登录框：交付记录

## 对应工作项

- [Issue](../issues/2026-11-02-extension-studio-static-shell-issue.md)

## 预期交付边界

官方 sidebar-07 工作台、左右官方 Empty 缺省、不可点击 Logo 右侧独立 House 图标返回、Studio 隐藏 Dock与精简 login-03 Dialog。GitHub/Google 都只提示未接入，真实登录单独排队；无接口、数据及外部配置变更，Media Download 不动。

## 实际交付

- 最新状态：用户于 2026-11-02 明确要求 commit，批准本地代码与文档提交完结。沿用已恢复官方结构后的自动化结果，不追加验证；浏览器样式与交互未由代理验收，不写成通过。

- 固定 shadcn/ui 源码 c257f688cf4de7ec10cc1be84cad29cd4631182c，按 sidebar-07 组合 Studio 侧栏与底部 Account，去掉示例团队、项目与假用户。按用户最新反馈，菜单区与右侧内容都直接组合官方 Empty，分别使用 List / PanelsTopLeft 图标与默认标题、说明样式；不保留 Overview、Studio Activity、正文 Scroll Area 或自写缺省面板，Home 原 Activity 保留。
- 品牌头部保留官方 32px Exts 标识与两行文字比例，采用普通非交互业务排版，不带点击、链接或按钮角色。只有右侧独立官方 Button ghost/icon-sm 与 House 执行 Home 返回，折叠时隐藏品牌并保留该按钮，窄屏打开侧栏后访问。正文 header 沿用官方触发器、分隔线与 Studio 当前页，无 Overview、Home 文字按钮或额外边框。
- App 保留 React Activity 切换，将 Dock 放入 Home 的布局区域；Studio 独占视口，Home 保留原网格与留白，无需修改 newtab.css。返回操作恢复 Home，未增加路由、浏览器历史或持久化视图。
- Account 恢复官方 Avatar/Fallback 的 32px 区域、原双行文字及尾部 ChevronsUpDown，原 Footer/MenuButton 边距不变；Fallback 内静态 UserRound，无假用户。点击仍打开用户指定的登录 Dialog。
- login-03 恢复官方 form/FieldGroup/Field、CardTitle/Description 与完整 Card 边框/阴影，DialogTitle/Description asChild 保留可访问性；定位外壳不再承担另一套卡片材质。用户指定删除的首行 Logo/表单字段继续删除，Welcome back、text-center 和指定说明保留；GitHub/Google 均可点且仅提示未接入。原 Media Download、Settings、Actions 业务文件没有改动。
- 新增必要官方 Sidebar/Dialog/Breadcrumb/Empty/Avatar/Field 与移动断点 Hook，Card 根实现不变，补官方 Header/Content/Title/Description 导出。Button outline 在共用 variant 补 border-border，不变更背景、圆角等主题值；现有 Telegram 对应按钮原已显式使用同一边框类，不修改其调用。新图标显式导入，无依赖、权限或云端配置变化。
- 同步扩展规则、UI 文档、来源与当前交付记录；真实 GitHub 登录单独建档排队，已知图标管理文档保持暂停，不恢复实施。

## 验证与限制

- 用户明确要求恢复后，本轮已修正 Account Avatar/文字/尾部图标、登录 Field/Card 组合及 Button border-border；未改全局主题值。源码和构建核对不代表实际视觉一致，仍须用户 Chrome/Edge 验收。

- 最新一轮用户反馈修正后执行 pnpm --filter @exts/extension test --maxWorkers=1 --no-file-parallelism：15 个文件、77 项测试全部通过，串行执行，不新增截图、布局、菜单、焦点或模拟 DOM 测试。
- 最新官方结构恢复后的 pnpm --filter @exts/extension typecheck：通过。
- 最新 pnpm ext:build：通过，输出 dist/build/chrome-mv3，总体积 1.75 MB，newtab JS 502.73 kB。构建提示单包超过 500 kB，未擅自拆包、提高阈值或改变构建配置；作为非阻塞限制记录。
- 构建提示 theme-init.js 缺少 type=module 的警告；该文件来自已有独立入口，构建已成功，后续确认实际 theme-init.js 存在，未因非阻塞警告改动主题启动逻辑。
- 产物 manifest.json 可解析，检查的 9 个必要入口、内容脚本与图标引用均存在；未新增网络或认证权限。
- git diff --check 通过；Media Download、Settings、Dock 原业务文件没有 diff。新 UI 组合由类型与构建验证，不将此表述为浏览器交互通过。
- 源码下载在受限工具环境首次无法连接；使用获准的网络执行上下文取得同一固定官方版本，只写入根 dist/.cache，不提交下载缓存，不安装 CLI 或任何依赖。
- 未启动 dev server、浏览器或 API。Chrome/Edge 中的视觉、布局、滚动、折叠、Dialog、键盘、焦点及真实下载回归由用户验收；真实登录不在本项范围。

## 用户验收

用户此前指出样式差异，本轮按要求恢复官方结构后，于 2026-11-02 明确要求 commit，批准本地提交完结，不追加或重复请求验收。未单独确认浏览器视觉与交互通过，不能将自动化或提交批准写成这些检查通过。下列步骤保留为可复现检查说明。

1. 在 Chrome 或 Edge 的扩展管理页开启开发者模式，加载已解压目录 D:\GitHub\exts\dist\build\chrome-mv3；若原来加载其他产物目录，须确认当前验收的是该新产物。
2. 新建标签页，原 Home、书签、Activity 和 Dock 应正常显示；打开过的文件夹和卡片状态在进入 Studio 再返回后应保留。
3. 点击 Dock 的 Studio，左侧菜单区应显示 No pages yet 的官方 Empty，右侧显示 No content yet 的官方 Empty，均含缺省图标与说明；不再出现 Overview 或 Studio Activity。点击头部 Logo 和 Exts/Studio 文字应无操作，只有右侧独立 House 图标按钮返回 Home。折叠时品牌与左侧缺省文字隐藏，House 按钮仍可返回；窄窗口先打开移动侧栏，再访问同一按钮。
4. 点击侧栏底部 Account，应打开无首行 Logo 的登录框，标题为 Welcome back，说明为 Login with your Github or Google account；仅含 GitHub 和 Google 两个按钮，均可点且分别提示对应登录暂未接入，不跳转、不出现假头像或登录状态。测试关闭按钮、Esc、外部点击和焦点恢复，再次打开仍正常。
5. 浅色、深色下检查侧栏、正文与弹框主题；切换或缩窄窗口后不应截断返回入口或登录按钮。返回 Home 后检查原 Download Sheet、Settings 和 Actions 入口仍按原方式工作，Media Download 未迁入 Studio。

## 提交方案

### 代码提交

- 文件：apps/extension/src/app/NewtabApp.tsx；modules/studio/index.tsx、components/account-login.tsx、components/studio-sidebar.tsx；shared/hooks/use-mobile.ts；shared/ui/sidebar.tsx、dialog.tsx、breadcrumb.tsx、empty.tsx、avatar.tsx、field.tsx、button.tsx、card.tsx、types.ts、ui-icon.tsx；styles/index.css、theme.css（以上均在 apps/extension/src 下）。
- diff 摘要：官方侧栏工作台与静态账户框，Home/Dock 布局切换，必要官方组件、图标与主题适配；不包含 Media Download、接口或依赖修改。

```text
feat(extension): 搭建 Studio 侧栏与静态账户入口

- 使用官方侧栏布局并提供独立首页返回入口
- 恢复官方账户及登录组合并补齐主题边框适配
```

### 文档提交

- 文件：根 AGENTS.md、apps/extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md、docs/changes/README.md、当前 Issue 与 Commit 记录、当前 Plan、真实登录排队 Issue 与 Commit 记录，以及此前已获批建档并暂停的图标管理 Issue 与 Commit 记录。本次已展示上述文档范围，用户明确要求本地提交；真实登录保持排队、图标管理保持暂停，不将其记为功能完成。
- diff 摘要：记录范围、官方来源差异、验证与用户验收步骤，更新唯一活动 Issue、真实登录队列并保留图标管理暂停状态。
- 用户已批准本地提交，机械性终态更新为当前 Issue/工作台改已完成、用户验收如实记录批准完结与限制、当前最终提交批准改已批准；真实登录仍排队、图标管理仍暂停。

```text
docs(extension): 记录 Studio 静态框架交付与登录队列

- 明确模板迁入边界并同步官方组件来源
- 记录交付与验证并保留登录队列和图标管理暂停状态
```

## 最终提交批准

已批准。用户于 2026-11-02 明确要求 commit，批准已展示的代码与文档两笔本地提交并完结本项；文档包含真实登录排队记录及图标管理暂停记录，不表示批准实施这两个后续工作，不包含推送或部署。
