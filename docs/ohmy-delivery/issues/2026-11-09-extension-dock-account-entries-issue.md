# 整理 Dock 与账户菜单入口

## 元信息

- 工作项：2026-11-09-extension-dock-account-entries
- 状态：已完成
- 当前阶段：用户验收通过，代码与文档本地提交完结
- 已批准范围依据：用户要求将 Studio 入口与账户菜单两项整理为下个 Issue；随后用户批准继续实施，并于 2026-11-09 明确表示验收通过并要求本地提交。
- 规模：小型任务，使用一个 Issue 与 Todo，不单独创建 Spec、Plan 或 Sub-issue。

## 背景与目标

Dock 的 Studio 入口仍使用 Toggle，带有不同于其他入口的悬停背景与旧选中态；当前入口进入 Studio 后 Dock 隐藏，不再需要切换按钮的激活反馈。Newtab 与 Studio 已共用账户菜单，需要移除 Billing，并增加可打开现有设置的 Settings 入口。

## 范围与排除项

- Studio 入口改用现有 Button 的 entry 组合，与其他 Dock 入口共用悬停反馈；点击只进入 Studio，清理该入口无用的 pressed 属性、切换文案及专属选中样式。
- 保留首页与 Studio 的页面切换、返回首页和位置记忆逻辑。
- 共享账户菜单移除 Billing，在 Notifications 下方新增 Settings，使用现有 settings 图标。
- Newtab Dock 与 Studio Account 菜单均支持点击 Settings：关闭账户菜单后打开现有 SettingsSheet，复用相同内容、设置读写与关闭行为，关闭后恢复到各自账户入口；保留菜单原有弹出方向。
- 保留 Dock 原有 Settings 入口，保持未登录时的账户登录流程不变。
- 排除项：实现 Account、Notifications 业务功能，新增设置项，改变认证或云端设置契约，重新设计菜单或抽屉外观，删除其他入口，以及推送、发布或部署。

## Todo

- [x] 将 Studio 入口改为普通进入按钮，清理入口旧选中逻辑，保留页面状态与位置记忆。
- [x] 调整共享账户菜单条目，并让两处账户入口复用现有设置抽屉及菜单到抽屉的衔接行为。
- [x] 按影响范围完成必要逻辑、类型与构建检查，记录实际结果与限制；不新增视觉或交互自动化测试。
- [x] 提供 Chrome/Edge 加载产物与可复现验收步骤，停在用户验收。

## 验收标准

- 在 Chrome 或 Edge 加载本次构建产物，首页悬停 Studio 入口时，背景反馈与其他 Dock 工具入口一致；点击进入 Studio，不显示旧激活背景，返回首页与页面位置记忆保持可用。
- 登录后分别从首页 Dock 和 Studio 打开 Account，菜单中无 Billing，Notifications 下方显示 Settings。
- 两处点击 Settings 均关闭账户菜单并打开相同的现有设置抽屉；设置读取、修改与保存沿用既有行为，关闭后仍在原页面，账户入口可再次打开。
- Dock 原有 Settings 入口仍可用；未登录点击 Account 仍进入现有登录流程。
- 自动化结果与用户实际验收分别记录，视觉、布局和交互由用户在 Chrome/Edge 验收。

## 关联文档

- [Commit 记录](../commits/2026-11-09-extension-dock-account-entries-commit.md)
- [工作台](../README.md)
- [Web UI 来源](../../web-ui-sources.md)
- [分级验证规范](../../verification.md)

## 本阶段验证与验收步骤

- `pnpm --filter @exts/extension typecheck`：通过；首次发现清理 Billing 图标后遗留类型项，移除无用类型项后复查通过。
- `pnpm --filter @exts/extension test tests/app/view-preference.test.ts tests/features/settings/store.test.ts tests/features/settings/api.test.ts --maxWorkers=1 --no-file-parallelism`：3 个文件、10 项通过。首次沙箱执行因 spawn EPERM 未启动 worker；停止后在沙箱外单 worker 重试通过。
- `pnpm --filter @exts/extension build`：通过，产物为根 `dist/build/chrome-mv3`；保留 theme-init.js 非模块脚本和大分块警告，未扩大范围修复。
- 未运行全量应用测试，未新增假 DOM 或交互测试；实际悬停、菜单/抽屉切换、焦点、窄屏和真实设置保存由用户验收，不把自动化通过记为用户验收。
- 在扩展管理页加载本次生产产物并打开新标签页；若恢复到 Studio，先点击 Home。比较 Studio 与其他 Dock 入口的悬停反馈，再点击进入 Studio，返回首页确认可用。
- 登录后在首页 Account 与 Studio Account 各执行一次：确认 Billing 消失，Notifications 下显示 Settings；点击后菜单关闭、设置抽屉打开，修改 Theme 并关闭、重新打开，确认设置按现有逻辑保存且当前页面不跳转，账户入口可再次打开。
- 确认 Dock 独立 Settings 仍可打开；未登录场景点击 Account 仍打开登录框。菜单衔接和焦点恢复也在窄屏复验。

## 唯一下一步

无。本 Issue 按用户批准本地提交完结，不推送或发布。
