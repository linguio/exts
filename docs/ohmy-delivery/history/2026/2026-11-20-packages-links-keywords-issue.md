---
date: "2026-11-20"
scope: packages
status: cancelled
type: task
---

# 修正公共包主页与关键词

## 当前阶段

已关闭。具体取消或并入情况见交付记录。

## 目标与范围

### 背景与目标

registry ext-ui 0.3.0缺少显式主页，npm将其补为仓库根目录；WXT 1.0.3已有自身目录主页。两包repository均已为有效Git URL及对应directory。统一主页入口和用户审定的精简关键词。

### 范围与排除项

- exts-ui homepage为https://github.com/linguio/exts/tree/main/packages/exts-ui，keywords为shadcn-ui、ui、components。
- WXT homepage为https://github.com/linguio/exts/tree/main/packages/wxt-stable-output，keywords为wxt、chrome、extension。
- 保留repository.url的Git仓库地址及各自repository.directory，不把Git URL替换成tree网页地址；不调整bugs或README。
- 不自行升版本、改Changelog、上传或发布。已发布版本不能用相同版本覆盖，本地修正须后续获批版本发布才会在npm生效。
- 遵守根AGENTS“当前Issue的代码与文档提交全部成功前，不得开始下一个Issue”；本轮仅登记队列和配套记录。

## Todo

- [ ] 当前工作项完结后修改两包主页与精简关键词。
- [ ] 核对元数据与正式打包出口，避免打包后丢失字段；按实际影响选择验证。
- [ ] 记录本地结果与npm尚未更新状态，交用户验收。

## 验收标准

- 两包主页直达各自packages目录，关键词严格为用户最新选择的三个词。
- Git仓库字段仍符合monorepo规范；不宣称仅本地改动就已更新npm。
- 不自动引入新版本或发布；需发布时先由用户审定版本和中文Changelog。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-20-packages-links-keywords-issue.md)

#### 预期交付边界

两包主页直达目录，exts-ui关键词shadcn-ui/ui/components，WXT关键词wxt/chrome/extension；保留正确Git仓库/子目录元数据，不自行升版本或发布。

#### 实际交付

未独立实施。用户指定1.1.0/0.4.0后已并入[当前工作项](2026-11-20-extension-stable-output-103-issue.md)，后续交付及提交记录由其配套Commit记录维护，不单独提交此目标。

#### 验证与限制

已由当前工作项实施双包主页与关键词，并核对真实tarball独立安装后的元数据，详情以对应交付记录为准；目前未提交或发布，线上展示尚未更新。

#### 用户验收

用户已确认包主页与关键词的实际实现验收通过。

本次本地补记提交：`docs(repo): 补记历史工作项验收结果`。

#### 提交方案

待实施后填写范围、消息和验证结果。

#### 最终提交批准

2026-11-20用户批准当前主工作项发布前阶段“验收通过 push”，本归并记录随主工作项文档提交，不另行创建代码提交或自动正式发布。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 状态：已验收通过（已并入当前工作项）
- 当前阶段：用户确认实际实现验收通过；后续提交与发布状态以[当前Issue](2026-11-20-extension-stable-output-103-issue.md)为准
- 批准依据：用户要求包主页直达各自源码目录，确认exts-ui关键词shadcn-ui/ui/components、WXT关键词wxt/chrome/extension。
- 规模：小型npm展示元数据修正，不修改组件、构建或业务。

### 历史后续事项

随[当前Issue](2026-11-20-extension-stable-output-103-issue.md)统一准备，本文仅保留已审定字段，不维护另一套实施状态。
