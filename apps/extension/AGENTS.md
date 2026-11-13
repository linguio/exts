# 子项目规范

## 界面样式

- 扩展界面样式规范维护在 [docs/extension/ui.md](../../docs/extension/ui.md)；主题 Token 与共用语义样式由 `src/styles/index.css` 实现，组件按用途引用，禁止复制一套相同参数自行维护。

## 网站图标

- 网站图标的原始参考优先使用 [Simple Icons](https://simpleicons.org/)。
- 图标资源仓库为 [simple-icons/simple-icons](https://github.com/simple-icons/simple-icons)。
- `src/assets/brand/` 中的书签图标优先从 Simple Icons 查找参考；允许按用户确认的范围参考原图手绘、调整大小与绘制细节，形成统一风格。有现成图标不限制手绘；没有对应资源时使用用户提供的参考。不直接嵌入或引用位图。
- 是否带框由用户逐图确认，不按品牌身份决定；带框时复用共同外框，无框时不添加。手绘源稿及登记规则见 [V3 图标规范](../../docs/ohmy-icon-system.md)；未确认的图标不得擅自重绘、加框、去框或替换。
- 本轮统一风格的正式 SVG 使用 `viewBox="0 0 1024 1024"`，不写固定 `width`、`height`；包含 `role="img"`、可访问的 `<title>` 与一个或多个 `<path>`。每个图标只维护一份正式 SVG，不另生成 24×24 接入版，实际显示大小与渲染适配由使用方负责；未调整的既有资源不自动转换。
- 本轮正式 SVG 采用透明背景、单色 `currentColor`，不维护独立黑色、深浅主题或上传版本；不得添加渐变、阴影、纹理或透明度效果，并保留小尺寸下可辨识的核心特征。未调整的既有黑色资源不在本次文档工作中改色。
- 文字类书签 SVG 统一命名为 `text-<书签 id>.svg`（例如 `text-pmi.svg`）；本轮统一风格的新正式源稿同样使用透明 `1024×1024` 坐标画布，按视觉重量居中并保留安全边距，不另设一套交付尺寸。未调整的既有文字资源保持原状。

## 通用 UI 与组合

- 表格及列表查询接口遵循与 UI/API 并列的仓库级[表格规范](../../docs/table-conventions.md)；扩展组件接入说明不能代替该规范，后续共性规则同步维护仓库级文档。

- 官网与扩展全部 Web UI 的选型、来源和风格维护原则遵循根 [AGENTS.md](../../AGENTS.md#web-ui-选型与风格)，不维护组件白名单。
- `src/components/ui/` 持有通用组件，不包含书签、Dock、Chrome API 或模块状态；各功能在自己的 `src/features/<功能>/` 中组合，Newtab 也遵循此边界。
- 扩展主题由 `src/lib/theme/preference.ts` 解析偏好、`src/features/settings/theme.ts` 同步运行状态 Light/Dark/System，默认跟随系统；实际明暗通过根 `data-theme` 应用，Portal 继承根 Token，不直接依赖 `.dark` 类。偏好保存、同步与首屏初始化不得放进通用 UI。官方源码接入和必要差异见 [Web UI 来源](../../docs/web-ui-sources.md)。
- 临时提示统一从 `src/components/ui/sonner.tsx` 导入 Toaster 与 toast，复用 shadcn Sonner 和 Lucide 成功/信息/警告/错误图标，使用图标加提示语、各自页面右下角位置和统一主题；不增加文件名副标题、模块独立配色或位置覆盖。TG 与后续 X 均遵守，业务只负责等级、文案与触发，不建立跨页面通知管理。等级规则见扩展 UI 规范。
- Download 与 Settings 共用试用前的 Sheet：默认右侧 420px、最大不超过视口，保留主题模糊遮罩、浮层阴影、原 Header／标题图标与分隔线、关闭按钮和 200ms／160ms 动画。仅按用户新增批准在共用组件增加左上／左下 rounded-l-[var(--radius)]，复用全局 1rem，右侧保持直角贴边；不新增边缘留白。
- 应用根只创建一个 `TooltipProvider`。Tooltip 只提供简短名称或帮助说明，不含可交互内容；菜单或 Sheet 打开时其入口不得残留 Tooltip，Sheet 内的主题名称和帮助提示可正常显示。
- Tooltip、菜单、Sheet、Button 与链接通过 `asChild` 等方式共享唯一真实交互元素，禁止嵌套交互控件。

- 模块级内容区域遵循 LoadingRegion 的首次 Skeleton、后续 Spinner 规则；DataTable 不套用该规则，首次与刷新统一使用整个 body 内居中的官方 Spinner，保留表头，刷新保留已有记录。具体组合与边界见 docs/extension/ui.md。

## Studio 功能归属

- Studio 侧栏采用 shadcn/ui dashboard-01 的 inset/offcanvas 结构，窄屏沿用官方 Sheet；左侧仅在确认登录后用官方 SidebarGroupLabel 与 SidebarMenu 展示前端固定的 Activity → Daily；右侧由 Studio 内容边界统一处理账号加载、错误、未登录提示及受保护页面，不在各业务页面重复。Daily 使用已有 DataTable 接入 days 服务端分页与多字段排序；日期条件点击 Query 生效，排序即时生效，Reset 包含日期与排序且保留每页条数及列显隐，采用表头普通点击单列、Shift 点击多列排序，具体规则与验收见 docs/extension/data-table.md。首页 ActivityCard 仍按原位置使用。品牌头部保留官方 32px Logo 与两行名称比例，以非交互布局展示既有 Exts 资源；Logo 与文字不可点击，只有其右侧独立的官方 Button ghost/icon-sm + Lucide House 返回 Home。收起侧栏采用官方 offcanvas，不保留图标轨道；窄屏在侧栏内访问。不在正文顶部放 Home 文字按钮或自定义边框；顶部官方触发器与分隔线保留，登录后按当前账号恢复会话路由，缺失或未知路由回到 Overview；分组标题不折叠，面包屑反映当前 Overview 或 Activity / Daily。Studio 不显示 Dock 且不保留其布局空行。无本机视图偏好时默认首页，当前扩展会话内新标签页恢复 ui-session.view 保存位置，Home／Studio 由 React Activity 保留各自状态。
- Account 位于 Studio 侧栏底部，保留官方 Dialog/login-03 的未登录结构、样式与文案。GitHub 与 Google 共用标准 oidc-client-ts 3.5.0 的 OIDC 授权码 + S256 PKCE；登录窗口先进入官网认证页，以片段传递本次提供方及标准授权地址，官网仅在窗口 sessionStorage 保存提供方，再跳转固定 Neon 授权端点，不修改授权查询或 Neon 签名查询。官网承载登录中转、授权确认与同源注销页，不保存令牌。identity 窗口由后台协调，插件认证 fetch 省略网页 Cookie，后台串行管理扩展源 IndexedDB 凭据、刷新与撤销，页面消息只返回头像/昵称/邮箱且拒绝内容脚本。退出先撤销刷新令牌，再短暂打开官网同源注销页调用 Neon signOut 并验证会话消失，收到固定插件回跳后删除残留的指定 Neon Cookie，最后删除插件身份；失败保留本地身份供重试且不提示成功。不注销 GitHub/Google 网站账号，不承诺即时使已签发访问令牌失效。再次登录发送 `prompt=consent` 要求 Neon 显示 Exts 授权确认；官网向所选 GitHub/Google 社交登录请求 `prompt=select_account` 供用户选择身份，不强制 GitHub 重复展示其自身应用授权。缺少公开 Client ID 时保持访客，不用占位值发起授权。取消和失败使用共用 Sonner，日志不输出授权码/令牌。退出和主动重新登录按当前会话重置工作项清理扩展自有设置、下载记录、目录句柄与运行状态；已下载文件和浏览器管理的数据不清理。不增加业务表、管理员或 API；真实 Chrome/Edge 行为由用户验收。
- Studio 参考 Newtab 按 views、components、stores、types、utils 等职责组织，目录内部按功能分组，只创建实际需要的目录；不预建全局 Store、空功能目录或通用事件总线。
- ActivityCard 归 `features/activity/charts`，由 Home 页面直接引入展示；纯类型、日期/时长转换与统计计算归 `features/activity/data`，Daily 查询与记录归 `features/activity/daily`；日期 Hook 为 charts/use-activity-today.ts，Dock 入口组件归 `pages/dock/studio-entry.tsx`。默认 Calendar，保留三项视图切换；Calendar 为 24 周完成项数日历，Chart 展示最近 14 天成长/睡眠，Pie 展示周投入及周计划。记录由扩展后台认证请求 API 获取，不再使用模拟 JSON，不提供页面录入、持久化或查询缓存；Provider 在 Home/Studio 隐藏边界外保留当前展示数据，登录初始化和三项视图切换才请求，Growth/Sleep 只切换字段，日期统一 Asia/Shanghai。睡眠仅每日总时长。运动、阅读、学习、创作固定对应全局 --chart-1 至 4，日历 activity-level 仅为其别名，全图表复用同一中性灰主题；实心饼图按分类着色，计划环按每25%完成度分档且不显示左右标题；周计划统一周日至周六。具体组合见扩展 UI 文档；退出与主动重新登录按当前会话重置工作项使旧 Activity 请求和展示数据失效，后续数据操作仍按获批范围推进。

- 首页倒计时归 `features/activity/timer`，由 NewtabCards 在日历下方左对齐组合，两者间距32px与左侧两排文件夹外框间距一致；外框宽高采用文件夹基准（默认178px），数字纵向比例2.8，数字牌填满剩余高度（默认112px）；以16px模式图标的可见边缘为操作行范围，顶部、数字牌上方、底部三处留白各16px；保留官方32px按钮点击区域，布局顶部与行间各8px、底部16px，复用日历同类主题与间距。TimerCard 通过 use-countdown 持有当前标签页内存状态，不写 session/local，不同步多标签，不记录活动时长；切 Studio 保留，刷新/关闭清空。Slider 使用指定官方 Base UI 组件，手动0–60分、步进5、提交即开始，运行按截止时间回缩；音频本地合成，归零仅复用 Sonner 与结束音，不请求或发送系统通知。Slider右侧为Clock/Timer模式按钮；时钟显示本地HH:mm、无秒数和滴答，切换清空倒计时，拖动自动回到倒计时。声音右键菜单采用指定官方Base Context Menu默认分组和勾选；英文计时四项、完成三项、按名称从短到长排列，默认Quartz Clock/Glass Chime，本机local保存；切换立即试听且不叠加、不重置计时。来源与布局见 docs/web-ui-sources.md 和 docs/extension/ui.md。

## 图标职责

- `UiIcon` 只适配 Lucide 通用 UI 图标，统一使用 `currentColor`、已批准的尺寸和线宽；只能显式静态导入实际使用的图标。
- 状态等级复用 components/custom/status-icon.tsx 的 StatusIcon：success、neutral、pending、loading、warning、error；等级语义与 Toast 的成功／信息／加载／警告／错误反馈一致，展示组件各自保留已确认图标。图标统一 16px、既有线宽与 muted-foreground，不额外加红绿等等级配色；loading 旋转且遵循减少动画偏好。业务自行判断状态、映射等级并组合官方 Tooltip，Tooltip 与可访问文案不得写入 StatusIcon，不建立全局业务状态管理。
- 禁止 `import * as Icons from 'lucide-react'`、完整图标注册表、根据任意字符串动态访问 Lucide 全量导出或其他可能将整套图标打入产物的方式。
- `components/custom/brand-icon.tsx` 只管理品牌、网站书签和文字 Logo；Newtab 书签及 Dock 收藏随明暗主题切换黑白，不再维护 original、adaptive 或 neutral 配置。普通书签透明单色，浅色黑色、深色白色；Exts 使用已批准的轻量圆角矢量展示资源，浅色黑底白图、深色白底黑图。品牌唯一源稿与三端应用图标保持原样；不得使用 Lucide 重绘或替换品牌 Logo。
- 被 Lucide 替代的通用功能 SVG 在完成迁移和验收后必须删除，不得长期保留两套等价资源或运行时实现。

## 共用能力与职责目录

- 界面位置保存在 chrome.storage.session 的 ui-session.view（home/studio），由 app/view-preference.ts 统一读取、校验与串行保存，启动读取后再挂载 App；同一扩展会话内恢复位置，不持久化到 local，不混入云端 settings，不订阅跨标签页导航。ui-session.studio 仅记录当前用户ID与字符串路由，恢复时按账号隔离，路由注册表验证并回退 Overview。账号重置清理全部 local 业务键（含旧 ui），不清理 session 导航；不在其中保存令牌或业务数据。

- shadcn 基础层已完整迁入 `src/styles/shadcn.css` 与 `shadcn-theme.css`；项目取值覆盖统一由 `theme.css` 和 `index.css` 的必要扩展维护。迁入组件必须核对源码、组合依赖、CSS、动画、主题变体与 Token，不只复制 JSX，不在业务调用方补颜色掩盖基础缺失；固定来源和已保留覆盖见 [来源记录](../../docs/web-ui-sources.md)。

- Studio 未登录时左侧菜单区复用官方 Empty，显示 Not signed in / Sign in to see your pages.，登录后替换为业务菜单；身份确认或读取失败不显示这个访客提示。


- 复杂表格复用 `src/components/custom/data-table/`；全部控件采用 shadcn 官方基础组件及组合，只有确有无法解决的实际问题时才说明证据并等待用户决定，不自行替代。业务维护列、请求和操作，通用层不包含账号或 Chrome API；具体组合与接入见 [UI 规范](../../docs/extension/ui.md#通用数据表格) 和 [DataTable 说明](../../docs/extension/data-table.md)。
- Studio 账号内容按账号 ID 与现有会话重置版本确定生命周期，退出、换号及同账号重新登录重建受保护子树。各模块继续负责其请求清理和边界外状态，新增页面不往账号模块追加硬编码清理清单。

- `src/api/` 集中维护业务 HTTP 客户端、地址配置与按业务划分的接口函数；Chrome 消息通信、会话、缓存和页面状态留在对应 feature。OIDC 与第三方下载遵循原协议，不迁入业务 API 客户端。
- `src/assets/brand/` 持有扩展共用品牌 SVG，`src/components/custom/` 持有 BrandIcon 与尺寸类型；通过 WXT 复制资源到相同相对路径，不更改 SVG 内容或三端品牌源稿。
- `src/features/bookmarks/` 持有 Newtab 与 Dock 实际复用的 BookmarkCard 和基础 Bookmark 类型；首页配置、文件夹类型、解锁及打开辅助同归该 feature，不把业务放进 components/ui。
- 模块内部按实际职责创建 views、components、hooks、types、constants、utils 等目录，目录内部按功能分组；下载执行、权限和运行环境接入保留明确的业务目录，不统放 utils，不建空目录或全局管理层。
- 界面消费者使用模块公开界面入口；后台、MAIN 页面和隔离脚本直接引用对应环境入口，不经过导出 React 视图的聚合入口。

## 模块组合与 Dock 交互

- `src/app/App.tsx` 负责 Home／Studio 切换、公共 Provider 与首页 Dock 的顶层组合；Home 布局与测量由 `pages/newtab` 持有，书签打开逻辑归 `features/bookmarks`，Dock 界面组合归 `pages/dock`。Studio 侧栏与返回入口归 `pages/studio`；Dock 与 Studio 共用 `pages/account` 的账号界面，认证与会话逻辑归 `features/account`，不把页面布局或账户业务放入通用 UI。
- `pages/dock` 持有 Dock 布局、入口、Actions 菜单和抽屉入口提示协调；收藏由应用组合层传入。Settings Sheet 归 `pages/settings`，Download Sheet 归 `pages/download`；业务模块不得依赖 Dock 内部实现。


- Dock 网页入口使用真实链接语义；工具分组使用真实按钮打开 `DropdownMenu`；已批准的 Settings 使用真实按钮打开 `Sheet`。各入口按已批准职责组合，不维护第二套交互实现。
- Dock 入口 Hover 或键盘 Focus 时只显示 Tooltip；不得通过 Hover 直接展开 DropdownMenu，也不得让同一个弹层同时承担 Tooltip 和菜单职责。
- DropdownMenu 中的网页入口优先使用真实 `<a>`；仅在需要调用 Chrome API、创建标签组或执行非导航操作时使用命令型菜单项。
- Dock 位于视口底部，DropdownMenu 默认从上方弹出并支持碰撞调整；由用户验证菜单在 `1280×720`、缩放后 CSS 视口 `640×360` 以及 100%、125%、150%、200% 缩放下不被裁剪或移出视口。
- 用户验收 DropdownMenu 应覆盖 Enter、Space 或 ArrowDown 打开、方向键移动、Enter 激活、Esc 关闭并恢复触发器焦点、外部点击关闭等行为；Portal 必须正确继承明暗主题 Token 和层级。
- 已废弃的自定义 Popover 不得重新引入；DropdownMenu 与 Tooltip 分别承担菜单和提示职责，不维护双轨实现。
- Settings 包含 General/Features，使用官方 Card、ItemGroup、Item 和 ItemSeparator 组成圆角边框列表。General 组合主题选择，Features 组合历史清理与 Media Download 总开关和帮助。Settings Sheet 由 `pages/settings` 组合，General 设置项归 `features/settings`，媒体下载设置项归 `features/media-download`，Settings 页面只负责抽屉和分区组合，Dock 只组合入口；通过公共 settings 数据源读写／订阅；TG、X、Helper 子项由官方 Collapsible 默认收起，只读展示英文状态，不提供独立开关或子项问号，仅主项保留帮助。折叠触发器与总开关独立，不在 Settings 展示下载记录。

## Media Download 与记录边界

- `src/features/media-download/` 统一媒体下载；`telegram/` 平铺网页按钮、下载执行、目录授权及 MAIN／隔离环境接入，`records/` 平铺记录后台、存储和列表；`pages/download/` 持有记录抽屉；各业务的辅助逻辑、类型与常量留在对应业务目录。总开关默认关闭，未登录时保存本机设置，已登录时保存当前账号云端设置；成功后更新 `settings.mediaDownload.enabled`。关闭立即屏蔽新下载入口，正在写入的任务继续。X／Helper 当前未接入，不预建空模块或模拟连接状态。
- 不提供 Popup；完成 Toast 使用 components/ui 中的官方 Sonner 样式组件，文案与触发由 TG 模块负责。只在文件关闭成功后显示成功图标与“下载完成”，不附加文件名描述；实际文件名保留在下载记录。不提示开始、进度、失败或取消，不修改现有文件名生成规则。
- 文件关闭成功后，TG 页面仅把实际文件名和字节数通过隔离脚本交给 features/media-download/records/background 后台；记录模块复用 lib/storage，保留 downloads 顶层对象、来源校验和按筛选清空。Dock 仅提供打开 Media Download Sheet 的一级入口，列表归 features/media-download/records，抽屉组合归 pages/download。记录错误不改变已保存文件或成功 Toast，不传媒体流、目录句柄或真实磁盘路径。X 下载与 Desktop 通信尚未接入，文件夹入口仅提示未接入。
- 后续 X／Helper 按当前 Issue 获批阶段接入：Helper 独立执行，成功后通知一次，扩展收到后记记录；关闭总开关停止通信但不取消任务。通知丢失可接受，不加确认、重试、补发、恢复同步或历史补拉。
- 保留 MAIN world 页面取流；目录选择与权限请求在用户手势内直接调用。下载入口使用官方 Button Group：主按钮为下载图标加“下载资源”，横向三点 DropdownMenu 收起“文件另存为”和“选择文件夹”；按钮组外层使用官方 Popover 定位，禁止恢复旧自定义 Popover。首次快速下载选择并记住目录后继续保存，后续直接保存；另存为独立选择本次文件而不更改目录，重新选择只更换后续目录。不限定目录名称、不创建固定子目录。句柄留在 Telegram 同来源 IndexedDB，同名递增避重；目录 API 不可用时快速保存降级为系统另存为。不把媒体流交给 desktop。统一主题 Token 位于 `src/styles/theme.css`，网页菜单与扩展页面共用。

## 历史清理边界

- 后台入口只注册独立模块，不导入 React 或 Newtab；注册、普通 worker 唤醒、安装或更新不能主动清理。
- 历史清理默认关闭，只在当前有效设置开启且获得 `browsingData` 可选权限时调用 `removeHistory`；未登录时设置点击保存本机，已登录时以接口保存结果为准；关窗时读取 `storage.local` 当前设置，不等待网络，不得扩大到其他浏览数据或站点权限。
- 开启操作申请权限并保存配置，不立即清理；浏览器真实启动、最后窗口关闭、授权和界面效果由用户在专用 Chrome/Edge 配置文件验收，代理测试不得删除真实历史。

## exts 新标签页模块 验收

- 自动化测试覆盖不依赖真实浏览器布局与焦点环境的配置、数据处理、链接安全属性和必要架构边界；不得用假 DOM 模拟 Tooltip、菜单、键盘、焦点或指针交互。
- 架构测试只用于防止高风险边界回退，例如旧 Popover、Lucide 全量导入或业务逻辑进入 `src/components/ui/`；不得大量断言源码文本和内部实现形式。
- 每个阶段按根规范完成必要的逻辑测试、类型检查和生产构建。
- 功能阶段完成后由用户在 Chrome 或 Edge 实际加载稳定开发目录，验证明暗主题、Tooltip、菜单、键盘、焦点恢复和约定缩放场景；用户未明确验收通过前不得进入最终提交准备。
