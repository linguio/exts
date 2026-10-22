# 替换 Dock 下载入口与 EDU 锁图标

## 元信息

- 状态：已完成
- 工作项：2026-10-22-extension-dock-download-edu-lock
- 用户批准：DevTools 替换为 Download 空抽屉入口，EDU 扫帚替换为锁并在 Hover 时显示开锁；图标统一采用 Lucide。Settings 与 Download 的 Header 均为图标加标题。两个 Dock 抽屉入口的 Tooltip/Sheet 交互提取为局部 hook。用户已明确要求开发，并批准按 EDU 与 Dock 两个结果拆分本地提交。
- 当前阶段：用户已验收通过并批准本地提交；EDU 已先独立提交，Dock 与工作项终态纳入最终本地提交。代理未自行执行浏览器验证。
- 任务规模：按用户指定合并记录在一个工作项，使用 Todo，不新增 Spec、Plan 或 Sub-issue。

## 背景

Dock 当前有 Components、DevTools 和 Settings，DevTools 是工具菜单。EDU 的模糊遮罩目前使用 Lucide BrushCleaning，用户希望用锁表达尚未显示的内容，并通过 Hover 开锁图标提示可点击。

## 目标

将原 Dock DevTools 位置替换为 Download 按钮，点击打开共用抽屉；EDU 改用锁与开锁图标，保留现有点击解除模糊的功能。

## 范围

- 移除 Dock 的 DevTools 菜单入口，在原位置增加 Download 按钮；Components、Settings 与其他收藏入口保留相对顺序。
- Download 使用 Lucide Download，并通过 `src/shared/ui/ui-icon.tsx` 和现有 UiIcon 类型表按需静态导入；Tooltip 显示 `Download`，沿用既有 Dock 图标、主题与提示方式。
- 点击 Download 打开右侧抽屉，复用 `src/shared/ui/sheet.tsx` 的共用 Sheet，不新增抽屉组件实现。现有 Sheet 已提供 Root、Trigger、Content、Header、Title、Description、Close 与 Portal 等组合。
- Settings 与 Download 的 Header 均使用左侧 Lucide 图标加标题、右侧共用关闭按钮。分别使用 Settings 与 Download 图标，标题文字保持 `Settings`、`Download`，保留真正的 SheetTitle；图标作为辅助展示，不重复朗读。
- Download 正文完全留空，不添加占位文案、空状态、列表、按钮、加载效果或虚构数据；空正文不影响 Header 与关闭按钮显示。
- Download 入口复用现有 Settings 的 Tooltip/Sheet 互斥与关闭焦点处理：抽屉打开时隐藏入口 Tooltip，关闭后恢复入口焦点但不自动弹出提示，后续正常 Hover 仍可提示。
- 两个抽屉入口共用 `views/dock/` 内的局部 hook 管理上述交互状态与事件；Sheet、Tooltip 仍使用现有共用组件，不向全局 utils 添加 Dock 状态。
- Download 抽屉视图放在 Newtab 的 `views/dock/` 独立文件，与 `dock-settings.tsx` 同层；本期未确定下载业务，不新增下载 module、记录服务或数据结构。
- EDU 模糊遮罩默认显示 Lucide Lock，鼠标 Hover 显示 Lucide LockOpen，移出恢复 Lock；图标变化本身不解除模糊，点击后仍按既有逻辑解除模糊并隐藏遮罩。
- EDU 继续复用既有遮罩、主题、圆角、焦点与点击行为；不将开锁提示理解为密码、认证或安全保护，不新增授权或重锁能力。
- 如旧通用图标随入口替换后不再使用，可移除其静态导入和类型登记；不删除用户提供的品牌资源或无关书签数据。
- 同步 Newtab/UI 说明与相关的必要配置、逻辑检查，保留原有真实行为覆盖。

## 已确认设计与实现边界

- 抽屉正文：用户已明确 Download 正文完全留空；不增加下载记录、任务列表、历史查询或空状态文案。
- Header：用户已明确 Settings 和 Download 同时采用 icon+title；两者沿用现有 Sheet 组件和标题层级，只调整各自 Header 组合，不额外建立通用 Header 框架。
- 抽屉尺寸与材质沿用 Settings：右侧、560px 宽且不超过视口，Header 高 56px，分割线和正文留白复用现有主题与布局，不另行重新设计。
- 空抽屉仍提供可访问标题；没有描述内容时显式不关联描述，不为消除提示而新增可见正文。关闭按钮、Esc 和遮罩关闭沿用共用组件行为。
- 不将 Download 正文滚动区的裁切传播到 Header，不让图标与标题进入关闭按钮区域；视觉和焦点效果由用户浏览器验收，不新增相关自动化测试。

## 排除项

- 不恢复已经移除的下载记录层、Popup 或旧下载流程，不修改 Telegram 取流、系统保存或完成 Toast。
- 不删除与入口替换无关的资源，不改 Components 内容、JLPT 日历、页面三区布局及底部滚动规则。
- 不升级依赖、修改版本或更新日志，不引入新的图标库、手绘 SVG 或全量 Lucide 导入。
- 不增加截图、视觉、Hover、菜单、焦点或布局自动化测试，不引入假 DOM；Chrome/Edge 视觉与交互由用户验收。
- 不自动提交、推送或发布。

## Todo

- [x] 按已确认设计替换 Dock DevTools 为 Download，共用 Sheet，正文完全留空并保持既有 Dock 行为。
- [x] 将 Settings 与 Download Header 统一为 Lucide 图标加标题，沿用共用关闭行为和 Tooltip/焦点处理。
- [x] EDU 默认 Lock、Hover LockOpen，保留点击解除模糊与共用状态反馈。
- [x] 同步说明和必要配置/逻辑覆盖，执行阶段完整测试、类型检查及构建并准备用户验收。

## 验收标准

- Dock 不再显示 DevTools，原位置显示 Lucide Download；悬停提示 Download，点击只打开批准的抽屉。
- 两个抽屉复用共用 Sheet，Header 为各自 Lucide 图标加标题及共用关闭按钮；Download 正文完全留空，尺寸与材质沿用 Settings，支持既有关闭按钮、Esc 和遮罩关闭行为，无第二套弹层实现。
- 打开 Download 时入口 Tooltip 收起；关闭恢复焦点但不立即弹出 Tooltip，后续正常 Hover 提示仍可用。
- EDU 未 Hover 时显示 Lock，Hover 时显示 LockOpen；移出恢复，Hover 不解除模糊，点击仍能解除模糊。
- 三个新增图标仅通过 UiIcon 按需接入 Lucide，保持现有线宽与尺寸体系，不手绘或加载全量图标。
- Components、Settings、书签、JLPT、三区滚动及 TG 下载行为保持原样；不擅自新增下载记录业务。
- 自动化结果与用户浏览器验收分别记录，不将测试通过视为视觉和交互验收完成。

## 关联文档

- [Commit 记录](../commits/2026-10-22-extension-dock-download-edu-lock-commit.md)
- [Newtab 说明](../../extension/newtab.md)
- [扩展 UI 规范](../../extension/ui.md)
- [Web UI 来源](../../web-ui-sources.md)

## 唯一下一步

按用户已验收通过并批准本地提交的指令，完成 Dock 与工作项终态提交。
