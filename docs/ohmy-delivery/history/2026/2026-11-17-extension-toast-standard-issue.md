---
date: "2026-11-17"
scope: extension
status: completed
type: task
---

# 统一 Toast 展示、复制与声音说明

## 当前阶段

已完成。

## 目标与范围

### 背景

扩展目前使用 Sonner，并为每条提示附加带边框的复制按钮及文案转换。用户认为当前展示粗糙，要求参考 shadcn Base UI Toast，统一提示外观、复制和声音描述。当前业务未使用 toast.loading 或 toast.promise，不需要新增处理中状态；Undo 是撤销操作，本次不接入。

### 目标

以指定官方 Toast 为基础统一扩展全部现有提示，保留用于排错的复制能力，并使声音设置说明与实际提示类型一致。

### 范围

- 迁入 https://ui.shadcn.com/docs/components/base/toast 对应的官方 Base UI Toast；实施前核对源码、组合组件、全局 CSS、主题 Token 和依赖，固定实际采用版本并记录来源。必要依赖使用精确版本并同步锁文件，不升级无关依赖。
- 沿用官方结构、排版、状态图标、间距、圆角、动画、堆叠和关闭行为，只适配现有主题；右下角位置继续保留，不调整全局主题参数。
- 业务提示使用普通、成功、信息、警告、失败五类。默认一句简短信息，必要时补充描述；不新增处理中或撤销流程。
- 每条提示保留复制能力：使用现有官方 Button 的小型 ghost 图标按钮，始终可见，点击复制完整标题和描述，成功后短暂显示勾号。该按钮是本次明确批准的官方组件差异，不挤占将来真实业务操作的语义。
- 清理被替代的 Sonner 展示、复制和文案处理，保留已确认英文提示要求；可显示文案不因复制而被替换或截断，不新增通知管理层。
- 适配现有 Newtab、Studio、Telegram Shadow DOM 的挂载与调用，保持下载、设置、倒计时等业务触发条件及页面隔离，不扩大业务功能。
- 将现有错误声音接入新 Toast 的官方状态能力，保持默认关闭、仅错误自动发声、1 秒节流、不补播、关闭后仍可试听及现有音频恢复规则；不改变音效和倒计时声音。
- 设置名称统一为 `Notification sounds`；总说明使用 `Play a sound when an error notification appears. Other notifications stay silent.`；静音分类说明使用 `Default, Success, Info, and Warning notifications are silent.`。同步无障碍说明，移除 Loading 表述，保留 Default／Error 两行设置结构。
- 同步根及 Extension 相关现行规范、UI 文档与官方来源记录，明确本次批准的复制差异；跨应用原则统一，当前实现范围仅 Extension。

### 排除项

- 不添加 Undo、重试、待办中心、持久通知或其他业务操作。
- 不为未使用的处理中、Promise 或 custom 状态新增业务入口。
- 不修改 Website、Desktop 的界面，不调整业务 API、数据库、权限、产品版本或 Changelog。
- 不添加截图、布局、主题、焦点或指针交互测试；浏览器视觉、交互与听感由用户验收。
- 不自动提交、推送或部署。

## Todo

- [x] 核对官方源码、依赖与主题适配，记录固定来源及批准差异。
- [x] 迁入共用 Toast 并替换现有调用和挂载，清理被替代实现。
- [x] 完成完整文案复制、错误声音状态接入及设置描述更新。
- [x] 同步现行规范和来源记录，调整与真实逻辑风险对应的既有测试。
- [x] 按分级验证规范完成必要逻辑、类型及构建检查，记录实际结果，停在用户验收。

## 验收标准

- 所有现有扩展提示使用同一官方 Toast 共用实现，保持右下角位置，五类提示语义一致；不出现本次新增的 Loading 或 Undo。
- 每条提示可复制完整标题和描述，复制成功显示短暂勾号；正常业务消息不因复制包装而被替换。
- Newtab、Studio、Telegram 内既有提示均能正常显示和复制，Telegram 的样式与状态接入在原 Shadow DOM 中有效。
- 声音设置名称、可见说明与无障碍说明一致；仅错误自动发声，其他四类静音，关闭仍可试听，原节流和倒计时行为保持。
- 来源版本、依赖和主题适配可追溯；不以构建通过代替视觉或用户验收。

## 唯一下一步

无。

## 交付记录

### 验证与用户验收

- `pnpm install`：通过；先前离线安装因缺少既有 use-sidecar 缓存失败，联网安装成功。移除 Sonner 及锁文件对应条目，无新增或升级依赖。
- `pnpm --filter @exts/extension test`：46 文件、187 项全部通过；完整复制行为测试先确认缺失实现失败，再补实现，完整应用检查通过。
- `pnpm --filter @exts/extension typecheck`：通过。
- `pnpm ext:build`：通过，产物 `dist/build/chrome-mv3`；保留原 theme-init.js 非 module 和大 chunk 警告。
- `git diff --check`、本工作项相对链接及 Manifest 声明资源检查：通过。
- 代理未执行浏览器视觉、交互、剪贴板权限或听感验收；没有截图、布局或焦点测试。实际结果待用户确认。

#### 用户验收步骤

1. Chrome／Edge 扩展管理页加载或重新加载 `/Users/kevin/Documents/GitHub/exts/dist/build/chrome-mv3`，刷新 Newtab；首页和 Studio 打开 Settings，保存设置，观察简短成功 Toast、右下角位置、关闭按钮及多条堆叠。
2. 点击 Toast 的 ghost 复制图标，确认短暂变勾号，粘贴到文本编辑器核对文案完整；有 description 时应另起一行，当前业务不人为新增描述或演示入口。
3. 在 Settings 检查 Notification sounds 名称、帮助说明及 Default 的四类静音说明，不再列 Loading。关闭声音后 Error 试听仍可用，试听不弹 Toast。
4. 开启声音，暂时阻断实际 API 请求，再执行需要请求的设置保存以触发真实错误；检查错误提示可复制且发声。连续错误仍遵循 1 秒节流、不补播，同提示更新不重复响；恢复网络并关闭声音后，错误只展示不发声。成功提示始终静音。
5. 刷新 Telegram 页面，完成一次真实下载，检查同一 Shadow DOM 中的成功 Toast、复制、Tooltip 和关闭正常，不显示文件名；下载开始、进行中、取消或失败不新增提示。
6. 检查浅深主题、长文案、堆叠展开、关闭及倒计时原结束音；不出现 Undo 或新处理中流程。以上实际外观、操作与听感由用户验收，自动化通过不代表本项已通过。

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-17-extension-toast-standard-issue.md)
- 状态：已完成；用户验收通过，本地提交及推送已批准

#### 预期交付边界

Extension 迁入指定官方 Base UI Toast，保留右下角及五类提示；统一为小型 ghost 复制按钮，复制完整标题和描述；适配原有错误声音行为并更新设置与无障碍说明；同步现行规范和来源记录。不新增处理中、Undo 或其他业务功能。

#### 实际交付

- components/ui/toast.tsx 迁入官方 Base Nova Toast 快照，保留官方结构、排版、样式、图标、动画与关闭；复用现有主题、Button 和 @base-ui/react 1.9.0。来源记录固定原始源码 SHA-256；移除 Sonner 2.0.8、CSS、展示组件及文案替换包装，锁文件同步，无新增或升级依赖。
- 所有既有 Extension 提示迁为官方 toast.add，业务触发条件保持。Newtab／Studio 根 Toaster 提供上下文；Telegram 原 Shadow DOM 容器承载 Toast 及复制 Tooltip，独立根只提供一份 TooltipProvider。共用 TooltipContent 仅增加可选 Portal 容器透传。
- 每条提示保留小型 ghost/icon-sm 复制按钮，成功短暂 Check；完整复制标题和描述，可见文本不再被共用层替换为通用英文。不新增业务描述、处理中或 Undo。
- 声音通过官方 useToastManager 接入，关闭动画中的提示不作为新通知；保留原声音开关、仅 Error 自动发声、节流、试听和页面恢复规则。设置名称改为 Notification sounds，更新总说明、Default 四类静音说明及无障碍描述，移除 Loading 文案。
- 根规范、Extension 规范、UI 和官方来源记录同步；未修改 Website／Desktop 界面、API、数据库、音色、产品版本或 Changelog。

#### 验证与限制

- 完整复制测试先运行确认缺少实现失败，完成实现后包含在完整应用验证中通过。
- pnpm install：通过；离线尝试因已有 use-sidecar 缓存缺失失败，联网安装成功。未升级依赖。
- pnpm --filter @exts/extension test：46 文件、187 项通过。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过；产物 dist/build/chrome-mv3。保留既有 theme-init.js 非 module 和大 chunk 警告。
- git diff --check、Issue／Commit 文档相对链接、Manifest 声明资源检查通过。
- 依仓库规则串行实施并自行审阅共用组件、React 上下文与 Portal 边界，未启动子代理。未执行浏览器视觉、焦点、指针、剪贴板实际权限或音效听感验收。
- GitHub 官方提交查询返回 403，采用已取得官方源码内容 SHA-256 固定快照，不记录未确认的 Git commit。官方源码迁入不表示渲染效果已验收。

#### 用户验收

2026-11-18 用户明确“验收通过 push”，验收通过并批准本地提交及推送；沿用已有结果，不追加验证。代理未独立执行的浏览器检查仍如实保留。

#### 提交方案

以下边界与消息已展示并获批准，代码、文档提交已成功；终态更新脚本因 Python 编码错误未执行，保留成功提交，另以 docs(extension): 记录 Toast 验收完成状态 补充机械性终态更新，不重写历史。

##### 代码提交

范围：Extension package.json、pnpm-lock.yaml；src/components/ui 的 toast、toast-copy-action、toast-message、tooltip 及旧 sonner 删除；App、现有 Toast 调用页面与功能、Telegram 样式与挂载、通知声音设置与状态接入；toast-message 行为测试。不包含流程及规范文档。

```text
refactor(extension): 统一官方 Toast 与完整提示复制

- 迁入 Base UI Toast 并替换现有提示调用与挂载
- 使用小型复制按钮保留完整标题和描述
- 适配错误声音状态并统一通知声音说明
```

##### 文档提交

范围：根 AGENTS.md、apps/extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md、本 Issue、本记录及工作台。

```text
docs(extension): 统一 Toast 与通知声音规范

- 明确官方展示、完整复制和五类提示规则
- 记录来源差异、验证结果及用户验收边界
```

#### 最终提交批准

已批准。2026-11-18 用户明确“验收通过 push”，批准本地提交及推送 origin/main；本记录、Issue 和工作台同步为已完成、验收通过及提交已批准。不执行部署。

##### 终态补充提交

仅包含本 Issue、本记录及工作台的机械性完成状态，不改实现。

```text
docs(extension): 记录 Toast 验收完成状态

- 记录用户验收通过及提交推送批准
- 完结当前工作项并移入已完成索引
```

## 关联文档

- [工作台](../../readme.md)
- [Extension UI](../../../extension/ui.md)
- [Web UI 来源](../../../web-ui-sources.md)
- [官方 Base UI Toast](https://ui.shadcn.com/docs/components/base/toast)

## 历史补充

### 元信息

- 当前阶段：2026-11-18 用户验收通过，本地提交及推送已批准
- 批准依据：2026-11-17 用户确认官方 Base UI Toast、复制方式和声音说明的调整范围，并要求“写个issue”。随后用户明确“开始吧”，批准按本 Issue 实施及必要验证，不包含 Git 提交。
- 规模：小型任务；一个可整体验收的通知展示结果，使用 Todo，不额外创建 Spec、Plan 或子 Issue。

### 历史后续事项

工作项已完成；2026-11-18 用户明确“验收通过 push”，批准本地提交并推送 origin/main。沿用已有验证结果，不追加检查。
