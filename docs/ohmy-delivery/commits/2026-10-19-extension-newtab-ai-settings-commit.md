# 整理 AI 入口与设置分区：Commit 记录

## 对应 Issue

- [Issue](../issues/2026-10-19-extension-newtab-ai-settings-issue.md)

## 预期交付边界

AI 文件夹排第一并复用三个 SVG；Social Media 新增 Telegram，X 移入 Dock，Dock 顺序为 X、GitHub、Exts、Gmail；移除 General 与 Features 间分割线。

## 实际交付

- 新增 AI 文件夹并放在主书签区域第一，内部依次收录 ChatGPT、Grok、Cursor。Social Media 新增 Telegram、移出 X；复用四个图标源稿并补齐 WXT 资源清单。
- 移除 Dock 的 ChatGPT，收藏从左到右调整为 X、GitHub、Exts、Gmail；其余工具入口不变。
- 移除 General 与 Features 间的分割线；标题改为 12px、中等字重、较淡颜色，正文为 14px、常规字重；父容器统一维护 24px 内边距与分区间距，顶部 Header 分割线保留。
- 同步现有书签及资源测试、Newtab 和 UI 说明；未改 SVG 源稿、依赖、版本或更新日志。

## 验证结果

- 先确认既有针对性测试出现三项预期失败，实现后 7 项通过；最终扩展测试 34 项通过。
- 最新样式调整后，34 项测试、类型检查、生产构建和体积检查全部通过；Manifest 版本为 1.2.0，新标签页入口完整。
- 三个 AI SVG 与 Telegram 已输出，且与源文件字节一致；diff 空白检查通过。

## 未验证事项与限制

- 浏览器视觉、图标主题、文件夹、菜单与设置交互由用户验收；代理未执行此类测试。
- 构建出现既有 theme-init.js 非 module 提示，不阻止本次构建；本次未修改该入口。
- 未更新 dev 稳定目录、未生成 Release 包或推送。Telegram 已按用户追加批准接入，源文件保持不变。

## 用户验收

已通过：用户在查看阶段结果、验证限制及三笔拆分方案后明确确认本地提交。

## 最终提交批准

已批准：按已展示的书签与 Dock、Settings 样式、说明与记录三笔本地提交；最后一笔同步完成状态，不推送。

## 最终 Commit message

用户明确批准同一工作项按三个已展示边界拆分；本记录不保存 Commit SHA。

### 书签与 Dock

```text
feat(extension): 整理 AI 与社交书签入口

- 新增 AI 和 Telegram 入口，将 AI 文件夹置顶
- 调整 Dock 为 X、GitHub、Exts、Gmail
```

### Settings 分区样式

```text
fix(extension): 改善设置分区层级与间距

- 区分分区标题与设置项字重和颜色
- 移除分割线并统一为 24px 分区间距
```

### 说明与工作记录

```text
docs(extension): 同步新标签页入口与设置规范

- 记录书签分组、Dock 顺序和设置样式
- 补齐验证结果与工作项交付记录
```
