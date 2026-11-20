# 修正公共包主页与关键词

## 元信息

- 工作项：2026-11-20-packages-links-keywords
- 状态：已并入当前工作项
- 当前阶段：用户指定双包新版本后并入版本与来源准备，不再独立实施；以[当前Issue](2026-11-20-extension-stable-output-103-issue.md)为唯一实施事实来源
- 批准依据：用户要求包主页直达各自源码目录，确认exts-ui关键词shadcn-ui/ui/components、WXT关键词wxt/chrome/extension。
- 规模：小型npm展示元数据修正，不修改组件、构建或业务。

## 背景与目标

registry ext-ui 0.3.0缺少显式主页，npm将其补为仓库根目录；WXT 1.0.3已有自身目录主页。两包repository均已为有效Git URL及对应directory。统一主页入口和用户审定的精简关键词。

## 范围与排除项

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

## 关联文档

- [Commit记录](../commits/2026-11-20-packages-links-keywords-commit.md)

## 唯一下一步

随[当前Issue](2026-11-20-extension-stable-output-103-issue.md)统一准备，本文仅保留已审定字段，不维护另一套实施状态。
