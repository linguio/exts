---
date: "2026-10-10"
scope: [repo, extension]
status: completed
type: task
---

# 整理 V3 图标与插头 Logo 独立规范

## 当前阶段

已完成。

## 目标与范围

### 背景

用户准备手绘 Tabs 网站所需图标，并作为 Kinari UI 配套资源。旧 V2 的产品身份、网站品牌职责和深浅资源命名需要改为通用个性化图标规则；现有插头 Logo 保持独立品牌规范。

### 目标

以 V3 替换本地 V2，明确一份手绘单色 SVG、主题换色、语义命名和 Iconfont 交付；将现有插头 Logo 规范整理为 docs 下的独立入口。

### 范围

- `docs/ohmy-icon-system.md` 修订为 V3；extension、download、photos、bookmark 使用同级语义名称，保留未要求改变的几何基准。
- 新增 `docs/exts-logo.md` 保存插头 Logo 规则，原 `assets/brand/GENERATION.md` 保留跳转入口，并同步资源 README。
- 整理 Logo 文档路径，验收产物位置以已批准的 `docs/build-release.md` 为准。
- 补充 Tabs 网站图标参考手绘与逐图外框规则；同步 apps/extension/AGENTS.md 的来源、手绘及外框约定，消除旧规则冲突。
- 最终源稿统一 viewBox="0 0 1024 1024" 与 currentColor，不写固定宽高，不额外生成 24×24 接入版；同步记录已确认的首批三个无框样本。
- 同步本 Issue、Commit 记录和工作台入口。

### 排除项

- 不修改现有图标、代码、依赖、外部 Notion 页面，不执行 Git 暂存、提交或推送。
- 不调整外框几何或图案登记尺寸，不生成用户尚未提供的手绘图标。
- 不改变插头 Logo 的主体、固定黑底白色及三端同步规则。

## Todo

- [x] 读取并导入 V2 原规范，确认设计基准。
- [x] 修订 V3 的职责、语义命名、单一 SVG 与主题规则。
- [x] 整理独立插头 Logo 文档及原入口。
- [x] 修正 Simple Icons 参考手绘、统一风格与逐图选择外框的规则。
- [x] 统一一份 1024 正式 SVG 的交付约定及扩展规范。
- [x] 核对规则、UTF-8、本地链接与 diff，停在用户验收。

## 验收标准

- 本地规范为 V3，extension 是与 download、photos 同级的个性化图标，不承担网站 Logo 职责。
- 文件及 Iconfont 名称不强制 ohmy- 前缀；每个图标只维护一份手绘单色 SVG，通过 currentColor 适配主题。
- 插头 Logo 独立文档保留原有主体、颜色、平台导出及验证规则，原入口仍可访问。
- Simple Icons 可作为手绘参考并进行统一风格的细节调整；有框或无框由用户逐图确认，不按品牌身份推断，不擅自重绘或替换资源。
- 正式 SVG 仅一份 1024 坐标的 currentColor 源文件；文档不再要求额外维护 24×24、黑色接入或深浅主题版本，显示适配由使用方负责。
- 文档及管理记录相互链接有效。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应 Issue

- [Issue](2026-10-10-repo-ohmy-icon-system-docs-issue.md)

#### 预期交付边界

将 V3 个性化图标规范与现有插头 Logo 规范分别保存到 docs，整理原入口与管理记录；不修改图标资源或外部页面。

#### 实际交付

- docs/ohmy-icon-system.md 以 V3 替换 V2：普通个性化图标采用 extension、bookmark、download、photos 语义名，一份手绘单色 SVG 由使用方控制主题颜色。
- 明确以 Simple Icons 原图为参考手绘并调整细节，统一视觉大小、颜色与绘制风格；外框由用户逐图确认，不按品牌身份决定。
- 同步 apps/extension/AGENTS.md，允许以 Simple Icons 原图为手绘参考；正式交付统一为一份 1024 坐标 currentColor SVG，无固定宽高或独立 24×24 接入版。未确认的图标不自动重绘或替换。
- 记录 GitHub、Notion、YouTube 首批样本均无框，圆润饱满风格尚待实际绘制验收。
- docs/exts-logo.md 独立保存插头 Logo 的既有规则，明确与图标库的职责边界，并按构建规范整理验收产物路径。
- assets/brand/GENERATION.md 保留跳转入口；资源 README 的规范链接与已批准主体版本同步。
- 同步 Issue、Commit 记录与工作台入口；现有图标和代码不变。

#### 验证结果

- 八份相关文档 UTF-8 解码成功，140 个本地链接目标存在。
- V3 的 13 节、语义名称、currentColor 和旧双版本规则清理检查通过；既有外框与四图案登记尺寸保留。
- Logo 的主体基准、固定黑底白色、正式导出哈希流程及根 dist 产物路径检查通过。
- 逐图外框与参考手绘规则核对通过；V3 及扩展规范不再保留品牌一律无框、有现成 SVG 就不能手绘的限制。
- 最终一份 1024 坐标 SVG、currentColor 及首批无框样本规则核对通过；V3 与扩展规范不再要求 24×24 独立接入版本。
- git diff --check 通过；工作区仅有本工作项八份文档变更。

#### 未验证事项与限制

- 本次只整理文档，未运行应用构建或图标视觉验收。
- 用户手绘图标尚未提供，尚未生成或上传 Iconfont；现有图标资源不变。
- 用户已验收并批准本地提交；不推送远端。

#### 用户验收

已通过：用户于 2026-10-10 确认已展示文档交付并批准本地提交。

#### 最终提交批准

已批准：用户同意已展示的八份文档、完整 Commit message 与结项字段更新。

#### 最终 Commit message

拟用，待用户审核与批准：

```text
docs(repo): 整理 V3 图标与插头 Logo 独立规范

- 明确语义命名与单一手绘 SVG 主题规则
- 分离插头 Logo 规范并整理文档入口
```

## 关联文档

- [独立规范](../../../ohmy-icon-system.md)
- [插头 Logo 规范](../../../exts-logo.md)
- [原规范](https://app.notion.com/p/3eefb7fd0360812d8651c3a4fcaa1de5)

## 历史补充

### 元信息

- 类型：小型任务
- 当前阶段：用户已验收并批准本地提交结项
- 用户批准：用户要求整理 V3 与独立 Logo 文档；以 Simple Icons 原图为参考统一绘制风格，逐图选择外框；正式 SVG 最终统一 1024 坐标，只维护一份，使用方自行调整显示大小。GitHub、Notion、YouTube 首批样本均无框

### 历史后续事项

无；用户已批准本地提交，提交成功后可开始独立的 SVG 调整工作项。
