# 扩展界面样式规范

适用于 `apps/extension`。覆盖全部扩展 Web UI，现有场景包括新标签页书签、Dock 工具、Settings Sheet 与 EDU 遮罩；Dock 基础规则见[对应 Issue](../changes/issues/2026-10-15-extension-newtab-dock-issue.md)，历史清理设置区域的交付与验收状态见[历史清理 Issue](../changes/issues/2026-10-16-extension-history-cleaner-issue.md)。

## 维护位置与职责

- `apps/extension/src/styles/theme.css`：整个 extension 的主题 Token 唯一实现位置，Newtab 与网页注入界面共同引用。
- `apps/extension/src/styles/index.css`：导入主题 Token，集中维护字体、共用语义样式和减少动态效果规则。
- `apps/extension/src/components/ui/`：以 shadcn 官方源码为基础的通用组件，不包含书签或 Chrome API 业务逻辑。
- `apps/extension/src/features/<功能>/`：持有对应功能的布局、内容、状态和操作；history-cleaner 持有设置区域与业务，Newtab 只组合设置区域。
- 本文维护用途、参数与组合约定；不在模块 README 再维护一份样式规则。

组件选型遵循根 [AGENTS.md](../../AGENTS.md#web-ui-选型与风格)。固定来源和逐项定制差异见 [Web UI 来源](../web-ui-sources.md)，不把 Radix 包装或组件数量少当作采用官方源码的依据。

滚动区域也按上述通用 UI 规则选型，优先采用官方 Scroll Area 与默认滚动条，不在业务模块各自维护滚动条样式。当前已接入 Download、Settings、Newtab 书签区、卡片区与 Dock；具体交付与验收状态见对应 Issue。

迁入官方组件保持修改前已确认的视觉效果；小差异沿用官方，明显差异保留必要定制，不逐像素复刻。用户于 2026-10-28 最终要求 Download／Settings 恢复试用前的整套 Sheet 样式，保留 420px 和模糊遮罩，仅新增复用 --radius 的左侧圆角；不保留官方默认视觉试用方案。

## 区域加载反馈

模块级内容区域遵循首次 Skeleton、后续 Spinner；这是模块加载规则，不推广到表格等独立控件。DataTable 首次与后续均使用官方 Spinner，不使用首次骨架屏，具体位置见“通用数据表格”。

- 共用 Spinner 与 Skeleton 使用固定官方源码，来源及差异见 [Web UI 来源](../web-ui-sources.md)。Spinner 沿用官方图标及旋转，Skeleton 沿用官方 bg-accent、rounded-md 和脉冲动画；两者遵循 prefers-reduced-motion，不硬编码明暗颜色。
- 模块级 LoadingRegion 只根据 `loading` 与 `hasPreviousResult` 选择展示：首次无上次成功结果时显示一整块官方基础 Skeleton，有结果时保留旧内容并居中显示官方 Spinner。组件只负责必要区域布局、aria-busy 与读屏提示，不发请求、不创建计时器、不持有业务状态或自定义视觉模式。
- 当前 Activity 的日历、趋势和 Summary 左右两区均使用自动选择。共享请求时复用状态，不产生重复请求；每个区域独立占位，标题、筛选及原区域高度保留，不使用整页遮罩或全应用加载开关。
- Activity 请求开始为 loading，成功为 success、失败为 error、未登录为 idle；同一账号各视图的上次成功结果在后续加载时保留，成功空结果也算已有结果。账号变化或页面刷新重新从首次加载开始；旧请求取消后不覆盖新状态。成功空记录与失败 Toast 保留，不新增错误布局。
- 不新增加载专用 Design Token，也不使用已有毛玻璃 Token；Skeleton 与 Spinner 保持官方默认类名，减少动画由应用现有全局规则处理。
- 日历、趋势和 Summary 两区分别接入；视觉、布局、主题和交互由用户实际验收，不使用假 DOM、截图或布局测试。

### LoadingRegion 的使用边界

- 适用于有明确尺寸、首次可整块占位的内容区域，例如图表、统计卡片内容或预览区。调用方负责区域尺寸、`loading`、读屏 `label` 和 `hasPreviousResult`；后者仅在当前账号与当前查询条件已有成功结果时为 true，成功空结果也算成功。
- 不直接放入 `<tbody>`、按钮、输入框或表单内部。表格不套用模块级 LoadingRegion 或首次 Skeleton 规则；DataTable 自行在 body 内组合官方 Spinner，表头、工具栏和分页保留。
- 组件不获取数据、不缓存结果，也不提供全应用加载状态。当前仅有 Activity 一组调用方，不增加通用模式、业务配置或表格专用分支；出现具体新场景时先核对现有组合是否适用。

## 通用数据表格

- [仓库级表格规范](../table-conventions.md) 与本 UI 规范并列，是表格加载、默认布局、筛选查询、排序、分页与列表接口约定的统一事实来源；新建或调整表格必须查阅。本文件不另维护同类默认规则。
- 扩展普通业务查询使用 components/custom/data-table 的 QueryDataTable，统一草稿/生效查询、请求生命周期和工具栏；低层 DataTable 默认不设固定像素高度，Daily 通过 `fillRecords` 在 flex 布局内分配剩余空间并由官方 ScrollArea 纵向滚动记录区。复用既有官方组件/主题；业务列、字段格式、请求、权限和操作留在 feature，不进入通用组件。表格行编辑共用 Sheet（默认 420px 与主题遮罩）标题栏与 Settings 同为 56px 行高与 Lucide 图标 + 标题组合，打开时同样阻止默认自动聚焦并聚焦标题；编辑 Sheet 固定 **Edit** 与 `SquarePen`，Settings 仍为 `settings` 图标。简短提示与简单操作用 Dialog；删除或放弃未保存修改用 AlertDialog（叠在 Sheet 上时沿用既有 z-60/z-70 层级）。
- 首次/刷新统一 body 中央无可见文字 Spinner，表格不使用骨架屏；本页上方模块级 LoadingRegion 的首次 Skeleton 规则不适用于表格。其余行为及例外流程以仓库级规范为准。
- 组件参数与扩展业务接入见 [DataTable 说明](./data-table.md)，官方固定版本及必要适配见 [Web UI 来源](../web-ui-sources.md)。表格规范建立不等于所有现有调用方已按规范改造或通过用户验收。

## Studio 内容与会话边界

- chrome.storage.session 的 ui-session 保存 home/studio 位置及当前账号ID与Studio字符串路由；同一扩展会话内刷新和新标签页可恢复，重启浏览器后不保证保留。启动读取后再挂载，已打开标签页不因保存而自动导航。视图与路由串行合并写入，恢复路由按账号隔离，未知路由回退Overview；账号重置清理全部local（含旧ui），不清理session导航，业务页面局部状态仍按账号/重置版本失效，不保存令牌或业务数据，不同步云端。

- Studio 未登录时左侧菜单区复用官方 Empty，显示 Not signed in / Sign in to see your pages.，登录后替换为业务菜单；身份确认或读取失败不显示这个访客提示。


- 菜单由 pages/studio/routes.ts 的静态页面注册表维护，包含一级 Overview 与 Activity → Daily；菜单仅在确认登录后可见，登录后恢复当前账号的会话路由，缺失或未知路由回到 Overview；Activity 为 SidebarGroupLabel 文字标题，Daily 为带图标的 SidebarMenuButton 平铺项，按用户截图采用 dashboard-01 Documents 结构，不包含折叠箭头或子菜单缩进。
- Studio 统一处理账号状态：首次读取显示 Spinner；普通读取失败显示 Alert 和 Retry；未登录或会话过期显示 Empty、Sign in to Studio、Sign in to access your personal workspace. 和 Sign in 按钮，复用现有 LoginDialog。登录后才挂载当前业务页面，不按表格、图表或表单分别实现登录提示。
- 受保护内容以账号 ID 和既有会话重置版本作为 React key，退出、换号及同账号重新登录均使旧页面局部状态失效；Home/Studio 的 React Activity 保留不跨越账号内容边界。异步取消与迟到结果防护、边界外 Provider/后台/持久化状态仍由既有模块负责，不另建重置总线或按菜单增加清理分支。
- Daily 使用真实查询接口与 QueryDataTable；行末 Edit/Sheet 仅临时更新当前已加载记录，未写入账号。字段、筛选与编辑集中于 columns.meta；Daily 内容区弹性占满可用高度，筛选单行可横向滚动，表格与分页在视口内分层。Studio 非 Daily 内容区使用官方 ScrollArea 整页滚动。Home 图表仍走原有 API。具体行为见 [DataTable](./data-table.md)。

## 主题与 Token

- 基础层已按固定官方版本一次性对齐：`shadcn.css` 保存完整官网 Tailwind 扩展，`shadcn-theme.css` 保存完整标准主题骨架；两者来源与必要差异见 [来源记录](../web-ui-sources.md#一次性对齐-shadcn-基础层2026-11-08)。
- `theme.css` 是项目个性化取值的覆盖位置；`index.css` 负责导入顺序、data-theme 变体、项目额外映射与已确认圆角公式。标准 Token 映射不在多处重复维护，不能把官方默认值当成项目覆盖直接修改。
- 标准 chart-5 槽已补齐，以 muted-foreground 保持中性灰契约；不增加实际业务分类或改变 chart-1 至 4。新 2xl/3xl/4xl 圆角沿用固定基线公式，原有 sm/md/lg/xl 的项目公式保留。

- 官网组件迁入需一并核对源码、组合、基础 CSS、动画和 Token 依赖，不能只复制 JSX。全局 base 层采用官方 border-border/outline-ring 默认规则，dark 变体适配根 data-theme；tw-animate-css 提供实际使用的官方动画类。
- 核对并补齐实际依赖的 Token 契约，优先映射现有主题；不整套覆盖已确认的图表灰阶、材质或其他 Token 值。只有现有 Token 无法表达实际用途时才补必要个性化 Token，统一维护，避免业务调用方补颜色。

明暗主题由 `src/lib/theme/preference.ts 与 src/features/settings/theme.ts` 解析：默认 System，通过系统 `prefers-color-scheme` 跟随变化；选择 Light/Dark 后固定为对应主题。根 `data-theme` 持有实际明暗，组件与 Portal 继承原有语义 Token，不独立硬编码配色。Geist 字体、基础界面明暗色值、遮罩透明度与模糊保留；图表中性灰色阶按下文全局规范维护。

正式偏好保存在 `chrome.storage.local` 的 `settings.theme`，不同步设备；扩展页面同源 localStorage 的 `exts.theme` 只作同步首屏缓存。页面 head 通过 WXT 独立外部脚本 `theme-init.js` 在解析时读取缓存，使用与运行时相同的解析逻辑应用主题；不内联可执行脚本或放宽 CSP。主页面读取正式配置并订阅变化，继续监听系统主题，面板关闭后仍生效。

- Theme保存期间禁用整组主题按钮，仅将点击按钮的图标替换为既有StatusIcon loading；标记aria-busy并遵循减少动画偏好。不遮罩Settings，不禁用无关设置；保留请求成功后应用主题的行为，失败沿用错误Toast，finally解除禁用。重复点击当前主题不请求，pending期间同步拦截重复提交。

上述规范属于整个 extension，并非 Newtab 专属。无法访问扩展同源 localStorage 的网页内容脚本直接读取并订阅 `settings` 对象，取得主题与功能开关；旧 `exts.theme` 存储键迁入正式配置后移除。网页菜单在 Shadow DOM 中通过 `:host` 和 `:host(...)` 引用同一 Token。官方 Sonner 样式同时导入该 Shadow DOM，以支持提示的默认交互。

| 用途 | Token | 现行规则 |
| --- | --- | --- |
| 页面 | `background` / `foreground` | 页面与 Sheet 背景、正文 |
| 图块 | `card` / `card-foreground` | 书签与工具入口图块 |
| 浮层 | `popover` / `popover-foreground` | Tooltip 与菜单 |
| 状态 | `accent` / `accent-foreground` | 通用按钮与菜单状态 |
| 输入与辅助状态 | `input` / `secondary` / `secondary-foreground` | 输入轨道沿用 muted，辅助控件引用主题 |
| 危险状态 | `destructive` / `destructive-foreground` | 按明暗主题集中定义，供官方组件状态引用 |
| 边框与焦点 | `border` / `ring` | 分隔线、边框、焦点轮廓 |
| 图表分类与等级 | `chart-1` 至 `chart-4` | 全局中性灰色板，ChartConfig 与日历共用，不在业务组件定义颜色 |
| 无记录与空轨道 | `muted` | 日历 0 档、进度环背景共用 |
| 透明遮罩 | `overlay` | 浅色白色 42%，深色近黑色 62% |
| 遮罩模糊 | `--overlay-blur` | 8px |
| 图标缩放 | `--entry-hover-scale` | 1.06 |
| 入口上移 | `--entry-hover-lift` | -2px |
| 反馈时长 | `--duration-fast` | 160ms |

### 全局图表灰阶

以下是整个 Extension 的图表规范，后续图表与页面直接复用，不局限于 ActivityCard。Token 接口沿用 shadcn，具体中性灰数值是本项目批准的设计，不是官方默认彩色色板。

| Token | 浅色主题 | 深色主题 | 成长分类 |
| --- | --- | --- | --- |
| `--chart-1` | `oklch(0.64 0 0)` | `oklch(0.52 0 0)` | 运动 |
| `--chart-2` | `oklch(0.50 0 0)` | `oklch(0.66 0 0)` | 阅读 |
| `--chart-3` | `oklch(0.36 0 0)` | `oklch(0.80 0 0)` | 学习 |
| `--chart-4` | `oklch(0.22 0 0)` | `oklch(0.94 0 0)` | 创作 |

- 颜色唯一色源位于 theme.css，index.css 提供对应 Tailwind 语义映射；ChartConfig 直接引用 chart Token，禁止每个图表分别定义 HEX、透明度色阶或第二套颜色。日历 `--activity-level-1..4` 只能是 chart Token 别名，0 档为 `--muted`。
- 两个主题的相邻 OKLCH 明度步长均为 0.14，色度为 0；浅色逐档加深，深色逐档变亮。固定分类顺序用于跨图表识别，深浅不代表分类优劣或睡眠健康评分。
- 对比核算使用当前不透明 `card`（浅色 L=1 / 深色 L=0.17）及 `muted`（浅色 L=0.97 / 深色 L=0.22）。中性 OKLCH 的相对亮度近似为 L³，以 `(较亮Y+0.05)/(较暗Y+0.05)` 计算，结果四舍五入两位；这是数值核算，不是浏览器视觉验收。

| 主题与对照 | 第 1 档 | 第 2 档 | 第 3 档 | 第 4 档 |
| --- | --- | --- | --- | --- |
| 浅色 / card | 3.36:1 | 6.00:1 | 10.86:1 | 17.31:1 |
| 浅色 / muted | 3.08:1 | 5.50:1 | 9.96:1 | 15.87:1 |
| 深色 / card | 3.47:1 | 6.15:1 | 10.23:1 | 16.04:1 |
| 深色 / muted | 3.14:1 | 5.56:1 | 9.27:1 | 14.52:1 |

- 相邻档对比：浅色 1.78/1.81/1.59:1，深色 1.77/1.67/1.57:1。四档均达到本项目对当前背景/轨道至少 3:1 的设计目标，但相邻档并未都达到 3:1；不得据此宣称所有图表通过无障碍认证或只依赖颜色即可辨认。
- 提示中的项目名称、实际时长与固定顺序必须保留；数据色不用于小号文字。背景、轨道或色阶调整后重新核算；真实布局、小尺寸辨识与明暗主题由用户 Chrome/Edge 验收。不得为颜色验证新增像素、截图或模拟 DOM 测试。
| 反馈曲线 | `--ease-standard` | cubic-bezier(0.2, 0, 0, 1) |
| 图块圆角 | `--radius` | 16px |
| 图块尺寸 | `--size-icon-tile` | 64px |
| 阴影 | `--shadow-hover` / `--shadow-floating` | 入口反馈与浮层，随主题切换 |

## 共用语义样式

| 类名 | 用途与组合 |
| --- | --- |
| `blur-overlay` | 共用主题透明色和背景模糊；Sheet 全屏遮罩与 EDU 局部遮罩都引用它，位置、尺寸由组件决定 |
| `entry-trigger` | 标记实际链接或按钮，作为 Hover/Focus 的统一触发范围 |
| `entry-surface` | 入口图块：尺寸、圆角、边框、背景、焦点轮廓及上移阴影反馈 |
| `entry-glyph` | 入口图形：统一过渡属性和缩放；用于书签品牌图、Dock 工具图标和 EDU 锁图标 |
| `entry-glyph--lift` | 无图块入口的图形上移变体；用于 EDU 锁图标，让透明遮罩保持不动 |

书签和工具按钮使用 `entry-trigger` → `entry-surface` → `entry-glyph`。文件夹遮罩按钮使用 `blur-overlay entry-trigger`，图标使用 `entry-glyph entry-glyph--lift`，不额外添加卡片阴影或改变遮罩背景。
UI 文件夹属于轻度遮挡，使用 EyeOff；点击后切换为 Eye。EDU 属于固定四位码 `0000` 的界面锁，使用 Lock；点击后直接在文件夹内只显示官方 Input OTP 的四个 64px 密文密码块，与内部书签图块同尺寸，横纵间距和四周留白均为 16px，上下两行各两个分离输入位，不弹出对话框或额外提示。输满四位自动校验，错误即清空，正确后切换为 LockOpen；未成功解锁时点文件夹外部或按 Escape 退出输入并恢复锁。两者统一按图标交叉淡变 200ms、停留 200ms、整个遮罩淡出 200ms 的三阶段过渡解锁；悬停不切换图标，减少动态效果偏好下直接显示，刷新 Newtab 后恢复遮挡。成功解锁后焦点停在文件夹容器，不默认聚焦第一个书签；下一次 Tab 可进入书签。EDU 锁定期间书签不可键盘聚焦或打开；此码仅是界面门槛，书签内容并未加密，不能作为安全防护声明。交付边界见[当前 Issue](../changes/issues/2026-10-26-extension-folder-access-issue.md)。

入口 Hover 与键盘 Focus 共用规则。保持当前即时缩放与上移效果：过渡属性只包含 `filter`、`transform`，图块另外包含边框和阴影；CSS 独立 `scale` / `translate` 不单独补充平滑过渡。若后续调整动效，修改这里的共用规则，不在某个组件单独添加 `transition-transform`。

减少动态效果开启时禁用入口缩放、上移和动态阴影，保留清晰的焦点轮廓。不要在组件中复制缩放比例、上移距离或遮罩模糊值。

## 组件边界与约定

- 扩展内的编辑类 Sheet 采用一致的标题栏：56px 高、两侧按现有 Settings 标题栏间距、Lucide 编辑图标与 **Edit** 标题；该视觉与文案规则维护在本应用 UI 规范。具体字段、校验和保存流程归所属业务组合层，表格行编辑仍由 `custom/data-table` 管理，不另抽全局编辑表单组件。
- 通用 `Button` 保留官方 variant 与常见状态；普通 ghost 反馈不变。Dock 工具按钮复用 `variant="entry" size="entry"` 透明外壳，实际反馈由内部 `entry-surface` 承担，不在调用方复制同套参数。
- EDU 保留默认模糊和点击解除逻辑，Hover 背景不变、指针为手形；其 hover 背景引用同一个 `overlay` Token，覆盖 ghost 默认背景变化。
- Settings 与 Download 使用右侧 Sheet：共用组件统一维护默认宽 420px、最大不超过屏幕，调用方不重复写宽度。Header 高 56px，均显示对应 Lucide 图标与标题，关闭按钮提示为 `Close`。Download 正文展示下载记录；Settings 正文包含 General 和 Features 两区，分区标题为 14px／font-medium，设置项标题沿用官方 DropdownMenuItemTitle 的 14px／font-medium。Settings 正文父容器统一设置 24px 内边距及 24px 分区间距，子分区不叠加外侧内边距；两区之间不用 Separator，不叠加 Browsing history 标题；两个 Header 下方均保留分割线。 用户最终选择恢复此原样式，仅在共用右侧 Sheet 增加左上／左下 rounded-l-[var(--radius)]，当前为 16px；右侧直角贴边。
- General 的 Theme 行使用官方 ToggleGroup 单选组合，Light/Dark/System 分别用太阳、月亮、笔记本（LaptopMinimal）图标，默认 System；图标不带可见文字，使用可访问名称与现有 Tooltip 提示名称，始终保留一个选项。控件的主题状态不进入 components/ui。
- ToggleGroup 单选项以 `aria-checked` 显示激活状态，选中背景使用官方 accent、图标使用 accent-foreground，不增加高反差主色选中块。Tooltip 组合也使用 data-state，因此不得仅凭该属性表达单选反馈；选择判断仍由官方控件负责。
- 共用 `Switch` 可操作时显示手形指针，禁用时显示禁止指针；在组件内统一维护，不在设置调用方重复指定。
- Media Download 的记录列表由 features/media-download/records 持有，Sheet 由 pages/download 组合，Dock 保留一级入口。Settings 的 General／Features 采用官方 Card、ItemGroup、Item、ItemSeparator 的圆角边框列表，标题置于框外。Media Download 只有一个总开关，独立箭头通过官方 Collapsible 展开默认收起的三个只读子项；仅主项保留问号，子项无问号。界面文案使用英文，TG 状态为 Enabled／Disabled，X／Helper 显示 Not integrated。设置界面与 Sheet 归 `pages/settings` 与对应 feature，`pages/dock` 只组合入口并协调入口提示，设置界面订阅公共 settings 数据，不在其中展示下载记录；保持官方折叠状态与焦点管理，不另写展开状态逻辑。
- 历史清理区域使用官方基础的 `Switch`，通过 `checked` / `onCheckedChange` 连接状态，保留可访问名称与说明；默认关闭，加载、授权和保存期间禁用重复操作，失败通过共用 toast.error 提示。配置和权限变更同步到已打开页面，不把业务状态放入通用组件或新增全局设置状态。
- 历史清理开关标题旁的圆圈问号复用 Button/UiIcon/Tooltip，帮助提示完整保留原说明，最大宽度 280px、优先向上显示并支持换行；独立按钮不切换开关，读屏描述通过常驻隐藏文本保留。错误不放进 Tooltip。
- Sheet 内容、边框与分隔线使用根主题；全屏遮罩使用 blur-overlay，阴影使用项目 Token。打开／关闭动画恢复为 200ms／160ms，减少动态效果遵循全局规则。
- Tooltip 提供名称或简短帮助说明，使用单一全局 Provider；入口通过 `asChild` 组合为唯一交互元素。Dock 的 Account（登录框与账户菜单）、Actions、Settings 与 Download 打开弹出层时不显示入口 Tooltip，关闭恢复焦点不自动弹出入口提示，后续正常悬停仍可显示；四个入口通过 Dock 局部 useDockOverlay 共用处理，面板内部提示正常使用。Settings 与 Download 打开时仍由各自面板将焦点放到标题。关闭自动恢复焦点阶段，入口标记 data-restored-focus 并仅抑制该阶段的描边；不取消默认焦点恢复。入口失焦、指针按下或主动键盘操作后清除标记，正常键盘聚焦仍有描边。
- 品牌图标由 `components/custom/brand-icon.tsx` 负责；Newtab 书签、Dock 收藏及其复用入口随主题切换黑白，不再按站点配置 original、adaptive 或 neutral。普通书签透明背景、单色主体，浅色显示黑色、深色显示白色。通用图标由 `UiIcon` 显式静态导入。
- UI 文件夹图标沿用原始几何、viewBox、线宽与留白，移除灰阶和渐变；白色覆盖形成的必要孔洞通过黑白遮罩转成真正透明区域，再统一主题转换，避免整体滤镜压平镂空。不套用 V3 重绘或统一坐标要求，不维护深浅两套源稿。
- Grok 书签移除固定底板、保留主体路径。Exts 按用户最新确认保留正式完整外形及底板，浅色黑底白图、深色白底黑图；沿用现有内嵌正式 PNG 的 SVG，不重绘外形、不替换为仅含内部主体的源稿，也不对其应用压平对比的 brightness 滤镜。此主题反转仅用于书签，品牌唯一源稿及三端应用图标保持原样。此次交付见[书签单色 Issue](../changes/issues/2026-10-26-extension-bookmark-monochrome-issue.md)。
- Dock 左侧保持 favorites，右侧 tools 顺序为 Studio、Actions、Download、Account、Settings。Studio 使用现有 Button entry/entry 与 Tooltip，固定 PanelsTopLeft，提示 Open Studio，点击只进入 Studio；不维护 pressed 或选中背景，悬停反馈复用共用入口样式。Dock 仅在首页显示，Studio 通过独立 Home 按钮返回，页面位置记忆保持不变。
- Newtab 与 Studio 的已登录 Account 共用菜单内容，条目为 Account、Notifications、Settings、Log out；Account 与 Notifications 保持占位，移除 Billing。Settings 关闭菜单并打开现有 SettingsSheet，复用设置内容与读写逻辑，关闭后恢复到各自账户入口；保留菜单原有弹出方向及 Dock 独立 Settings 入口，未登录流程不变。
- Studio 采用官方 dashboard-01 的 inset/offcanvas 侧栏、SidebarInset 与顶部导航；Home／Studio 继续由 React Activity 保留状态和 DOM。Dock 只随 Home 显示，Studio 独占视口，没有有效本机偏好时默认 Home，同一扩展会话内新标签页恢复 ui-session.view 保存的 Home/Studio 位置。登录后左侧展示 Overview 和 Activity → Daily，按账号恢复会话路由，缺失或未知路由回到 Overview；未登录显示独立 LoginRequired，受保护内容仍沿用上述共用账号边界。Home 原 ActivityCard 的数据、外观和行为保留。
- 品牌头部保留官方示例 32px 标识与两行文字比例，Exts SVG 与 Exts/Studio 使用普通非交互排版，不重绘或叠加底板，不带链接、点击事件或按钮角色。右侧独立使用官方 Button ghost/icon-sm、House 与 Tooltip 作为唯一返回入口，Logo 不可点击；收起时沿用官方 offcanvas，品牌和 Home 随侧栏一起隐藏，窄屏先打开侧栏后访问同一按钮。正文顶部只保留官方 SidebarTrigger、Separator 和 Studio / Activity / Daily 面包屑，不保留 Home 文字按钮、Overview 层级或额外边框。
- Account 未登录时显示 UserRound / Account / Not signed in；点击打开官方 Dialog，登录内容来自简化 login-03，首行不显示 Logo/Exts 品牌，采用官方 Welcome back 标题与 CardHeader text-center，说明为用户指定的 Login with your Github or Google account。仅保留 Login with GitHub / Login with Google，不包含邮箱、密码、注册、其他方式或无效条款链接，不自行改写官方标题或增加品牌行。GitHub 通过 Neon 官方 SDK 与 identity 窗口授权，期间按钮显示 Signing in… 并阻止重复操作；Google 仍可点击并 toast.info 提示暂未接入。会话初次读取显示 Checking account…；成功后侧栏显示真实头像和昵称/邮箱，账户 Dialog 沿用 Card/Title/Description 组合显示账户与 Sign out，退出期间显示 Signing out…。加载、登录与退出失败直接使用共用 Sonner，取消为信息提示，不插入内联错误或另建通知层。未登录进入 Studio 不受阻，关闭框继续使用原 Studio；账户 Tooltip 在框打开时隐藏，弹框焦点与关闭由官方 Radix Dialog 管理。真实登录与会话行为由用户在 Chrome/Edge 验收，不将自动化结果视为实际授权通过。
- Sidebar 主题语义映射现有 surface-raised、foreground、accent、border、ring 和 primary，不另设深浅主题；官方内部滚动、图标折叠及 768px 移动端断点沿用。SidebarProvider 不重复挂载 TooltipProvider，不写入示例 cookie，折叠状态仅在当前页面内保留；当前正文为官方 Empty。Account 使用官方 32px Avatar/Fallback、双行文字及尾部 ChevronsUpDown，副标题和间距沿用官方；Fallback 内为静态 UserRound，无假用户头像。登录表单恢复官方 FieldGroup/Field、CardTitle/Description，Card 保留默认边框、背景与 shadow-sm；Dialog 定位外壳透明无阴影，保留可访问语义、关闭按钮和全局 blur-overlay，避免重复卡片材质。Button outline 在共用组件显式使用既有 border-border，不在登录处重复覆盖颜色，不改变主题变量值。
- Actions 沿用向上的官方 DropdownMenu，只有带 List / FolderOpen 的 Placeholder A / B；复用官方 Hover、焦点、键盘与选中关闭行为，onSelect 仅调用 toast.info 显示「暂未接入」，不执行业务功能。Media Download、Actions 的入口未迁入 Studio；Settings 通过共享账户菜单打开现有抽屉。Newtab 根部仍只挂一份复用主题的右下角 Toaster，供菜单、静态账户和下载面板共用，业务继续决定提示文案，不新增通知管理层。Components 旧菜单已移除，资源收藏只保留在 UI 文件夹。
- 字号、页面列数、具体宽高、位置与排版仍由现有组件负责；本次不建立全站布局框架或额外组件层。

## 验证与变更

### Newtab 区域布局

- Dock 中间分割线使用官方 Separator，局部设置高 48px、垂直居中；宽度沿用官方 1px，颜色引用 border Token。
- 页面级布局在 `src/pages/newtab/newtab.css`，只作用于 Newtab；保留 24px 外圈留白，内部左右间距及上方区域与 Dock 间距均为 24px。
- 页面使用两行网格，上行为左右两列，下行为 Dock；上行使用剩余高度，左右各自通过官方 Scroll Area 滚动，溢出不传播到页面或相邻区域。Dock 仍按内容宽度居中，最大不超过底部可用宽度，撑满后通过官方 Scroll Area 与水平 ScrollBar 滚动。
- 上行外层提供完整可用宽度，ResizeObserver 监听该层；按左侧实际项目宽度、数量及间距模拟换行，取最宽一行确定左栏占宽，再将左栏、24px 分栏间距和固定右栏整体居中。随窗口宽度变化自动更新，不设置整体固定最大宽度；末行左对齐，右侧卡片仅纵向排列。极窄窗口沿用区域内部溢出约束，不压缩右侧或将其移到左栏下方。
- 首页文件夹预览框横向间距为 24px；纵向预览框边缘之间总共 32px，由名称前 8px、名称固定单行行高 16px 和下一行前 8px 组成。长名称单行省略，规则限定在 `.newtab-bookmarks`，不改变其他场景。
- 文件夹外框基准为 `--size-bookmark-folder`，由两枚 `--size-icon-tile`、内部 16px 间距、两侧各 16px 内边距与两侧各 1px 边框计算，默认 178px；文件夹宽度与右侧日历卡片高度引用同一基准，右侧列宽为两个基准加 24px，默认 380px。
- UI 文件夹放在 EDU 前，沿用两列图标网格与默认模糊机制；高度固定为文件夹外框基准，更多内容在官方 Scroll Area 内纵向滚动并阻止滚动传播。按用户批准仅隐藏该文件夹内的滚动条，其他文件夹与页面滚动条保持既有行为。
- UI 上下两端各用 16px 高的绝对定位提示层，贴边 3px 使用 card 背景色盖住内部图标边框，再向内容侧渐隐；复用 overlay-blur，磨砂和背景由同一线性蒙版渐隐，上下镜像，保留文件夹自身外边框。次要前景色 ChevronUp 与 ChevronDown 单独显示、不受蒙版影响；对应方向还有内容时才显示，顶部只有下提示，中间两个都有，底部只有上提示。默认模糊或无溢出时都隐藏，不占布局、不额外预留空间，保留网格原有内边距。不依赖 Hover，不响应点击或阻挡滚动；判断由文件夹局部监听滚动与尺寸变化，卸载后清理。
- 右侧首卡采用官方 Card 基础，按批准的文件夹外框效果组合主题圆角、16px 内边距和无阴影。右侧卡片间距为 24px，卡片区域统一滚动。
- ActivityCard 由 `features/activity` 持有，Home 的 cards 区域只引入展示；卡片尺寸和材质保留，首行高 32px，使用现有 outline/sm/spacing=0 ToggleGroup，切换为 CalendarDays、ChartColumn、ChartPie，名称为 Calendar／Chart／Pie chart，宽度沿用 36px。
- 固定活动记录当前仅保留2026-11-01和2026-11-02。两日睡眠均为5.5h，运动0h/0.5h、阅读0h/0h、学习0h/1h、创作0h/0h；其他日期无记录。数据仍以分钟维护，不提供录入或持久化。
- 三个视图切换入口按内容模块命名：Check-ins（打卡日历）、Trends（成长与睡眠趋势）、Summary（周投入与计划）；Tooltip与可访问名称一致，内部视图值与切换行为保持。
- 默认 Calendar，重复选择不能取消至空值；Tooltip 与组件状态机制保留。Calendar 保留完整 24 周网格、每格 12px、间距 2px、周日开始及未来日期留白；运动、阅读、学习、创作每日各累计满 30 分钟完成一项，0–4 项分别使用 --activity-level-0 至 4，仅映射全局 muted/chart 色源，不维护第二套颜色。参数与核算以本文件“全局图表灰阶”为准。
- Chart 内容高 96px，固定最近 14 个自然日。右上角复用 ChevronsUpDown 图标 Button ghost/icon-sm 点击直接轮换成长/睡眠。成长每日实际时长堆叠，从上到下为运动/阅读/学习/创作，分别对应 1/2/3/4 档；不足 30 分钟仍显示实际投入，Tooltip显示日期及四项时长，不显示合计或完成数。睡眠只保存每日总分钟，<6h、6–<7h、7–9h、>9h 对应 1–4 档；缺失留空不计 0，虚线固定在7小时且无文字标签，不计算均值。深浅只表达时长范围，不表达健康评分。
- Pie 内容高96px，左右两列等宽，依次为本周投入实心饼图、四个周计划同心环，各自在列中居中（雷达图已移除）。周日至周六，顶部不显示日期范围标题；四项从12点顺时针、同心环从内到外均为运动/阅读/学习/创作。目标分别180/300/1200/180分钟（运动3h、阅读5h、学习20h、创作3h）；计划环为0–100%域，超额图形封顶、Tooltip保留实际百分比。无投入显示英文空状态 No activity this week，环背景引用0档。两图均无常驻标题，保持原卡片宽高、图形半径和列间距16px。
- Activity 从后台认证的 /api/activity/days 读取本人数据，移除固定模拟 JSON；不提供页面录入或数据持久化/查询缓存。字段缺失与 null 保留未记录语义，0 为已记录零。请求在登录初始化及三种视图切换时触发；Growth/Sleep 只切换字段，Home/Studio、窗口聚焦、跨天不额外请求。Provider 在隐藏边界外保留当前展示状态；退出或切换身份不显示旧数据，完整本地存储重置在独立后续工作项实施。图表在所有状态始终保留，无数据、未登录、加载或失败使用图表本身的空数据表现；不以 Empty、图标、大标题、登录文案或无周投入文字替换图表。失败只由业务直接调用现有 Sonner toast.error「加载失败」，不增加通知包装器或重试交互。
- 柱状图横轴每柱显示日号（1、2、…、31，不显示月份与前导零）。活动卡片内四种数据视图统一复用 ChartTooltipContent 的外观与行布局；日历仅由官方普通 Tooltip 提供触发/定位，局部使用 disableHoverableContent，避免相邻小格触发被鼠标过渡区域阻挡。不改其他模块 Tooltip。
- 横轴预留 28px 容纳默认 tickSize、6px tickMargin 和日号文字，避免文字在 SVG 底部被截断；保持图表 96px 和原卡片高度不变。
- 柱状图外轮廓统一4px圆角，数值集中在components/ui/chart.tsx的CHART_BAR_RADIUS，避免SVG数值属性与CSS变量重复维护。睡眠直接用Bar.radius，成长用Recharts官方BarStack.radius，内部各Bar不单独圆角，保留色块直角接缝。缺项、单项和较薄端部沿用官方整体裁切，不自写图形或逐项拼接圆角。
- 趋势分类入口为既有 Lucide ChevronsUpDown，Button ghost/icon-sm（32px）；不显示常驻分类文字，普通控件 Tooltip 以 Growth/Sleep 表示当前分类；点击直接轮换两个分类，不打开菜单。
- 成长增加当前 14 个自然日总投入 / 14 的平均时长虚线，无投入日按 0 计；睡眠仍为固定 7 小时。两线无常驻文字，当前 ReferenceLine 不提供独立 Hover 提示，不混同柱子的每日数据提示。
- 成长与睡眠共用同一日期窗口：从上海业务今天往前第14天至昨天，共14个完整自然日，不包含今天；均值只计算该窗口。日历和本周统计继续按各自原有范围，不受趋势窗口影响。业务日期固定 Asia/Shanghai，不随设备时区切换。
- 周视图左侧按用户最新提供的 ChartPieSimple 使用实心 Pie，不设置 innerRadius；移除左右“投入/计划”可见标题，保留可访问名称。左侧按项目固定 chart-1..4，右侧计划环按完成比例分档：0%为muted，(0,25%]为chart-1，(25%,50%]为chart-2，(50%,75%]为chart-3，>75%为chart-4；超额保持4档。四个环的颜色不绑定项目，仍以内到外固定顺序和统一 Tooltip 识别项目。
- 活动卡片时长统一为小写h，小时值最多一位小数，整数移除末尾.0，如0h、1h、1.3h；内部分钟数据和达标判断不变。日历/柱状图只显示MM-DD日期及明细，无合计或完成数行。周投入明细为“百分比 / 投入时长h”，如30% / 5h；周计划明细为“完成率 / 目标时长h”，如120% / 10h，不显示实际/目标比值。
- 周视图Tooltip标题为“W<周号> Spent”和“W<周号> Plan”，两图使用同一个实际周号（周日开始，包含1月1日的一周为第1周），不显示日期范围或progress字段。原生图表Tooltip的active/payload仅用于判断是否显示与当前悬停项目；展示数据始终按运动/阅读/学习/创作完整四项排列（含0值）。当前项名称和数值均使用font-semibold，其他行正常字重；投入显示占比/投入时长，计划显示完成率/目标时长。外框、间距和标题沿用同一官方ChartTooltipContent。

- 数据提示统一由共用 ChartTooltipContent 维护：w-max 按内容取宽，最小宽度120px，不设固定宽高；whitespace-nowrap 禁止文字自动换行，数据行不启用 flex-wrap。内边距使用全局 Tailwind p-4（当前16px，与活动卡片一致），不在各图调用方覆盖。日历仍以透明无内边距外层承载该内容，标题与各数据行保留独立行；普通按钮、帮助及文件名 Tooltip 不受影响。睡眠显示名为 Sleep；四项显示名统一为 Exercise/Reading/Learning/Creation，底层分类键与目标不变；提示日期仅显示MM-DD，数据键仍保留完整年份。

### 验证边界

修改共用规则前检查所有使用方，更新本文和对应 Issue。只验证逻辑、配置、类型与构建，不增加源码形状断言、假 DOM 或视觉交互测试。

视觉、悬停、焦点、Portal、明暗主题和窄视口由用户在 Chrome/Edge 加载实际产物验收；自动化通过不等于用户验收通过。未来扩展样式时按真实用途复用以上规则，不把官网的不同交互强制合并。

Tooltip 共用默认 sideOffset 为 4px，用于设置名称与帮助提示；Dock 调用方显式使用既有 12px，不随默认值改变。位置由 Radix 计算，不手写坐标。

## 临时 Toast 提示

### 共用状态等级

状态图标使用 src/components/custom/status-icon.tsx，基于现有 UiIcon 静态映射。官方 DropdownMenuItem 用于行布局、Badge 用于标签、Sonner 用于临时通知，均不提供本需求所需的独立状态 SVG 等级映射，因此按用户批准提供此最小组件，不重写官方 Tooltip 或通知逻辑。

| 等级 | 状态图标 | 语义 |
|---|---|---|
| success | CircleCheck | 已启用、已连接、已完成 |
| neutral | CircleMinus | 已关闭、未启用 |
| pending | CircleDashed | 未接入、未配置 |
| loading | LoaderCircle | 正在读取、连接或处理 |
| warning | TriangleAlert | 受限、需要处理 |
| error | CircleX | 操作失败、连接异常 |

统一 16px、既有线宽与 muted-foreground，沿用主题颜色，不增加红绿等级配色；loading 使用旋转并尊重减少动画偏好。业务负责映射等级及提供英文 Tooltip／读屏文案，组件只展示图标，不读取业务数据。Media Download 子项名称保留，右侧以此图标替代文字状态，鼠标悬停或键盘聚焦显示业务自有 Tooltip。Toast 与状态图标共用等级含义，Toast 继续沿用现有官方图标与 API，不新增等级通知封装。

### Toast 使用规则

扩展各模块统一从 src/components/ui/sonner.tsx 导入 Toaster 和原生 toast API，复用 shadcn 官方 Sonner 展示组件、Lucide 图标和现有主题。通用组件维护各自页面视口右下角位置、图标映射和外观；业务不覆盖位置、图标或品牌配色，不分别手写提示框、关闭定时器或折叠逻辑。TG、Newtab 和后续 X 使用同一套规则。

提示采用“等级图标 + 提示语”，不增加第二层 description。内容使用现有主题文字与背景，通过图标区分等级，不启用彩色 richColors。长文案可自然换行，不为单行展示裁掉重要反馈。

| 类型 | 调用方式 | Lucide 图标 | 适用场景 |
| --- | --- | --- | --- |
| 成功 | toast.success | CircleCheck | 操作已成功完成，例如下载完成 |
| 信息 | toast.info | Info | 普通状态说明，例如尚未接入 Desktop |
| 警告 | toast.warning | TriangleAlert | 需要用户留意或处理的状态；不因此新增当前模块的触发条件 |
| 错误 | toast.error | OctagonX | 已触发操作失败，例如下载记录清空失败 |

业务模块持有文案、等级、完成条件等状态；不在共用 UI 中加入 Chrome API、下载记录、跨页面通知管理或重复消息包装器。不同页面/Shadow DOM 各自挂载 Toaster，多条提示沿用 Sonner 默认折叠堆叠与关闭行为，互不转发。用户可见提示语统一使用英文；共用 `sonner.tsx` 为每条 Toast 提供右侧官方 outline 图标按钮（与 DataTable Columns 触发器同款 `Button`，Lucide Copy，成功后短暂 Check），复制当前可见英文文案；悬停/键盘提示与 Columns 相同采用官方 Tooltip，固定显示 `Copy`，`aria-label` 为完整英文说明（成功后可显示 `Copied`），并通过 Toaster/`pointer-events` 规则避免点击穿透到页面控件。

Settings 的加载、保存与权限操作失败统一使用根部现有 Toaster 的 toast.error，不在设置行追加错误段落；共用英文文案集中在 src/features/settings/messages.ts，调用方直接使用官方 API，不包装新的通知服务。Toast 不复制内部异常细节；保留必要的正式异常日志，临时排错日志结束后清理。此规则不改变已有 TG 下载仅成功提示的专属约定。

TG 下载仅在文件流关闭成功后调用 toast.success，显示成功图标和 “Download complete.”，不再描述文件名；文件名保留在 Download 记录。开始、进行中、取消和失败不显示 Toast。后续 X 必须复用同一组件和位置，实际触发条件由其独立 Issue 决定，不代表本次已接入。

## Activity 翻页倒计时

- 首页卡片区上方为ActivityCard，下方左对齐组合TimerCard；不新增 Studio 页面。TimerCard 宽高为 --size-bookmark-folder（默认178px），左边缘与上方日历对齐，日历仍保留原有整块宽度。
- 外层保留固定文件夹尺寸、border、主题背景、rounded-[var(--radius)]与shadow-none；左右与底部16px、顶部8px，操作行32px、行间8px。官方32px按钮内图标高16px，补偿内部上下各8px后，图标可见边缘至外框顶部/数字牌顶部均为16px，数字牌下方16px。Slider拇指12px、轨道4px沿用官方居中，对应边缘空白比16px分别多2px/6px，不修改官方尺寸。卡片之间使用NewtabCards的gap-8（默认32px），与左侧文件夹两排外框间的8px名称前距＋16px名称＋8px行距一致；水平分区间距保持原值。
- 默认根字号 16px 时，--size-bookmark-folder = 2×64 + 48 + 2 = 178px。去除两侧 16px 内边距及 1px 边框，内容宽 144px。顶部操作行32px，点击区域保持官方大小；右侧为官方Button ghost/icon-sm（32px），间隔12px，Slider余宽约100px。
- 时钟HH:mm与倒计时MM:ss共用两张等大双位卡和中间冒号，统一字号32cqw。内容宽144px，两个6px间隔加6px冒号，余126px均分，单卡63px宽，高度填满剩余空间，默认112px（178−2边框−8顶部−32操作行−8行间−16底部），不再使用固定宽高比或额外垂直居中；Geist Sans 600数字保持横向宽度，文字层纵向缩放2.5，布局和翻页层不缩放；切换只变内容，位置和尺寸不变。
- Slider 手动5分钟步进；松开自动开始，再拖动替换；右侧不显示时间，改为Clock/Timer模式图标；倒计时卡片按秒显示分秒；运行受控值按50ms采样截止时间缩回，不按分钟跳变。无开始、暂停、重置、额外0/60标签。
- 字体、颜色和圆角复用现有主题。数字翻页为200ms旧上页折下+250ms新下页展开，结束后更新静态下页；分缝1px，无额外阴影。
- 状态只在当前 Newtab 的 TimerCard/use-countdown 中，Home/Studio切换不重置；刷新、关闭清空，多标签各自独立，不写session/local，不累计Activity记录。
- 滴答与完成音均由Web Audio本地合成，默认Metronome＋Harp；归零只触发一次英文Toast和结束音，不发送系统通知、不请求通知权限。
- 休眠或冻结可能延后提示音和Toast；这不是后台系统闹钟。声音、布局与实际交互留给用户Chrome/Edge验收。

- 模式补充：Slider右侧使用既有官方Button ghost/icon-sm与Tooltip，显示当前模式Timer/Clock图标。点击切换时清空倒计时并停止声音，Clock模式显示系统本地24小时制HH:mm，不显示秒数，不播放滴答；再次点击自动从25:00开始倒计时，不恢复旧值。拖动Slider自动切入倒计时。
- 时钟每分钟边界重读系统时间，数字变化才翻页；恢复页面可见性或Home后立即校准。时、分各一张双位翻页卡，中间冒号，字体按内容容器32cqw；倒计时改为同样的两张等大双位卡，分秒变化节奏与翻页时序不变。默认展示系统本地HH:mm，无新增时钟权限或存储。

- 计时卡片右键使用官方Base Context Menu默认分组/勾选；计时音Metronome在前、Brown Noise在后，完成音Harp在前、Glass Chime在后。Timer Sound：Metronome、Brown Noise；Completion Sound：Harp、Glass Chime。两组各两项，各组单选或全不选，默认Metronome＋Harp。官方CheckboxItem受控勾选，再选同项取消并停止声音；选择后菜单保持打开。按用户最新要求不显示声音播放图标或试听动画，保留官方默认勾选。
- 本机偏好分别保存在chrome.storage.local的timer.tickSound与timer.completionSound，不写云端；null表示该组静音，刷新后保留，完成音关闭仍显示归零Toast。多个Newtab通过storage.onChanged读取一致偏好，Home隐藏后重新显示会重读。缺失或非法值回到默认。仍遵循现有账号重置清理local规则，不扩大修改认证逻辑。
- 选择后立即试听：滴答3次、连续噪声3秒、完成音1遍。试听取消旧音源与旧试听，暂停原滴答；结束恢复当前计时滴答，真正归零时优先结束当前试听并播放完成音；全程不修改截止时间。无计时时试听后释放音频上下文，切模式或关闭页面也释放。
- 偏好读取/保存失败使用英文toast.error并保留正式错误日志；声音试听不另发Toast。真正到时仍仅有共用完成Toast和所选完成音。

- 计时音仅保留Brown Noise与Metronome；Brown Noise在倒计时运行时持续循环，不按秒触发。本地合成8秒双声道缓冲区，50ms首尾交叉过渡并从50ms处循环，带淡入；采样RMS目标0.18、峰值上限0.7，再经既有0.35主音量输出。无下载或新增依赖。
- 连续噪声选择后试听3秒，计时中试听结束恢复连续播放；切回时钟、取消、归零或关闭页面立即停止，归零再播放所选完成音。旧rain、pink、quartz偏好按非法值回退Metronome，旧warm完成音偏好回退Harp，保留完成音偏好，不重置截止时间。

## Studio 品牌头部

- 顶部采用sidebar-07的SidebarMenuButton lg官方组合，直接复用32px Exts品牌资源，不新增圆角或背景容器，保持SVG自带外形；两行文字为Exts（text-sm/font-medium）和Ideas into action（text-xs），使用官方leading-tight、gap-2与p-2。
- 品牌区域渲染非交互div，不提供下拉、团队切换或返回行为。右侧独立官方Home按钮保持ghost/icon-sm及原Tooltip；offcanvas、窄屏Sheet、菜单、登录与底部账号入口不变。

- About 位于 Account 账户菜单 Settings 下方，复用官方 DropdownMenuItem 与 Dialog，展示既有 Logo、Exts、Ideas into action 和 Manifest 动态版本（根产品版本经 WXT 构建写入）；内容居中，版本只显示数字；底部 Built by Lin Gui 与 Source on GitHub 分别链接 https://x.com/lingui_dev 和 https://github.com/linguio/exts，不展示 Vercel 或 Website / Changelog 按钮。初始聚焦标题，保留关闭按钮的键盘焦点样式，不另存版本状态。

- Studio 账户界面统一位于 `pages/studio/account`：`index.tsx` 侧栏账户入口、`menu.tsx` 共享账户菜单、`login-dialog.tsx` 登录弹窗、`login-required.tsx` 未登录提示、`state.ts` 展示状态、`about-dialog.tsx` 关于弹窗；Dock 引用同一实现。

- Dock 与 Studio 的 Account 菜单统一固定 200px，不跟随触发按钮宽度；沿用官方内边距，长账户名称和邮箱省略展示。

- About 比例：最大宽 400px、内边距 24px，Logo 48px、名称 20px、描述 14px、纯版本号 12px；分区间距 24px，页脚 12px 单行 `Built by Lin Gui · Source on GitHub`。窄屏保留官方 Dialog 视口留白。

- About 不展示分割线，品牌区与页脚以 24px 留白分隔；Source on GitHub 整段可点击，仅 GitHub 使用下划线。
