# 恢复原 Sheet 样式并统一左侧圆角：交付记录

## 对应工作项

- [Issue](../issues/2026-10-28-extension-download-drawer-issue.md)

## 最终交付边界与实际结果

- 以代码提交 54f33fc 对应源码恢复试用前 Sheet 外观：420px、模糊遮罩、项目阴影、原标题图标与分隔线、Button／UiIcon 关闭入口、200ms／160ms 动画。
- Sheet 外壳只增加 rounded-l-[var(--radius)]，使用全局 1rem，仅左上／左下，右侧直角贴边。未修改全局 Token 或其他组件圆角。
- useDockSheetTooltip 保留关闭恢复焦点阶段的临时入口标记，CSS 仅抑制该阶段的描边；正常主动键盘操作反馈保留。
- Drawer、Vaul、tw-animate-css 试用代码及依赖已清理；未改变内部业务内容、日历修正或 README。
- 当前规范与来源记录同步最终结果，之前 Drawer／官方默认外壳试用不作为最终交付。

## 验证与限制

- 扩展完整测试：15 个文件、77 项通过。
- TypeScript 类型检查、WXT 生产构建与 git diff --check 通过，产物位于根 dist/build/chrome-mv3。
- 设置／下载的 Sheet 组合和 Dock 入口与恢复基准核对一致，共用 Sheet 仅圆角变化，styles/index.css 仅入口恢复描边选择器变化；局部 hook 增加恢复阶段标记。
- 新标签页入口约 482.21 KB，无大于 500 KB 提示；既有 theme-init.js 提示不阻塞构建。
- 真实浏览器视觉、焦点和交互待用户验收，未添加模拟 DOM 或 UI 交互测试。

## 用户验收

用户于 2026-10-28 明确表示验证通过并要求本地提交；按已展示代码范围提交，沿用已有验证，不重复测试、类型检查或构建。代理未独立执行的浏览器验收仍如实保留。

## 文件边界与完整 Commit message

- 代码：shared/ui/sheet.tsx 的左侧圆角、Dock 局部 useDockSheetTooltip 与 styles/index.css 的恢复焦点描边修正。试用的其他源码和依赖均已恢复，不作为新增交付。
- 文档：本 Issue、Commit 记录、工作台与现行规范／来源；共用文档含前项未提交内容，最终提交前须完整展示，不自动暂存。

```text
fix(extension): 统一抽屉左侧圆角与关闭反馈

- 复用全局圆角设置右侧 Sheet 左上和左下边角
- 保留原抽屉样式并抑制关闭恢复后的入口描边
```

```text
docs(extension): 记录原抽屉恢复与圆角规范

- 明确 Sheet 原样式与左侧圆角交付边界
- 记录验证结果与浏览器验收限制
```

## 最终提交批准

用户于 2026-10-28 明确要求剩余全部提交，覆盖此前暂不提交 Issue 的指示。已批准代码提交保留，本轮将所有剩余规范、Issue、Commit 记录和工作台合并为一笔文档本地提交，随提交完成本工作项；未重复验证，不推送，README 未修改。

## 本轮统一文档提交

文件范围：apps/extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md、docs/changes/README.md，以及 module-boundaries、activity-cards、download-drawer、media-download-structure 四组 Issue／Commit 记录。前三项终态为已完成，media-download-structure 仍为已排队，未实施能力不记为交付。此前单项文档消息仅为历史提交方案，本轮以以下实际统一消息为准：

```text
docs(extension): 完结模块迁移并同步抽屉规范

- 记录导航设置与活动日历迁移及验收结果
- 同步原 Sheet 样式、左侧圆角和关闭反馈规范
- 保存媒体下载内部结构整理的后续工作项
```
