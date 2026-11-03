# 扩展界面样式规范

适用于 `apps/extension`。覆盖全部扩展 Web UI，现有场景包括新标签页书签、Dock 工具、Settings Sheet 与 EDU 遮罩；Dock 基础规则见[对应 Issue](../changes/issues/2026-10-15-extension-newtab-dock-issue.md)，历史清理设置区域的交付与验收状态见[历史清理 Issue](../changes/issues/2026-10-16-extension-history-cleaner-issue.md)。

## 维护位置与职责

- `apps/extension/src/styles/theme.css`：整个 extension 的主题 Token 唯一实现位置，Newtab 与网页注入界面共同引用。
- `apps/extension/src/styles/index.css`：导入主题 Token，集中维护字体、共用语义样式和减少动态效果规则。
- `apps/extension/src/shared/ui/`：以 shadcn 官方源码为基础的通用组件，不包含书签或 Chrome API 业务逻辑。
- `apps/extension/src/modules/<功能>/`：持有对应功能的布局、内容、状态和操作；history-cleaner 持有设置区域与业务，Newtab 只组合设置区域。
- 本文维护用途、参数与组合约定；不在模块 README 再维护一份样式规则。

组件选型遵循根 [AGENTS.md](../../AGENTS.md#web-ui-选型与风格)。固定来源和逐项定制差异见 [Web UI 来源](../web-ui-sources.md)，不把 Radix 包装或组件数量少当作采用官方源码的依据。

滚动区域也按上述通用 UI 规则选型，优先采用官方 Scroll Area 与默认滚动条，不在业务模块各自维护滚动条样式。当前已接入 Download、Settings、Newtab 书签区、卡片区与 Dock；具体交付与验收状态见对应 Issue。

迁入官方组件保持修改前已确认的视觉效果；小差异沿用官方，明显差异保留必要定制，不逐像素复刻。用户于 2026-10-28 最终要求 Download／Settings 恢复试用前的整套 Sheet 样式，保留 420px 和模糊遮罩，仅新增复用 --radius 的左侧圆角；不保留官方默认视觉试用方案。

## 主题与 Token

明暗主题由 `src/shared/theme/` 解析：默认 System，通过系统 `prefers-color-scheme` 跟随变化；选择 Light/Dark 后固定为对应主题。根 `data-theme` 持有实际明暗，组件与 Portal 继承原有语义 Token，不独立硬编码配色。Geist 字体、基础界面明暗色值、遮罩透明度与模糊保留；图表中性灰色阶按下文全局规范维护。

正式偏好保存在 `chrome.storage.local` 的 `settings.theme`，不同步设备；扩展页面同源 localStorage 的 `exts.theme` 只作同步首屏缓存。页面 head 通过 WXT 独立外部脚本 `theme-init.js` 在解析时读取缓存，使用与运行时相同的解析逻辑应用主题；不内联可执行脚本或放宽 CSP。主页面读取正式配置并订阅变化，继续监听系统主题，面板关闭后仍生效。

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

- 通用 `Button` 保留官方 variant 与常见状态；普通 ghost 反馈不变。Dock 工具按钮复用 `variant="entry" size="entry"` 透明外壳，实际反馈由内部 `entry-surface` 承担，不在调用方复制同套参数。
- EDU 保留默认模糊和点击解除逻辑，Hover 背景不变、指针为手形；其 hover 背景引用同一个 `overlay` Token，覆盖 ghost 默认背景变化。
- Settings 与 Download 使用右侧 Sheet：共用组件统一维护默认宽 420px、最大不超过屏幕，调用方不重复写宽度。Header 高 56px，均显示对应 Lucide 图标与标题，关闭按钮提示为 `Close`。Download 正文展示下载记录；Settings 正文包含 General 和 Features 两区，分区标题为 14px／font-medium，设置项标题沿用官方 ItemTitle 的 14px／font-medium。Settings 正文父容器统一设置 24px 内边距及 24px 分区间距，子分区不叠加外侧内边距；两区之间不用 Separator，不叠加 Browsing history 标题；两个 Header 下方均保留分割线。 用户最终选择恢复此原样式，仅在共用右侧 Sheet 增加左上／左下 rounded-l-[var(--radius)]，当前为 16px；右侧直角贴边。
- General 的 Theme 行使用官方 ToggleGroup 单选组合，Light/Dark/System 分别用太阳、月亮、笔记本（LaptopMinimal）图标，默认 System；图标不带可见文字，使用可访问名称与现有 Tooltip 提示名称，始终保留一个选项。控件的主题状态不进入 shared/ui。
- ToggleGroup 单选项以 `aria-checked` 显示激活状态，选中背景使用官方 accent、图标使用 accent-foreground，不增加高反差主色选中块。Tooltip 组合也使用 data-state，因此不得仅凭该属性表达单选反馈；选择判断仍由官方控件负责。
- 共用 `Switch` 可操作时显示手形指针，禁用时显示禁止指针；在组件内统一维护，不在设置调用方重复指定。
- Media Download 的记录列表与 Sheet 由 media-download/views/records 持有，Dock 保留一级入口。Settings 的 General／Features 采用官方 Card、ItemGroup、Item、ItemSeparator 的圆角边框列表，标题置于框外。Media Download 只有一个总开关，独立箭头通过官方 Collapsible 展开默认收起的三个只读子项；仅主项保留问号，子项无问号。界面文案使用英文，TG 状态为 Enabled／Disabled，X／Helper 显示 Not integrated。设置界面与 Sheet 归 `modules/settings`，`modules/dock` 只组合入口并协调入口提示，设置界面订阅公共 settings 数据，不在其中展示下载记录；保持官方折叠状态与焦点管理，不另写展开状态逻辑。
- 历史清理区域使用官方基础的 `Switch`，通过 `checked` / `onCheckedChange` 连接状态，保留可访问名称与说明；默认关闭，加载、授权和保存期间禁用重复操作，失败通过共用 toast.error 提示。配置和权限变更同步到已打开页面，不把业务状态放入通用组件或新增全局设置状态。
- 历史清理开关标题旁的圆圈问号复用 Button/UiIcon/Tooltip，帮助提示完整保留原说明，最大宽度 280px、优先向上显示并支持换行；独立按钮不切换开关，读屏描述通过常驻隐藏文本保留。错误不放进 Tooltip。
- Sheet 内容、边框与分隔线使用根主题；全屏遮罩使用 blur-overlay，阴影使用项目 Token。打开／关闭动画恢复为 200ms／160ms，减少动态效果遵循全局规则。
- Tooltip 提供名称或简短帮助说明，使用单一全局 Provider；入口通过 `asChild` 组合为唯一交互元素。Sheet 打开时 Dock 的 Settings 与 Download 入口不显示 Tooltip，关闭恢复焦点不自动弹出入口提示，后续正常悬停仍可显示；两个入口的状态由 Dock 局部 useDockSheetTooltip 共用，面板内部提示正常使用。关闭自动恢复焦点阶段，入口标记 data-restored-focus 并仅抑制该阶段的描边；不取消默认焦点恢复。入口失焦、指针按下或主动键盘操作后清除标记，正常键盘聚焦仍有描边。
- 品牌图标由 `shared/brand/BrandIcon` 负责；Newtab 书签、Dock 收藏及其复用入口随主题切换黑白，不再按站点配置 original、adaptive 或 neutral。普通书签透明背景、单色主体，浅色显示黑色、深色显示白色。通用图标由 `UiIcon` 显式静态导入。
- UI 文件夹图标沿用原始几何、viewBox、线宽与留白，移除灰阶和渐变；白色覆盖形成的必要孔洞通过黑白遮罩转成真正透明区域，再统一主题转换，避免整体滤镜压平镂空。不套用 V3 重绘或统一坐标要求，不维护深浅两套源稿。
- Grok 书签移除固定底板、保留主体路径。Exts 按用户最新确认保留正式完整外形及底板，浅色黑底白图、深色白底黑图；沿用现有内嵌正式 PNG 的 SVG，不重绘外形、不替换为仅含内部主体的源稿，也不对其应用压平对比的 brightness 滤镜。此主题反转仅用于书签，品牌唯一源稿及三端应用图标保持原样。此次交付见[书签单色 Issue](../changes/issues/2026-10-26-extension-bookmark-monochrome-issue.md)。
- Dock 左侧保持 favorites，右侧 tools 顺序为 Studio、Actions、Download、Settings。Studio 复用官方 Toggle：固定 PanelsTopLeft，首页提示 Switch to Studio、工作台提示 Back to Home；选中反馈使用官方 accent/accent-foreground，通过 aria-pressed 应用到 entry-surface，避免 Tooltip 的 data-state 覆盖及内部图块盖住反馈。不切换图标、不加 fill，不新增选中状态管理。
- Studio 是独立模块，采用固定官方 sidebar-07 的可折叠侧栏、SidebarInset 与顶部导航；Home／Studio 继续由 React Activity 保留状态和 DOM。Dock 与原下载/设置入口随 Home 显示，Studio 独占视口，不保留 Dock 空行或 Home 外圈留白；每个新标签页仍默认 Home，不保存视图偏好。左侧菜单区使用官方 Empty，List 图标、No pages yet 与说明；右侧内容区同样用官方 Empty，PanelsTopLeft 图标、No content yet 与说明，沿用默认 icon variant、布局及字号，不加额外颜色、描边或缺省面板封装。不显示 Overview、Studio Activity、示例团队、假用户或未实现功能菜单；Home 原 Activity 保留。
- 品牌头部保留官方示例 32px 标识与两行文字比例，Exts SVG 与 Exts/Studio 使用普通非交互排版，不重绘或叠加底板，不带链接、点击事件或按钮角色。右侧独立使用官方 Button ghost/icon-sm、House 与 Tooltip 作为唯一返回入口，Logo 不可点击；折叠时隐藏品牌与左侧 Empty 文字区，保留 House 按钮，窄屏先打开侧栏后访问同一按钮。正文顶部只保留官方 SidebarTrigger、Separator 和 Studio 当前页，不保留 Home 文字按钮、Overview 层级或额外边框。
- Account 本期为纯前端未登录入口，显示 UserRound / Account / Not signed in；点击打开官方 Dialog，登录内容来自简化 login-03，首行不显示 Logo/Exts 品牌，采用官方 Welcome back 标题与 CardHeader text-center，说明为用户指定的 Login with your Github or Google account。仅保留 Login with GitHub / Login with Google，不包含邮箱、密码、注册、其他方式或无效条款链接，不自行改写官方标题或增加品牌行。两个按钮均可点击，分别 toast.info 提示登录暂未接入；不禁用 Google，不发接口请求、不创建或恢复假会话。关闭框后继续使用原 Studio；账户 Tooltip 在框打开时隐藏，弹框焦点与关闭由官方 Radix Dialog 管理。真实登录单独排队，未登录进入 Studio 不受阻。
- Sidebar 主题语义映射现有 surface-raised、foreground、accent、border、ring 和 primary，不另设深浅主题；官方内部滚动、图标折叠及 768px 移动端断点沿用。SidebarProvider 不重复挂载 TooltipProvider，不写入示例 cookie，折叠状态仅在当前页面内保留；当前正文为官方 Empty。Account 使用官方 32px Avatar/Fallback、双行文字及尾部 ChevronsUpDown，副标题和间距沿用官方；Fallback 内为静态 UserRound，无假用户头像。登录表单恢复官方 FieldGroup/Field、CardTitle/Description，Card 保留默认边框、背景与 shadow-sm；Dialog 定位外壳透明无阴影，保留可访问语义、关闭按钮和全局 blur-overlay，避免重复卡片材质。Button outline 在共用组件显式使用既有 border-border，不在登录处重复覆盖颜色，不改变主题变量值。
- Actions 沿用向上的官方 DropdownMenu，只有带 List / FolderOpen 的 Placeholder A / B；复用官方 Hover、焦点、键盘与选中关闭行为，onSelect 仅调用 toast.info 显示「暂未接入」，不执行业务功能。Media Download、Settings、Actions 的代码与入口未迁入 Studio。Newtab 根部仍只挂一份复用主题的右下角 Toaster，供菜单、静态账户和下载面板共用，业务继续决定提示文案，不新增通知管理层。Components 旧菜单已移除，资源收藏只保留在 UI 文件夹。
- 字号、页面列数、具体宽高、位置与排版仍由现有组件负责；本次不建立全站布局框架或额外组件层。

## 验证与变更

### Newtab 区域布局

- Dock 中间分割线使用官方 Separator，局部设置高 48px、垂直居中；宽度沿用官方 1px，颜色引用 border Token。
- 页面级布局在 `src/app/newtab.css`，只作用于 Newtab；保留 24px 外圈留白，内部左右间距及上方区域与 Dock 间距均为 24px。
- 页面使用两行网格，上行为左右两列，下行为 Dock；上行使用剩余高度，左右各自通过官方 Scroll Area 滚动，溢出不传播到页面或相邻区域。Dock 仍按内容宽度居中，最大不超过底部可用宽度，撑满后通过官方 Scroll Area 与水平 ScrollBar 滚动。
- 上行外层提供完整可用宽度，ResizeObserver 监听该层；按左侧实际项目宽度、数量及间距模拟换行，取最宽一行确定左栏占宽，再将左栏、24px 分栏间距和固定右栏整体居中。随窗口宽度变化自动更新，不设置整体固定最大宽度；末行左对齐，右侧卡片仅纵向排列。极窄窗口沿用区域内部溢出约束，不压缩右侧或将其移到左栏下方。
- 首页文件夹预览框横向间距为 24px；纵向预览框边缘之间总共 32px，由名称前 8px、名称固定单行行高 16px 和下一行前 8px 组成。长名称单行省略，规则限定在 `.newtab-bookmarks`，不改变其他场景。
- 文件夹外框基准为 `--size-bookmark-folder`，由两枚 `--size-icon-tile`、内部 16px 间距、两侧各 16px 内边距与两侧各 1px 边框计算，默认 178px；文件夹宽度与右侧首卡高度引用同一基准，右侧列宽为两个基准加 24px，默认 380px。
- UI 文件夹放在 EDU 前，沿用两列图标网格与默认模糊机制；高度固定为文件夹外框基准，更多内容在官方 Scroll Area 内纵向滚动并阻止滚动传播。按用户批准仅隐藏该文件夹内的滚动条，其他文件夹与页面滚动条保持既有行为。
- UI 上下两端各用 16px 高的绝对定位提示层，贴边 3px 使用 card 背景色盖住内部图标边框，再向内容侧渐隐；复用 overlay-blur，磨砂和背景由同一线性蒙版渐隐，上下镜像，保留文件夹自身外边框。次要前景色 ChevronUp 与 ChevronDown 单独显示、不受蒙版影响；对应方向还有内容时才显示，顶部只有下提示，中间两个都有，底部只有上提示。默认模糊或无溢出时都隐藏，不占布局、不额外预留空间，保留网格原有内边距。不依赖 Hover，不响应点击或阻挡滚动；判断由文件夹局部监听滚动与尺寸变化，卸载后清理。
- 右侧首卡采用官方 Card 基础，按批准的文件夹外框效果组合主题圆角、16px 内边距和无阴影。右侧卡片间距为 24px，卡片区域统一滚动。
- ActivityCard 由 `modules/studio/components/activity` 持有，Home 的 cards 区域只引入展示；卡片尺寸和材质保留，首行高 32px，使用现有 outline/sm/spacing=0 ToggleGroup，切换为 CalendarDays、ChartColumn、ChartPie，名称为 Calendar／Chart／Pie chart，宽度沿用 36px。
- 默认 Calendar，重复选择不能取消至空值；Tooltip 与组件状态机制保留。Calendar 保留完整 24 周网格、每格 12px、间距 2px、周日开始及未来日期留白；运动、阅读、学习、创作每日各累计满 30 分钟完成一项，0–4 项分别使用 --activity-level-0 至 4，仅映射全局 muted/chart 色源，不维护第二套颜色。参数与核算以本文件“全局图表灰阶”为准。
- Chart 内容高 96px，固定最近 14 个自然日。右上角复用 ChevronsUpDown 图标 Button ghost/icon-sm 点击直接轮换成长/睡眠。成长每日实际时长堆叠，从上到下为运动/阅读/学习/创作，分别对应 1/2/3/4 档；不足 30 分钟仍显示实际投入，Tooltip显示日期及四项时长，不显示合计或完成数。睡眠只保存每日总分钟，<6h、6–<7h、7–9h、>9h 对应 1–4 档；缺失留空不计 0，虚线固定在7小时且无文字标签，不计算均值。深浅只表达时长范围，不表达健康评分。
- Pie 内容高96px，左右两列等宽，依次为本周投入实心饼图、四个周计划同心环，各自在列中居中（雷达图已移除）。周日至周六，顶部不显示日期范围标题；四项从12点顺时针、同心环从内到外均为运动/阅读/学习/创作。目标分别180/300/600/900分钟；计划环为0–100%域，超额图形封顶、Tooltip保留实际百分比。无投入显示空状态，环背景引用0档。两图均无常驻标题，保持原卡片宽高、图形半径和列间距16px。
- 当前固定样本在 Studio data/activity/mock-records.json，覆盖 2026-10-07 至 2026-11-03，不随机、不自动平移日期；样本范围外自然显示无记录。不提供录入、持久化或跨端同步，Home/Studio 状态保留及刷新默认行为沿用现状。
- 柱状图横轴每柱显示日号（1、2、…、31，不显示月份与前导零）。活动卡片内四种数据视图统一复用 ChartTooltipContent 的外观与行布局；日历仅由官方普通 Tooltip 提供触发/定位，局部使用 disableHoverableContent，避免相邻小格触发被鼠标过渡区域阻挡。不改其他模块 Tooltip。
- 横轴预留 28px 容纳默认 tickSize、6px tickMargin 和日号文字，避免文字在 SVG 底部被截断；保持图表 96px 和原卡片高度不变。
- 柱状图外轮廓统一4px圆角，数值集中在shared/ui/chart.tsx的CHART_BAR_RADIUS，避免SVG数值属性与CSS变量重复维护。睡眠直接用Bar.radius，成长用Recharts官方BarStack.radius，内部各Bar不单独圆角，保留色块直角接缝。缺项、单项和较薄端部沿用官方整体裁切，不自写图形或逐项拼接圆角。
- 趋势分类入口为既有 Lucide ChevronsUpDown，Button ghost/icon-sm（32px）；不显示常驻分类文字，普通控件 Tooltip 以 Growth/Sleep 表示当前分类；点击直接轮换两个分类，不打开菜单。
- 成长增加当前 14 个自然日总投入 / 14 的平均时长虚线，无投入日按 0 计；睡眠仍为固定 7 小时。两线无常驻文字，当前 ReferenceLine 不提供独立 Hover 提示，不混同柱子的每日数据提示。
- 成长与睡眠共用同一日期窗口：从本地今天往前第14天至昨天，共14个完整自然日，不包含今天；均值只计算该窗口。日历和本周统计继续按各自原有范围，不受趋势窗口影响。
- 周视图左侧按用户最新提供的 ChartPieSimple 使用实心 Pie，不设置 innerRadius；移除左右“投入/计划”可见标题，保留可访问名称。左侧按项目固定 chart-1..4，右侧计划环按完成比例分档：0%为muted，(0,25%]为chart-1，(25%,50%]为chart-2，(50%,75%]为chart-3，>75%为chart-4；超额保持4档。四个环的颜色不绑定项目，仍以内到外固定顺序和统一 Tooltip 识别项目。
- 活动卡片时长统一为小写h，小时值最多一位小数，整数移除末尾.0，如0h、1h、1.3h；内部分钟数据和达标判断不变。日历/柱状图只显示MM-DD日期及明细，无合计或完成数行。周投入明细为“百分比 / 投入时长h”，如30% / 5h；周计划明细为“完成率 / 目标时长h”，如120% / 10h，不显示实际/目标比值。
- 周视图Tooltip标题为“W<周号> Time Spent”和“W<周号> Plan”，两图使用同一个实际周号（周日开始，包含1月1日的一周为第1周），不显示日期范围或progress字段。原生图表Tooltip的active/payload仅用于判断是否显示与当前悬停项目；展示数据始终按运动/阅读/学习/创作完整四项排列（含0值）。当前项名称和数值均使用font-semibold，其他行正常字重；投入显示占比/投入时长，计划显示完成率/目标时长。外框、间距和标题沿用同一官方ChartTooltipContent。

- 数据提示统一由共用 ChartTooltipContent 维护：w-max 按内容取宽，最小宽度120px，不设固定宽高；whitespace-nowrap 禁止文字自动换行，数据行不启用 flex-wrap。内边距使用全局 Tailwind p-4（当前16px，与活动卡片一致），不在各图调用方覆盖。日历仍以透明无内边距外层承载该内容，标题与各数据行保留独立行；普通按钮、帮助及文件名 Tooltip 不受影响。四项显示名统一为 Exercise/Reading/Learning/Creation，底层分类键与目标不变；提示日期仅显示MM-DD，数据键仍保留完整年份。

### 验证边界

修改共用规则前检查所有使用方，更新本文和对应 Issue。只验证逻辑、配置、类型与构建，不增加源码形状断言、假 DOM 或视觉交互测试。

视觉、悬停、焦点、Portal、明暗主题和窄视口由用户在 Chrome/Edge 加载实际产物验收；自动化通过不等于用户验收通过。未来扩展样式时按真实用途复用以上规则，不把官网的不同交互强制合并。

Tooltip 共用默认 sideOffset 为 4px，用于设置名称与帮助提示；Dock 调用方显式使用既有 12px，不随默认值改变。位置由 Radix 计算，不手写坐标。

## 临时 Toast 提示

### 共用状态等级

状态图标使用 src/shared/ui/status-icon.tsx，基于现有 UiIcon 静态映射。官方 Item 用于行布局、Badge 用于标签、Sonner 用于临时通知，均不提供本需求所需的独立状态 SVG 等级映射，因此按用户批准提供此最小组件，不重写官方 Tooltip 或通知逻辑。

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

扩展各模块统一从 src/shared/ui/sonner.tsx 导入 Toaster 和原生 toast API，复用 shadcn 官方 Sonner 展示组件、Lucide 图标和现有主题。通用组件维护各自页面视口右下角位置、图标映射和外观；业务不覆盖位置、图标或品牌配色，不分别手写提示框、关闭定时器或折叠逻辑。TG、Newtab 和后续 X 使用同一套规则。

提示采用“等级图标 + 提示语”，不增加第二层 description。内容使用现有主题文字与背景，通过图标区分等级，不启用彩色 richColors。长文案可自然换行，不为单行展示裁掉重要反馈。

| 类型 | 调用方式 | Lucide 图标 | 适用场景 |
| --- | --- | --- | --- |
| 成功 | toast.success | CircleCheck | 操作已成功完成，例如下载完成 |
| 信息 | toast.info | Info | 普通状态说明，例如尚未接入 Desktop |
| 警告 | toast.warning | TriangleAlert | 需要用户留意或处理的状态；不因此新增当前模块的触发条件 |
| 错误 | toast.error | OctagonX | 已触发操作失败，例如下载记录清空失败 |

业务模块持有文案、等级、完成条件等状态；不在共用 UI 中加入 Chrome API、下载记录、跨页面通知管理或重复消息包装器。不同页面/Shadow DOM 各自挂载 Toaster，多条提示沿用 Sonner 默认折叠堆叠与关闭行为，互不转发。

Settings 的加载、保存与权限操作失败统一使用根部现有 Toaster 的 toast.error，不在设置行追加错误段落；共用英文文案集中在 src/shared/settings/messages.ts，调用方直接使用官方 API，不包装新的通知服务。Toast 不复制内部异常细节；保留必要的正式异常日志，临时排错日志结束后清理。此规则不改变已有 TG 下载仅成功提示的专属约定。

TG 下载仅在文件流关闭成功后调用 toast.success，显示成功图标和“下载完成”，不再描述文件名；文件名保留在 Download 记录。开始、进行中、取消和失败不显示 Toast。后续 X 必须复用同一组件和位置，实际触发条件由其独立 Issue 决定，不代表本次已接入。
