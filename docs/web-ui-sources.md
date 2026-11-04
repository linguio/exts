# Web UI 官方来源与必要差异

官网与扩展的通用 Web UI 遵循根 [AGENTS.md](../AGENTS.md#web-ui-选型与风格)。本文记录源码基线与必要差异；主题参数和组合约定分别见 [官网 UI](website/ui.md) 与 [扩展 UI](extension/ui.md)。源码不是随上游自动升级的运行时依赖。

## 成长与睡眠图表（2026-11-03）

- Chart 来源固定为既有官方基线 `c257f688cf4de7ec10cc1be84cad29cd4631182c` 的 [new-york-v4/ui/chart.tsx](https://github.com/shadcn-ui/ui/blob/c257f688cf4de7ec10cc1be84cad29cd4631182c/apps/v4/registry/new-york-v4/ui/chart.tsx)。保留官方 ChartContainer、响应式容器、ChartStyle、Tooltip/Legend 与配置解析；安装精确版本 Recharts 3.10.1、与现有 React 匹配的 react-is 19.3.0，不升级既有依赖。
- 必要适配：cn 路径改为 shared/lib/utils；英文注释改中文；深色选择器改为根 data-theme=dark。用户最新批准将中性灰设计提升为全局 UI 规范：theme.css 唯一定义 --chart-1 至 4，ChartConfig/睡眠直接引用；日历档位仅为 chart Token 别名，第 0 档指向 muted。环背景恢复官方 fill-muted，不让共用 Chart 依赖活动业务 Token。明暗等步长 OKLCH 色值及当前背景对比核算见扩展 UI 规范；这组颜色是项目定制，不是官方默认色板。
- 业务图表基于用户提供的官方 ChartBarDefault、ChartPieSimple、ChartRadialSimple 示例，按批准目标组合；保留 CartesianGrid、XAxis、官方 ChartTooltip/ChartTooltipContent、Pie/RadialBar 体系。现有卡片已提供外框和视图切换，因此不嵌套示例 Card、访客标题、日期说明、TrendingUp 页脚；这是此次批准业务组合，不宣称与原示例视觉完全一致。
- 用户批准差异：成长为实际分钟堆叠柱、睡眠为分档柱与固定7小时且无文字的 ReferenceLine，均固定 14 天；饼图改为左右并列的周投入实心饼图及周计划四同心环，PolarAngleAxis 明确固定 [0,100] 避免按最大项目重新缩放。分类顺序与主题参数见扩展 UI 文档，不仿写图表引擎或 Tooltip 管理。
- 趋势分类直接组合现有官方 Button 与 Tooltip，点击轮换两个分类；不新增 Select 包装或业务通知层。视觉、布局、Tooltip 与明暗主题实际效果留待用户 Chrome/Edge 验收。
- 验收反馈修正：14 天窗口逐柱显示日号，睡眠只保留固定 7 小时虚线，无均值或标签；用户要求卡片内所有数据提示统一为 ChartTooltipContent。组件仅增加可选 config 属性供非 Recharts 日历使用，仍保留官方内容结构及默认样式；其他图表继续从官方 ChartContext 取配置。日历复用官方 Tooltip 触发与定位，外定位层清除自身边框/背景/内边距/阴影，唯一可见外观来自 ChartTooltipContent。
- 日历连续 Hover：核对安装的 Radix Tooltip 实现，其默认 hoverable content 会建立 trigger 到 content 的 pointer grace 区域，Provider 在 transit 时阻止下个 Trigger 打开；日历小格局部使用官方 disableHoverableContent 关闭该区域，不自写计时器/受控 Tooltip 管理。浏览器实际切换仍待用户复验。
- 提示语统一：Studio activity/tooltip-content.tsx 只持有业务标题与数据行，日期数据使用 YYYY-MM-DD、提示仅显示 MM-DD，所有时长使用同一格式化函数；日历/成长只显示日期与明细，周图标题为 W<周号> Spent / W<周号> Plan且不显示日期范围，目标和百分比按统一顺序附加。外框/主题/间距仍完全由同一官方 ChartTooltipContent 提供，不分别维护四套提示样式。
- 最新分类入口按用户图示使用既有 Lucide ChevronsUpDown + 官方 Button ghost/icon-sm，英文 Growth/Sleep Tooltip 与顶部视图图标一致；按用户最新要求，点击直接轮换分类，移除 DropdownMenu 导入、菜单内容及菜单打开状态。成长新增 14 天日均 ReferenceLine，睡眠保留 7 小时线，无常驻标签或额外 Hover 管理。
- 趋势窗口最终统一为截至昨天的14个自然日，成长/睡眠均排除今天；成长均值仅使用该窗口，无投入日按0计，不影响日历与本周视图。
- 最新周视图修正：用户提供的 ChartPieSimple 为实心饼图，因此删除误加的 innerRadius=25，保留适配现有卡片的 outerRadius=44；移除“投入/计划”标题。计划环使用同一全局灰阶按每25%完成度分档，而非按项目着色；0%用muted，超过100%保持4档，轨道与官方 RadialBar 实现保留。具体区间见扩展 UI 规范，不再表述为所有图表颜色都绑定分类。
- 周视图Tooltip按最新批准使用官方ChartTooltip content渲染回调：保留原生active与悬停payload，业务侧提供完整四项payload给同一ChartTooltipContent，避免计划环把progress字段名当文案。标题直接用官方label属性“W<周号> Spent / W<周号> Plan”，不显示周日期；formatter复用同一数据行，仅将当前项加粗。日历/柱状图去掉自定义合计标题，保留日期；所有活动时长使用小写h，最多一位小数且整数无.0。未新增Tooltip定位、堆叠或状态管理。
- 最新文案格式：普通时长使用小写h、最多一位小数且整数去掉.0；投入明细先百分比再斜杠投入时长，如30% / 5h，计划先完成率再斜杠目标时长，如120% / 10h。仍通过官方formatter使用同一业务数据行，不改变组件样式。计划环颜色已核对为每25%一档，0%用muted，超额保持chart-4；当前模拟数据两项超额同色，不为差异不明显擅改全局色阶。
- 柱状图圆角：用户批准统一圆角，选用4px，共用Chart仅新增导出CHART_BAR_RADIUS数值，供需要参与数值运算的SVG半径属性使用。成长使用已安装Recharts 3.10.1的官方BarStack.radius，睡眠使用Bar.radius；整根柱外轮廓圆角、内部接缝直角，保留官方处理缺项/薄端部的逻辑。未使用已弃用Cell、未仿写shape/clip，无新增依赖。

- 用户后续批准数据提示样式差异：ChartTooltipContent 移除官方 min-w-[8rem]，改用 w-max 随内容撑开；后续按用户批准增加 min-w-[120px] 作为统一最小宽度，仍随内容撑开；增加 whitespace-nowrap 并移除数据行 flex-wrap，保留标题及各明细独立行。内边距从 px-2.5/py-1.5 改为全局 p-4（当前16px），统一作用于日历及各图表，不覆盖普通 Tooltip，不改变全局间距 Token。

- 用户最新批准提示文案：四项显示名为 Exercise/Reading/Learning/Creation；日历/趋势提示仅显示MM-DD，不改数据日期键；周图以 W<周号> Spent / W<周号> Plan 替换中文标题。周号沿用周日开周、含元旦为第1周，两图周号一致，不改变统计范围。

## API 文档 Scalar（2026-10-31）

- 官方集成：[scalar-fastapi](https://scalar.com/products/api-references/integrations/fastapi)，Python 包固定 1.9.1，浏览器资源 @scalar/api-reference 固定 1.76.4，使用 jsDelivr 的 dist/browser/standalone.js。
- API 文档的 OpenAPI 阅读与交互请求由 Scalar 官方实现；shadcn/ui 不提供 OpenAPI 文档渲染器，不为此仿写通用 UI。沿用 Scalar 默认样式，无自定义主题或 CSS；关闭 Agent、遥测，不启用请求代理或认证持久保存，不预填任何凭据。
- 官网入口继续组合已有官方 Button ghost/icon 与 Tooltip，按用户更换图标的要求使用现有 Lucide Cable 连接图标，不新增封装或改变控件默认状态。

## Studio 侧栏与静态登录（2026-11-02）

- 沿用既有固定源码版本 c257f688cf4de7ec10cc1be84cad29cd4631182c，不执行 latest CLI、不升级或新增依赖。官方目录为 apps/v4/registry/new-york-v4；Sidebar 来自 ui/sidebar.tsx，移动端 Hook 来自 hooks/use-mobile.ts，Dialog、Breadcrumb 和 Card 子组件来自同目录 ui；业务组合参考 blocks/sidebar-07/components/app-sidebar.tsx 与 blocks/login-03/components/login-form.tsx。
- Sidebar 保留官方 Provider/context、setOpen/toggleSidebar、Ctrl/Meta+B、icon/offcanvas、桌面间距/固定定位、移动 Sheet、Rail、MenuButton CVA 与 Tooltip 行为。仅迁入实际使用的组合项，省略 Input/Skeleton/Submenu 等未用组件；去掉示例 cookie 写入（扩展本期不持久化折叠状态）及嵌套 TooltipProvider（复用根部唯一 Provider），不自建另一套折叠状态。官方英文注释移除或改中文，import 路径适配 shared，PanelLeft 通过既有 UiIcon 静态映射。
- Sidebar 颜色语义在应用主题映射现有 Token；border、foreground、accent、ring 及 primary 不引入业务色值或额外激活状态。应用无官方全局默认边框规则，因此 Sidebar 容器显式使用 border-sidebar-border，避免 border-r 使用前景色。官方内部滚动沿用；当前右侧仅有官方 Empty，无正文滚动包装。移动 Sheet 直接复用现有共用组件，不更改 Settings/Download 材质参数。
- Breadcrumb 只迁入 nav/list/item/page，不迁入当前未用的 separator/link/ellipsis；用户去掉 Overview 后只显示 Studio 当前页，已移除不再使用的 ChevronRight 映射。保留官方语义及默认状态。
- Dialog 保留 Root、Trigger、Portal、Overlay、Content、Title、Description 与默认关闭按钮，省略未使用的 Footer/Header/独立 Close 包装。Overlay 复用现有 blur-overlay 材质，Overlay/Content 都保留官方 z-50；Content 恢复官方 shadow-lg，边框颜色显式引用已有 Token。账户调用方为承载完整官方 Card，仅让 Dialog 定位外壳 border-0/bg-transparent/p-0/shadow-none，Card 自己保留官方边框、背景、py-6、圆角和 shadow-sm，避免双重外框。这是将用户指定登录块放入 Dialog 的承载适配，不再自改 Card 材质。移除未安装动画插件的 animate/fade/zoom 类，不引入新动画；关闭图标经 UiIcon 适配，Radix 管理焦点、Esc 与外部点击。
- 现有 Card 根样式不改，从同一官方版本补充 CardHeader/CardContent/CardTitle/CardDescription。login-03 恢复官方 flex-col/gap-6 外层、Card、form/FieldGroup/Field 组合，只移除用户指定的品牌首行、Apple、邮箱密码、注册、分隔线与无目标条款。Field/FieldGroup 直接取自同一 ui/field.tsx，保留官方 CVA/默认 vertical 及间距，未引入未使用的 Label 等组件。标题与说明以 DialogTitle/Description asChild 包裹官方 CardTitle/Description，保留可访问性和官方 text-center、Welcome back，指定说明为 Login with your Github or Google account。GitHub 使用已有品牌 SVG，Google path 沿用该官方块，两个 outline 按钮仅提示未接入。Button outline 在共用 variant 补 border-border，复用已有全局边框颜色，不改 background/radius 等变量值，不在业务调用方写配色覆盖；现有 Telegram outline 调用原本已显式 border-border，无对应业务文件改动。
- Account 入口恢复同一 sidebar-07/components/nav-user.tsx 的 SidebarMenuButton lg、h-8/w-8/rounded-lg Avatar、原双行文字与尾部 ChevronsUpDown，去掉代理添加的副标题 muted 色和折叠隐藏类。Avatar/AvatarFallback 源自同版 ui/avatar.tsx；静态未登录时不放假用户头像，以既有 UserRound 放在官方 32px Fallback 内。唯一功能替换为点击打开用户指定的登录 Dialog，保留原账户行间距及官方 data-state=open 状态样式，Tooltip 仍复用单一 Provider。
- sidebar-07 移除样例团队切换、假用户、Projects、Overview 菜单与 Studio Activity，不保留未使用 Group 组件和 LayoutDashboard 图标。原 TeamSwitcher 是可点击的团队选择控件，不满足用户最新明确的 Logo 不可点击要求；因此仅保留官方 32px 标识与双行文字比例，以非交互业务布局展示既有完整 Exts SVG（不叠加另一层底板），旁边独立组合已有官方 Button ghost/icon-sm 与 Tooltip。返回图标为显式静态导入的 Lucide House，已移除不再使用的 ArrowLeft；收起时隐藏品牌并保留该独立按钮，不把 Logo 变成替代返回目标。正文 header 继续沿用官方触发器与分隔线，面包屑只显示 Studio。Account 的登录弹框打开时隐藏原 Tooltip，不改变官方 MenuButton 的激活外观。
- 新增 ui/empty.tsx 来自同一固定版本官方源码，迁入 Empty/Header/Media/Title/Description，保留官方默认样式、Media CVA 与 icon variant；仅适配 cn 路径和 React 类型导入，省略未用 EmptyContent。左侧菜单与右侧内容直接组合官方 Empty；左侧随侧栏收起隐藏，右侧作为 SidebarInset 的 flex 内容填充，不再需要 Activity/Overview 内容包装或正文 Scroll Area。不另建缺省组件、样式或通知逻辑。缺省图使用现有 UiIcon 的 List/PanelsTopLeft，尺寸沿用官方 Media 的 24px 图形。

## 官方基线

- Studio GitHub 登录（2026-11-04）：从同一固定版本 c257f688cf4de7ec10cc1be84cad29cd4631182c 的 ui/avatar.tsx 补齐实际需要的 AvatarImage，沿用官方 aspect-square/size-full；未登录 Fallback、Account 行及登录块样式保持原有规则。真实账户、登录进行中及退出属于获批登录行为，不改主题 Token。插件认证采用 oidc-client-ts 3.5.0；官网认证承接页使用现有官方 Button 和主题，不引入额外 UI 模板或图表框架，@neon/auth 0.8.2 仅在官网读取网页会话。

- 核对日期：2026-10-16。
- 仓库：[shadcn-ui/ui](https://github.com/shadcn-ui/ui)，MIT 许可。
- 固定源码目录：[new-york-v4/ui](https://github.com/shadcn-ui/ui/tree/c257f688cf4de7ec10cc1be84cad29cd4631182c/apps/v4/registry/new-york-v4/ui)。以下文件均可在这个固定目录逐项对照，不用随时变化的 main 作为版本依据。
- 文件：`button.tsx`、`badge.tsx`、`switch.tsx`、`tooltip.tsx`、`dropdown-menu.tsx`、`separator.tsx`、`sheet.tsx`；2026-10-17 按同一固定版本接入 `toggle.tsx`、`toggle-group.tsx`。
- 使用现有精确版本的 React 19.3.0、Tailwind 4.3.3、radix-ui 1.6.7、CVA 0.7.1；未升级或新增依赖，未切换组件底层。
- 两端都是 Vite 客户端应用，省略官方 `use client`；`cn` 使用各应用已有工具路径。不运行批量生成或覆盖命令。

## 逐项差异

Telegram 下载菜单的下载资源、选择文件夹项使用现有 DropdownMenuItem asChild 与 Button ghost 组合，保留菜单语义、按钮 hover 与禁用反馈；各操作按钮沿用已有 cursor-pointer，不改变共用组件默认指针或状态。Shadow DOM 内的共用主题属性使用 :host(...) 选择器，不另建菜单配色。

| 应用与组件 | 保留的官方基础 | 项目必要差异 |
| --- | --- | --- |
| 官网 Button、Badge | 官方 CVA、Slot、variant、size、状态及数据属性 | 已有实现与固定基线仅注释、空白及 cn 路径不同，本次不改 |
| 官网 Tooltip | Provider、Root、Trigger、Portal、Content 与 data-slot | 保留 400ms 延迟、8px 间距、现有主题配色/内边距/行高；无箭头，无新增动画 |
| 扩展 Button | 官方 CVA、Slot、variant/size、数据属性、禁用与无效状态 | 沿用 Token 时长与 2px outline 焦点；ghost 保留透明底与前景色；入口外壳使用 entry variant/size，反馈由 entry-surface 提供；icon 保留零内边距；危险前景引用主题 Token |
| 扩展 Switch | 官方 Root/Thumb、受控 checked、onCheckedChange、data-state/size、disabled | 保持默认 44×24px、4px 内边距、16px 滑块与20px位移；小尺寸跟随相同规则；使用 input 轨道、background 滑块与既有焦点轮廓，无新增阴影；按用户批准增加 cursor-pointer，禁用时保留 cursor-not-allowed |
| 扩展 Tooltip | 官方 Provider、Root、Trigger、Portal、Content 与 data-slot | 保留 400ms、popover 配色、边框、阴影和内边距；按用户确认默认间距 4px，Dock 在调用方显式保留 12px；无箭头，无新增动画 |
| 扩展 DropdownMenu | 官方 Root、Trigger、Portal、Content、Item；保留可用高度限制与纵向滚动、Item 通用状态 | 只导出当前需要的四项；保留 12px 间距、8px 碰撞边距、160px 最小宽、36px 菜单项、字重、highlighted 状态和浮层阴影；不加入未安装的动画工具类 |
| 扩展 Separator | 官方 data-orientation、decorative 与颜色语义 | 无结构差异；Dock 调用方通过同一方向 variant 保持 64px 高度，避免普通 h-16 被方向选择器覆盖 |
| 扩展 Sheet | 官方 Root、Trigger、Close、Portal、Overlay、Content、Header/Footer、Title/Description 组合及属性 | 保留主题模糊遮罩与层级、浮层阴影、无额外内容间距；关闭按钮复用 Button 和 UiIcon；现有右侧 CSS 动画 200/160ms。2026-10-24 按用户批准在共用组件维护右侧默认 420px、最大视口宽度；Download/Settings 不再覆盖宽度，可访问描述省略与焦点恢复提示抑制仍由调用方持有 |
| 扩展 Toggle/ToggleGroup | 官方 Toggle CVA、Radix Root/Item、上下文传递 variant/size/spacing 与单选接口 | 适配本地 cn/toggle 路径；移除 .dark 配色分支，采用既有主题 Token、2px outline 焦点、手形和 border 边框；单选激活通过 aria-checked 使用官方 accent/accent-foreground，避免 Tooltip 覆盖 data-state，不额外增加高反差背景或更改圆角。主题行指定 outline、sm、spacing=0、图标项宽 36px。空选忽略、主题保存与同步由业务/共用主题层处理 |

扩展实际深色通过根 `data-theme` 覆盖原有 Token，System 模式才跟随系统媒体查询，不依赖 `.dark`。接入源码时移除依赖 `.dark` 的配色分支，以主题 Token 表达对应状态；减少动态效果继续由现有全局规则处理。仓库未安装动画工具类插件，因此不引入无法生效的动画类或新依赖。Sheet 当前仅使用右侧入口，其余方向保留官方定位接口，不增加未批准的新交互。

2026-10-26 Studio 直接组合现有官方 Toggle 与 Tooltip，调用方指定现有 Dock 的 64px 外框；因 Tooltip 共享 data-state 且 entry-surface 会遮住按钮底色，选中外观通过根 aria-pressed 将官方 accent/accent-foreground 应用到共用入口图块。Radix 继续管理 pressed，不改 Toggle 源码，不添加图标填充或自定义状态。Actions 复用现有 DropdownMenu 默认 Hover、焦点、键盘与选中关闭行为，保留菜单打开时抑制 Tooltip 及原有关闭焦点行为；两个占位项通过 onSelect 调用 toast.info 显示「暂未接入」。现有 Toaster 从下载面板移到 Newtab 根部，仍复用同一共用 Sonner 源码、主题与右下角默认位置，不重复挂载或新增管理层。

## 业务组合与扫描边界

- 官网介绍文字二进制动效（2026-10-25）：核对 [shadcn/ui 官方组件目录](https://ui.shadcn.com/docs/components)，没有对应字符解码组件，现有通用控件组合不能提供该效果。在 `pages/home/components/binary-text/index.tsx` 与同目录 CSS 独立实现固定二进制序列及单次分步动画，仅供首页介绍文字使用；参考 shadcn.io 的公开效果及本地 Demo，不复制 Pro 源码，不作为官方组件或引入动画依赖。保留原文字体、字距和主题 Token；字符占位、辅助技术原文与减少动态效果降级由该组件负责，1.2 行高沿用首页目标文字的既有值。
- 历史清理设置视图与权限/存储逻辑继续由 `modules/history-cleaner` 持有；`modules/settings` 组合设置区域和 Sheet 外壳，`modules/dock` 只组合入口。通用 Switch 不调用 Chrome API，不持有配置或错误状态。
- Telegram Download 复用现有 DropdownMenu；Content 增加可选 `portalContainer`，仅将 Portal 挂入网页 Shadow DOM，未指定时保持官方默认挂载方式。Shadow DOM 的事件重定向处理在业务菜单中完成，保留官方选择、禁用和关闭行为；不迁入旧自定义菜单的配色或状态管理。Popup 不恢复；2026-10-28 现有 TG 与记录整合到 media-download，records 自己组合记录列表与现有 Sheet，Dock 只提供入口；不修改通用 Sheet 源码或新增 Drawer。Settings 模块自行组合总开关和三项只读状态／帮助，数据复用公共 settings 接口。
- Sheet 关闭后的 Tooltip 抑制、菜单与 Tooltip 互斥、指针外部关闭处理继续位于业务组合处；不放入共享控件。
- 官网叠放窗口保留原生 button 与现有卡片池。专用展示的尺寸、网格、窗口内容与轮换不适合套用默认 Button 或标准 Carousel。
- 书签卡片、EDU 遮罩、品牌图标与网站分类布局按需求组合；未发现需要为本次目标迁入通用 UI 的业务逻辑，不创建跨应用组件包。
- 现有测试为纯逻辑、配置和体积边界，没有需要移除的截图、布局或焦点交互测试；本次不新增模拟 DOM 测试。

## Sheet 左侧圆角与试用回退（2026-10-28）

- 用户最终明确要求全部恢复试用前 Sheet 方案，以本地代码提交 54f33fc 对应实现核对：保留 420px、主题模糊遮罩、浮层阴影、原标题图标和分隔线、Button／UiIcon 关闭按钮、200ms／160ms 自写动画。
- 唯一新增的外壳样式为右侧分支 rounded-l-[var(--radius)]，复用主题 1rem，只影响左上／左下，右侧保持贴边直角。关闭恢复焦点描边修正仍在 Dock 局部 hook 及入口样式中，不改变内部内容。
- Drawer 源码、Vaul 和 tw-animate-css 试用依赖全部移除；不将官方默认样式试用方案保留为第二套实现，README 仍推迟到整轮最后更新。

## 更新方式

### 扩展 Card（2026-10-22）

- 来源固定为本文官方基线 `c257f688cf4de7ec10cc1be84cad29cd4631182c` 的 `new-york-v4/ui/card.tsx`，通过 GitHub API 核对源码；本期仅引入需要的 Card 根组件，不引入未使用的 Header、Content 等组合项，无新增依赖。
- `src/shared/ui/card.tsx` 保留官方结构、data-slot、属性透传及其余默认样式；适配本地 cn 路径、类型导入和代码格式，并显式引用 `border-border`。本应用没有全局默认边框 Token 覆盖，须在组件内引用现有主题，避免边框使用前景色。
- 打卡占位卡片调用方按已批准的文件夹外框基准指定尺寸，使用主题 `--radius`、16px 内边距与无阴影；保留主题边框及官方 card 配色。这些调用方差异用于兑现文件夹等高与现有外框效果，不改变通用 Card 的默认圆角、内边距或阴影。

### 更新原则

修改组件时对照固定基线和本表，记录新增的必要差异；先判断是否应通过主题或既有 variant 表达。保留真实行为测试，不通过源码形状断言证明“官方”。实际视觉、主题、焦点、Tooltip/菜单/Sheet 和权限流程由用户在 Chrome/Edge 验收。

## 2026-10-17 现有视觉基准复核

用户确认以本工作项修改前的视觉为基准：差异小直接沿用官方，明显差异保留现有效果。本次串行对照当前工作区与修改前 Git 版本的组件、主题和调用方，未执行浏览器视觉验收，也未新增产品代码改动。

| 复核对象 | 源码与配置结论 | 处理 |
| --- | --- | --- |
| Sheet 遮罩 | 仍为 blur-overlay；浅色白色 42%、深色近黑色 62%，模糊 8px，层级 z-40 | 保留现有定制，不采用官方默认黑色遮罩 |
| Sheet 内容与关闭入口 | Settings 调用方指定 560px 与最大屏宽；主题背景、边框、浮层阴影、右侧 200/160ms 动画和关闭图标仍为原规则 | 保留现有定制，关闭后的 Tooltip 抑制逻辑未改 |
| 两端 Tooltip | 原配色、字号、内边距、400ms 延迟、扩展 12px/官网 8px 间距和无箭头规则均保留 | 官方 w-fit 与 data-slot 等小差异沿用，不增加覆盖 |
| 扩展菜单 | 原配色、字重、最小宽度、行高、间距和碰撞参数保留；增加官方可用高度约束与纵向滚动 | 保留原风格，狭小视口下的滚动交用户验收 |
| Button、Dock、EDU | 实际调用为 entry 或 ghost；入口图块和 EDU 仍引用原语义样式，尺寸、遮罩、图标和焦点规则保留 | 官方 gap、SVG 通用状态等不影响现有单图标组合，不额外覆盖 |
| Switch | 原 44×24px 轨道、16px 滑块、20px 位移、明暗配色及焦点规则保留 | 滑块默认过渡 150ms 与原 160ms 属细小差异，直接沿用官方，不再增加定制 |
| Separator | 原方向、颜色与尺寸保留；Dock 高度已通过匹配方向的样式覆盖 | 保留官方 data-orientation 基础 |
| 官网 Button/Badge 与特殊展示 | 本轮未修改这些实现 | 保留，避免扩大视觉变更 |

以上是源码与配置核对结论，不证明最终渲染、焦点、菜单碰撞或真实权限交互已通过。验收发现明显差异时，以原有已确认效果修正，不能要求用户接受官方默认外观。

## 扩展 Sonner（2026-10-21）

- 官方源码沿用本文固定 commit 的 new-york-v4/ui/sonner.tsx；运行时依赖精确固定为 sonner 2.0.8，锁文件同步，仅新增该包。
- 本地 src/shared/ui/sonner.tsx 保留官方图标、主题 Token 与 props 透传；Vite 客户端去除 use client 和 Next.js 专属 next-themes，主题改由调用方使用现有主题解析结果传入，不新增主题系统。
- TG 在自身 Shadow DOM 中挂载 Toaster，并导入 sonner/dist/styles.css；原页面中的官方默认 CSS 注入行为不修改。堆叠、折叠、关闭时长和交互沿用 Sonner 默认。TG 使用默认 success 类型，不自写关闭计时或通知队列；2026-10-24 按用户确认移除文件名 description，仅保留等级图标及“下载完成”。
- 共用组件只负责展示；实际完成判断、文案、文件名和调用时机仍在 TG 模块中。
- 2026-10-24 按用户反馈在共用 Toaster 显式设置默认 bottom-right，TG 去除 top-right 覆盖，与 Newtab 提示共用位置规则；不同页面分别挂载，不增加跨页提示中心或业务管理层。
- 2026-10-24 统一通过 shared/ui/sonner.tsx 导出既有 toast API，TG 与 Download 均从该入口导入；沿用官方 success/info/warning/error 和现有 Lucide 映射，不添加消息管理封装或彩色状态覆盖。业务仅选择等级与提示语；当前文件夹提示改用 info，以展示既有信息图标。后续 X 遵守同一规则，不在本期接入。

## Settings 分组列表与折叠（2026-10-28）

- 用户批准的共用 StatusIcon 基于现有 UiIcon 与 lucide-react 1.46.0 静态导入，仅负责六个等级的 SVG 映射。官方 Item／Badge／Sonner 不适合作为独立状态图标的替代，因此提供此最小展示组件；不仿写官方 Tooltip。Media Download 调用方自行组合现有 Tooltip、焦点与读屏文案；不改变现有官方 Tooltip 或 Sonner 样式。

- 新接入 Item 与 Collapsible 的 shadcn/ui new-york-v4 官方源码，固定提交 `c257f688cf4de7ec10cc1be84cad29cd4631182c`：[Item 源码](https://github.com/shadcn-ui/ui/blob/c257f688cf4de7ec10cc1be84cad29cd4631182c/apps/v4/registry/new-york-v4/ui/item.tsx)、[Collapsible 源码](https://github.com/shadcn-ui/ui/blob/c257f688cf4de7ec10cc1be84cad29cd4631182c/apps/v4/registry/new-york-v4/ui/collapsible.tsx)。沿用现有 radix-ui 1.6.7、class-variance-authority 0.7.1，不新增或升级依赖。
- 本地差异仅为中文来源注释、cn／Separator 的本地导入路径、移除无需求的 use client 指令、补充 React 类型导入；保留官方组件结构、默认样式、可访问属性与状态管理。
- General／Features 以已有 Card 加官方 ItemGroup／Item／ItemSeparator 组合用户指定的圆角边框分组；Card 调用处去阴影、纵向内边距与 gap，Item 去水平内边距以共享分隔线边缘。这是本次参考图明确批准的业务布局，不改通用组件默认样式。
- Media Download 通过 CollapsibleTrigger asChild 组合官方 ghost Button 与现有 chevron 图标，依据官方 data-state 翻转箭头；默认收起，不维护额外展开状态。总开关与触发器是独立元素，仅主项保留 Tooltip，子项不带问号且全部英文；不进行浏览器交互自动化验收。

## 扩展 Alert Dialog 与 Download（2026-10-24）

- Alert Dialog 源码固定为本文官方基线 c257f688cf4de7ec10cc1be84cad29cd4631182c 的 new-york-v4/ui/alert-dialog.tsx，读取官方原文件后接入；使用现有 radix-ui，无新增依赖。
- shared/ui/alert-dialog.tsx 保留官方 Root、Trigger、Portal、Overlay、Content、Header/Footer、Title/Description、Action/Cancel 及 Button asChild 组合。去除 use client，适配本地 cn/Button 路径；未引入未使用的 Media。
- 未安装动画工具类，移除对应进出场类；边框显式引用 border-border，文字引用 text-foreground。确认框位于整个页面中心，保留官方黑色半透明遮罩；为叠在既有 Sheet 上，Overlay/Content 分别使用 z-60/z-70，其余保留官方默认样式及取消优先焦点。
- Download 自己持有筛选、确认文案和清空逻辑，无全局弹窗管理。记录截断和图标名称复用现有 Tooltip，文件夹不可用和清空失败复用现有 Sonner，沿用当前主题。
- 工具栏使用官方 ToggleGroup、Button icon-sm 和既有品牌资源；新增通用列表、文件夹、垃圾桶图标通过 UiIcon 静态映射。40px 记录行属于业务布局，不新增通用表格或卡片封装。

## 扩展 Input OTP（2026-10-26）

- `input-otp.tsx` 使用固定官方基线 c257f688cf4de7ec10cc1be84cad29cd4631182c 的 [Input OTP](https://github.com/shadcn-ui/ui/blob/c257f688cf4de7ec10cc1be84cad29cd4631182c/apps/v4/registry/new-york-v4/ui/input-otp.tsx) 源码。运行时依赖固定为 `input-otp` 1.5.0，精确写入 Extension package 与锁文件；本地源码去除 Vite 客户端不需要的 `use client`，适配 `cn` 路径。
- Input OTP 保留官方单一真实输入与 Group/Slot 的上下文、焦点、粘贴能力，省略未使用的 Separator。因用户确认四格彼此分开，本地 Slot 改为四边完整边框与统一圆角，Group 使用 8px 间距；增加可选 `masked` 以圆点显示已输入字符。EDU 调用方覆盖组内和组间间距为 16px、四周留白为 16px，以对齐内部书签布局，并设置真实输入的 password 类型、纵向两组各两格及输满自动校验，不自制四个输入框或焦点管理。
- 文件夹轻度遮挡、EDU 固定 `0000` 界面锁与成功过渡由 Newtab 业务层维护；输入格直接组合在 EDU 文件夹内，无 Dialog。Input OTP 共用组件不保存验证码、书签或业务状态。浏览器里的实际外观、焦点、输入和过渡效果由用户验收。

## 扩展 TG 下载按钮组（2026-10-25）

- Button Group 与 Popover 源码固定为官方基线 c257f688cf4de7ec10cc1be84cad29cd4631182c 的 new-york-v4/ui/button-group.tsx、popover.tsx，使用现有 radix-ui、class-variance-authority，无新增依赖。
- Button Group 沿用官方 group 语义、orientation、组合选择器与属性透传，仅适配本地 cn/Separator 路径。主按钮和横向三点使用现有 Button outline，不自建选中状态。
- TG 按用户最终提供的 ButtonGroupDropdown 示例使用单一 ButtonGroup，下载资源与三点均用 outline Button，不额外加入 ButtonGroupSeparator。项目现用 Radix，对应触发器采用 asChild；保留已确认图标与业务菜单，不增加子组、手动间距或宽度变量。
- Popover 仅引入 Root、Trigger、Content、Anchor，适配本地 cn，去掉 use client 和未安装的动画工具类，显式主题边框、复用既有浮层阴影；Content 增加 portalContainer 以挂到 TG Shadow DOM。不是恢复旧自定义 Popover；此处承载按钮组，次要操作仍由官方 DropdownMenu 负责。
- TG 业务负责右键位置、操作和 Shadow DOM 外部事件判定，Popover 只定位按钮组，调用方去掉其边框、背景、内边距与阴影，不再额外包一层白框；保留 w-max、8px 碰撞边距。DropdownMenu 按用户要求使用官方 4px sideOffset，不使用项目共用的 12px；共用默认不改。现有流式保存、目录授权和另存为保持各自职责，不接 chrome.downloads。
- TG 的两个 outline 按钮显式使用 border-solid border-border，恢复 Shadow DOM 中未生效的边框样式和主题颜色；未手画分割线、未加入 Separator 或新变量。Tailwind 产物的 border 依赖 @property --tw-border-style，Shadow DOM 对 @property 存在限制，参见 [Chrome 说明](https://developer.chrome.com/docs/css-ui/css-names)。
- TG host 默认 pointer-events:none，Popover 与下拉菜单通过 Portal 成为兄弟层，业务调用方分别添加 pointer-events-auto，避免下拉层无法悬停和点击；沿用官方 highlighted/focus 配色。

## 官网与扩展 Scroll Area（2026-10-25）

- 两端源码固定为同一官方基线 c257f688cf4de7ec10cc1be84cad29cd4631182c 的 new-york-v4/ui/scroll-area.tsx，保留 Root、Viewport、ScrollBar、Thumb 与 Corner 的官方组合。使用现有 radix-ui，无新增依赖。
- 仅移除 use client、适配各应用 cn 导入；滚动条宽度、轨道、Thumb、颜色、显隐与焦点均沿用官方默认，不增加状态、事件管理或自制滚动逻辑。
- 扩展增加可选 viewportClassName：书签区、卡片区和 Dock 保留原 overscroll 约束；Download 用 [&>div]:h-full 让 Radix 内容包装层填满已有区域，内层保留最小满高与 flex，以维持空列表居中。这些仅为容器布局适配，不改变滚动条外观。
- 纵向区域使用官方自带 ScrollBar；书签区与卡片区保留双向溢出能力，Dock 与官网命令区按官方 Horizontal 示例组合水平 ScrollBar。调用方只维护原有尺寸、间距与内容。
- 已删除被替代的 Newtab 隐藏原生滚动条规则。DropdownMenu 自带滚动、官网文档主体、Telegram 原网页及 macOS 原生界面保持原有机制。
- 2026-10-26 UI 文件夹按用户明确批准在调用方隐藏直接子级的官方 ScrollBar，保留 Root、Viewport、内部滚动与 overscroll-y-contain；不改共用源码，不新增原生滚动条 CSS 或手写滚动事件。其余区域继续使用官方默认滚动条。
