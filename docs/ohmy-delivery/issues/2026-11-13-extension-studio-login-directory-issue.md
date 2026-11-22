# 统一 Studio 账号目录与 Dock 入口命名

## 元信息
- 工作项：2026-11-13-extension-studio-login-directory
- 状态：已完成
- 规模：小型任务
- 批准依据：用户确认账号 UI 收入 studio/login，使用 login-page、account-dialog、account-sidebar、account-menu、account-state 命名；Dock 复用同一弹窗和菜单。

- 补充批准：用户明确要求将 Dock 入口命名调整合并到当前 Issue。

## 背景与目标
登录提示页、账号入口和共用弹窗目前分散在多个页面目录，统一归属并明确命名。

## 范围
- 将 pages/login、pages/account、studio/account-login.tsx 和 studio/studio-access.ts 的现有实现迁入 studio/login。
- 页面命名为 login-page.tsx，侧栏账号为 account-sidebar.tsx，菜单为 account-menu.tsx，状态判断为 account-state.ts。
- 更新 Studio、Dock、Daily 与现有状态测试的引用，保留测试覆盖。

- Dock 四个入口改为 actions-entry、download-entry、account-entry、settings-entry，组件对应改名；保留 studio-entry 与 use-dock-overlay，不合并或新增组件。

## 排除项
不修改认证协议、令牌、登录退出流程、样式、菜单项目和导航；不复制登录弹窗或菜单，不改 features/account。

## Todo
- [x] 迁移登录与账号 UI、状态文件并更新命名及引用。
- [x] 同步状态测试位置并执行对应测试、类型检查和构建。
- [x] 记录结果与限制，停在用户验收。

- [x] 统一 Dock 四个入口命名并更新引用。
- [x] 重新检查类型与构建，补充验收记录。

## 验收标准
- studio/login 中只有实际迁入的五个文件，旧页面目录和文件不再保留。
- Dock 与侧栏引用同一个 AccountDialog 和 AccountMenu，保留各自入口外观。
- 未登录提示、账号菜单、状态判断及会话隔离行为保持不变。
- Dock 文件数量与入口排列不变，四个入口文件统一使用 *-entry.tsx 命名。
- 必要检查通过，浏览器行为由用户验收。

## 关联文档
- [Commit 记录](../commits/2026-11-13-extension-studio-login-directory-commit.md)

## 唯一下一步
无；用户验收通过并批准代码与文档两笔本地提交，随文档提交完结。
