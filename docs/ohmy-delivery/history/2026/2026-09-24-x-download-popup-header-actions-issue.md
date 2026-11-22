---
date: "2026-09-24"
scope: x-download
status: completed
type: task
---

# 为 X 与 TG Download 统一下载提示与 Popup 操作

## 当前阶段

已完成。

## 目标与范围

### 背景

X Download 当前 Popup 只有入队结果状态，缺少 TG Download Popup Header 右侧的下载目录和失败任务操作。X Download 的失败任务由 macOS Helper 持有，扩展侧不能直接复用 TG Download 的标签页消息，需要沿现有 Native Messaging 边界增加受控命令。两边在下载开始后还需要统一显示页面内的短暂提示，避免用户只能依赖按钮浮层或 Popup 判断是否已入队。

### 目标

让 X Download Popup Header 右侧提供与 TG Download 一致的两个图标及功能：打开 Downloads 文件夹、清理失败任务；同时让 X 与 TG Download 在下载入队后都在原页面显示“已开始下载，可在扩展中查看进度”的短暂 Toast，并保留两边现有媒体检测、保存和任务入队流程。

### 范围

- 复用 TG Download 的 Header 结构、两个 SVG 图标、按钮尺寸和禁用语义。
- 扩展 X Download 与 Helper 的 Native Messaging 操作协议，支持查询失败任务、打开 Downloads 文件夹和清理失败任务。
- Popup 保留标题与状态内容；入队成功后不再自动关闭，使 Header 操作可用。
- X 与 TG 页面在下载开始后追加页面 Toast，原有下载浮层和 Popup 任务状态继续保留；Toast 自动淡出。
- 增加与协议、任务清理和 Popup 状态对应的自动化验证。

### 排除项

- 不改变 X Download 的媒体来源捕获、视频下载流程、任务重试或取消行为。
- 不新增下载历史、持久化队列、系统通知、设置页或跨平台 Helper 能力。
- 不把页面 Toast 扩展为系统通知、跨标签页广播或下载完成提醒。
- 不在开发阶段执行浏览器视觉验收；Chrome/Edge 加载与 Popup 交互由用户验收。

## Todo

- [x] 为 X Download Native Messaging 增加失败任务查询、打开 Downloads 和清理失败任务命令，并保持现有入队协议兼容。
- [x] 将 TG Download 的两个 SVG 图标和 Header 交互移植到 X Download Popup，按失败任务状态启用或禁用垃圾桶按钮。
- [x] 在 Helper 任务存储中实现打开 Downloads 与清理失败任务，并补齐协议和 Helper 单元测试。
- [x] 记录本次 X/TG 类型检查、生产构建和语法解析结果；Vitest 全量复跑受 localhost 随机端口环境限制，限制已写入 Commit 记录。
- [x] 为 X 与 TG 页面接入统一文案的页面 Toast，并保留下载开始后的原按钮浮层提示。
- [x] 补充两边页面提示消息链路的针对性自动化验证；当前测试运行受本地随机端口限制，需在可用环境复跑。
- [x] 记录 Helper XCTest 的 ObservationMacros 环境限制，并保留在可用 Xcode 环境中复验。

## 验收标准

- X Download Popup Header 右侧显示文件夹和垃圾桶两个图标，尺寸、间距、深色模式处理与 TG Download 一致。
- 文件夹按钮打开系统 Downloads 文件夹；垃圾桶按钮仅在存在失败任务时可用，点击后清理 Helper 中的失败任务并刷新禁用状态。
- 入队成功后 Popup 保持打开并继续显示现有状态内容；媒体来源不足、无效页面和 Helper 失败状态不改变原有文案。
- X 与 TG 在下载成功入队后，发起下载的页面显示短暂 Toast；原下载按钮浮层和 Popup 状态仍可见，页面不可注入时不影响入队结果和 Popup 状态。
- X/TG 类型检查和生产构建通过；两边全量测试需在可分配 localhost 端口的环境复跑，Helper 在正常 Xcode 环境完成 XCTest 与可运行构建后，且不引入未批准的其他行为。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-24-x-download-popup-header-actions`
- 对应 Issue：[为 X 与 TG Download 统一下载提示与 Popup 操作](2026-09-24-x-download-popup-header-actions-issue.md)
- 状态：已完成
- 用户验收：已通过（用户明确要求本地提交）
- 最终提交批准：已完成
- 创建日期：2026-09-24
- 最近更新：2026-09-25

#### 预期交付边界

- 为 X Download Popup 增加与 TG Download 一致的 Header 文件夹、失败任务清理图标和操作。
- 通过 Native Messaging 连接 Popup、Helper 任务存储与 Downloads 文件夹操作。
- 为 X 与 TG Download 增加页面内下载开始 Toast，统一提示文案并保留 Popup 任务状态。

#### 实际完成内容

- X Download Popup 增加与 TG Download 对齐的 48px Header、Downloads 文件夹按钮和失败任务清理按钮。
- X Download Native Messaging 增加 Popup 状态查询、打开 Downloads 和清理失败任务命令；成功入队后 Popup 保持打开。
- Helper 任务存储增加失败任务计数与批量清理，Helper 请求处理器增加对应命令和系统 Downloads 打开操作。
- X Download 构建配置发布 `folder-down.svg` 与 `trash.svg` 两个 Popup 图标。
- TG 下载菜单在任务脱离页面后保留原按钮浮层，并追加页面右上角短暂 Toast。
- X 下载入队成功后由后台通知当前帖子页显示同文案 Toast，提示失败不影响已经入队的任务。
- 补充 TG Toast DOM 状态和 X 页面消息发送的针对性测试。

#### 验证结果

- X Download 全量测试：9 个文件、54/54 项通过。
- X Download `tsc --noEmit` 通过。
- X Download WXT 生产构建成功，产物包含两个 SVG，构建总大小 40.90 kB。
- Swift 改动通过 `swiftc -parse` 语法解析。
- 本次变更后 TG 与 X 的 `tsc --noEmit` 均通过。
- 本次变更后 TG WXT 构建成功（42.84 kB），X WXT 构建成功（42.23 kB），两边均生成页面内容脚本及 Toast 样式。

#### 未验证事项与限制

- Helper XCTest/构建仍受当前 Xcode `ObservationMacros.ObservableMacro` 插件返回 malformed response 阻塞；该限制发生在既有 `@Observable` 宏处理阶段，未能完成 Helper 运行时验证。
- TG 与 X 的 Vitest 启动均受当前环境无法分配 localhost 随机端口的 `GetPortError` 阻塞，新增测试未能在本环境执行。
- Chrome/Edge 中的 Popup 视觉、按钮点击和 Helper 联动尚未由代理执行，需用户实际验收。

#### 用户验收

- 结果：通过
- 说明：用户明确要求本地提交，按仓库规范视为验收通过和提交批准；Chrome/Edge 视觉限制仍保留在“未验证事项与限制”中。

#### 本次提交拆分

##### X Download 与 Helper

`feat(x-download): 完善 Popup 操作与页面提示`

- 对齐 TG Download Header 的 Downloads 与失败任务清理操作
- 打通 X Popup、Native Messaging 和 Helper 任务状态边界

##### TG Download 与本地交付记录

`feat(tg-download): 保留下载浮层并追加页面提示`

- 保留 TG 原下载浮层并追加页面 Toast
- 补充本次 Issue 与交付验证记录

#### 最终提交批准

- 状态：已完成
- 说明：用户明确要求拆分并提交到本地；Helper XCTest 环境限制已记录，不通过修改业务代码规避。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 类型：中型任务
- 当前阶段：已完成；Helper XCTest 仍受 ObservationMacros 环境限制，未引入业务代码绕过
- 最近更新：2026-09-24

### 历史后续事项

无。该 Issue 已完成；后续 TG 下载提示和按钮视觉调整由新的 Issue 独立处理。
