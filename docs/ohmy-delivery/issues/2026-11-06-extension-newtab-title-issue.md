# 调整 Newtab 标题并修复 Dock 关闭动效

## 元信息

- 工作项：2026-11-06-extension-newtab-title
- 状态：已完成
- 当前阶段：用户批准本地提交完结
- 已批准范围依据：用户指定「Exts — Ideas into Action」并要求直接修改，随后明确目标为 Newtab。
- 补充批准：用户要求将弹出层关闭后图标抬起不恢复的统一修复合并到本 Issue。

## 背景与目标

调整 Newtab 标题，并让 Dock 弹出层关闭后的焦点恢复不再残留图标抬起、缩放及阴影。

## 范围与排除项

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

## 关联文档

- [交付记录](../commits/2026-11-06-extension-newtab-title-commit.md)

## 唯一下一步

无；用户于 2026-11-06 明确要求本地提交完结。浏览器交互未独立确认，稳定开发目录未更新，未推送。
