---
date: "2026-10-28"
scope: extension
status: completed
type: task
---

# 恢复原 Sheet 样式并统一左侧圆角

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

用户试用 Drawer 后决定恢复原 Sheet。此前代理仅恢复组件类型但保留官方默认视觉，未满足恢复原样式的意图。本轮明确恢复试用前完整外观，仅保留用户批准的左侧圆角和关闭描边修正。

### 范围

- Download 与 Settings 恢复原 Sheet：右侧 420px、最大视口限制、主题模糊遮罩、浮层阴影、标题图标与分隔线、Button／UiIcon 关闭入口、200ms／160ms 动画。
- 共用 Sheet 右侧分支仅增加 rounded-l-[var(--radius)]，复用 theme.css 的 --radius: 1rem，左上／左下圆角、右侧直角贴边，不增加外侧间距。
- Dock 的 useDockSheetTooltip 保留关闭自动恢复焦点阶段的入口描边与 Tooltip 抑制；不取消焦点恢复或正常键盘反馈。
- Drawer 源码、Vaul、tw-animate-css 及其导入全部清理，恢复原依赖边界；内部下载和设置内容不变。

### 排除项

- 不修改下载、配置、权限、数据或后台，不做媒体下载目录重组，不接入 X／Helper。
- 不改日历修正、品牌资源或 README，不升级依赖，不新增模拟 DOM 或 UI 交互测试。
- 不提交 Git；前项代码提交保留，文档继续留在工作区。

## Todo

- [x] 对照试用前提交恢复共用 Sheet、设置和下载 Header、入口及原动画。
- [x] 复用全局 Token 添加左侧圆角，保留关闭恢复描边修正。
- [x] 清理 Drawer 与试用依赖，同步最终规范及记录。
- [x] 执行必要测试、类型检查、生产构建与 diff 检查，停在验收。

## 验收标准

- Chrome/Edge 加载根 dist/build/chrome-mv3，Download 和 Settings 均恢复试用前 420px、模糊遮罩、标题图标／分隔线、关闭入口和动画。
- 只有左上／左下增加全局 16px 圆角，右侧直角贴边，内部下载列表、筛选、清空和设置项行为保持。
- 关闭面板后入口不残留描边或 Tooltip，正常键盘聚焦仍有反馈；用户验证 Esc、外部点击和关闭按钮。
- 源码和依赖不保留 Drawer、Vaul、tw-animate-css；未修改 README，不自动提交。

## 唯一下一步

无。

## 交付记录

### 验证与限制

- 对照 54f33fc 核对源码：设置／下载的 Sheet 组合和 Dock 入口无差异；共用 Sheet 只增加左侧圆角，styles/index.css 只保留关闭恢复描边标记选择器变化。
- 扩展完整测试 15 个文件、77 项通过，类型检查、生产构建与 diff 检查通过。
- 新标签页入口约 482.21 KB，没有大于 500 KB 提示；既有 theme-init.js 提示保留，构建成功。
- pnpm 12.4.2 成功移除试用依赖，未升级其他依赖。浏览器视觉、焦点和交互未由代理验收，不以自动化结果代替用户验收。

### 历史交付记录

#### 对应工作项

- [Issue](2026-10-28-extension-download-drawer-issue.md)

#### 最终交付边界与实际结果

- 以代码提交 54f33fc 对应源码恢复试用前 Sheet 外观：420px、模糊遮罩、项目阴影、原标题图标与分隔线、Button／UiIcon 关闭入口、200ms／160ms 动画。
- Sheet 外壳只增加 rounded-l-[var(--radius)]，使用全局 1rem，仅左上／左下，右侧直角贴边。未修改全局 Token 或其他组件圆角。
- useDockSheetTooltip 保留关闭恢复焦点阶段的临时入口标记，CSS 仅抑制该阶段的描边；正常主动键盘操作反馈保留。
- Drawer、Vaul、tw-animate-css 试用代码及依赖已清理；未改变内部业务内容、日历修正或 README。
- 当前规范与来源记录同步最终结果，之前 Drawer／官方默认外壳试用不作为最终交付。

#### 验证与限制

- 扩展完整测试：15 个文件、77 项通过。
- TypeScript 类型检查、WXT 生产构建与 git diff --check 通过，产物位于根 dist/build/chrome-mv3。
- 设置／下载的 Sheet 组合和 Dock 入口与恢复基准核对一致，共用 Sheet 仅圆角变化，styles/index.css 仅入口恢复描边选择器变化；局部 hook 增加恢复阶段标记。
- 新标签页入口约 482.21 KB，无大于 500 KB 提示；既有 theme-init.js 提示不阻塞构建。
- 真实浏览器视觉、焦点和交互待用户验收，未添加模拟 DOM 或 UI 交互测试。

#### 用户验收

用户于 2026-10-28 明确表示验证通过并要求本地提交；按已展示代码范围提交，沿用已有验证，不重复测试、类型检查或构建。代理未独立执行的浏览器验收仍如实保留。

#### 文件边界与完整 Commit message

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

#### 最终提交批准

用户于 2026-10-28 明确要求剩余全部提交，覆盖此前暂不提交 Issue 的指示。已批准代码提交保留，本轮将所有剩余规范、Issue、Commit 记录和工作台合并为一笔文档本地提交，随提交完成本工作项；未重复验证，不推送，README 未修改。

#### 本轮统一文档提交

文件范围：apps/extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md、docs/ohmy-delivery/readme.md，以及 module-boundaries、activity-cards、download-drawer、media-download-structure 四组 Issue／Commit 记录。前三项终态为已完成，media-download-structure 仍为已排队，未实施能力不记为交付。此前单项文档消息仅为历史提交方案，本轮以以下实际统一消息为准：

```text
docs(extension): 完结模块迁移并同步抽屉规范

- 记录导航设置与活动日历迁移及验收结果
- 同步原 Sheet 样式、左侧圆角和关闭反馈规范
- 保存媒体下载内部结构整理的后续工作项
```

## 关联文档

- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：代码已独立提交、用户验收通过；用户最新要求剩余全部本地提交，本轮随统一文档提交完结，沿用已有结果，不追加验证或推送。
- 批准范围：用户最终明确「全部还原回去成sheet 然后加个border-radius」，圆角仅左上／左下。以本地代码提交 54f33fc 对应实现为恢复基准。
- 任务规模：小型界面修正；不保留 Drawer 试用实现与新增依赖。

### 历史后续事项

本项完成。后续工作按工作台队列和明确批准范围推进，README 按用户要求留到整轮整理最后更新，不自动实施排队功能或推送。
