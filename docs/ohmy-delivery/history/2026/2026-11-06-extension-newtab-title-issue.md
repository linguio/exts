---
date: "2026-11-06"
scope: extension
status: completed
type: bug
---

# 调整 Newtab 标题并修复 Dock 关闭动效

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

调整 Newtab 标题，并让 Dock 弹出层关闭后的焦点恢复不再残留图标抬起、缩放及阴影。

### 范围与排除项

- 范围：扩展 Newtab HTML 的 title 改为 `Exts — Ideas into Action`；撤回误改的官网 title。
- 统一修复：共用入口动效识别已有 data-restored-focus 标记，覆盖 Actions、Account、Settings 和 Download；保留鼠标悬停、主动键盘操作反馈及默认焦点恢复。
- 排除项：官网、扩展描述及其他页面标题；不提交、不推送或部署。

## Todo

- [x] 替换 Newtab 标签页标题并恢复官网标题。
- [x] 检查标题引用与 diff。
- [x] 修复共用入口的焦点恢复动效并验证 CSS 构建。
- [x] 交付用户浏览器验收。

## 验收标准

- Newtab 标签页及悬停预览标题为 `Exts — Ideas into Action`。
- 官网、扩展描述及其他页面标题保持原文。
- 鼠标移出入口后点击外部关闭菜单或抽屉，以及 Esc 关闭时，不因恢复焦点残留抬起、缩放及阴影；再次悬停与主动键盘操作仍有正常反馈。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-06-extension-newtab-title-issue.md)

#### 预期交付边界

修改扩展 Newtab HTML 的 title 为 `Exts — Ideas into Action`；统一修复 Dock 弹出层关闭后的焦点恢复动效，并维护本工作项文档。保留默认焦点恢复和正常悬停、主动键盘反馈。

#### 实际交付

Newtab title 已改为 `Exts — Ideas into Action`；误改的官网 title 已恢复。

共用入口 CSS 的抬起、缩放及阴影仅在真实悬停或非恢复焦点的 focus-visible 时触发，复用已有 data-restored-focus 标记，不改变 Hook 和官方焦点恢复。

#### 验证与限制

- 标题引用检查通过，官网无剩余改动。
- `pnpm --filter @exts/extension build` 通过，生成 dist/build/chrome-mv3；保留 theme-init 非 module 脚本及大 chunk 警告。
- HTML/CSS 变更未运行业务测试或类型检查，未新增交互模拟测试；未执行浏览器验收、部署，未更新稳定开发目录。

#### 用户验收

用户于 2026-11-06 明确要求本地提交，按批准完结；未另行确认浏览器交互验收。可复现步骤：加载 `dist/build/chrome-mv3`，打开新标签页确认标题；逐一打开 Actions、Account、Settings、Download，鼠标移出入口点击外部或按 Esc 关闭，确认无焦点恢复导致的抬起、缩放、阴影残留；再次悬停、Tab 和键盘操作反馈正常。鼠标仍在入口上时保留正常悬停动效。

#### 提交方案

代码边界：`apps/extension/src/entrypoints/newtab/index.html` 替换 title；`apps/extension/src/styles/index.css` 统一调整三条动效选择器。

```text
fix(extension): 调整 Newtab 标题并修复 Dock 关闭动效

- 使用 Exts — Ideas into Action 作为 Newtab 标题
- 抑制弹出层恢复焦点导致的入口动效残留
```

文档边界：本 Issue、Commit 记录与工作台，记录范围、验证及验收状态。

```text
docs(extension): 记录 Newtab 标题与 Dock 动效修复

- 记录标题和共用动效修改范围、构建结果与验收步骤
```

按用户批准分开本地提交代码与文档，同步 Issue、Commit 记录及工作台为已完成。

#### 最终提交批准

已批准：用户于 2026-11-06 明确要求 commit，本工作项已完成；不包含推送或部署。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 当前阶段：用户批准本地提交完结
- 已批准范围依据：用户指定「Exts — Ideas into Action」并要求直接修改，随后明确目标为 Newtab。
- 补充批准：用户要求将弹出层关闭后图标抬起不恢复的统一修复合并到本 Issue。

### 历史后续事项

无；用户于 2026-11-06 明确要求本地提交完结。浏览器交互未独立确认，稳定开发目录未更新，未推送。
