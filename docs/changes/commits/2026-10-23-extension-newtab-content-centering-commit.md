# 动态居中 Newtab 上半区并统一文件夹行距：交付记录

## 对应工作项

- [Issue](../issues/2026-10-23-extension-newtab-content-centering-issue.md)

## 预期交付边界

用户在布局验收中最新批准 Dock 中间分割线改为 48px 高、保持垂直居中及 1px 宽，作为本轮布局验收补充。

根据容器与左侧实际内容动态计算布局，使左侧换行、右侧固定宽度纵向排列，左右整体居中且两端平分剩余宽度；按用户最新批准，相邻两行文件夹预览框之间总共 32px，名称以 8px + 16px + 8px 占用其间。保留既有滚动及 Dock 边界，同步直接相关说明。

用户已批准实施，并在最终间距调整后明确要求本地 commit，批准完结当前 Issue；不推送或发布。

## 实际交付

- Dock 分割线局部高度从原有 64px 改为 48px，沿用原有居中、1px 宽度和主题颜色；新增样式的浏览器效果待用户确认。
- Newtab 上半区新增外层宽度监听，按左侧实际项目宽度及换行后的最宽行确定占宽，与固定右栏整体居中；容器尺寸变化时更新，卸载时清理监听。
- 首页文件夹名称固定单行 16px，上下各 8px，使相邻两行预览框之间总共 32px；名称样式限制在首页，保留现有单行省略。右栏纵向组合、独立滚动及 Dock 约束沿用原实现。
- 同步 Newtab 与扩展 UI 说明；未变更数据、业务、依赖、版本或更新日志。

## 验证与限制

- 名称间距改为 8px + 16px + 8px 后重新执行 `pnpm ext:build`，通过，生产产物已更新，仍有既有 `theme-init.js` 非 module 提示；此次仅修改局部行距与说明，未重复逻辑测试和类型检查。上下预览框总间距 32px 的视觉效果待用户确认。
- Dock 分割线改为 48px 后重新执行 `pnpm ext:build`，通过，生产产物已更新，仍有既有 `theme-init.js` 非 module 提示。此次仅调整局部高度类，未重复逻辑测试和类型检查，沿用前述阶段结果；实际视觉效果待用户确认。
- 现有扩展测试：11 个文件、48 项通过；首次因沙箱阻止子进程而出现 `spawn EPERM`，没有执行断言，在允许子进程的环境重试一次通过。
- 扩展类型检查、生产构建通过；产物为 `dist/build/chrome-mv3`，Manifest 可解析，版本 1.4.0，Newtab 入口存在；diff 空白检查通过。
- 构建保留既有 `theme-init.js` 非 module 提示；未新增布局尺寸或浏览器交互测试。ResizeObserver 属于既有 Chromium 能力，[Chrome 官方说明](https://developer.chrome.com/blog/new-in-chrome-64?hl=en)记录了支持起点。
- 浏览器实际缩放、换行、24px 间距、滚动、长名称省略及交互仍待用户验收，未启动浏览器或开发服务器，未更新 dev 稳定产物。当前多卡片场景未覆盖，不添加生产样本。

## 用户验收

用户明确要求本地 commit，依仓库规则批准当前 Issue 完结与提交；不核实用户是否实际执行全部步骤。浏览器未验证事项保留前述真实记录，不将其写为通过。

## 提交方案

- 文件边界：`apps/extension/src/app/NewtabApp.tsx`、`apps/extension/src/app/newtab.css`、`apps/extension/src/modules/newtab/views/dock/bookmark-dock.tsx`、`docs/extension/newtab.md`、`docs/extension/ui.md`，以及本工作项的 Issue、Commit 记录与 `docs/changes/README.md`，共 8 个文件。
- Diff 摘要：上半区按实际内容动态换行并整体居中；首页名称采用 8px + 16px + 8px，预览框纵向间隔合计 32px；Dock 分割线高 48px；同步现行说明和交付状态。
- 随提交发生的终态更新：Issue 与工作台为已完成，验收按用户本地提交指令记录完结，最终提交批准为已批准；提交失败时恢复待提交与待批准状态。

```text
fix(extension): 居中新标签页内容并统一布局间距

- 根据可用宽度动态换行并居中上半区内容
- 设置文件夹名称上下各 8px、单行行高 16px
- 将 Dock 分割线缩短至 48px 并同步说明与交付记录
```

## 最终提交批准

已批准：用户明确要求本地 commit，随本地提交完结；不推送或发布。
