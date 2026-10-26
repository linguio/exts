# Studio 切换与 Actions 交付记录

- Issue：[新增 Studio 切换与 Actions 入口](../issues/2026-10-26-extension-workspace-entry-issue.md)
- 状态：已完成
- 预期交付边界：独立 studio 模块、首页与 Studio 同页切换、固定 PanelsTopLeft 图标及英文动作提示；Components 位置改为 Zap Actions，两个带图标的占位项复用官方交互，选中后右下角提示「暂未接入」。

## 实际交付
- 新增独立 studio 模块，包含标题、No content yet 空状态与 Dock 切换入口；同一 Newtab 内切换，默认首页，不接入后端或真实数据功能。
- 首页与工作台使用现有 React 的 Activity 保留组件状态与 DOM，隐藏时暂停副作用，恢复时重新测量布局；Dock 和下载、设置抽屉位于切换区域之外。
- Studio 固定 PanelsTopLeft，Tooltip 与可访问名称为 Switch to Studio / Back to Home。使用官方 Toggle 管理 pressed，选中反馈沿用 accent/accent-foreground；通过共用入口图块的 aria-pressed 样式解决 Tooltip data-state 覆盖和图块遮住按钮底色的问题，没有新增选中状态逻辑或图标填充。
- Components 菜单改为 Zap Actions，向上打开官方 DropdownMenu，仅有带 List / FolderOpen 的 Placeholder A / B；取消禁用及 Coming soon 副文字，沿用官方 Hover、键盘、焦点与选中关闭行为，onSelect 调用现有 toast.info 显示「暂未接入」，无实际业务操作。保留原菜单提示抑制与关闭焦点行为。
- 将下载抽屉内现有 Toaster、样式导入及主题订阅移至 Newtab 根部，两个主视图与下载面板共用一份右下角 Sonner；未新建通知管理层、定时器或堆叠逻辑，下载面板保留现有 toast 调用。
- 移除 Components 聚合配置、旧菜单、专用图标包装及仅由它们使用的类型和 Blocks 导入；UI 文件夹仍保留七个网站。更新已有配置测试及相关 UI 来源说明，未引入依赖。

## 验证结果与限制
- 针对性书签配置测试 2 项通过；Extension 完整 14 个测试文件、73 项测试通过。
- `pnpm --filter @exts/extension typecheck` 与 `pnpm ext:build` 通过，正式构建位于 `dist/build/chrome-mv3`。
- 最新 Studio / Actions 改名、占位菜单恢复交互及根部 Toaster 调整后，完整 73 项测试、类型检查和生产构建再次通过；未将构建成功表述为菜单或提示已实际验收。
- 测试数从 74 降到 73 是因为删除已移除 Components 功能的配置断言；UI 文件夹中的同一份七站点配置覆盖保留。
- 构建仍提示 theme-init.js 非 module，构建成功；本次不修改该入口。
- 浏览器视觉、布局、现场保留、Tooltip、菜单、抽屉、键盘和焦点仍需用户按 Issue 步骤在 Chrome 或 Edge 验收，未由代理执行，也未新增假 DOM 或同类自动化测试。
- 稳定开发目录未更新，没有启动开发服务器；用户已批准按代码、文档两笔本地提交，提交时不追加验证，不推送。

## 用户验收
用户于 2026-10-26 明确要求本地提交并完结；不追问是否已实际验收，浏览器未由代理执行，不记为通过。

## 最终提交批准
用户于 2026-10-26 明确批准本地提交并完结；先提交代码，再提交文档及完成状态，不推送。

## 提交方案与文件边界
- 代码提交：`apps/extension` 下的 App 组合、独立 studio 模块、Dock 入口与菜单、聚合配置清理、类型、UiIcon 显式映射、选中反馈语义样式及相关配置测试。
- 文档提交：本 Issue、本 Commit 记录、`docs/changes/README.md`、`docs/extension/ui.md`、`docs/web-ui-sources.md`；完成状态只归入文档提交。

## 最终代码 Commit message
```text
feat(extension): 新增 Studio 切换与 Actions 入口

- 新增独立工作台模块并保留首页切换现场
- 将 Components 替换为可交互的 Actions 占位菜单
- 复用官方 Toggle 与根部 Sonner 提示并清理旧聚合实现
```

## 最终文档 Commit message
```text
docs(extension): 记录 Studio 切换与 Actions 交付

- 记录切换与占位菜单的交付范围和验证限制
- 同步组件组合规则与浏览器验收步骤
```
