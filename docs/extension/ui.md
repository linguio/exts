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

迁入官方组件保持修改前已确认的视觉效果；小差异沿用官方，明显差异保留必要定制，不逐像素复刻。Sheet 的官方结构不覆盖现有 `blur-overlay` 遮罩效果，具体 Token 与组合见下文。

## 主题与 Token

明暗主题由 `src/shared/theme/` 解析：默认 System，通过系统 `prefers-color-scheme` 跟随变化；选择 Light/Dark 后固定为对应主题。根 `data-theme` 持有实际明暗，组件与 Portal 继承原有语义 Token，不独立硬编码配色。Geist 字体、既有明暗色值、遮罩透明度与模糊不变。

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
| 透明遮罩 | `overlay` | 浅色白色 42%，深色近黑色 62% |
| 遮罩模糊 | `--overlay-blur` | 8px |
| 图标缩放 | `--entry-hover-scale` | 1.06 |
| 入口上移 | `--entry-hover-lift` | -2px |
| 反馈时长 | `--duration-fast` | 160ms |
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
- Settings 与 Download 使用右侧 Sheet：共用组件统一维护默认宽 420px、最大不超过屏幕，调用方不重复写宽度。Header 高 56px，均显示对应 Lucide 图标与标题，关闭按钮提示为 `Close`。Download 正文展示下载记录；Settings 正文包含 General 和 Features 两区，分区标题为 12px／font-medium／text-muted-foreground，设置项正文为 14px／font-normal。Settings 正文父容器统一设置 24px 内边距及 24px 分区间距，子分区不叠加外侧内边距；两区之间不用 Separator，不叠加 Browsing history 标题；两个 Header 下方均保留分割线。
- General 的 Theme 行使用官方 ToggleGroup 单选组合，Light/Dark/System 分别用太阳、月亮、笔记本（LaptopMinimal）图标，默认 System；图标不带可见文字，使用可访问名称与现有 Tooltip 提示名称，始终保留一个选项。控件的主题状态不进入 shared/ui。
- ToggleGroup 单选项以 `aria-checked` 显示激活状态，选中背景使用官方 accent、图标使用 accent-foreground，不增加高反差主色选中块。Tooltip 组合也使用 data-state，因此不得仅凭该属性表达单选反馈；选择判断仍由官方控件负责。
- 共用 `Switch` 可操作时显示手形指针，禁用时显示禁止指针；在组件内统一维护，不在设置调用方重复指定。
- 历史清理区域使用官方基础的 `Switch`，通过 `checked` / `onCheckedChange` 连接状态，保留可访问名称与说明；默认关闭，加载、授权和保存期间禁用重复操作，错误就地展示。配置和权限变更同步到已打开页面，不把业务状态放入通用组件或新增全局设置状态。
- 历史清理开关标题旁的圆圈问号复用 Button/UiIcon/Tooltip，帮助提示完整保留原说明，最大宽度 280px、优先向上显示并支持换行；独立按钮不切换开关，读屏描述通过常驻隐藏文本保留。错误不放进 Tooltip。
- Sheet 内容、边框与分隔线使用根主题；全屏遮罩使用 `blur-overlay`。打开/关闭动画为 200ms/160ms，减少动态效果时遵循全局规则。
- Tooltip 提供名称或简短帮助说明，使用单一全局 Provider；入口通过 `asChild` 组合为唯一交互元素。Sheet 打开时 Dock 的 Settings 与 Download 入口不显示 Tooltip，关闭恢复焦点不自动弹出入口提示，后续正常悬停仍可显示；两个入口的状态由 Dock 局部 hook 共用，面板内部提示正常使用。
- 品牌图标由 `BookmarkIcon` 负责；Newtab 书签、Dock 收藏及其复用入口随主题切换黑白，不再按站点配置 original、adaptive 或 neutral。普通书签透明背景、单色主体，浅色显示黑色、深色显示白色。通用图标由 `UiIcon` 显式静态导入。
- UI 文件夹图标沿用原始几何、viewBox、线宽与留白，移除灰阶和渐变；白色覆盖形成的必要孔洞通过黑白遮罩转成真正透明区域，再统一主题转换，避免整体滤镜压平镂空。不套用 V3 重绘或统一坐标要求，不维护深浅两套源稿。
- Grok 书签移除固定底板、保留主体路径。Exts 按用户最新确认保留正式完整外形及底板，浅色黑底白图、深色白底黑图；沿用现有内嵌正式 PNG 的 SVG，不重绘外形、不替换为仅含内部主体的源稿，也不对其应用压平对比的 brightness 滤镜。此主题反转仅用于书签，品牌唯一源稿及三端应用图标保持原样。此次交付见[书签单色 Issue](../changes/issues/2026-10-26-extension-bookmark-monochrome-issue.md)。
- Dock 左侧保持 favorites，右侧 tools 顺序为 Studio、Actions、Download、Settings。Studio 复用官方 Toggle：固定 PanelsTopLeft，首页提示 Switch to Studio、工作台提示 Back to Home；选中反馈使用官方 accent/accent-foreground，通过 aria-pressed 应用到 entry-surface，避免 Tooltip 的 data-state 覆盖及内部图块盖住反馈。不切换图标、不加 fill，不新增选中状态管理。
- Studio 是独立模块，只显示标题与 No content yet；首页和工作台由 React Activity 切换，保留状态和 DOM，隐藏时暂停副作用、恢复时重新测量布局。Dock 与抽屉位于两者之外；每个新标签页默认首页，不保存视图偏好。Actions 沿用向上的官方 DropdownMenu，只有带 List / FolderOpen 的 Placeholder A / B；复用官方 Hover、焦点、键盘与选中关闭行为，onSelect 仅调用 toast.info 显示「暂未接入」，不执行业务功能。Newtab 根部挂一份复用主题的右下角 Toaster，供菜单与下载面板共用，业务继续决定提示文案，不新增通知管理层。Components 旧菜单已移除，资源收藏只保留在 UI 文件夹。
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
- Daily check-in 首行高 32px，左侧标题 14px，右侧复用 Settings 的 outline/sm/spacing=0 ToggleGroup，仅有固定选中的 JLPT 项，不维护额外选中样式。首行与日历相隔 16px；日历每格 12px、圆角 2px、横纵间距 2px，24 列×7 行共 334×96px，水平居中；不额外添加描边、阴影、月份或统计行。
- 日历颜色集中在 `theme.css` 的 `--check-in-level-0` 至 `3`：浅色为 #EEEEEE/#CCCCCC/#999999/#666666，深色为 #2A2A2A/#484848/#737373/#A3A3A3，按分钟档位递增使用，不将颜色散落在组件内。
- 正分钟数格子复用页面现有 TooltipProvider 和共用 TooltipContent，沿用默认 400ms 延迟与 4px 间距、优先向上并使用组件边界避让。日期与学习时长分两行显示，0 分钟和未来日期不创建 Tooltip；键盘聚焦正分钟格子也能触发提示。

### 验证边界

修改共用规则前检查所有使用方，更新本文和对应 Issue。只验证逻辑、配置、类型与构建，不增加源码形状断言、假 DOM 或视觉交互测试。

视觉、悬停、焦点、Portal、明暗主题和窄视口由用户在 Chrome/Edge 加载实际产物验收；自动化通过不等于用户验收通过。未来扩展样式时按真实用途复用以上规则，不把官网的不同交互强制合并。

Tooltip 共用默认 sideOffset 为 4px，用于设置名称与帮助提示；Dock 调用方显式使用既有 12px，不随默认值改变。位置由 Radix 计算，不手写坐标。

## 临时 Toast 提示

扩展各模块统一从 src/shared/ui/sonner.tsx 导入 Toaster 和原生 toast API，复用 shadcn 官方 Sonner 展示组件、Lucide 图标和现有主题。通用组件维护各自页面视口右下角位置、图标映射和外观；业务不覆盖位置、图标或品牌配色，不分别手写提示框、关闭定时器或折叠逻辑。TG、Newtab 和后续 X 使用同一套规则。

提示采用“等级图标 + 提示语”，不增加第二层 description。内容使用现有主题文字与背景，通过图标区分等级，不启用彩色 richColors。长文案可自然换行，不为单行展示裁掉重要反馈。

| 类型 | 调用方式 | Lucide 图标 | 适用场景 |
| --- | --- | --- | --- |
| 成功 | toast.success | CircleCheck | 操作已成功完成，例如下载完成 |
| 信息 | toast.info | Info | 普通状态说明，例如尚未接入 Desktop |
| 警告 | toast.warning | TriangleAlert | 需要用户留意或处理的状态；不因此新增当前模块的触发条件 |
| 错误 | toast.error | OctagonX | 已触发操作失败，例如下载记录清空失败 |

业务模块持有文案、等级、完成条件等状态；不在共用 UI 中加入 Chrome API、下载记录、跨页面通知管理或重复消息包装器。不同页面/Shadow DOM 各自挂载 Toaster，多条提示沿用 Sonner 默认折叠堆叠与关闭行为，互不转发。

TG 下载仅在文件流关闭成功后调用 toast.success，显示成功图标和“下载完成”，不再描述文件名；文件名保留在 Download 记录。开始、进行中、取消和失败不显示 Toast。后续 X 必须复用同一组件和位置，实际触发条件由其独立 Issue 决定，不代表本次已接入。

## Media Download 模块归属

记录数据、列表和现有 Sheet 由 media-download/records 持有，Dock 保留一级入口并打开 Media Download。设置数据使用公共 settings 读写／订阅，下载能力与记录不依赖页面自己的副本；本次不接入 X／Helper。
