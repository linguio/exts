---
date: "2026-09-30"
scope: [desktop]
status: completed
type: feature
---

# 建立 Omy Photos 应用壳与设备会话

## 当前阶段

已完成。

## 目标与范围

### 背景

第 1 阶段已经确认 ImageCaptureCore 的 macOS 27 SDK 接口可编译。现在需要把设备发现、信任、锁定、同步、拔出和失败恢复收敛为可供后续媒体库消费的会话接口，避免 SwiftUI 直接持有 ImageCaptureCore delegate 状态。

### 目标

建立可观察的 SwiftUI 应用壳和单设备会话对象，为后续 SQLite 索引提供稳定的设备状态与媒体来源入口。

### 范围

- 建立 `DeviceAuthorizationState` 状态模型和状态转移规则。
- 建立 `DeviceSession`，管理 `ICDeviceBrowser`、当前 iPhone 会话和只读设备摘要。
- 提供连接状态、授权提示、锁定和重新连接的最小窗口视图。
- 保留 ImageCaptureCore 的设备层边界，不在视图层直接调用 delegate。

### 排除项

- 不建立 SQLite 正式索引、缩略图缓存或下载队列。
- 不实现媒体网格、月份选择或真实下载按钮。
- 不宣称未连接真实 iPhone 时的视觉与交互验收已经通过。

## Todo

- [x] 先写状态转移测试，覆盖未连接、未信任、同步中、可用、锁定、拔出和失败恢复。
- [x] 实现会话对象、设备生命周期和 SwiftUI 连接视图。
- [x] 运行测试目标编译、Debug 构建和 Bundle 配置检查。
- [x] 记录真实 iPhone 连接、信任、锁定、拔出和重连的待验收步骤。

## 验收标准

- `DeviceSession.state` 能稳定表达设备生命周期，并在拔出后不保留可用状态。
- App 启动后可以展示当前连接状态和下一步授权提示。
- Xcode 27 / macOS 27 SDK 下 App 与测试目标可构建。
- 所有未连接真实 iPhone 的事项明确记录为待用户验收；不把自动化结果写成实机通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-30-omy-photos-app-shell-device-session`
- 对应 Issue：[建立 Omy Photos 应用壳与设备会话](2026-09-30-omy-photos-app-shell-device-session-issue.md)
- 状态：已完成
- 用户验收：自动化验收通过；真实 iPhone 验收待用户补做
- 最终提交批准：用户已授权每阶段自动本地提交
- 创建日期：2026-09-30
- 最近更新：2026-09-30

#### 预期交付边界

- SwiftUI 应用壳和设备会话状态模型。
- ImageCaptureCore 设备生命周期与授权提示的隔离层。
- 状态转移测试、构建结果和未验证事项。

#### 实际完成内容

- 新增 `DeviceAuthorizationState` 与 reducer，覆盖信任、同步、可用、锁定、拔出和失败恢复。
- 新增 `DeviceSession`，隔离 ImageCaptureCore 设备生命周期并发布只读设备摘要。
- 用 SwiftUI 连接窗口展示授权提示、锁定和重连状态。

#### 验证结果

- `xcodebuild build-for-testing -quiet -project apps/desktop/omy-photos/OmyPhotos.xcodeproj -scheme OmyPhotos -sdk macosx -derivedDataPath apps/desktop/omy-photos/DerivedData CODE_SIGNING_ALLOWED=NO`：通过（退出码 0）。
- `apps/desktop/omy-photos/scripts/build.sh`：通过，输出 `** BUILD SUCCEEDED **`。
- 状态转移测试目标已编译；`xcodebuild test` 的实际执行仍受当前沙盒 Xcode Test Manager 分布式通知限制。
- Bundle 配置确认 `dev.kevinstack.omyphotos`、macOS 27.0 和 ImageCaptureCore 链接存在。

#### 未验证事项与限制

- 尚未连接真实 iPhone 验证授权、锁定、拔出和重连。
- 连接窗口尚未进行用户视觉与交互验收。

#### 用户验收

- 结果：自动化验收通过；实机验收待用户
- 说明：用户回来后启动 Debug App，连接并信任 iPhone，验证状态提示、锁定、拔线和再次连接。

#### 最终 Commit message

feat(omyphotos): 建立设备会话与连接应用壳

- 增加设备授权状态机和 ImageCaptureCore 会话隔离层
- 增加 SwiftUI 连接状态窗口
- 增加状态转移自动化验证

#### 最终提交批准

- 状态：已批准
- 说明：用户明确要求离开期间按阶段自动验收并保存到本地。

## 关联文档

- [ImageCaptureCore 阶段 Issue](2026-09-30-omy-photos-image-capture-validation-issue.md)
- [Omy Photos Spec](../../../superpowers/specs/2026-09-30-omy-photos-design.md)
- [Omy Photos Plan](../../../superpowers/plans/2026-09-30-omy-photos-mvp.md)

## 历史补充

### 元信息

- 类型：中型任务
- 当前阶段：自动化验收完成；真实 iPhone 会话验收待用户补做
- 最近更新：2026-09-30

### 历史后续事项

本阶段已提交本地；下一步建立 SQLite 媒体索引 Issue。真实 iPhone 会话结果必须在最终 MVP 前补回 Commit 记录。
