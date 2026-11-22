# 设置抽屉初始焦点交付记录

- 对应 [Issue](../issues/2026-10-17-extension-settings-initial-focus-issue.md)
- 状态：已完成
- 预期交付边界：打开抽屉时聚焦 Settings 标题，避免自动触发主题 Tooltip，保留主动提示与键盘操作。
- 实际交付：仅修改 DockSettings，打开时通过 onOpenAutoFocus 聚焦 Settings 标题，标题使用 tabIndex=-1，不进入常规 Tab 顺序；保留主题 Tooltip 和关闭焦点恢复实现。
- 自动化验证：扩展 7 个文件、34 项测试通过；类型检查、生产构建、包体积和 git diff --check 通过。JS gzip 126086B、CSS gzip 6576B、字体 69652B。构建保留现有经典 theme-init.js 提示，构建成功且文件已生成。
- 未验证事项：Chrome/Edge 实际焦点、Tooltip、键盘及主题操作由用户验收。
- 用户验收：用户在收到交付说明后要求提交到本地，按仓库流程确认验收通过；代理未独立执行浏览器交互验收。
- 最终提交批准：已批准；仅本地提交，不推送、不部署。
- 最终 Commit message：

```text
fix(extension): 避免打开设置时自动显示主题提示

- 将设置抽屉初始焦点移到标题并保留主题主动提示
- 记录自动化检查结果及浏览器验收步骤
```
