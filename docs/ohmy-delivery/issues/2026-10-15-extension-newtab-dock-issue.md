# 调整新标签页 Dock 书签与工具入口

## 元信息

- 工作项：2026-10-15-extension-newtab-dock
- 项目：extension
- 类型：小型任务
- 状态：已完成
- 创建日期：2026-10-15
- 当前阶段：用户确认验收并批准代码、文档两笔本地提交；完成事实以最终文档提交成功为准
- 用户批准：用户在看到交付与验证结果后明确要求拆分两笔本地提交，同时确认验收；不推送或发布
- 设计确认：设置入口使用右侧 Sheet，顶部 Header 包含标题与下方分隔线，宽度 560px 且不超过屏幕，跟随当前主题；内部设置项后续再定

- 追加反馈：设置相关界面文字统一英文，Sheet 加宽为 560px、Header 压缩为 56px；关闭 Sheet 后不因焦点恢复自动弹出 Tooltip，保留后续正常悬停提示；保留透明模糊效果，Sheet 与 EDU 共用全局 blur-overlay 样式。
- 追加反馈：扫帚 hover 需与现有书签一致；仅调整扫帚使用相同过渡属性、1.06 倍缩放及 2px 上移，遮罩背景保持不动。
- 追加批准：统一当前书签、Dock 工具、Settings 与扫帚的共用反馈样式，集中遮罩参数，新增 docs/extension-ui.md 作为扩展样式规范；不扩大到其他页面。

## 背景

新标签页 Dock 需要调整常用书签顺序、补充 Exts 书签与设置入口，并统一 EDU 文件夹的 hover 反馈。

## 目标

完成用户提出的三项 Dock 调整，保持其他书签和工具的行为。

## 范围

- 交换 GitHub 与 Gmail 书签的位置，在交换后的 GitHub 后面新增 Exts 书签。
- 在 Dock 右侧工具区新增 Settings 图标，点击打开 shadcn Sheet 设置面板。
- Sheet 从屏幕右侧滑出，固定宽度 560px，最大不超过屏幕宽度；顶部 Header 高度为 56px，包含“Settings”标题，Header 下方显示分隔线。
- Sheet 的背景、文字、边框与分隔线跟随 newtab 当前明暗主题；本次只做面板外壳，内部不添加设置项。
- EDU 文件夹保持默认模糊效果；hover 时背景不变，鼠标变为手形指针，中间扫帚图标轻微放大，与其他书签 hover 的反馈一致。
- 将半透明主题色与 8px 背景模糊集中为全局 blur-overlay，Sheet 遮罩与 EDU 模糊层共用，保留同样效果。
- 同步本 Issue、Commit 记录和工作台。
- 将入口卡片、图标反馈与透明模糊遮罩收敛为共用语义样式和 Token；组件保留自身布局及交互逻辑。

## 排除项

不调整其他书签顺序或重新设计视觉，共用语义样式整理覆盖现有书签与 Dock 入口；不扩展为 Dock 重构，不实现内部设置项、设置数据存储或新的主题切换机制；用户已批准代码与文档两笔本地提交，不推送或发布。

## 实施取值

- 实施取值：Exts 指向现有官网 https://exts.linguio.dev/，直接复用根 assets/brand/exts.svg，不重绘；Settings 入口提示文案为“Settings”。

## Todo

- [x] 获得实施批准，按现有官网地址与品牌资源实施，入口提示使用“Settings”。
- [x] 交换 GitHub 与 Gmail 位置，并在 GitHub 后添加 Exts。
- [x] 添加右侧 Settings 入口与 Sheet 外壳，接入现有明暗主题。
- [x] 调整 EDU hover 反馈，保留模糊效果和原有点击行为。
- [x] 完成必要逻辑、配置、类型检查与构建验证，提供 Chrome/Edge 加载产物路径与验收步骤。
- [x] 用户确认验收并批准代码、文档两笔本地提交，同步工作项终态。
- [x] 完成当前入口语义样式整理、规范文档与必要验证。

## 验收标准

- GitHub 与 Gmail 位置互换，Exts 紧随交换后的 GitHub，链接和图标与确认内容一致。
- Dock 右侧显示 Settings 入口，点击后从屏幕右侧打开 Sheet；可以关闭后再次打开。
- Sheet 宽度为 560px，窄窗口不超过屏幕宽度；顶部 Header 显示“Settings”标题，下方有分隔线，内部没有设置项。
- 切换 newtab 当前明暗主题时，Sheet 的背景、文字、边框和分隔线同步变化，不独立固定为某一主题。
- EDU 默认模糊效果保留；hover 时背景不变、指针为手形、扫帚图标轻微放大，反馈与其他书签一致；原有点击行为不变。
- Sheet 遮罩与 EDU 共用透明主题色和模糊强度，明暗模式同步，EDU hover 不改变背景。
- 必要自动化验证通过；视觉与交互由用户自行在 Chrome 或 Edge 实际加载验收，代理不执行此类测试。
- 自动化通过不代表用户验收通过，实施完成后停在待验收。

## 关联文档

- [Commit 记录](../commits/2026-10-15-extension-newtab-dock-commit.md)
- [工作台](../README.md)
- [扩展界面样式规范](../../extension/ui.md)

## 验证结果

- 更新既有书签顺序与资源配置测试，先确认新增要求下失败，再实施使定向 7 项通过。
- 扩展全量测试 15/15、类型检查、生产构建、包体积检查、git diff --check 通过。
- 产物 Manifest 和新标签页入口有效，Exts SVG 与根品牌源稿逐字节一致。
- 复用 radix-ui 1.6.7 的 Dialog 原语实现 shadcn Sheet 组合，无新增依赖、权限或浏览器 API。
- 追加调整：英文文案、560px 面板、56px Header，以及 Sheet 和 EDU 共用的全局透明模糊样式；追加类型检查、构建、包体积和 diff 检查通过，浏览器待用户复测。
- 追加反馈定位：本地 Radix Dialog 关闭后默认 focus 触发器，而 Tooltip 的 onFocus 调用打开；在 onCloseAutoFocus 设置抑制标记，指针主动移动或失焦后解除，不阻止默认焦点恢复。未做浏览器复测。
- React 核对：入口共用唯一按钮，Radix 提供面板标题、关闭与焦点管理；Tooltip 打开状态与 Sheet 互斥；图标静态导入；Portal 使用根主题 Token。
- 代理未实测视觉、键盘焦点、指针或主题效果；以下步骤由用户执行。
- 扫帚反馈差异定位：构建 CSS 中 transition-transform 包含独立 scale/translate，而书签 transition-[filter,transform] 不包含；仅调整扫帚对齐书签现状并补齐上移，不改变其他书签。

- 语义样式整理结果：entry-trigger、entry-surface、entry-glyph 与扫帚 lift 变体统一入口反馈，blur-overlay 及其模糊强度、缩放、上移参数集中维护；docs/extension-ui.md 为规范入口，扩展 AGENTS 链接该规范并反映已批准的 Sheet 范围。
- 整理后最终 15/15 测试、类型检查、构建、包体积、diff 检查通过；JS gzip 113820 字节，CSS gzip 4827 字节，无新增依赖或视觉交互测试。

## 用户验收步骤

1. 在 Chrome 的 chrome://extensions 或 Edge 的 edge://extensions 开启开发者模式，加载已解压扩展 `/Users/kevin/Documents/GitHub/exts/dist/build/chrome-mv3`，打开新标签页。本次为正式构建，未启动开发服务或更新 dist/dev 稳定开发产物。
2. 确认收藏从左到右为 ChatGPT、Gmail、GitHub、Exts；Exts 紧随 GitHub，点击后在当前标签页进入 https://exts.linguio.dev/。
3. 点击右侧齿轮，确认右侧滑出 560px Sheet，顶部“Settings”标题与下方分隔线可见，内容为空；关闭按钮、外部点击与 Esc 可关闭，关闭后可重新打开，键盘操作可进入并返回触发器，面板打开时无残留 Tooltip，关闭后不自动弹出 Tooltip；重新主动悬停仍显示 Settings 提示。
4. 切换系统明暗主题，确认页面和 Sheet 的背景、文字、边框与分隔线同步变化；缩窄到不足 560px 时面板不超出屏幕。检查 1280×720 及缩放后 640×360 CSS 视口，100%、125%、150%、200% 缩放下 Dock、工具菜单和设置入口仍可使用。
5. 对比普通书签、Dock 工具、Settings 与扫帚的悬停缩放及上移；带图块的入口仍有原有阴影与焦点轮廓，扫帚只移动图形、遮罩不动。
6. 刷新后 EDU 保持默认模糊；悬停整个遮罩时背景不变、显示手形、扫帚轻微放大；移出恢复。点击仍解除模糊，其他书签和工具行为不变；系统减少动态效果开启时不要求图标缩放或滑出动效。

## 唯一下一步

无；用户已确认验收并批准两笔本地提交，不推送或发布。
