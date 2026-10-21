# 扩展界面样式规范

适用于 `apps/extension`。覆盖全部扩展 Web UI，现有场景包括新标签页书签、Dock 工具、Settings Sheet 与 EDU 遮罩；Dock 基础规则见[对应 Issue](../changes/issues/2026-10-15-extension-newtab-dock-issue.md)，历史清理设置区域的交付与验收状态见[历史清理 Issue](../changes/issues/2026-10-16-extension-history-cleaner-issue.md)。

## 维护位置与职责

- `apps/extension/src/styles/theme.css`：整个 extension 的主题 Token 唯一实现位置，Newtab 与网页注入界面共同引用。
- `apps/extension/src/styles/index.css`：导入主题 Token，集中维护字体、共用语义样式和减少动态效果规则。
- `apps/extension/src/shared/ui/`：以 shadcn 官方源码为基础的通用组件，不包含书签或 Chrome API 业务逻辑。
- `apps/extension/src/modules/<功能>/`：持有对应功能的布局、内容、状态和操作；history-cleaner 持有设置区域与业务，Newtab 只组合设置区域。
- 本文维护用途、参数与组合约定；不在模块 README 再维护一份样式规则。

组件选型遵循根 [AGENTS.md](../../AGENTS.md#web-ui-选型与风格)。固定来源和逐项定制差异见 [Web UI 来源](../web-ui-sources.md)，不把 Radix 包装或组件数量少当作采用官方源码的依据。

迁入官方组件保持修改前已确认的视觉效果；小差异沿用官方，明显差异保留必要定制，不逐像素复刻。Sheet 的官方结构不覆盖现有 `blur-overlay` 遮罩效果，具体 Token 与组合见下文。

## 主题与 Token

明暗主题由 `src/shared/theme/` 解析：默认 System，通过系统 `prefers-color-scheme` 跟随变化；选择 Light/Dark 后固定为对应主题。根 `data-theme` 持有实际明暗，组件与 Portal 继承原有语义 Token，不独立硬编码配色。Geist 字体、既有明暗色值、遮罩透明度与模糊不变。

偏好以 `exts.theme` 保存于扩展页面同源 localStorage，不同步设备；浏览器 storage 事件同步其他已打开页面，本页事件通知当前设置。页面 head 通过 WXT 独立外部脚本 `theme-init.js` 在解析时读取偏好，使用与运行时相同的解析逻辑应用主题；不内联可执行脚本或放宽 CSP。主页面持续监听系统与跨页变化，面板关闭后仍生效。

上述规范属于整个 extension，并非 Newtab 专属。运行时将偏好发布到扩展 storage.local 的 `exts.theme` 副本，供无法访问扩展同源 localStorage 的网页内容脚本订阅；配置入口及主事实来源仍是既有扩展页面偏好。网页菜单在 Shadow DOM 中通过 `:host` 和 `:host(...)` 引用同一 Token。官方 Sonner 样式同时导入该 Shadow DOM，以支持提示的默认交互。

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
| `entry-glyph` | 入口图形：统一过渡属性和缩放；用于书签品牌图、工具图标、Settings 和扫帚 |
| `entry-glyph--lift` | 无图块入口的图形上移变体；用于扫帚，让透明遮罩保持不动 |

书签和工具按钮使用 `entry-trigger` → `entry-surface` → `entry-glyph`。EDU 遮罩按钮使用 `blur-overlay entry-trigger`，扫帚使用 `entry-glyph entry-glyph--lift`，不额外添加卡片阴影或改变遮罩背景。

入口 Hover 与键盘 Focus 共用规则。保持当前即时缩放与上移效果：过渡属性只包含 `filter`、`transform`，图块另外包含边框和阴影；CSS 独立 `scale` / `translate` 不单独补充平滑过渡。若后续调整动效，修改这里的共用规则，不在某个组件单独添加 `transition-transform`。

减少动态效果开启时禁用入口缩放、上移和动态阴影，保留清晰的焦点轮廓。不要在组件中复制缩放比例、上移距离或遮罩模糊值。

## 组件边界与约定

- 通用 `Button` 保留官方 variant 与常见状态；普通 ghost 反馈不变。Dock 工具按钮复用 `variant="entry" size="entry"` 透明外壳，实际反馈由内部 `entry-surface` 承担，不在调用方复制同套参数。
- EDU 保留默认模糊和点击解除逻辑，Hover 背景不变、指针为手形；其 hover 背景引用同一个 `overlay` Token，覆盖 ghost 默认背景变化。
- Settings 使用右侧 Sheet：宽 560px、最大不超过屏幕，Header 高 56px，标题及提示为 `Settings`，关闭按钮提示为 `Close`；正文包含 General 和 Features 两区，分区标题为 12px／font-medium／text-muted-foreground，设置项正文为 14px／font-normal。正文父容器统一设置 24px 内边距及 24px 分区间距，子分区不叠加外侧内边距；两区之间不用 Separator，不叠加 Browsing history 标题；Header 下方保留分割线。
- General 的 Theme 行使用官方 ToggleGroup 单选组合，Light/Dark/System 分别用太阳、月亮、笔记本（LaptopMinimal）图标，默认 System；图标不带可见文字，使用可访问名称与现有 Tooltip 提示名称，始终保留一个选项。控件的主题状态不进入 shared/ui。
- ToggleGroup 单选项以 `aria-checked` 显示激活状态，选中背景使用官方 accent、图标使用 accent-foreground，不增加高反差主色选中块。Tooltip 组合也使用 data-state，因此不得仅凭该属性表达单选反馈；选择判断仍由官方控件负责。
- 共用 `Switch` 可操作时显示手形指针，禁用时显示禁止指针；在组件内统一维护，不在设置调用方重复指定。
- 历史清理区域使用官方基础的 `Switch`，通过 `checked` / `onCheckedChange` 连接状态，保留可访问名称与说明；默认关闭，加载、授权和保存期间禁用重复操作，错误就地展示。配置和权限变更同步到已打开页面，不把业务状态放入通用组件或新增全局设置状态。
- 历史清理开关标题旁的圆圈问号复用 Button/UiIcon/Tooltip，帮助提示完整保留原说明，最大宽度 280px、优先向上显示并支持换行；独立按钮不切换开关，读屏描述通过常驻隐藏文本保留。错误不放进 Tooltip。
- Sheet 内容、边框与分隔线使用根主题；全屏遮罩使用 `blur-overlay`。打开/关闭动画为 200ms/160ms，减少动态效果时遵循全局规则。
- Tooltip 提供名称或简短帮助说明，使用单一全局 Provider；入口通过 `asChild` 组合为唯一交互元素。Sheet 打开时 Dock 的 Settings 入口不显示 Tooltip，关闭恢复焦点不自动弹出入口提示，后续正常悬停仍可显示；面板内部提示正常使用。
- 品牌图标由 `BookmarkIcon` 负责；单色 adaptive 资源随主题转换，Exts 品牌 SVG 保持固定黑底白图。通用图标由 `UiIcon` 显式静态导入。
- 字号、页面列数、具体宽高、位置与排版仍由现有组件负责；本次不建立全站布局框架或额外组件层。

## 验证与变更

修改共用规则前检查所有使用方，更新本文和对应 Issue。只验证逻辑、配置、类型与构建，不增加源码形状断言、假 DOM 或视觉交互测试。

视觉、悬停、焦点、Portal、明暗主题和窄视口由用户在 Chrome/Edge 加载实际产物验收；自动化通过不等于用户验收通过。未来扩展样式时按真实用途复用以上规则，不把官网的不同交互强制合并。

Tooltip 共用默认 sideOffset 为 4px，用于设置名称与帮助提示；Dock 调用方显式使用既有 12px，不随默认值改变。位置由 Radix 计算，不手写坐标。

## 临时 Toast 提示

扩展各模块复用 src/shared/ui/sonner.tsx 的官方展示组件和主题，不分别手写提示框、关闭定时器或折叠逻辑。挂载位置由使用方对应的页面/Shadow DOM 决定；业务模块持有文案、完成条件等状态，不在共用 UI 中加入 Chrome API、下载记录或跨页面通知管理。多条提示沿用 Sonner 默认折叠堆叠与关闭行为。

TG 下载仅在文件流关闭成功后调用完成提示，标题“下载完成”，描述为实际保存文件名；开始、进行中、取消和失败不显示 Toast。
