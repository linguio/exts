# 统一 Toast 展示、复制与声音说明：交付记录

## 对应工作项

- [Issue](../issues/2026-11-17-extension-toast-standard-issue.md)
- 状态：待验收，实现及自动化验证完成

## 预期交付边界

Extension 迁入指定官方 Base UI Toast，保留右下角及五类提示；统一为小型 ghost 复制按钮，复制完整标题和描述；适配原有错误声音行为并更新设置与无障碍说明；同步现行规范和来源记录。不新增处理中、Undo 或其他业务功能。

## 实际交付

- components/ui/toast.tsx 迁入官方 Base Nova Toast 快照，保留官方结构、排版、样式、图标、动画与关闭；复用现有主题、Button 和 @base-ui/react 1.9.0。来源记录固定原始源码 SHA-256；移除 Sonner 2.0.8、CSS、展示组件及文案替换包装，锁文件同步，无新增或升级依赖。
- 所有既有 Extension 提示迁为官方 toast.add，业务触发条件保持。Newtab／Studio 根 Toaster 提供上下文；Telegram 原 Shadow DOM 容器承载 Toast 及复制 Tooltip，独立根只提供一份 TooltipProvider。共用 TooltipContent 仅增加可选 Portal 容器透传。
- 每条提示保留小型 ghost/icon-sm 复制按钮，成功短暂 Check；完整复制标题和描述，可见文本不再被共用层替换为通用英文。不新增业务描述、处理中或 Undo。
- 声音通过官方 useToastManager 接入，关闭动画中的提示不作为新通知；保留原声音开关、仅 Error 自动发声、节流、试听和页面恢复规则。设置名称改为 Notification sounds，更新总说明、Default 四类静音说明及无障碍描述，移除 Loading 文案。
- 根规范、Extension 规范、UI 和官方来源记录同步；未修改 Website／Desktop 界面、API、数据库、音色、产品版本或 Changelog。

## 验证与限制

- 完整复制测试先运行确认缺少实现失败，完成实现后包含在完整应用验证中通过。
- pnpm install：通过；离线尝试因已有 use-sidecar 缓存缺失失败，联网安装成功。未升级依赖。
- pnpm --filter @exts/extension test：46 文件、187 项通过。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过；产物 dist/build/chrome-mv3。保留既有 theme-init.js 非 module 和大 chunk 警告。
- git diff --check、Issue／Commit 文档相对链接、Manifest 声明资源检查通过。
- 依仓库规则串行实施并自行审阅共用组件、React 上下文与 Portal 边界，未启动子代理。未执行浏览器视觉、焦点、指针、剪贴板实际权限或音效听感验收。
- GitHub 官方提交查询返回 403，采用已取得官方源码内容 SHA-256 固定快照，不记录未确认的 Git commit。官方源码迁入不表示渲染效果已验收。

## 用户验收

待用户按 Issue 中的步骤在 Chrome／Edge 验收。范围批准不等于交付验收通过。

## 提交方案

以下为待审核方案，尚未批准或执行；默认先代码后文档。

### 代码提交

范围：Extension package.json、pnpm-lock.yaml；src/components/ui 的 toast、toast-copy-action、toast-message、tooltip 及旧 sonner 删除；App、现有 Toast 调用页面与功能、Telegram 样式与挂载、通知声音设置与状态接入；toast-message 行为测试。不包含流程及规范文档。

```text
refactor(extension): 统一官方 Toast 与完整提示复制

- 迁入 Base UI Toast 并替换现有提示调用与挂载
- 使用小型复制按钮保留完整标题和描述
- 适配错误声音状态并统一通知声音说明
```

### 文档提交

范围：根 AGENTS.md、apps/extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md、本 Issue、本记录及工作台。

```text
docs(extension): 统一 Toast 与通知声音规范

- 明确官方展示、完整复制和五类提示规则
- 记录来源差异、验证结果及用户验收边界
```

## 最终提交批准

待批准。未执行 Git 提交、推送或部署；未将 Issue 或工作台标为已完成。
