---
date: "2026-10-10"
scope: extension
status: completed
type: feature
---

# 添加 npm 与 Simple Icons 书签

## 当前阶段

已完成。

## 目标与范围

### 背景

用户已在新标签页 assets/brand 中新增 npm.svg 和 simpleicons.svg，现有书签配置尚未接入这两个资源。

### 目标

在 DevOps 文件夹中提供 npm 入口，在底部 Dock 的 Components 菜单中提供 Simple Icons 入口，分别打开用户指定的官网。

### 范围

- 在 BOOKMARK_GRID 的 DevOps items 中加入 npm，地址 https://www.npmjs.com/，图标 brand/npm.svg。
- 在 DOCK_COMPONENTS 的 bookmarks 末尾加入 Simple Icons，地址 https://simpleicons.org/，图标 brand/simpleicons.svg。
- 使用用户新增的 SVG，沿用现有书签渲染与交互方式，并登记到构建资源清单。
- 同步本 Issue、Commit 记录和工作台。

### 排除项

- 不重绘、移动或转换用户提供的 SVG，不调整 Dock 布局或交互。
- 不修改其他书签、依赖、桌面、官网或发布流程。
- 不执行浏览器视觉与交互验收，不自动提交或推送。

## Todo

- [x] 核对两份 SVG 与现有书签图标接入方式。
- [x] 将 npm 与 Simple Icons 加入指定分类并配置官网地址。
- [x] 执行必要的配置、类型检查和构建验证，记录实际结果。
- [x] 展示变更并交付用户在 Chrome/Edge 验收。

## 验收标准

- DevOps 文件夹包含 npm，打开 https://www.npmjs.com/。
- 底部 Dock 的 Components 菜单最后一项为 Simple Icons，打开 https://simpleicons.org/。
- 两个入口使用用户提供的对应 SVG，其他书签和分类保持原有行为。
- 配置、类型检查与构建通过；视觉与交互以用户实际加载验收为准。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应 Issue

- [Issue](2026-10-10-extension-npm-simpleicons-bookmarks-issue.md)

#### 预期交付边界

使用用户提供的 npm.svg 和 simpleicons.svg，将 npm 接入 DevOps 文件夹，将 Simple Icons 接入底部 Dock 的 Components 菜单，并配置指定官网地址。

#### 实际交付

- DevOps 文件夹新增 npm，地址 https://www.npmjs.com/。
- Dock Components 菜单在最后加入 Simple Icons，地址 https://simpleicons.org/。
- 两项均引用用户提供的 brand SVG 并启用现有 adaptive 单色适配；资源登记进入 WXT 产物清单，源 SVG 未修改。
- 同步已有书签配置与资源完整性测试；按用户确认结项旧发布 Issue，并更新工作台。

#### 验证结果

- 定向测试先确认缺少两项书签及资源登记导致 3 项预期失败，接入后扩展全量测试 15/15 通过。
- 使用仓库指定 Node 24.16.0 直接运行现有本地工具：TypeScript --noEmit、WXT 生产构建和体积预算检查均通过。
- dist/build/chrome-mv3 的 Manifest 可解析，两份 SVG 与源文件逐字节一致。
- JS gzip 112363 字节、CSS gzip 4796 字节、字体 69652 字节，未生成 source map。
- 原 pnpm/Volta 入口无输出，已停止该运行；直接运行工具验证成功，没有修改运行时或包管理器配置。
- 用户要求 Simple Icons 调整为 Components 最后一项后，书签定向测试 4/4 通过，生产构建重新成功。
- Git diff 空白检查通过。

#### 未验证事项与限制

用户已确认验收通过；代理未独立执行 Chrome/Edge 视觉与交互验收。仅生成生产目录 dist/build/chrome-mv3，未更新稳定开发目录或现有发布 ZIP。旧发布 Issue 按用户确认结项，本轮未重新核验远程结果。

#### 可复现验收

1. Chrome 打开 chrome://extensions（Edge 打开 edge://extensions），开启开发者模式，加载仓库根 dist/build/chrome-mv3；已加载该目录时点击重新加载。
2. 打开新标签页，进入 DevOps 文件夹，确认 npm 显示对应图标，点击打开 https://www.npmjs.com/。
3. 点击底部 Dock 的 Components，确认最后一项显示 Simple Icons 及对应图标，点击打开 https://simpleicons.org/。
4. 切换系统明暗主题，确认两个单色图标可辨识；确认已有书签仍在、菜单关闭与再次打开行为正常。

#### 用户验收

已通过：用户于 2026-10-10 明确表示“通过 提交到本地”。

#### 最终提交批准

已批准：用户明确要求本地提交，范围包含已展示的 11 个文件及 Issue、Commit 记录、工作台的机械性结项更新；未批准远程推送。

#### 最终 Commit message

```text
feat(extension): 添加 npm 与 Simple Icons 书签

- 将 npm 加入 DevOps 并将 Simple Icons 加入 Dock Components
- 接入用户提供的图标资源并同步配置验证
- 同步发布结项状态与本次书签工作记录
```

## 关联文档

- [构建与分发规范](../../../build-release.md)

## 历史补充

### 元信息

- 类型：小型任务
- 当前阶段：用户已确认验收通过并批准本地最终提交
- 用户批准：用户要求 npm 加入 DevOps，Simple Icons 加入底部 Dock 的 Components；已批准创建本 Issue 与配套 Commit 记录，并明确要求继续实施

### 历史后续事项

无；用户已验收通过并批准本地最终提交。
