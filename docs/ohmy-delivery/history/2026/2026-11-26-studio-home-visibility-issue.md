---
date: "2026-11-26"
scope: [extension]
status: completed
type: task
---

# 突出 Studio 返回首页入口

## 当前阶段

已完成。

## 目标与范围

在 Studio 顶栏最右侧放置常驻实心按钮，显示小房子图标和 Exit Studio，保留返回首页操作和提示。亮色主题为黑底白字，深色主题沿用高对比主按钮样式。

## Todo

- [x] 将返回首页入口移至顶栏右侧，采用现有实心按钮样式。
- [ ] 执行扩展类型检查。
- [x] 用户确认验收通过。

## 验收标准

- 打开 Studio 及切换页面时，顶栏最右侧始终显示小房子图标和 Exit Studio。悬停显示 Back to Home，点击返回扩展首页。

## 唯一下一步

无。

## 交付记录

- 复用现有 secondary 按钮样式，在图标按钮上显示小房子。按最新要求移除常驻 Home 文案。
- 调整为顶栏右侧的主按钮，文案为 Exit Studio，移除原侧栏入口。
- `git diff --check` 通过。pnpm 类型检查因无法创建临时目录而退出，直接运行本地 TypeScript 入口也因 Node 无法加载该入口而退出。用户确认验收通过。
- 用户批准本地提交。代码提交 `ff7e09f` 包含 Studio 的 `index.tsx`、`layout/index.tsx` 和 `layout/sidebar.tsx`。文档提交只包含本 Issue 的终态及归档。

```text
feat(extension): 在 Studio 顶栏突出返回首页入口

- 在顶栏右侧显示 Exit Studio 实心按钮
- 移除侧栏返回入口并保留返回首页提示
```

```text
docs(extension): 归档 Studio 返回首页入口工作项

- 记录验证结果和用户验收
- 将已完成工作项移入 2026 年历史目录
```

## 关联文档

无。
