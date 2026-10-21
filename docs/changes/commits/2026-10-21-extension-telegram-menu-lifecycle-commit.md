# TG 下载入口与完成提示交付记录

- Issue：[整理 TG 下载入口与完成提示](../issues/2026-10-21-extension-telegram-menu-lifecycle-issue.md)
- 状态：已完成
- 用户验收：2026-10-22 用户查看后确认没有问题并要求拆分 Commit
- 最终提交批准：2026-10-22 已批准，按展示边界拆两笔本地提交，不推送

## 预期交付边界
整理 TG 模块内部职责，移除 Popup 与暂时不用的下载记录层，保留流式下载、另存为和即时配置。共用层仅提供官方 Toast 样式组件，业务反馈由 TG 决定。

## 实际交付
- telegram-download 改名 tg-download，按 components/download-menu、views/settings、download-core、page 与 settings.ts 组织；同步入口、Newtab 导入、测试和活动文档，不改变配置键和文件名规则。
- 删除 Popup、downloads 模块及后台注册、任务记录协议、快照上报和相关专用测试；不清除旧存储或预建未来下载中心。
- 图标加“下载资源”按内容宽度，使用官方 Button ghost 与 DropdownMenuItem，保留 hover、禁用及手形；修复 Shadow DOM 的主题属性选择器。
- 共用 UI 接入项目固定 shadcn commit 的官方 Sonner，精确新增 sonner 2.0.8 和锁文件；保留默认折叠堆叠与关闭行为。主题由调用方传入，官方 CSS 同时导入 Shadow DOM。
- 只有文件关闭成功后提示“下载完成”和实际文件名；取消/失败只清理、不提示，响应写入失败取消流并释放锁，中止失败不产生未处理拒绝。
- 保留系统另存为，startIn 改为 desktop；Tooltip 删除用户指定句子，仅留功能简介。根 AGENTS、扩展规范及 UI 来源统一明确共用展示、业务由模块持有。

## 验证结果
- sonner 2.0.8 精确安装成功，WXT prepare 完成，锁文件仅新增该包。
- 保存流程定向测试 9 项通过；最终扩展完整逻辑测试 10 文件 / 45 项通过（maxWorkers=1）。
- pnpm --filter @exts/extension typecheck、pnpm ext:build、git diff --check 通过。
- Manifest 无 default_popup、无 Popup 构建产物，后台/Newtab/内容脚本入口完整；旧模块路径和下载记录消息在活动源码中无引用。

## 未验证与限制
- 未独立执行浏览器主题、hover、焦点、Toast 折叠、真实媒体保存、重载或系统另存为验收；用户按 Issue 步骤加载根 dist/build/chrome-mv3/。未更新开发稳定目录，未启动 watch/dev。
- 既有 Newtab theme-init.js 经典脚本构建提示仍在，构建成功。
- desktop 是建议位置，浏览器可能记住相同 picker id 的目录；不承诺锁定桌面。关闭 Telegram 页面后不承诺继续下载，没有持久列表或续传。
- 按用户要求完成两笔本地提交；本轮仅执行提交及完成状态同步，未重复验证、不推送或发布。

## 提交拆分
按用户要求分为代码和规范记录两笔，不重复运行验证：

1. 功能代码：apps/extension/package.json、pnpm-lock.yaml、apps/extension/src、apps/extension/tests 与 apps/extension/wxt.config.ts；包括目录更名、删除旧模块、官方 Sonner 和配置/测试调整。
2. 规范与记录：根和扩展 AGENTS、apps/extension/README.md、docs/extension、docs/web-ui-sources.md、本 Issue/交付记录与工作台。批准本地提交后，第二笔包含 Issue/交付记录已完成、最终提交已批准、工作台移入完成索引的机械性终态更新；不额外修改功能。

## 最终 Commit message
已展示并获用户本地提交批准：

```text
fix(extension): 整理 TG 下载入口与完成提示

- 按职责整理 tg-download，移除 Popup 与下载记录链路
- 修复菜单主题并采用官方完成 Toast 和内容宽度按钮
- 保留文件名规则，另存为建议桌面并精简设置说明
```

```text
docs(extension): 同步 TG 下载规范与交付记录

- 明确官方 Toast 共用展示组件与模块业务边界
- 同步 TG 模块结构、下载说明与工作项完成记录
```
