---
date: "2026-11-28"
scope: [extension]
status: completed
type: feature
---

# 恢复 Studio 侧栏整行返回入口

## 当前阶段

用户已确认全部验收通过。

## 目标与范围

将退出入口移回 Studio 侧栏顶部。保留品牌内容，右侧使用上下双箭头，复用整行侧栏按钮和既有 New Tab 切换逻辑。范围限于退出入口。

## Todo

- [x] 将返回入口接回侧栏顶部。
- [x] 使用整行按钮提供点击和悬停反馈。
- [x] 验证扩展类型检查和构建。

## 验收标准

- 鼠标移过侧栏顶部品牌行任意位置时，整行显示悬停背景。
- 点击图标、品牌文字或行内留白均回到 New Tab。
- Studio 顶栏的退出按钮移除。

## 唯一下一步

已结项。

## 交付记录

- 退出入口已从顶栏移回侧栏品牌行，使用上下双箭头，沿用原有 New Tab 切换逻辑。
- pnpm 验证命令无输出，已终止。直接运行扩展已安装的 TypeScript 和 WXT，类型检查及 Chrome MV3 构建均通过。构建提示主题脚本打包和分块体积警告。
- 用户明确确认全部验收通过，并批准提交和推送。
- 按用户反馈移除额外的手形光标样式，保留官方侧栏按钮的整行悬停背景。

## 关联文档

- [扩展 UI 规范](../../../extension/ui.md)

## 提交记录

代码提交（`pages/studio/index.tsx`、`pages/studio/layout/index.tsx`、`pages/studio/layout/sidebar.tsx`），`aece8eb`。

```text
feat(extension): 恢复 Studio 侧栏整行返回入口

- 将退出入口移回侧栏品牌行并改用上下双箭头
- 复用整行悬停背景和返回 New Tab 行为
```

文档提交（本 Issue，状态设为 `completed` 并移入 2026 年历史目录）。

```text
docs(extension): 归档 Studio 侧栏返回入口工作项

- 记录类型检查、构建结果和用户验收
```
