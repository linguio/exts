# Newtab 新标签页

Newtab 是 Exts 扩展的新标签页模块，源码位于 apps/extension/src/modules/newtab。加载扩展后，打开新标签页进入书签页面。

## 书签与文件夹

- 页面按文件夹组织网站书签；EDU 文件夹默认带模糊遮罩，锁图标在悬停时变为开锁，点击后显示书签。
- AI 文件夹位于主书签区域第一，依次收录 ChatGPT、Grok、Cursor，使用已有品牌 SVG，打开方式与其他文件夹一致。
- Social Media 文件夹依次收录 Telegram、Bilibili、YouTube；Telegram 打开 Web 版，X 移至 Dock。
- 普通书签提供网站名称和图标，链接打开目标网站；工具分组中的部分入口可批量创建标签组。
- 当前书签来自模块配置，没有可用的用户编辑、拖拽或自定义书签设置。

## Dock

页面保留原有 24px 外圈边距，内部划分为上方左右区域与底部 Dock 行。左右区域边界之间、上方区域底边与 Dock 外框顶边之间均为 24px。

上半区根据容器可用宽度和左侧项目实际宽度自动计算换行，取最宽一行的占用宽度作为左栏宽度，和右栏整体水平居中，将剩余空间平分到两端；不设置固定整体最大宽度或额外空列。ResizeObserver 监听外层可用空间，手动调整浏览器窗口大小时自动更新。左侧末行保持左对齐，不拉伸文件夹；右侧固定为两个文件夹预览外框宽度加一段 24px 间距（默认约 380px），卡片仅纵向排列。左右内容溢出时仅在各自区域内滚动，使用官方 Scroll Area 默认滚动条，页面整体不跟随滚动，内容不会侵入 Dock 区域。

首页文件夹的预览框横向相隔 24px；换行后，上下两行预览框之间总共 32px：名称上方 8px、固定单行行高 16px、名称下方到下一行预览框 8px。长名称单行省略，不撑高文件夹行；该规则只作用于首页文件夹。

Dock 按内容宽度在底部居中，最大不超过底部可用宽度；撑满后只在内部通过官方 Scroll Area 与水平 ScrollBar 滚动，保留原有菜单与设置弹层。

底部收藏入口依次为 X、GitHub、Exts、Gmail，直接打开对应网站；ChatGPT 位于 AI 文件夹。Exts 使用已有的完整正式圆角 Logo，保留黑底白色主体，不随页面主题反色。

Components 提供工具菜单；原 DevTools 位置为 Download，点击后打开下载记录右侧抽屉。Download 与 Settings 抽屉的标题区均为对应图标加标题；入口悬停或键盘聚焦时显示名称提示，抽屉打开时提示收起。

## Download 记录

- 抽屉复用共用 Sheet 默认 420px 宽度，与 Settings 一致，最大不超过视口。左侧为全部列表图标、TG/X 品牌图标单选筛选，默认全部，按完成时间倒序；右侧依次为文件夹、清空图标，按钮 32px、图标 16px、间距 4px。图标名称使用现有 Tooltip。
- 记录行高 40px，左侧为实际保存文件名，右侧大小，不展示角标、缩略图、重复时间或单条删除。TG 默认文件名已有 TG_ 前缀；X_ 是后续 X 下载的命名约定，不伪造尚未接入的记录。
- 长名称单行省略并保留来源前缀与扩展名，仅省略时通过 Tooltip 展示完整名称。大小缺失显示 0 MB。空列表在工具栏下方可用区域水平、垂直居中显示“暂无下载记录”；空筛选禁用清空，文件夹保持可用。临时提示沿用共用 Toaster 的视口右下角位置。
- 清空跟随当前全部/TG/X 筛选。官方 Alert Dialog 在整个页面居中，说明仅清记录、不删文件；取消或清空后保留 Download 抽屉，保存失败保留记录并由 Sonner 报错。
- 文件夹入口按筛选对应 Exts Downloads、Telegram、X 预设目录；当前尚未接入 Desktop，点击通过 Sonner 提示“暂无法打开文件夹，尚未接入 Exts Desktop”，不检查目录、不打开 Finder、不创建目录。
- media-download/stores/records 复用公共 storage 工具，数据位于 storage.local.downloads 的 tg.records、x.records。后台串行写入，Newtab 订阅变化，关闭 Newtab 不影响 TG 保存记录。尚未设置自动淘汰上限；存储失败不会改动原记录或已下载文件。
- 首轮只接 TG 文件关闭成功后的记录，失败和取消不记成功；成功 Toast 继续显示在 Telegram 页面，Newtab 不重复提示。X 筛选保留但下载尚未接入。

用户验收：重新加载 dist/build/chrome-mv3，刷新 Telegram Web 后成功保存图片或视频，打开 Download 检查实际名称、大小、倒序和刷新持久化；在另一个 Newtab 同时观察记录更新。分别切换全部/TG/X，检查 X 空状态、取消清空保持记录、确认清空只影响筛选范围且本地文件仍在。取消或使文件保存失败不得新增成功记录。检查截断 Tooltip、明暗主题和页面居中确认框；文件夹在有无记录时均显示未接入提示。

## 右侧卡片

右侧通过 Studio 模块公开入口展示 ActivityCard；业务组件归 `modules/studio/components/activity/`，首页 `views/cards/index.tsx` 只组合展示。Calendar／Chart 图标切换默认 Calendar，日历保留当前周和之前 23 周，活动记录初始为空；Chart 内容留空，切换状态不持久化，不再加载旧 JLPT／Workout 模拟 JSON。

日历展示与 Tooltip 归 Studio 的 activity 组件，本地日期与等级计算归 `utils/activity/calendar.ts`，跨午夜或切回页面时更新日期的 Hook 归 `hooks/activity/use-local-date.ts`，记录类型归 `types/activity.ts`。

首页 `views/bookmarks/` 组合书签，文件夹组件、文件夹类型和配置仍归 Newtab；解锁判断与标签组辅助归 `utils/bookmarks/`。Newtab 与 Dock 共用 `shared/bookmarks/` 的 BookmarkCard 和基础类型；品牌 SVG 归 `src/assets/brand/`，由 `shared/brand/BrandIcon` 统一展示。Dock 与 Settings 分别由独立模块持有，不再放在首页 views 内。

## Settings

Dock 右侧的 Settings 打开右侧设置面板，面板跟随当前明暗主题，分为两区。Download 与 Settings 的入口提示及抽屉关闭焦点处理共用 Dock 局部 hook：

General 与 Features 之间不使用分割线：分区标题为 12px、中等字重和较淡颜色，设置项正文为 14px、常规字重；正文外侧内边距和两区间距统一为 24px，不再叠加子分区内边距。顶部 Settings 标题区保留分割线。

- General：Theme 提供太阳、月亮、笔记本（LaptopMinimal）三个图标，对应 Light、Dark、System。默认 System，手动选择立即应用并保存在本机，多个已打开页面同步；System 随系统变化，手动 Light/Dark 保持固定。
- Features：Clear History 默认关闭，旁边问号通过 Tooltip 展示原清理范围与触发说明；临时操作失败通过共用 Sonner 提示。

[历史清理](./history-cleaner.md)模块独立持有配置与后台行为；Newtab 只展示设置区域，不需要保持页面打开。启用时申请浏览器清理权限，拒绝则保持关闭；开启操作本身不立即清理。

## 使用与限制

- 面向 Chrome、Edge，不要求其他浏览器兼容。
- 未配置主题时跟随系统或浏览器的配色偏好；手动选择后按所选主题显示，单色书签同步适配，品牌原色保持不变。首次加载、跨页与系统切换的实际效果由用户验收。
- 开发时加载根 dist/dev/chrome-mv3-dev-stable，生产构建加载 dist/build/chrome-mv3；具体操作见[应用 README](../../apps/extension/README.md)。
- 本模块不要求其他扩展功能依赖 Newtab 页面保持打开。

共用样式和组件规则见[界面规范](./ui.md)，构建产物规则见[构建与分发](../build-release.md)。
