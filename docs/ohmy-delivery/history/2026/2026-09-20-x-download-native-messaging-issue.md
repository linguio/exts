---
date: "2026-09-20"
scope: [extension, desktop]
status: completed
type: feature
---

# 打通 X Download 扩展与 macOS Helper 通信

## 当前阶段

已完成。

## 目标与范围

### 背景

X Download 扩展已经能从当前标签页识别并规范化 X 单帖地址，macOS Helper 已具备菜单栏任务列表，但两者仍完全独立。下一阶段先建立可验证的本机通信链路，不同时接入真实媒体解析和下载，避免把 Native Messaging、进程启动、IPC、网络和文件写入混在一次交付中。

### 目标

用户在有效 X 单帖页面点击扩展图标后，扩展通过 Native Messaging 将帖子目标交给 macOS Helper。Helper 未运行时自动启动，接收任务后在列表新增“已接收”记录并自动展开菜单栏 Popover；扩展通过请求响应确认任务已被接收。

Helper 未安装或未注册时，插件 Popup 只显示简洁提示，不在本阶段提供安装引导、安装步骤或“重新检测”。

### 范围

- 为扩展增加小型 Popup，覆盖连接中、当前页面无效、未检测到 Helper 和成功自动关闭四种状态。
- 保留当前工具栏图标作为唯一触发入口，不新增右键菜单。
- 为扩展增加 `nativeMessaging` 权限、稳定的本地开发 Extension ID 和一次性请求客户端。
- 定义版本化的 `task.enqueue` JSON 请求、成功响应和结构化错误响应。
- 在 Xcode 工程中增加独立 Native Messaging 命令行 Bridge，并随 Helper App Bundle 打包。
- Bridge 只负责 Native Messaging 帧、来源校验、Helper 启动、本机 IPC 转发和响应，不包含 UI 或下载逻辑。
- Helper 使用当前用户专属 Unix Domain Socket 接收 Bridge 请求，并在主线程更新任务 Store。
- Helper 启动时默认空列表；收到帖子后新增“已接收”任务，同一运行周期内按 `postId` 去重。
- 任务进入列表后自动展开 Helper 的菜单栏 Popover；不执行模拟下载或真实下载。
- 提供 Chrome、Edge 本地 Native Host 注册和卸载脚本。
- Helper 启动时自动注册或刷新当前用户的 Chrome、Edge Host Manifest；脚本仅作为卸载和故障排查后备入口。
- 使用现有 TypeScript/Vitest、Swift/XCTest 和打包校验覆盖协议、校验、去重、Bridge 与 Helper 边界。

### 排除项

- 不接入 yt-dlp、ffmpeg、X API、Cookie、媒体解析、真实网络请求或文件写入。
- 不实现任务持久化；Helper 重启后已接收任务清空。
- 不提供插件安装引导页、安装步骤、下载链接、“重新检测”按钮或自动安装能力。
- 不新增右键菜单、浏览器系统通知、macOS 系统通知、下载完成提示或设置页。
- 不实现 Windows Helper、Windows Native Host 或其他浏览器平台。
- 不处理签名、公证、DMG、商店发布、生产安装器或面向其他用户的分发。
- 不实现下载进度、完成、失败、暂停、恢复、并发控制或下载历史。
- 不新增视觉、Popover、Popup、焦点、指针或键盘自动化测试。

## Todo

### Sub-issues

#### 1. 建立协议、Bridge 与本地注册基础

- [x] 定义版本化请求、响应、错误码和 Native Messaging 帧边界。
- [x] 增加独立 Native Host Target，并将 Bridge 打包进 Helper App Bundle。
- [x] 增加稳定开发 Extension ID 以及 Chrome、Edge 注册和卸载脚本。
- [x] 验证未注册 Host、非法来源、非法消息和 Helper 启动失败的错误映射。

#### 2. 接入 Helper IPC 与已接收任务

- [x] 增加用户专属 Unix Domain Socket 监听和失效 Socket 清理。
- [x] Helper 未运行时由 Bridge 自动启动，并在限定时间内完成连接或返回失败。
- [x] 将静态模拟任务替换为空列表和“已接收”任务模型。
- [x] 按 `postId` 去重，并在新建或命中已有任务后自动展开 Popover。

#### 3. 接入扩展 Popup 与端到端流程

- [x] 在 Popup 中完成连接中、无效页面、未检测到 Helper 和成功关闭状态。
- [x] 将现有帖子地址识别结果通过一次性 Native Messaging 请求发送给 Bridge。
- [x] 完成 TypeScript、Swift、打包和协议边界自动化验证。
- [x] 完成 Chrome、Edge 与 macOS Helper 的实际端到端用户验收。

## 验收标准

- 在有效 X 单帖页面点击插件图标后，Popup 短暂显示“正在连接 X Download Helper…”。
- Native Host 未注册时，Popup 显示“未检测到 X Download Helper”及“请先安装并启动 Helper，然后再次点击扩展。”，不打开新标签页或系统通知。
- 当前页面不是有效 X 单帖时，Popup 显示“当前页面不是 X 单篇帖子”及“请打开需要处理的帖子后重试。”，不启动 Helper。
- Helper 已注册但未运行时，点击插件后 Helper 自动启动，任务列表新增对应帖子的“已接收”记录，并自动展开菜单栏 Popover。
- Helper 已运行时，同一流程直接新增任务并展开 Popover；插件 Popup 在收到成功响应后自动关闭。
- 重复发送相同 `postId` 不创建重复任务，响应返回已有任务 ID，Popover 仍然展开。
- Helper、Bridge 与扩展都会拒绝不支持的协议版本、未知消息类型、不合法字段和非 X 单帖地址。
- Chrome 和 Edge 都能从稳定开发产物完成 Host 缺失与 Host 可用两条实际流程。
- 直接启动 Helper App 后，无需手动执行注册脚本即可完成 Host 注册；重复启动可修正 App 路径变化。
- 整个交付不产生真实下载、文件写入、任务持久化、系统通知或安装引导。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-20-x-download-native-messaging`
- 对应 Issue：[打通 X Download 扩展与 macOS Helper 通信](2026-09-20-x-download-native-messaging-issue.md)
- 状态：已完成
- 用户验收：通过
- 最终提交批准：已批准
- 创建日期：2026-09-20
- 最近更新：2026-09-20

#### 预期交付边界

- 使用 Native Messaging Bridge 和本机 Unix Domain Socket 打通扩展与 macOS Helper。
- 点击插件图标后，由 Popup 展示连接、无效页面或未检测到 Helper 的状态。
- Helper 接收有效帖子任务后新增“已接收”记录并自动展开菜单栏 Popover。
- 提供 Chrome、Edge 本地开发注册和卸载脚本。
- 保持无真实下载、无媒体解析、无文件写入、无持久化、无系统通知和无生产分发。

#### 实际完成内容

- 扩展新增版本化 Native Messaging 请求/响应协议、纯逻辑校验、后台当前标签页入队流程和 Popup 状态页。
- Helper 新增独立 `XDownloadNativeHost` Target、四字节小端帧 Bridge、Helper 启动重试、用户级 Unix Socket、任务处理和 Popover 展开。
- Helper 任务列表改为空列表起步，收到任务后以“已接收”状态展示，按 `postId` 去重并支持移除。
- 增加稳定开发 Manifest Key、Chrome/Edge Native Host 安装卸载脚本及打包校验。
- Helper 启动时自动注册或刷新两套 Host Manifest，手动脚本保留为卸载和排障后备入口。

#### 验证结果

- TypeScript 类型检查通过；扩展 Vitest 5 个测试文件、30 个测试通过。
- WXT 构建通过；Native Host 独立 Xcode Target 构建通过。
- Native Host 临时目录安装/卸载脚本验证通过；`git diff --check` 通过。
- Helper 完整 XCTest 当前受本机 Xcode `ObservationMacros` 插件返回 malformed response 阻断，未将该环境错误改写为业务修复。

#### 未验证事项与限制

- Chrome、Edge 与 macOS Helper 的实际端到端行为已由用户在本机验收通过。
- Helper 完整 XCTest 需在 Observation 宏插件可用的 Xcode 环境重新运行。
- 当前工作项不验证真实媒体下载、文件产物、任务恢复或生产安装流程。

#### 用户验收

- 结果：通过
- 说明：用户已确认 extension 与 Helper 通信、自动注册和任务接收流程可用。

#### 最终 Commit messages

```text
feat(x-download): 接入 macOS Helper 通信

- 增加 Native Messaging 协议、后台转发和 Popup 状态反馈
- 固定开发扩展 ID 并覆盖通信边界测试
```

```text
feat(x-download-helper): 接收扩展任务并自动注册 Native Host

- 增加 Native Host Bridge、Unix Socket 和已接收任务流程
- 自动注册 Chrome 与 Edge Host Manifest 并完善打包验证
- 记录端到端验收结果和交付终态
```

#### 最终提交批准

- 状态：已批准
- 说明：用户已审核待提交范围、验证结果、限制与两个 Commit message，并要求 extension 与 helper 分开提交。

## 关联文档

- [通信架构设计](../../../superpowers/specs/2026-09-20-x-download-native-messaging-design.md)
- [实施 Plan](../../../superpowers/plans/2026-09-20-x-download-native-messaging.md)

## 历史补充

### 元信息

- 类型：架构任务
- 当前阶段：用户已完成端到端验收，并批准按 extension 与 helper 分开提交
- 最近更新：2026-09-20

### 历史后续事项

工作项已完成；后续真实下载能力作为新工作项单独开展。
