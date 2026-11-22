# 替换 Dock 下载入口与 EDU 锁图标：Commit 记录

## 对应 Issue

- [Issue](../issues/2026-10-22-extension-dock-download-edu-lock-issue.md)

## 预期交付边界

Dock DevTools 替换为使用共用 Sheet 的 Download 抽屉入口，正文完全留空；Settings 与 Download Header 均采用对应 Lucide 图标加标题与共用关闭按钮；EDU 默认 Lock、Hover LockOpen，保留点击解除模糊；图标统一由 UiIcon 按需接入 Lucide，不新增下载业务。

## 实际交付

本记录对应最终 Dock 提交：原 DevTools 入口替换为 Download，打开复用共用 Sheet 的空抽屉；Settings 与 Download Header 均显示 Lucide 图标和标题。两个入口共用 Dock 局部 hook 处理 Tooltip 互斥及焦点恢复后的提示抑制。旧 DevTools 配置与对应断言已移除，Newtab/UI 说明已同步。EDU 的 Lock/LockOpen 遮罩按用户要求先独立本地提交。

## 验证结果

扩展定向书签测试 3/3 通过；扩展完整测试 48/48 通过；TypeScript 类型检查通过；Chrome MV3 生产构建通过；`git diff --check` 通过。

## 未验证事项与限制

代理未自行在 Chrome 或 Edge 中验证视觉、Hover、Tooltip、关闭焦点、Esc 和遮罩交互；用户已表示验收通过。构建中出现既有 `theme-init.js` 非模块脚本打包提示，不影响本次构建成功。

## 用户验收

用户已验收通过，并明确要求拆分后提交到本地；代理未自行执行浏览器验证。

## 最终提交批准

已批准本地拆分提交；不推送或发布。

## 最终 Commit message

feat(extension): 将 Dock DevTools 替换为 Download 抽屉

- Download 使用空的共用 Sheet，Settings 与 Download 使用图标标题
- 两个入口共用 Dock 提示与焦点处理，移除旧 DevTools 配置
