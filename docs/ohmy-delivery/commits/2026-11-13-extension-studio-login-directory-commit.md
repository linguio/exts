# Studio 账号目录与 Dock 命名交付记录

- 对应 [Issue](../issues/2026-11-13-extension-studio-login-directory-issue.md)
- 状态：已完成
- 用户验收：已通过
- 提交批准：已批准；代码与文档分开本地提交

## 预期交付边界
将登录与账号 UI、状态判断归入 studio/login；Dock 与侧栏复用原有弹窗及菜单，统一 Dock 四个入口命名，不改变行为。

## 实际交付
- 登录提示页、共用登录弹窗、账号菜单、侧栏账号入口与原状态判断统一迁入 `pages/studio/login`。
- 使用 `login-page.tsx`、`account-dialog.tsx`、`account-menu.tsx`、`account-sidebar.tsx`、`account-state.ts` 五个实际文件；组件相应改名 AccountMenu、AccountSidebar，状态函数行为及名称保留。
- Dock 与侧栏引用同一 AccountDialog、AccountMenu；仅更新导入与组件命名，不新增副本。
- Studio 入口、布局边界、Daily 会话标识引用更新；原状态测试迁至对应 login 目录并保留全部用例。
- 删除迁移后空的 pages/login、pages/account 目录；features/account 未修改。

- Dock 的四个入口更名为 actions-entry.tsx、download-entry.tsx、account-entry.tsx、settings-entry.tsx，组件名同步改为 ActionsEntry、DownloadEntry、AccountEntry、SettingsEntry；index.tsx 更新引用，组件数量与排列不变。

## 验证结果与限制
- `pnpm --filter @exts/extension test tests/pages/studio/login/account-state.test.ts`：1 个文件、4 项通过。
- `pnpm --filter @exts/extension typecheck`：通过。
- `pnpm --filter @exts/extension build`：通过，产物 `dist/build/chrome-mv3`。
- Dock 入口改名后重新执行类型检查与构建，均通过；账号状态逻辑未再改动，复用上述 4 项测试结果。
- 构建仍提示 theme-init.js 非 module 脚本与 chunk 超过 500kB，未扩大处理。
- 迁移 diff 与旧路径引用已核对；组件职责和既有 Hook、事件及属性保持原样。
- 代理未执行浏览器视觉及交互验收，未新增同类测试；用户明确表示验收通过。代码已提交，文档随本笔提交完结；未推送或发布。

## 用户验收步骤
1. Chrome/Edge 加载 `dist/build/chrome-mv3`，打开 Newtab。
2. 未登录时分别打开 Dock 账号入口、Studio 正文 Sign in 与侧栏账号入口，预期均展示原有共用 GitHub/Google 登录弹窗。
3. 登录后分别查看 Dock 与侧栏账号菜单，预期账号信息、Settings 与 Log out 保持原行为及各自弹出位置。
4. 取消登录、退出及重新登录，预期原提示与页面会话隔离保持不变，Daily 正常进入。

5. 检查 Dock 的 Studio、操作、下载、账号和设置入口仍在原位置，原有弹出功能保持正常；无需新增配置。

## 提交边界与完整消息
代码：登录相关文件迁移、组件命名、Dock 四个入口改名、引用更新与原状态测试迁移。
文档：Issue、Commit 记录与工作台。

代码消息：
```text
refactor(extension): 统一账号目录与 Dock 入口命名

- 将登录页与账号界面迁入 Studio 并明确组件命名
- 统一 Dock 入口命名并复用账号组件，保留现有测试
```

文档消息：
```text
docs(extension): 记录账号目录与 Dock 命名整理

- 记录目录与命名调整范围及验证结果
- 同步验收状态与交付边界
```
