# 扩展界面样式规范

适用于 `apps/extension`。本轮覆盖新标签页书签、Dock 工具、Settings Sheet 和 EDU 遮罩；实际交付及用户验收状态以[当前 Issue](./changes/issues/2026-10-15-extension-newtab-dock-issue.md)为准。

## 维护位置与职责

- `apps/extension/src/styles/index.css`：主题 Token、共用语义样式、减少动态效果规则的唯一实现位置。
- `apps/extension/src/shared/ui/`：项目持有的 shadcn/Radix 通用原语，不包含书签或 Chrome API 业务逻辑。
- `apps/extension/src/modules/newtab/`：组合通用原语与语义样式，负责布局、内容、状态和实际操作。
- 本文维护用途、参数与组合约定；不在模块 README 再维护一份样式规则。

## 主题与 Token

明暗主题由根 `prefers-color-scheme` 切换。组件引用语义颜色，Portal 也继承根 Token，不独立硬编码明暗配色。

| 用途 | Token | 现行规则 |
| --- | --- | --- |
| 页面 | `background` / `foreground` | 页面与 Sheet 背景、正文 |
| 图块 | `card` / `card-foreground` | 书签与工具入口图块 |
| 浮层 | `popover` / `popover-foreground` | Tooltip 与菜单 |
| 状态 | `accent` / `accent-foreground` | 通用按钮与菜单状态 |
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

- 通用 `Button` 的普通 ghost 反馈保留；Dock 工具按钮使用透明外壳，实际反馈由内部 `entry-surface` 承担。
- EDU 保留默认模糊和点击解除逻辑，Hover 背景不变、指针为手形；其 hover 背景引用同一个 `overlay` Token，覆盖 ghost 默认背景变化。
- Settings 使用右侧 Sheet：宽 560px、最大不超过屏幕，Header 高 56px，标题及提示为 `Settings`，关闭按钮提示为 `Close`；内部暂时无设置项。
- Sheet 内容、边框与分隔线使用根主题；全屏遮罩使用 `blur-overlay`。打开/关闭动画为 200ms/160ms，减少动态效果时遵循全局规则。
- Tooltip 只提供名称提示，使用单一全局 Provider；入口通过 `asChild` 组合为唯一交互元素。Sheet 打开时不显示 Tooltip，关闭恢复焦点不自动弹出提示，后续正常悬停仍可显示。
- 品牌图标由 `BookmarkIcon` 负责；单色 adaptive 资源随主题转换，Exts 品牌 SVG 保持固定黑底白图。通用图标由 `UiIcon` 显式静态导入。
- 字号、页面列数、具体宽高、位置与排版仍由现有组件负责；本次不建立全站布局框架或额外组件层。

## 验证与变更

修改共用规则前检查所有使用方，更新本文和对应 Issue。只验证逻辑、配置、类型、构建与包体积，不增加源码形状断言、假 DOM 或视觉交互测试。

视觉、悬停、焦点、Portal、明暗主题和窄视口由用户在 Chrome/Edge 加载实际产物验收；自动化通过不等于用户验收通过。未来扩展样式时按真实用途复用以上规则，不把官网的不同交互强制合并。
