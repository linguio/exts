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

| 应用与组件 | 保留的官方基础 | 项目必要差异 |
| --- | --- | --- |
| 官网 Button、Badge | 官方 CVA、Slot、variant、size、状态及数据属性 | 已有实现与固定基线仅注释、空白及 cn 路径不同，本次不改 |
| 官网 Tooltip | Provider、Root、Trigger、Portal、Content 与 data-slot | 保留 400ms 延迟、8px 间距、现有主题配色/内边距/行高；无箭头，无新增动画 |
| 扩展 Button | 官方 CVA、Slot、variant/size、数据属性、禁用与无效状态 | 沿用 Token 时长与 2px outline 焦点；ghost 保留透明底与前景色；入口外壳使用 entry variant/size，反馈由 entry-surface 提供；icon 保留零内边距；危险前景引用主题 Token |
| 扩展 Switch | 官方 Root/Thumb、受控 checked、onCheckedChange、data-state/size、disabled | 保持默认 44×24px、4px 内边距、16px 滑块与20px位移；小尺寸跟随相同规则；使用 input 轨道、background 滑块与既有焦点轮廓，无新增阴影；按用户批准增加 cursor-pointer，禁用时保留 cursor-not-allowed |
| 扩展 Tooltip | 官方 Provider、Root、Trigger、Portal、Content 与 data-slot | 保留 400ms、popover 配色、边框、阴影和内边距；按用户确认默认间距 4px，Dock 在调用方显式保留 12px；无箭头，无新增动画 |
| 扩展 DropdownMenu | 官方 Root、Trigger、Portal、Content、Item；保留可用高度限制与纵向滚动、Item 通用状态 | 只导出当前需要的四项；保留 12px 间距、8px 碰撞边距、160px 最小宽、36px 菜单项、字重、highlighted 状态和浮层阴影；不加入未安装的动画工具类 |
| 扩展 Separator | 官方 data-orientation、decorative 与颜色语义 | 无结构差异；Dock 调用方通过同一方向 variant 保持 64px 高度，避免普通 h-16 被方向选择器覆盖 |
| 扩展 Sheet | 官方 Root、Trigger、Close、Portal、Overlay、Content、Header/Footer、Title/Description 组合及属性 | 保留主题模糊遮罩与层级、浮层阴影、无额外内容间距；关闭按钮复用 Button 和 UiIcon；现有右侧 CSS 动画 200/160ms。560px 宽度、可访问描述省略与焦点恢复提示抑制由 Settings 调用方指定 |
| 扩展 Toggle/ToggleGroup | 官方 Toggle CVA、Radix Root/Item、上下文传递 variant/size/spacing 与单选接口 | 适配本地 cn/toggle 路径；移除 .dark 配色分支，采用既有主题 Token、2px outline 焦点、手形和 border 边框；单选激活通过 aria-checked 使用官方 accent/accent-foreground，避免 Tooltip 覆盖 data-state，不额外增加高反差背景或更改圆角。主题行指定 outline、sm、spacing=0、图标项宽 36px。空选忽略、主题保存与同步由业务/共用主题层处理 |

扩展实际深色通过根 `data-theme` 覆盖原有 Token，System 模式才跟随系统媒体查询，不依赖 `.dark`。接入源码时移除依赖 `.dark` 的配色分支，以主题 Token 表达对应状态；减少动态效果继续由现有全局规则处理。仓库未安装动画工具类插件，因此不引入无法生效的动画类或新依赖。Sheet 当前仅使用右侧入口，其余方向保留官方定位接口，不增加未批准的新交互。

## 业务组合与扫描边界

- 历史清理设置视图与权限/存储逻辑继续由 `modules/history-cleaner` 持有；Newtab 的 DockSettings 只组合设置区域和外壳。通用 Switch 不调用 Chrome API，不持有配置或错误状态。
- Sheet 关闭后的 Tooltip 抑制、菜单与 Tooltip 互斥、指针外部关闭处理继续位于业务组合处；不放入共享控件。
- 官网叠放窗口保留原生 button 与现有卡片池。专用展示的尺寸、网格、窗口内容与轮换不适合套用默认 Button 或标准 Carousel。
- 书签卡片、EDU 遮罩、品牌图标与网站分类布局按需求组合；未发现需要为本次目标迁入通用 UI 的业务逻辑，不创建跨应用组件包。
- 现有测试为纯逻辑、配置和体积边界，没有需要移除的截图、布局或焦点交互测试；本次不新增模拟 DOM 测试。

## 更新方式

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
