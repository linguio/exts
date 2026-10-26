# Newtab 更新日志交付记录

- Issue：[补充 Newtab 更新日志](../issues/2026-10-26-website-newtab-changelog-issue.md)
- 状态：已完成
- 预期交付边界：官网新增 2026-10-26 的 Extension 更新日志，围绕 Studio / Actions 入口、书签分类与 SVG、文件夹滚动与细节三点；按用户最新要求将根产品版本与新条目同步为 1.6.0，不改变历史日志或实际功能。

## 实际交付
- 官网 Changelog 顶部新增 2026-10-26 的 Extension 条目，标题为「新增工作台入口并优化书签体验」。
- 三点分别介绍 Studio / Actions 入口、UI 书签分类与 SVG 配色、文件夹滚动与上下提示及渐变磨砂。
- 根 package.json 从 1.5.0 更新为 1.6.0，新条目沿用既有格式关联 `exts-chrome.zip · 1.6.0` 和 v1.6.0 附件路径；历史条目中的 1.5.0 和原链接保持不变。

## 验证结果与限制
- 初版官网类型检查与 `pnpm web:build` 通过。版本更新为 1.6.0 后，`node scripts/version.mjs` 输出 1.6.0；在 apps/website 直接执行 `node node_modules/typescript/bin/tsc --noEmit` 与 `node node_modules/vite/bin/vite.js build` 均通过，构建位于 `dist/build/exts-web`。
- 此次 pnpm 启动检查时意外进入依赖安装并因目录权限失败；停止该路径后使用已有工具验证，未升级或重装依赖，package 依赖声明和锁文件未修改。
- 仅静态文案变更，未新增或运行无关逻辑测试，没有启动开发服务器。
- 浏览器视觉与远端附件未实测，未重新构建扩展或桌面，不把关联 1.6.0 描述成已发布新附件；用户已批准两笔本地提交，提交时不追加验证，不推送、部署或发布。

## 用户验收
用户于 2026-10-26 明确要求本地提交并完结；不追问是否已实际验收，浏览器未由代理执行，不记为通过。

## 最终提交批准
用户于 2026-10-26 明确批准本地提交并完结；先提交版本与官网数据，再提交工作项文档及完成状态，不推送、部署或发布。

## 提交方案
- 版本与官网数据提交：`package.json` 和 `apps/website/src/features/changelog/changelog-data.ts`。
- 工作项文档提交：本 Issue、本 Commit 记录与 `docs/changes/README.md`，完成状态仅归入文档提交。

## 最终版本与官网数据 Commit message
```text
chore(repo): 更新产品版本至 1.6.0 并补充日志

- 将根产品版本更新为 1.6.0
- 官网补充 Newtab 三点更新并关联 1.6.0
- 保留历史日志与 1.5.0 附件链接
```

## 最终工作项文档 Commit message
```text
docs(website): 记录 Newtab 日志交付

- 记录三点日志范围与官网验证结果
- 同步验收限制与工作项完成状态
```
