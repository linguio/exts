---
date: "2026-10-26"
scope: extension
status: completed
type: feature
---

# 新增 Studio 切换与 Actions 入口

## 当前阶段

已完成。

## 目标与范围

### 背景

首页继续承担书签与卡片展示；新增与 Exts 一体的工作台，为后续数据管理预留主视图。保留 Dock 向上弹出列表的交互，Components 资源迁入 UI 后，其位置改为操作菜单。

### 目标

在同一 Newtab 内切换首页与 Studio，Dock 保持可用；新增 Zap Actions 菜单，两个占位项沿用官方交互并提示「暂未接入」。

### 范围

- 新增独立 studio 模块，承担工作台主视图；本期只显示 Studio 标题与基础空状态，不添加侧栏、统计卡片或业务导航。
- Dock 右侧仍命名为 tools，左侧仍为 favorites；新增 Studio 入口，固定使用 PanelsTopLeft 图标。
- 同一入口点击切换首页与工作台。首页 Tooltip 为 `Switch to Studio`，工作台 Tooltip 为 `Back to Home`；可访问名称同步使用相同英文目标动作。
- 工作台打开时沿用官方组件已有的选中反馈；不切换成 House，不给线条图标额外加 fill，不自行增加一套选中配色。
- Dock 在两个视图中保留，下载与设置继续使用原抽屉；首页现有布局保持不变，切换不重置可保留的视图现场。
- 新标签页首次打开默认首页，不将工作台状态持久化成新标签页默认入口。
- 移除原 Components 菜单残留，原位置改为 Zap 图标的「操作菜单」，保留向上弹出列表。
- 用户最新批准：工作台命名为 Studio，Zap 菜单命名为 Actions；对应提示改为 `Switch to Studio` / `Back to Home`，菜单入口提示和可访问名称为 Actions。独立模块与组件同步采用 studio / actions 命名，Issue 与 Commit 记录文件前缀保持稳定。
- Actions 暂不放新建 Issue、记录打卡等具体业务入口，只保留 `Placeholder A`（List）与 `Placeholder B`（FolderOpen）。两项取消禁用，完全沿用官方菜单 Hover、焦点、键盘及选中关闭行为；通过 onSelect 调用现有 `toast.info('暂未接入')`，显示右下角信息提示，无创建、跳转或网络操作。
- 复用现有 Sonner，将下载抽屉内唯一 Toaster 及主题订阅移到 Newtab 根部，供 Actions 和下载面板共用，位置与主题保持不变；不引入通知管理层、手写计时器或堆叠逻辑。
- Studio 的 PanelsTopLeft 与操作菜单的 Zap 接入共用 UiIcon 显式静态导入；占位项复用已有 List、FolderOpen，不引入整套图标注册表或独立品牌 SVG。
- Dock 右侧顺序按已讨论方案为 Studio、操作菜单、下载、设置。

### 排除项

- 不实现 Issue、打卡或日志业务，不接入登录、Hono、Neon、Vercel 或其他外部服务。
- 不把工作台打开为抽屉、独立网站或新浏览器标签页。
- 不迁移书签图标或重复实现 UI 文件夹；相关内容由前序 Issue 交付。
- 不重构其他模块，不调整 Dock 收藏区或现有下载、设置功能。
- 不新增视觉、布局、Tooltip、菜单、键盘或焦点类自动化测试；此类验收由用户执行。
- 不提交或推送。

## Todo

- [x] 前序 Issue 的代码与文档提交成功，已展示范围并取得实施批准。
- [x] 新增 workspace 模块及同页主视图切换，保持默认首页和必要视图现场。
- [x] 接入 Studio 固定图标、Tooltip 与默认选中反馈，保留 Dock 和抽屉。
- [x] 将 Components 位置替换为 Zap 操作菜单占位列表，清理被替代代码。
- [x] 执行必要逻辑测试、类型检查和一次构建，记录限制并停在用户验收。

## 验收标准

- 打开新标签页默认首页；点击 Studio 在同页切至工作台，再点击回首页。
- 图标始终为 PanelsTopLeft，提示表达点击目标，选中反馈表达工作台当前状态；两种主题均复用现有体系。
- 切换后 Dock 始终可用，下载、设置仍可打开；首页原有状态不因不必要的卸载而重置。
- 原 Components 菜单被 Zap Actions 替代；两个带图标的占位项有官方 Hover、焦点与选中反馈，选中后菜单自动关闭，右下角显示「暂未接入」，不触发实际业务功能。
- 构建、类型与必要逻辑检查通过；用户加载构建产物后在 Chrome 或 Edge 验收切换、提示、菜单、主题与抽屉。

### 用户验收步骤

1. 在 Chrome 或 Edge 加载 `D:\GitHub\exts\dist\build\chrome-mv3`，重新打开新标签页，应默认显示原首页；Dock 右侧依次为 Studio、Actions、Download、Settings。
2. 解锁 UI 文件夹并滚到中间，将右侧打卡卡片切换到 Workout；点击 Studio，主区域应显示 Studio 与 No content yet，Dock 仍在原处，图标始终为 PanelsTopLeft，入口使用默认选中反馈。
3. Hover 时首页提示 Switch to Studio，工作台提示 Back to Home；再次点击返回，检查 UI 解锁、滚动位置和 Workout 选择仍保留。工作台期间调整窗口宽度，再返回检查原有居中换行布局正常。
4. 在两个视图中分别打开下载、设置抽屉，切换 Light/Dark，检查主题、抽屉及固定 Dock；另开新标签页仍默认首页。
   同时检查 Actions 信息提示在首页与 Studio 都能显示；打开下载抽屉点击现有文件夹入口，仍应只有一份右下角提示，关闭抽屉不影响提示显示。
5. 点击 Zap Actions，菜单向上打开，仅有 List / FolderOpen 对应的 Placeholder A / B。检查官方 Hover 和键盘移动、Enter 激活；选择任意项后菜单自动关闭，右下角出现「暂未接入」，不创建或跳转。连续选择沿用 Sonner 官方堆叠；检查菜单与 Tooltip 不同时残留，Esc 与外部点击可关闭、焦点恢复符合现有习惯，小视口与缩放下边界避让正常。
6. 检查 Components 入口消失，UI 文件夹的七个网站仍能正常打开与加入标签组。

## 唯一下一步

无。

## 交付记录

### 验证结果与限制

- 针对性书签配置测试 2 项通过；Extension 全量 14 个文件、73 项测试通过，类型检查和生产构建通过。
- 最新 Studio / Actions 改名、菜单 onSelect 提示及根部 Toaster 调整后，重新执行完整 73 项测试、类型检查与生产构建，均通过；实际交互与提示显示仍待用户浏览器验收。
- 原 Components 配置断言随功能删除；七个网站的顺序、网址与资源仍由 UI 文件夹配置测试覆盖。
- 构建仍提示 theme-init.js 非 module，构建成功，本次未调整该入口。
- 代理未运行浏览器视觉、布局、Tooltip、菜单、键盘、焦点或切换现场验收；未引入假 DOM 或同类测试。
- 本次只生成正式构建，稳定开发目录未更新；没有启动开发服务器。用户已批准代码、文档两笔本地提交，提交时不追加验证，不推送。

### 历史交付记录

- Issue：[新增 Studio 切换与 Actions 入口](2026-10-26-extension-workspace-entry-issue.md)
- 状态：已完成
- 预期交付边界：独立 studio 模块、首页与 Studio 同页切换、固定 PanelsTopLeft 图标及英文动作提示；Components 位置改为 Zap Actions，两个带图标的占位项复用官方交互，选中后右下角提示「暂未接入」。

#### 实际交付
- 新增独立 studio 模块，包含标题、No content yet 空状态与 Dock 切换入口；同一 Newtab 内切换，默认首页，不接入后端或真实数据功能。
- 首页与工作台使用现有 React 的 Activity 保留组件状态与 DOM，隐藏时暂停副作用，恢复时重新测量布局；Dock 和下载、设置抽屉位于切换区域之外。
- Studio 固定 PanelsTopLeft，Tooltip 与可访问名称为 Switch to Studio / Back to Home。使用官方 Toggle 管理 pressed，选中反馈沿用 accent/accent-foreground；通过共用入口图块的 aria-pressed 样式解决 Tooltip data-state 覆盖和图块遮住按钮底色的问题，没有新增选中状态逻辑或图标填充。
- Components 菜单改为 Zap Actions，向上打开官方 DropdownMenu，仅有带 List / FolderOpen 的 Placeholder A / B；取消禁用及 Coming soon 副文字，沿用官方 Hover、键盘、焦点与选中关闭行为，onSelect 调用现有 toast.info 显示「暂未接入」，无实际业务操作。保留原菜单提示抑制与关闭焦点行为。
- 将下载抽屉内现有 Toaster、样式导入及主题订阅移至 Newtab 根部，两个主视图与下载面板共用一份右下角 Sonner；未新建通知管理层、定时器或堆叠逻辑，下载面板保留现有 toast 调用。
- 移除 Components 聚合配置、旧菜单、专用图标包装及仅由它们使用的类型和 Blocks 导入；UI 文件夹仍保留七个网站。更新已有配置测试及相关 UI 来源说明，未引入依赖。

#### 验证结果与限制
- 针对性书签配置测试 2 项通过；Extension 完整 14 个测试文件、73 项测试通过。
- `pnpm --filter @exts/extension typecheck` 与 `pnpm ext:build` 通过，正式构建位于 `dist/build/chrome-mv3`。
- 最新 Studio / Actions 改名、占位菜单恢复交互及根部 Toaster 调整后，完整 73 项测试、类型检查和生产构建再次通过；未将构建成功表述为菜单或提示已实际验收。
- 测试数从 74 降到 73 是因为删除已移除 Components 功能的配置断言；UI 文件夹中的同一份七站点配置覆盖保留。
- 构建仍提示 theme-init.js 非 module，构建成功；本次不修改该入口。
- 浏览器视觉、布局、现场保留、Tooltip、菜单、抽屉、键盘和焦点仍需用户按 Issue 步骤在 Chrome 或 Edge 验收，未由代理执行，也未新增假 DOM 或同类自动化测试。
- 稳定开发目录未更新，没有启动开发服务器；用户已批准按代码、文档两笔本地提交，提交时不追加验证，不推送。

#### 用户验收
用户于 2026-10-26 明确要求本地提交并完结；不追问是否已实际验收，浏览器未由代理执行，不记为通过。

#### 最终提交批准
用户于 2026-10-26 明确批准本地提交并完结；先提交代码，再提交文档及完成状态，不推送。

#### 提交方案与文件边界
- 代码提交：`apps/extension` 下的 App 组合、独立 studio 模块、Dock 入口与菜单、聚合配置清理、类型、UiIcon 显式映射、选中反馈语义样式及相关配置测试。
- 文档提交：本 Issue、本 Commit 记录、`docs/ohmy-delivery/readme.md`、`docs/extension/ui.md`、`docs/web-ui-sources.md`；完成状态只归入文档提交。

#### 最终代码 Commit message
```text
feat(extension): 新增 Studio 切换与 Actions 入口

- 新增独立工作台模块并保留首页切换现场
- 将 Components 替换为可交互的 Actions 占位菜单
- 复用官方 Toggle 与根部 Sonner 提示并清理旧聚合实现
```

#### 最终文档 Commit message
```text
docs(extension): 记录 Studio 切换与 Actions 交付

- 记录切换与占位菜单的交付范围和验证限制
- 同步组件组合规则与浏览器验收步骤
```

## 关联文档

- [前序：UI 资源与书签文件夹](2026-10-26-extension-ui-bookmarks-issue.md)

## 历史补充

### 元信息

- 完成日期：2026-10-26
- 当前阶段：用户明确批准按代码、文档两笔本地提交并完结；已有验证与未验证事项如实保留。

### 历史后续事项

用户于 2026-10-26 明确要求本地提交并完结；本工作项无后续实施步骤，不推送。
