# Web UI 官方来源与必要差异

官网与扩展的通用 Web UI 遵循根 [AGENTS.md](../AGENTS.md#web-ui-选型与风格)。本文记录源码基线与必要差异；主题参数和组合约定分别见 [官网 UI](website/ui.md) 与 [扩展 UI](extension/ui.md)。源码不是随上游自动升级的运行时依赖。

## 官方基线

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

- 官网介绍文字二进制动效（2026-10-25）：核对 [shadcn/ui 官方组件目录](https://ui.shadcn.com/docs/components)，没有对应字符解码组件，现有通用控件组合不能提供该效果。在 `pages/home/binary-text.tsx` 与同目录 CSS 独立实现固定二进制序列及单次分步动画，仅供首页介绍文字使用；参考 shadcn.io 的公开效果及本地 Demo，不复制 Pro 源码，不作为官方组件或引入动画依赖。保留原文字体、字距和主题 Token；字符占位、辅助技术原文与减少动态效果降级由该组件负责，1.2 行高沿用首页目标文字的既有值。
- 历史清理设置视图与权限/存储逻辑继续由 `modules/history-cleaner` 持有；Newtab 的 DockSettings 只组合设置区域和外壳。通用 Switch 不调用 Chrome API，不持有配置或错误状态。
- Telegram Download 复用现有 DropdownMenu；Content 增加可选 `portalContainer`，仅将 Portal 挂入网页 Shadow DOM，未指定时保持官方默认挂载方式。Shadow DOM 的事件重定向处理在业务菜单中完成，保留官方选择、禁用和关闭行为；不迁入旧自定义菜单的配色或状态管理。Popup 不恢复；2026-10-24 的独立 downloads 模块仅管理成功记录元数据，Newtab 组合展示和清空。
- Sheet 关闭后的 Tooltip 抑制、菜单与 Tooltip 互斥、指针外部关闭处理继续位于业务组合处；不放入共享控件。
- 官网叠放窗口保留原生 button 与现有卡片池。专用展示的尺寸、网格、窗口内容与轮换不适合套用默认 Button 或标准 Carousel。
- 书签卡片、EDU 遮罩、品牌图标与网站分类布局按需求组合；未发现需要为本次目标迁入通用 UI 的业务逻辑，不创建跨应用组件包。
- 现有测试为纯逻辑、配置和体积边界，没有需要移除的截图、布局或焦点交互测试；本次不新增模拟 DOM 测试。

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
