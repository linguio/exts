# UI 资源图标与书签文件夹交付记录

- Issue：[统一 UI 资源图标并新增书签文件夹](../issues/2026-10-26-extension-ui-bookmarks-issue.md)
- 状态：已完成
- 预期交付边界：统一 UI 全部七个 SVG 的配色，tools 中五份迁至 brand；UI 文件夹位于 EDU 前，沿用现有图标网格，默认模糊，内部上下滚动且隐藏滚动条；按补充批准删除 Google Translate 旧 PNG。

## 实际交付
- UI 文件夹位于 EDU 前，七个网站沿用现有两列图标网格、默认模糊与解锁机制，固定外框高度后使用官方 Scroll Area 内部纵向滚动；仅此文件夹隐藏滚动条。
- 上下两端采用 16px 绝对定位的渐变磨砂与 ChevronUp / ChevronDown，贴边 3px 以 card 背景色盖住内部图标边框，再向内容侧渐隐；复用 overlay-blur，背景与磨砂通过同一蒙版柔和过渡，上下镜像，箭头不受蒙版影响，文件夹外边框保留。仅在对应方向有内容时显示，顶部只有下提示、中间两个都有、底部只有上提示；默认模糊或无溢出时都隐藏。没有额外占位，保留网格原有内边距；局部滚动及尺寸监听均清理，不改共用 Scroll Area，不增加按钮。
- tools 中五份 SVG 仅转换颜色后迁至 brand；shadcn.io 同步改色，Simple Icons 保持原有几何，七个图标统一采用 neutral 灰阶主题策略。深色只反转明暗，保留灰阶、黑白区域及遮罩作用，不重绘或改坐标。
- 过渡期 Components 仍保留，与 UI 共用同一份七站点配置与 brand 资源，待下一 Issue 改为 Zap。
- 更新 WXT 注册与配置测试，移除 google-translate.png 的失效注册；用户在重新拆分提交时明确批准将该旧 PNG 删除一并提交。
- 同步 UI 主题与 Scroll Area 使用差异文档，没有修改共用 Scroll Area 源码或引入依赖。

## 验证结果与限制
- 针对性书签与资源配置测试 6 项通过；Extension 全量 14 个文件、74 项测试通过。
- `pnpm --filter @exts/extension typecheck` 与 `pnpm ext:build` 通过，正式产物为 `dist/build/chrome-mv3`。
- 转换时逐份比较七个 SVG 的非颜色内容，均一致；发布 Manifest 可解析，七个发布 SVG 与源码一致。
- 初次沙箱测试因 spawn EPERM 未启动，终止后在获准环境串行测试成功；没有扩大并行度或引入模拟 DOM。
- 构建仍提示 theme-init.js 非 module，构建成功；不在本次范围内。
- 未执行浏览器视觉、布局、模糊、滚动、主题及链接交互验收；由用户加载正式构建按 Issue 步骤检查。稳定开发目录未更新。
- 未开始 Workspace；用户已明确批准本地提交，提交时不追加验证，不推送。
- 最新上下渐变磨砂调整后重新完成 74 项 Extension 测试、类型检查和生产构建；渐变、边框遮挡、箭头显隐、布局及滚动效果仍由用户浏览器验收，未增加同类自动化测试。

## 用户验收
用户于 2026-10-26 明确要求本地提交并完结；不追问是否已实际验收，浏览器未由代理执行，不记为通过。

## 最终提交批准
用户于 2026-10-26 明确批准本地提交并完结，随后明确要求按先代码、后文档重新拆分，并将 Google Translate 旧 PNG 删除纳入代码提交；不推送。

## 提交方案与文件边界

- 代码提交：`apps/extension` 下的 Newtab 样式、书签文件夹与图标组件、配置与类型、UiIcon 静态映射、SVG 迁移及改色、Google Translate 旧 PNG 删除、相关配置测试与 WXT 注册。
- 文档提交：`docs/changes/README.md`、本 Issue 与 Commit 记录、Workspace Issue 与 Commit 记录、`docs/extension/ui.md`、`docs/web-ui-sources.md`；当前工作项的完成状态归入文档提交。

## 最终代码 Commit message
```text
feat(extension): 统一 UI 图标配色并新增书签文件夹

- 将开发资源图标迁至 brand 并保留图案细节与主题灰阶层次
- 在 EDU 前新增默认模糊且内部滚动的 UI 文件夹与上下提示
- 同步配置测试与构建注册并移除 Google Translate 旧图标
```

## 最终文档 Commit message
```text
docs(extension): 记录 UI 书签交付与工作台计划

- 记录 UI 图标与文件夹的实际交付和验证限制
- 同步主题配色与滚动提示规则并完结当前工作项
- 登记 Workspace 切换与快速开始的后续计划
```
