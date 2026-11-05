# 统一 Dock 弹出层入口交互：交付记录

## 对应工作项

- [Issue](../issues/2026-11-05-extension-dock-overlay-hook-issue.md)

## 预期交付边界

四个 Dock 入口共用 Tooltip 与焦点恢复处理，Settings 和 Download 内部聚焦方式保留。

## 实际交付

- 将 useDockSheetTooltip 整理为 useDockOverlay，四个 Dock 入口统一使用打开状态、Tooltip 互斥、关闭恢复焦点阶段的提示与描边抑制。
- 删除 Actions 单独的外部点击阻止焦点恢复及 blur 逻辑，采用组件默认焦点恢复；Account 登录框和菜单向入口传递关闭焦点事件。
- Account 登录成功关闭时同步入口状态，Settings 与 Download 打开时仍聚焦内部标题。
- 同步扩展 UI 规范，不修改官方组件或全局 Token。
- 用户反馈仍有一闪而过：静态追踪发现关闭焦点回调中的状态提交可能晚于默认 focus，改为开始关闭时预置提示抑制与描边标记；未添加延时或取消焦点恢复，后续用户澄清为 ⌘Tab 切换后弹出内容消失；菜单失焦关闭已核实属于官方默认行为，未将此前时序推断记作该现象的根因。


## 验证与限制

- `pnpm --filter @exts/extension typecheck`：关闭闪现修正后重新执行，通过。
- `pnpm --filter @exts/extension build`：关闭闪现修正后重新执行，通过，产物 dist/build/chrome-mv3，约 1.71 MB。沿用 theme-init 普通脚本无法打包提示及大于 500 kB chunk 警告。
- React 变更静态复核：Hook 顶层调用、业务状态留在业务组件、共享事件可选透传、保留官方焦点恢复；未增加依赖或交互模拟测试。
- 不运行与改动无关的业务测试；浏览器视觉与交互未由代理验证，稳定开发目录未更新。
- 用户验收：Chrome/Edge 加载 dist/build/chrome-mv3，在四个入口分别打开弹出层并点击外部或按 Esc 关闭；入口不应残留 Tooltip 或恢复焦点附带的描边。移开再悬停应显示提示，Tab 重新聚焦应有正常描边，Enter/空格打开应正常。
- Account 分别验收未登录 Dialog 和已登录菜单，以及登录成功后的关闭；Settings / Download 打开不应自动触发内部按钮 Tooltip。


## 用户验收

用户于 2026-11-05 明确表示“验收通过”，并于 2026-11-06 批准本地提交完结。用户已确认菜单保留官方失焦关闭、Dialog / Sheet 沿用默认行为，公共 Hook 只统一 Tooltip 与焦点反馈；不增加 ⌘Tab 特殊处理。

## 提交方案

按用户于 2026-11-06 的指令执行本地提交。代码范围：pages/dock 下四个入口、新 Hook 与旧 Hook 删除，pages/account 下 Dialog 与菜单的关闭事件透传；文档范围：扩展 UI 规范、工作台、Issue 与交付记录。

代码消息：

```text
fix(extension): 统一 Dock 弹出层的提示与焦点反馈

- 四个入口复用弹出层 Hook 并移除重复关闭处理
- 抑制恢复焦点附带的提示与描边并同步账户关闭状态
```

文档消息：

```text
docs(extension): 记录 Dock 弹出层共用交互规则

- 同步入口提示与焦点恢复规则
- 记录实现范围、编译结果和浏览器验收步骤
```

随本次文档提交将工作项与工作台同步已完成；用户已验收通过并批准本地提交。

## 最终提交批准

2026-11-06 用户明确要求 commit，已批准本地提交；未批准推送。
