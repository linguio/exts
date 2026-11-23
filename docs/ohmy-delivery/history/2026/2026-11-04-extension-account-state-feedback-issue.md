---
date: "2026-11-04"
scope: [extension]
status: completed
type: bug
---

# 修正账户状态并补充 Newtab 快捷登录

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

刚进入 Studio 就可能出现“无法读取登录状态，请重新打开账户后重试”。该文案不能说明实际失败环节，也不应把没有本地会话视为认证请求失败。用户应能区分未登录、登录失效和暂时无法确认状态。

用户已确认账户状态阶段验收通过，并要求在同一工作项补充 Newtab 快捷登录入口。

### 范围与排除项

- 范围：核对本地会话读取链路；区分无会话、有效会话、明确失效和临时错误；账户业务继续使用共用 Sonner 提示；Newtab Dock 在 Settings 旁增加 Account 图标，未登录点击直接打开现有 GitHub/Google 登录框，已登录时在 Dock 展开与 Studio 共用的完整账户菜单，复用同一账户状态与认证流程；补充对应验证。
- 排除项：不新增公共请求层、轮询、后端账户删除接口、账户删除推断、其他功能通知规则或登录授权流程改造；Actions 行为保持原样。

## Todo

- [x] 核对无本地会话时的实际调用和错误路径。
- [x] 调整账户状态结果及后台安全错误分类。
- [x] 调整 Studio 账户提示，保留自动检查和共用 Toast。
- [x] 完成针对性测试及阶段完整验证。
- [x] 在 Newtab Dock 增加 Account 快捷入口，复用现有登录框与账户状态。
- [x] 完成快捷入口相关自动化验证。
- [x] 用户确认快捷登录入口验收通过。

## 验收标准

- 无本地会话时显示未登录，不向认证服务器发请求，也不显示错误提示。
- 有效会话显示账户；过期会话只在有刷新令牌时尝试恢复，明确失效后显示未登录并给出准确提示。
- 网络或本地存储等暂时错误不被误报为已退出、账户被删除或 OAuth 配置错误；自动检查失败仍通过共用 Toast 提示。
- 页面重新获得焦点时仍能检查账户，持续的同一错误不重复刷屏；不引入周期轮询。
- Newtab 的 Settings 旁有 Account 入口；入口保持通用人像图标，未登录点击直接打开 GitHub/Google 登录框，已登录点击原地展开与 Studio 共用的完整账户菜单，包含相同的头像资料区、Account、Billing、Notifications 和退出项；不显示占位提示，也不跳转 Studio。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-04-extension-account-state-feedback-issue.md)

#### 预期交付边界

账户状态、后台错误分类、Studio 提示及 Newtab Dock Account 快捷入口的最小改动和相关验证；不加入轮询、公共请求层或后端账户删除能力。

#### 实际交付

无会话直接返回未登录；过期且无法刷新时标记会话失效；后台对状态读取失败返回安全错误类别及对应文案。Studio 继续通过共用 Sonner 提示，持续同一错误不随焦点恢复重复弹出，侧栏区分失效、暂时不可用与未登录。Newtab Dock 的 Settings 旁增加 Account 入口；未登录时复用 Studio 的 GitHub/Google 登录框，已登录时原地展开与 Studio 共用的完整账户菜单。

#### 验证与限制

账户控制器针对性测试 14 项通过；最终扩展完整测试 102 项通过，类型检查、Chrome MV3 生产构建及 `git diff --check` 通过。构建保留既有 theme-init.js 与大 chunk 警告。用户于 2026-11-05 确认整项验收通过；代理未独立执行 Chrome/Edge 交互验证，网络中断、令牌过期及账户删除未单独实测。当前后端没有账户删除的明确状态协议，本工作项不推断账户删除。

#### 用户验收

用户于 2026-11-05 表示“commit 验证通过”，批准整项验收和本地提交；不声称代理独立完成浏览器验收。

#### 提交方案

代码提交：`apps/extension/src/modules/dock/index.tsx`、`views/dock-account.tsx`，`apps/extension/src/modules/studio/components/account-dialog.tsx`、`account-login.tsx`、`account-menu-content.tsx`，`apps/extension/src/modules/studio/index.tsx`、`services/account-background.ts`、`account-controller.ts`、`auth-client.ts` 及 `tests/modules/studio/account-controller.test.ts`。Diff 涵盖账户状态分类、共用登录框和菜单、Newtab Dock 入口及逻辑测试。

完整消息：

```text
fix(extension): 修正账户状态并接入 Newtab 快捷登录

- 区分登录失效与账户状态暂时不可用
- 在 Newtab 复用登录框和完整账户菜单
```

文档提交：`docs/ohmy-delivery/history/2026/2026-11-04-extension-account-state-feedback-issue.md`、`docs/ohmy-delivery/history/2026/2026-11-04-extension-account-state-feedback-issue.md`、`docs/ohmy-delivery/readme.md`。Diff 同步工作项范围、实际验证与用户验收；代码提交成功后执行已批准的终态更新：Issue 与工作台改为已完成，验收 Todo 勾选，Commit 记录标记本地提交已批准。

完整消息：

```text
docs(extension): 完结账户状态与快捷登录工作项

- 记录交付范围、验证结果和用户验收
```

#### 最终提交批准

用户于 2026-11-05 明确要求本地 commit；上述两笔本地提交及机械性终态更新已批准并执行，未批准推送。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 当前阶段：用户验收通过并完成本地提交
- 已批准范围依据：用户要求继续处理无本地会话时的错误提示、过期与失效状态，保留自动检查和统一提示，不增加轮询；之后明确要求在同一 Issue 增加 Newtab Dock 的 Account 快捷登录入口。

### 历史后续事项

本工作项已按用户于 2026-11-05 的本地提交指令完结；后续新需求另建工作项。
