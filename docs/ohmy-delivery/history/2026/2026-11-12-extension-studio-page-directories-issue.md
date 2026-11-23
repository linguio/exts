---
date: "2026-11-12"
scope: [extension]
status: completed
type: task
---

# 整理 Studio 页面目录

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

源码目录与 Studio 的实际页面层级对齐，不改变导航或业务行为。

### 范围

- 将 pages/overview/index.tsx 移至 pages/studio/overview/index.tsx。
- 将 pages/studio/daily-page.tsx 移至 pages/studio/activity/daily/index.tsx，更新实际引用。

- 用户补充批准：建立 layout/，迁入侧栏与内容边界、提取既有布局；menu.ts 改名 routes.ts，访问逻辑仍留在外层。

### 排除项

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

## 唯一下一步

无。

## 交付记录

### 历史交付记录

- 对应 [Issue](2026-11-12-extension-studio-page-directories-issue.md)
- 状态：已完成
- 用户验收：已通过
- 提交批准：已批准；代码与文档分开本地提交

#### 预期交付边界
Studio 页面目录迁移、layout 组织与 routes 命名；features/activity 和页面行为保持原样。

#### 实际交付
- Overview 迁入 `apps/extension/src/pages/studio/overview/index.tsx`，内容不变。
- Daily 页面迁入 `apps/extension/src/pages/studio/activity/daily/index.tsx`，仅调整业务组件的相对导入。
- 页面注册文件 menu.ts 改为 routes.ts，更新页面与侧栏导入。
- 新增 layout/index.tsx，提取原侧栏容器、顶栏、面包屑与滚动组合；studio-sidebar.tsx、studio-content.tsx 分别迁入 layout/sidebar.tsx、layout/content.tsx。
- 账号访问判断、页面选择与会话恢复仍由原入口控制，布局通过属性接收侧栏、标题与正文，不增加账号读取或请求。

#### 验证结果与限制
- `pnpm --filter @exts/extension typecheck`：通过。
- `pnpm --filter @exts/extension build`：通过，产物 `dist/build/chrome-mv3`。
- 构建提示 theme-init.js 非 module 脚本与 chunk 超过 500kB；未在本次扩大处理范围。
- 补充 layout 与 routes 整理后重新执行类型检查和构建，均通过。
- `pnpm --filter @exts/extension test tests/pages/studio/studio-access.test.ts`：1 文件、4 项通过；未新增测试。
- React 组件职责审查：布局未引入 Hook、请求或持久化，账号子树 key 与原事件处理保留。
- 代理未执行浏览器视觉和交互验收；用户明确表示验收通过。
- 用户批准两笔本地提交；代码已提交，文档随本笔提交完结。未推送或发布。

#### 提交边界与完整消息
代码：Overview/Daily 页面迁移、Studio 入口调整、layout 三个文件与 routes.ts。
文档：本 Issue、Commit 记录与工作台。

代码消息：
```text
refactor(extension): 将概览与活动页面归入 Studio 目录

- 按 Studio 页面层级整理 Overview、Daily 与布局目录
- 将页面注册改名为 routes 并保持导航与活动业务逻辑不变
```

文档消息：
```text
docs(extension): 记录 Studio 页面目录整理

- 记录目录迁移范围与验证结果
- 同步工作项状态与验收说明
```

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 规模：小型任务
- 批准依据：用户确认将 Overview 与 Activity 页面收进 pages/studio。

### 历史后续事项

无；用户验收通过并批准代码与文档两笔本地提交，随文档提交完结。
