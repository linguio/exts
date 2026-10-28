# 拆分 Dock 与 Settings 并归位 Home：交付记录

## 对应工作项

- [Issue](../issues/2026-10-28-extension-module-boundaries-issue.md)

## 预期交付边界

代码仅迁移 Home、Dock、Settings 的归属和引用，保持现有行为。文档包含本工作项记录、工作台及现行归属规则。品牌资源与 Activity 不在本次范围内。

## 实际交付

- Home 实现移入 modules/newtab/index.tsx；app 保留主视图切换、公共 Provider、Toaster 与常驻 Dock 组合。
- modules/dock 持有布局、收藏入口、Actions、下载和设置入口以及入口提示协调，原 DOM、样式类和局部状态处理保留。
- modules/settings 持有 SettingsSheet、General 与 Media Download 设置界面；Dock 通过受控打开状态和触发器子元素组合，配置、权限及后台能力不搬迁。
- 更新应用规范、UI 规范和官方组件来源中的当前归属；品牌资源和 Activity 未修改。
- 用户最新要求将应用 README 留到整轮整理最后更新；已撤回本轮 README 编辑，本工作项不包含 README 变化。

## 验证与限制

- `node node_modules/vitest/vitest.mjs run --pool=threads --maxWorkers=1 --no-file-parallelism`：15 个文件、76 项测试通过。
- `node node_modules/typescript/bin/tsc --noEmit`：通过。
- `node node_modules/wxt/bin/wxt.mjs build`：通过，产物位于根 dist/build/chrome-mv3；Manifest 与页面、后台、主题入口存在。
- `git diff --check`：通过；Home 和 Settings Sheet 的原始实现逐段核对一致，旧源码引用已清理。
- pnpm 依赖目录权限和默认 Vitest forks 的 spawn EPERM 属执行环境限制；改用已安装工具和单线程串行测试完成验证，未重装依赖。Node 内部启动 Git 也受 EPERM 阻断，改用 PowerShell 直接调用 Git 完成内容核对。
- 构建输出 theme-init.js 非 module 脚本提示，最终脚本生成成功；未改变其加载方式。
- 浏览器视觉、交互和真实权限操作未由代理执行；用户明确表示验证通过，代码提交沿用已有结果，未追加测试或构建，未推送或部署。

## 用户验收

用户于 2026-10-28 明确表示「验证通过了」，并要求已完成代码先提交到本地、Issue 不提交。

## 文件边界与完整 Commit message

- 代码提交：apps/extension/src/app/NewtabApp.tsx、新增 modules/newtab/index.tsx、modules/dock 与 modules/settings，删除对应原 newtab/views/dock 和 newtab/views/settings 文件。无测试、依赖、资源、样式或后台变更。
- 文档边界：apps/extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md、本 Issue、Commit 记录与工作台。后续媒体下载整理的 Issue 与 Commit 记录仅作为排队文档另行保留，均未提交。应用 README 留到整轮整理最后更新，不在本次边界内。
- 以下代码消息已按用户批准执行本地提交；文档消息仅为待审核方案。

```text
refactor(extension): 拆分导航与设置模块并归位首页

- 将常驻 Dock 与设置抽屉迁入独立模块
- 将首页布局与书签操作移回 Newtab
- 保留原有配置接口与界面交互
```

```text
docs(extension): 记录导航设置与首页模块归属

- 同步应用规范与界面组合职责
- 记录模块迁移结果及验证限制
```

## 最终提交批准

用户于 2026-10-28 明确要求剩余全部提交，覆盖此前暂不提交 Issue 的指示。已批准代码提交保留，本轮将所有剩余规范、Issue、Commit 记录和工作台合并为一笔文档本地提交，随提交完成本工作项；未重复验证，不推送，README 未修改。

## 本轮统一文档提交

文件范围：apps/extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md、docs/changes/README.md，以及 module-boundaries、activity-cards、download-drawer、media-download-structure 四组 Issue／Commit 记录。前三项终态为已完成，media-download-structure 仍为已排队，未实施能力不记为交付。此前单项文档消息仅为历史提交方案，本轮以以下实际统一消息为准：

```text
docs(extension): 完结模块迁移并同步抽屉规范

- 记录导航设置与活动日历迁移及验收结果
- 同步原 Sheet 样式、左侧圆角和关闭反馈规范
- 保存媒体下载内部结构整理的后续工作项
```
