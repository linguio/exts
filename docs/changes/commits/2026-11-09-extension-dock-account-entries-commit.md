# 整理 Dock 与账户菜单入口：交付记录

## 对应工作项

- [Issue](../issues/2026-11-09-extension-dock-account-entries-issue.md)

## 预期交付边界

- Studio Dock 入口统一为普通进入按钮，去除旧激活反馈，保留页面切换与位置记忆。
- 共享 Account 菜单移除 Billing，在 Notifications 下新增 Settings；Newtab 与 Studio 均打开现有设置抽屉，保留 Dock 独立 Settings 入口。
- 用户已批准实施，并于 2026-11-09 明确表示验收通过并要求本地提交；不推送或发布。

## 实际交付

- Studio 入口改用既有 Button entry/entry，移除入口 pressed、旧切换属性及专属选中样式；页面切换与位置记忆保留。
- 共享 Account 菜单移除 Billing 与无用 CreditCard 映射/类型，在 Notifications 下加入 Settings，使用原 SettingsSheet；两处入口共用菜单到抽屉的打开、关闭和焦点恢复逻辑。
- Dock 独立 Settings、菜单展开方向、未登录流程与设置数据读写保持既有逻辑；SettingsSheet 关闭回调补充事件参数供账户入口恢复焦点。
- 工作台、Issue、UI 规范及官方来源差异记录已同步。

## 验证与限制

- 扩展 typecheck 通过；清理 Billing 图标时发现遗留 UiIconName 项，修正后重试通过。
- 页面位置记忆、设置 store/API 三个测试文件共 10 项通过，使用 --maxWorkers=1 --no-file-parallelism。首次沙箱 spawn EPERM 未启动 worker，停止后沙箱外重试通过。
- 扩展生产构建通过，产物位于 `dist/build/chrome-mv3`；theme-init.js 与大分块警告保留。
- 未执行全量应用测试，代理未执行浏览器交互验收；用户已确认验收通过，未逐项提供浏览器检查细节。验收步骤见 Issue。

## 用户验收

2026-11-09 用户明确表示“验收通过 commit”，批准本地提交完结。

## 提交方案

### 代码提交

- 文件：apps/extension/src/app/App.tsx；components/custom/types.ts、ui-icon.tsx；pages/account/account-menu-content.tsx；pages/dock/dock-account.tsx、index.tsx、studio-entry.tsx；pages/settings/index.tsx；pages/studio/account-login.tsx；styles/index.css（均位于 apps/extension/src）。
- diff：Studio 改用普通入口按钮，清理旧激活反馈与 Billing 图标，账户菜单共用现有设置抽屉及关闭焦点恢复。

```text
fix(extension): 统一 Studio 入口并接通账户菜单设置

- 移除 Studio 入口旧选中反馈并复用 Dock 按钮样式
- 移除 Billing 并在两处账户菜单接入现有设置抽屉
```

### 文档提交

- 文件：docs/changes/README.md；本 Issue 与本 Commit 记录；docs/extension/ui.md；docs/web-ui-sources.md。
- diff：同步当前入口规则、来源差异、有效验证与用户验收；将 Issue 改为已完成、当前阶段改为已完结、唯一下一步改为无，工作台移至已完成索引，最终提交批准改为已批准。

```text
docs(extension): 完结 Dock 与账户菜单入口整理

- 记录入口调整与设置抽屉复用规则
- 同步验证结果、用户验收及工作项完成状态
```

## 最终提交批准

已批准。2026-11-09 用户要求本地提交；先代码后文档，不推送、不发布。
