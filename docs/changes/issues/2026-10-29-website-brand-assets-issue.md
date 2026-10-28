# 统一官网品牌资源目录

## 元信息

- 工作项：2026-10-29-website-brand-assets
- 状态：已完成
- 当前阶段：用户于 2026-10-29 确认验证通过并明确要求本地提交，代码与文档两笔提交完结；不追加验证，不推送或部署。
- 批准依据：用户确认品牌资源归位、重复与未引用资源清理，以及 README 工作台入口修正的小范围方案。
- 任务规模：小型行为保持整理，一个 Issue，不另建 Spec 或 Plan。

## 背景

官网品牌 SVG 分散在 src/assets 与 features/showcase/assets，两份 GitHub SVG 内容一致，showcase/assets/chatgpt.svg 没有直接源码引用；README 将历史已完成任务标为当前 Issue。

## 目标与范围

- 官网使用的品牌 SVG 统一归入 src/assets/brand，Header、下载入口和展示卡片直接引用；不新增图标组件封装。
- 合并内容相同的两份 GitHub 图标，清理无引用的 ChatGPT SVG，保留其他 SVG 原始内容。
- 更新 README 的资源职责与工作台入口，其他应用和根品牌源稿保持原样。

## 排除项

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

## 关联文档

- [Commit 记录](../commits/2026-10-29-website-brand-assets-commit.md)
- [工作台](../README.md)

## 唯一下一步

本工作项已按用户批准完结，无待执行开发步骤。
