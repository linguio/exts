# 调整新标签页 Dock 书签与工具入口：Commit 记录

## 对应 Issue

[Issue](../issues/2026-10-15-extension-newtab-dock-issue.md)

## 预期交付边界

交换 GitHub 与 Gmail 并添加 Exts 书签，新增右侧 Settings 入口和 shadcn Sheet 外壳，调整 EDU hover 反馈。Sheet 从右侧打开，宽度 560px 且不超过屏幕，顶部 Header 包含“Settings”标题及下方分隔线，跟随当前明暗主题；内部设置项不在本次范围。Exts 使用现有官网与品牌 SVG，入口提示为“Settings”。

## 实际交付

收藏顺序改为 ChatGPT、Gmail、GitHub、Exts，Exts 指向 https://exts.linguio.dev/，构建直接复用根品牌 SVG。新增 Settings 按钮及基于现有 Radix 的 Sheet 外壳，沿用根主题 Token；EDU 遮罩取消 hover 背景替换与阴影，保留模糊，增加手形及整个遮罩触发的扫帚 1.06 倍缩放。无新增依赖或权限。

## 验证结果

定向配置测试先失败后通过（7/7）；最终全量测试 15/15、类型检查、构建、包体积及 diff 检查通过。Manifest、新标签页入口和品牌 SVG 原样输出核对通过。最终追加调整后 JS gzip 为 113820 字节、CSS gzip 为 4827 字节，均在现有预算内。

## 未验证事项与限制

代理未实测浏览器视觉、交互、键盘焦点、缩放或主题。供用户加载的正式产物为 dist/build/chrome-mv3，未启动开发服务或更新稳定开发目录；用户验收步骤见 Issue。

## 追加验收反馈

设置相关文案改为英文 Settings、Open settings 与 Close；Sheet 加宽至 560px，Header 改为 56px，关闭按钮随之居中。针对关闭后焦点恢复导致 Tooltip 弹出的问题，增加仅抑制恢复焦点提示的标记，保留默认焦点恢复与后续正常悬停提示。用户确认保留透明模糊效果并全局复用；Sheet 和 EDU 已统一使用 blur-overlay（主题透明色与 8px 背景模糊）。追加类型检查、构建、包体积和 diff 检查通过；用户后续通过本地提交请求确认验收，代理未独立实测。

## 共用样式整理

用户追加批准统一语义样式。书签、Dock 工具、Settings 共用 entry-trigger、entry-surface 和 entry-glyph，扫帚使用图形上移变体；遮罩模糊、入口缩放与上移参数集中到 Token。新增 docs/extension-ui.md，并在扩展 AGENTS 中链接与同步已批准组件范围。未新增模块 README，避免维护两套规范。整理后 15/15 测试、类型检查、构建、包体积及 diff 检查通过，用户后续通过本地提交请求确认验收。

## 用户验收

追加对齐扫帚与书签反馈：扫帚改用书签相同的过渡属性、1.06 倍缩放和 2px 上移；遮罩本身不移动；本次类型检查、构建、包体积及 diff 检查通过，用户后续通过本地提交请求确认验收。

已通过；用户看到完整交付与验证结果后明确要求拆分两笔本地提交，同时确认验收。

## 最终提交批准

已批准代码、文档两笔本地提交，以及 Issue、Commit 记录和工作台完成状态更新；不推送或发布。最终提交失败时恢复待提交、待批准状态。

## 交付拆分

用户明确要求拆成两笔本地提交：先提交代码与对应测试，再提交规范、AGENTS 与工作项终态；本记录对应最后的文档结项提交，不保存 Commit SHA。

代码提交信息：

```text
feat(extension): 完善新标签页 Dock 与共用样式

- 调整书签顺序并添加 Exts，新增 Settings Sheet
- 统一入口反馈与透明模糊遮罩，修正关闭后的 Tooltip
```

## 最终 Commit message

```text
docs(extension): 补充界面规范并完成 Dock 工作项

- 添加扩展界面规范，同步 AGENTS
- 将 Issue、Commit 记录和工作台更新为已完成
```
