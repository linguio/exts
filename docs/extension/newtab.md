# Newtab 新标签页

Newtab 是 Exts 扩展的新标签页模块，源码位于 apps/extension/src/modules/newtab。加载扩展后，打开新标签页进入书签页面。

## 书签与文件夹

- 页面按文件夹组织网站书签；EDU 文件夹默认带模糊遮罩。
- AI 文件夹位于主书签区域第一，依次收录 ChatGPT、Grok、Cursor，使用已有品牌 SVG，打开方式与其他文件夹一致。
- Social Media 文件夹依次收录 Telegram、Bilibili、YouTube；Telegram 打开 Web 版，X 移至 Dock。
- 普通书签提供网站名称和图标，链接打开目标网站；工具分组中的部分入口可批量创建标签组。
- 当前书签来自模块配置，没有可用的用户编辑、拖拽或自定义书签设置。

## Dock

页面保留原有 24px 外圈边距，内部划分为上方左右区域与底部 Dock 行。左右区域边界之间、上方区域底边与 Dock 外框顶边之间均为 24px。

左侧书签占剩余宽度并自动换行，右侧固定为两个文件夹预览外框宽度加一段 24px 间距（默认约 380px）。左侧行尾可以有剩余空白，不拉伸文件夹填满。左右内容溢出时仅在各自区域内滚动，隐藏滚动条，页面整体不跟随滚动，内容不会侵入 Dock 区域。

Dock 按内容宽度在底部居中，最大不超过底部可用宽度；撑满后只在内部横向滚动，隐藏滚动条，保留原有菜单与设置弹层。

底部收藏入口依次为 X、GitHub、Exts、Gmail，直接打开对应网站；ChatGPT 位于 AI 文件夹。Exts 使用已有的完整正式圆角 Logo，保留黑底白色主体，不随页面主题反色。

Components 和 DevTools 提供工具菜单；入口悬停或键盘聚焦时显示名称提示，点击工具入口打开菜单。

## 右侧卡片

右侧首张卡片是打卡功能的空外框，顶部与首排文件夹预览外框对齐，高度等于文件夹预览外框（默认约 178px，不含名称），宽度占满右侧列。目前没有打卡、编辑、数据存储或 GitHub 接入。

`views/cards/index.tsx` 组合右侧卡片；首张卡片由 `views/cards/check-in/` 独立目录持有，后续内容、状态与操作按需在目录内拆分。其他卡片后续各用独立目录，不将业务堆入页面入口。`views/bookmarks/` 负责左侧书签，`views/dock/` 负责 Dock、工具菜单及设置入口，`views/settings/` 保留通用设置视图。

## Settings

Dock 右侧的 Settings 打开右侧设置面板，面板跟随当前明暗主题，分为两区：

General 与 Features 之间不使用分割线：分区标题为 12px、中等字重和较淡颜色，设置项正文为 14px、常规字重；正文外侧内边距和两区间距统一为 24px，不再叠加子分区内边距。顶部 Settings 标题区保留分割线。

- General：Theme 提供太阳、月亮、笔记本（LaptopMinimal）三个图标，对应 Light、Dark、System。默认 System，手动选择立即应用并保存在本机，多个已打开页面同步；System 随系统变化，手动 Light/Dark 保持固定。
- Features：Clear history on startup and close 默认关闭，旁边问号通过 Tooltip 展示原清理范围与触发说明；错误直接显示在区域内。

[历史清理](./history-cleaner.md)模块独立持有配置与后台行为；Newtab 只展示设置区域，不需要保持页面打开。启用时申请浏览器清理权限，拒绝则保持关闭；开启操作本身不立即清理。

## 使用与限制

- 面向 Chrome、Edge，不要求其他浏览器兼容。
- 未配置主题时跟随系统或浏览器的配色偏好；手动选择后按所选主题显示，单色书签同步适配，品牌原色保持不变。首次加载、跨页与系统切换的实际效果由用户验收。
- 开发时加载根 dist/dev/chrome-mv3-dev-stable，生产构建加载 dist/build/chrome-mv3；具体操作见[应用 README](../../apps/extension/README.md)。
- 本模块不要求其他扩展功能依赖 Newtab 页面保持打开。

共用样式和组件规则见[界面规范](./ui.md)，构建产物规则见[构建与分发](../build-release.md)。
