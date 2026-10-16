# 修正新标签页 Exts 书签图标：Commit 记录

## 对应 Issue

[Issue](../issues/2026-10-16-extension-newtab-exts-icon-issue.md)

## 预期交付边界

直接复制现成的正式圆角展示 SVG 到 newtab 的 brand/exts.svg，不重新设计或额外改色。

## 实际交付

本地 exts.svg 已原样复制 assets/brand/website/exts.svg，撤掉此前新增的主题反色样式。Exts 保持 original；构建统一复制本地资源，删除从根直角源稿复制的特例。既有配置测试确认资源来源。

## 验证结果

最新构建通过；正式资源、本地副本与构建输出 SHA-256 一致。此前本工作项的 15 项测试、类型检查通过，本轮仅替换静态资源，不重复逻辑验证。

## 未验证事项与限制

浏览器视觉与交互由用户在 Chrome/Edge 验收。正式 SVG 内嵌 PNG，不是纯矢量。原样资源在明暗模式下均为黑底白色主体。未启动 dev server 或刷新 dist/dev 稳定目录。

## 用户验收

已通过；用户在看到交付和验证结果后明确要求“提交到本地”，同时表示验收通过。

## 最终提交批准

已批准本地提交，以及 Issue、Commit 记录和工作台完成状态更新；不推送或发布。提交失败时恢复待提交、待批准状态。

## 最终 Commit message

```text
fix(extension): 为 Exts 书签复用正式圆角 Logo

- 原样复制现有展示 SVG，保留完整背景与主体
- 统一使用本地书签资源，移除直角源稿复制特例
```
