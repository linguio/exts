# Studio 页面目录整理交付记录

- 对应 [Issue](../issues/2026-11-12-extension-studio-page-directories-issue.md)
- 状态：已完成
- 用户验收：已通过
- 提交批准：已批准；代码与文档分开本地提交

## 预期交付边界
Studio 页面目录迁移、layout 组织与 routes 命名；features/activity 和页面行为保持原样。

## 实际交付
- Overview 迁入 `apps/extension/src/pages/studio/overview/index.tsx`，内容不变。
- Daily 页面迁入 `apps/extension/src/pages/studio/activity/daily/index.tsx`，仅调整业务组件的相对导入。
- 页面注册文件 menu.ts 改为 routes.ts，更新页面与侧栏导入。
- 新增 layout/index.tsx，提取原侧栏容器、顶栏、面包屑与滚动组合；studio-sidebar.tsx、studio-content.tsx 分别迁入 layout/sidebar.tsx、layout/content.tsx。
- 账号访问判断、页面选择与会话恢复仍由原入口控制，布局通过属性接收侧栏、标题与正文，不增加账号读取或请求。

## 验证结果与限制
- `pnpm --filter @exts/extension typecheck`：通过。
- `pnpm --filter @exts/extension build`：通过，产物 `dist/build/chrome-mv3`。
- 构建提示 theme-init.js 非 module 脚本与 chunk 超过 500kB；未在本次扩大处理范围。
- 补充 layout 与 routes 整理后重新执行类型检查和构建，均通过。
- `pnpm --filter @exts/extension test tests/pages/studio/studio-access.test.ts`：1 文件、4 项通过；未新增测试。
- React 组件职责审查：布局未引入 Hook、请求或持久化，账号子树 key 与原事件处理保留。
- 代理未执行浏览器视觉和交互验收；用户明确表示验收通过。
- 用户批准两笔本地提交；代码已提交，文档随本笔提交完结。未推送或发布。

## 提交边界与完整消息
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
