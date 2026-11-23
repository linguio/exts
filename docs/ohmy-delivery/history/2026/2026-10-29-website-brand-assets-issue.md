---
date: "2026-10-29"
scope: [website]
status: completed
type: task
---

# 统一官网品牌资源目录

## 当前阶段

已完成。

## 目标与范围

### 背景

官网品牌 SVG 分散在 src/assets 与 features/showcase/assets，两份 GitHub SVG 内容一致，showcase/assets/chatgpt.svg 没有直接源码引用；README 将历史已完成任务标为当前 Issue。

- 官网使用的品牌 SVG 统一归入 src/assets/brand，Header、下载入口和展示卡片直接引用；不新增图标组件封装。
- 合并内容相同的两份 GitHub 图标，清理无引用的 ChatGPT SVG，保留其他 SVG 原始内容。
- 更新 README 的资源职责与工作台入口，其他应用和根品牌源稿保持原样。

### 排除项

- 不修改页面文案、样式、交互、轮播 Hook、产品分类、更新日志和下载地址。
- 不改 public 下的正式 Exts 品牌派生资源，不升级依赖，不增加全局状态或测试框架。
- 不自动提交、推送或部署；不执行浏览器视觉和交互验收。

## Todo

- [x] 建立 Issue、Commit 记录并展示范围。
- [x] 迁移品牌 SVG、同步引用、合并重复资源并清理无引用文件。
- [x] 更新 README，核对资源内容和引用，运行必要逻辑测试、类型检查、构建与 diff 检查。
- [x] 记录结果及限制，交付用户验收。

## 验收标准

- 所有模块内品牌 SVG 引用统一指向 src/assets/brand，同一 GitHub SVG 只有一份，旧 showcase/assets 目录被清理。
- 保留的 SVG 内容与迁移前逐字节一致，首页示意图、Header 图标和平台下载入口表现不变。
- README 正确说明资源职责，并通过工作台查阅当前任务。
- 现有官网逻辑测试、类型检查与生产构建通过，实际显示和下载由用户验收。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-10-29-website-brand-assets-issue.md)

#### 实际交付

- 11 份官网品牌 SVG 统一归入 src/assets/brand；Header、平台下载和首页展示卡片改用统一资源路径。
- 两份内容相同的 GitHub SVG 合并为一份，删除无源码引用的 ChatGPT SVG，清理旧 showcase/assets 目录。
- README 同步资源职责，将失效的“当前 Issue”标注改为项目工作台入口。
- 三处组件仅改导入；页面文案、样式、交互、轮播、正式 public 品牌资源、下载地址和依赖均未修改。

#### 验证与限制

- node --test apps/website/tests/showcase/card-pool.test.ts apps/website/tests/products/categories.test.ts：10 项通过。
- pnpm --filter @exts/website typecheck：通过。
- pnpm web:build：通过；产物为根 dist/build/exts-web。
- 11 份保留 SVG 与迁移前逐字节一致；三处组件除预期导入路径外内容一致；所有 src/assets 导入目标均存在。
- git diff --check：通过。
- 用户于 2026-10-29 明确确认验证通过；代理未独立执行浏览器视觉、交互或真实下载验收，未部署线上。

#### 用户验收

状态：用户于 2026-10-29 确认验证通过并批准本地提交；以下步骤保留供复现。

1. 在根目录运行 pnpm web:dev，使用终端显示的地址在 Chrome／Edge 打开首页。
2. 检查 Header 的 GitHub 图标、macOS／Chrome 下载入口图标和 Newtab 示意中的品牌图标均正常显示，卡片轮播与原样一致。
3. 打开产品介绍和更新日志，检查共用 Header 图标仍正常；下载入口保持原链接，无新增加载或提示行为。
4. 检查 apps/website/README.md 中的资源目录说明及“项目工作台”链接。

#### 文件边界与完整 Commit message

代码：apps/website/src/assets/brand 下的迁移资源、旧资源删除，以及 src/components/layout/site-header.tsx、src/features/download/platform-downloads.tsx、src/features/showcase/showcase-cards.tsx 的导入调整。

```text
refactor(website): 统一品牌资源目录并清理重复图标

- 将平台与展示卡片品牌 SVG 归入统一资源目录
- 合并 GitHub 图标并清理未引用资源
```

文档：apps/website/README.md、本 Issue、Commit 记录及 docs/ohmy-delivery/readme.md。

```text
docs(website): 同步品牌资源职责与整理记录

- 修正资源目录说明与工作台入口
- 记录迁移验证结果和用户验收步骤
```

#### 最终提交批准

已批准；用户于 2026-10-29 明确要求本地提交，代码与文档按已展示范围分开提交。Issue、Commit 记录与工作台同步为已完成；沿用已有验证，提交不追加测试、类型检查或构建，不推送或部署。

## 关联文档

- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：用户于 2026-10-29 确认验证通过并明确要求本地提交，代码与文档两笔提交完结；不追加验证，不推送或部署。
- 批准依据：用户确认品牌资源归位、重复与未引用资源清理，以及 README 工作台入口修正的小范围方案。
- 任务规模：小型行为保持整理，一个 Issue，不另建 Spec 或 Plan。

### 历史后续事项

本工作项已按用户批准完结，无待执行开发步骤。
