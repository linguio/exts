# 整理 Studio 页面目录

## 元信息
- 工作项：2026-11-12-extension-studio-page-directories
- 状态：已完成
- 规模：小型任务
- 批准依据：用户确认将 Overview 与 Activity 页面收进 pages/studio。

## 背景与目标
源码目录与 Studio 的实际页面层级对齐，不改变导航或业务行为。

## 范围
- 将 pages/overview/index.tsx 移至 pages/studio/overview/index.tsx。
- 将 pages/studio/daily-page.tsx 移至 pages/studio/activity/daily/index.tsx，更新实际引用。

- 用户补充批准：建立 layout/，迁入侧栏与内容边界、提取既有布局；menu.ts 改名 routes.ts，访问逻辑仍留在外层。

## 排除项
不移动 features/activity，不改变菜单、路由、页面样式、认证或业务逻辑，不修订无关历史文档。

## Todo
- [x] 移动两个页面并更新引用。
- [x] 完成扩展类型检查及构建，核对变更边界。
- [x] 记录结果并停在用户验收。

- [x] 整理 layout/ 与 routes.ts，保留访问和会话逻辑。
- [x] 对本次补充重新验证并记录结果。

## 验收标准
- Overview 与 Activity/Daily 均位于 pages/studio 内，旧页面路径不再保留。
- /overview 与 /activity/daily 路由保持不变；原业务逻辑保留。
- 扩展类型检查和构建通过，或如实记录阻塞。

## 关联文档
- [Commit 记录](../commits/2026-11-12-extension-studio-page-directories-commit.md)

## 唯一下一步
无；用户验收通过并批准代码与文档两笔本地提交，随文档提交完结。
