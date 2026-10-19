# 整理 AI 入口与设置分区

## 元信息

- 状态：已完成
- 工作项：2026-10-19-extension-newtab-ai-settings
- 用户批准：开始实施原三项优化，随后追加 Telegram 到 Social Media、X 移到 Dock 第一、Gmail 放到 Exts 后，并明确 AI 文件夹排第一；最新要求去掉 Gemini，保留其源文件但不接入或打包。
- 当前阶段：用户已确认三笔拆分并批准本地提交，书签入口与 Settings 样式已分别交付，本笔同步说明及结项记录；不推送。

## 背景

Newtab 当前将 ChatGPT 单独放在 Dock，主书签区域尚无 AI 文件夹；Settings 的 General 与 Features 之间有分割线。用户已提供 Grok、Cursor 和 Gemini SVG，ChatGPT SVG 已存在。

## 目标

将 AI 网站集中在一个文件夹，移除 Dock 中重复的 ChatGPT 入口；设置分区通过标题与正文层级自然区分。

## 范围

- 在主书签区域新增 AI 文件夹，AI 放在主书签区域第一个，内部依次包含 ChatGPT、Grok、Cursor，复用现有文件夹及书签行为。
- 使用 `apps/extension/src/modules/newtab/assets/brand/` 下的 `chatgpt.svg`、`grok.svg`、`cursor.svg`，沿用用户提供的图案，不重绘源稿。
- 从 Dock 收藏区移除 ChatGPT，将 X 从 Social Media 移到 Dock 收藏区第一；Gmail 移到 Exts 后，最终收藏顺序为 X、GitHub、Exts、Gmail。
- Social Media 文件夹新增 Telegram，使用用户提供的 telegram.svg，指向 Telegram Web；源稿不修改。
- 移除 Settings 中 General 与 Features 之间的分割线；标题使用 12px、中等字重和较淡颜色，设置项正文使用 14px、常规字重。分区间距为 24px，正文外侧保留 24px 内边距，由父容器统一维护；Settings 顶部标题区保留分割线。

## 排除项

不增加 AI 对话或 API 接入，不重构书签、Dock 或设置组件，不改主题与历史清理功能，不升级依赖、修改产品版本或更新日志；仅按用户批准拆分本地提交，不推送、部署或发布。

## Todo

- [x] 新增 AI 文件夹及三个网站入口，接入现有 SVG。
- [x] 将 AI 文件夹放在第一，Social Media 接入 Telegram 并移出 X，Dock 调整为 X、GitHub、Exts、Gmail。
- [x] 移除 General 与 Features 间分割线，按批准调整标题、正文层级及 24px 分区间距。
- [x] 执行必要的数据、类型及构建验证，准备用户浏览器验收步骤。

## 实际完成与验证

- AI 文件夹放到主书签区域第一，其余原有文件夹相对顺序保持不变；Grok 保留黑底白色原图，ChatGPT、Cursor 适配单色主题，SVG 源文件未修改。
- WXT 资源清单新增 Cursor、Grok、Telegram 三个 SVG；既有书签及资源测试同步，先确认缺少 AI、Dock 仍含 ChatGPT、新图标未声明三项失败，实现后 7 项针对性检查通过。
- 阶段完整验证：扩展测试 34 项通过，typecheck、生产构建和 check:bundle-size 通过。Manifest 仍为根产品版本 1.2.0，新标签页入口存在；三个 AI SVG 与 Telegram 在构建产物中存在且与源文件字节一致。
- 标题使用 text-xs／font-medium／text-muted-foreground，设置项使用 text-sm／font-normal；父容器统一 p-6 与 space-y-6，子分区移除 p-6，避免相邻留白叠加。两个设置区仅在 Dock Sheet 中使用，未影响其他调用方。
- 同步 Newtab 说明与现行 UI 规范，不增加组件、依赖或图标变体。
- 构建保留既有 theme-init.js 非 module 提示，但产物成功生成；本轮不改该入口。
- 未运行浏览器视觉、菜单、焦点或交互验收，未生成 Release 包、提交或推送。

## 用户验收步骤

1. 在 Chrome 的 chrome://extensions 或 Edge 的 edge://extensions 开启开发者模式，加载或重新加载 `D:\GitHub\exts\dist\build\chrome-mv3`。这是本次生产构建；现有 dev 稳定目录未更新。
2. 打开新标签页，主书签区域第一应出现 AI 文件夹；展开后依次看到 ChatGPT、Grok、Cursor，三个图标可用，各自打开对应网站。展开、关闭和导航行为应与其他文件夹一致。
3. 检查 Social Media 包含 Telegram、Bilibili、YouTube，Telegram 打开 Web 版，X 不在其中；Dock 收藏入口从左到右为 X、GitHub、Exts、Gmail，其后工具入口不变，ChatGPT 改从 AI 文件夹访问。
4. 打开 Settings，General 与 Features 之间不再有分割线，应看到较小、较淡的分区标题和常规字重的设置项，两个区域的间距收紧；顶部 Settings 标题下方仍保留分割线。切换 Light、Dark、System 后检查图标与两个设置区的表现，确认主题与历史清理设置功能不受影响。

## 验收标准

- Newtab 主书签区域出现 AI 文件夹，包含 ChatGPT、Grok、Cursor；名称、SVG 和网站链接对应正确。
- AI 文件夹与已有文件夹使用一致的打开及导航行为；ChatGPT 仍可从 AI 文件夹访问，Dock 不再显示它。
- Dock 收藏顺序为 X、GitHub、Exts、Gmail，其他工具及 Settings 行为不变；Social Media 包含 Telegram、Bilibili、YouTube，不再含 X。
- Settings 中 General 与 Features 之间没有分割线，分区标题 12px、中等字重和较淡颜色，设置项正文 14px、常规字重，两区间距为 24px；顶部标题区分割线及既有设置功能保持不变。
- SVG 在实际扩展产物中可用；不新增假 DOM、截图、布局或焦点交互测试，视觉与交互由用户在 Chrome/Edge 验收。

## 现有入口与资源

- `apps/extension/src/modules/newtab/constants/bookmarks.ts`：BOOKMARK_GRID 和 DOCK_FAVORITES。
- `apps/extension/src/modules/newtab/views/bookmarks/dock-settings.tsx`：GeneralSettings 与 HistoryCleanerSettings 之间的 Separator。
- 三个 AI SVG 及 telegram.svg 均复用源稿，不重绘或修改文件内容；Gemini 已从入口与资源清单移除，用户提供的 gemini.svg 保留未使用。

## 关联文档

- [Commit 记录](../commits/2026-10-19-extension-newtab-ai-settings-commit.md)
- [Newtab 说明](../../extension/newtab.md)
- [扩展 UI 规范](../../extension/ui.md)

## 唯一下一步

本地三笔交付完成；推送、部署或发布等待用户另行明确要求。
