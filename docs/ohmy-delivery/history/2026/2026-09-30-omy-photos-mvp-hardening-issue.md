---
date: "2026-09-30"
scope: desktop
status: completed
type: bug
---

# 收口 Omy Photos 最小 MVP 稳定性

## 当前阶段

已完成。

## 目标与范围

### 背景

前五个阶段已经分别保存设备会话、SQLite 索引、缩略图网格和安全下载能力。最后需要补齐失败恢复、压力边界和应用主路径接线，明确哪些结果已由自动化证明，哪些必须由真实 Mac+iPhone 验收。

### 目标

完成不扩展范围的最小 MVP 收口：设备连接后能进入媒体库，媒体可分页浏览、选择并通过安全下载边界落盘；异常状态不会留下错误的可用状态或临时文件。

### 范围

- 增加大图库分页/选择压力测试和设备/下载失败恢复测试。
- 将连接窗口与空媒体库网格、选择状态、下载协调器接入同一最小入口。
- 完成完整构建、Bundle 检查、差异检查和稳定性材料。
- 更新 Spec/Plan/Issue/Commit/Workbench 的最终验收状态与限制。

### 排除项

- 不实现大图预览、视频播放、删除、上传、联网或 App Store 发布。
- 不伪造真实 iPhone、视觉滚动、Instruments 或用户操作结果。
- 不新增第七阶段或额外功能 Issue。

## Todo

- [x] 新增 40 万条选择压力测试，复用锁定/拔线状态机覆盖，并补充下载失败继续、不可用目标目录和临时文件清理测试。
- [x] 按最小改动完成设备媒体目录、月份网格、选择状态和安全下载主路径接线。
- [x] 运行 `scripts/build.sh`、`xcodebuild build-for-testing`、`git diff --check` 和 Bundle 配置检查。
- [x] 记录 XCTest 运行限制、Instruments 与真实 Mac+iPhone 最终验收步骤。

## 验收标准

- 所有前五阶段接口在同一 App 入口可构建连接；无设备时显示连接提示，有媒体时可进入网格。
- 分页、选择、缓存、下载和失败恢复测试目标可编译；完整测试运行限制被明确记录。
- Debug App Bundle 使用 `dev.kevinstack.omyphotos`、macOS 27.0，并链接 ImageCaptureCore/SQLite3。
- 自动化证据与真实设备待验收事项分开记录；未完成用户验收时不宣称长期自用 MVP 已最终通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-30-omy-photos-mvp-hardening`
- 对应 Issue：[收口 Omy Photos 最小 MVP 稳定性](2026-09-30-omy-photos-mvp-hardening-issue.md)
- 状态：已完成
- 用户验收：自动化验收通过；真实 Mac+iPhone 最终验收待用户补做
- 最终提交批准：用户已授权每阶段自动本地提交，本次按授权执行
- 创建日期：2026-09-30
- 最近更新：2026-09-30

#### 预期交付边界

- 前五阶段接口的最小主路径接线与恢复测试。
- 完整构建、Bundle 配置和测试运行限制记录。
- 真实设备最终验收清单与 MVP 是否可长期自用的明确结论。

#### 实际完成内容

- 将 `DeviceSession` 的媒体目录接入月份网格，设备断开时清理媒体引用，并通过 ImageCaptureCore 传输选中原片。
- 将三态选择、下载按钮和最多 2 并发安全下载协调器接入应用入口。
- 增加 40 万条选择压力与失败恢复覆盖，包含不可用目标目录和临时文件清理边界。

#### 验证结果

- `apps/desktop/omy-photos/scripts/build.sh`：通过，输出 `** BUILD SUCCEEDED **`。
- `xcodebuild build-for-testing -quiet -project apps/desktop/omy-photos/OmyPhotos.xcodeproj -scheme OmyPhotos -sdk macosx -derivedDataPath apps/desktop/omy-photos/DerivedData CODE_SIGNING_ALLOWED=NO`：通过（退出码 0）。
- `git diff --check`：通过。
- Bundle 检查通过：`dev.kevinstack.omyphotos`、`Omy Photos`、macOS `27.0`。
- XCTest 测试目标已编译；当前环境的 Xcode Test Manager worker/分布式通知限制导致 `xcodebuild test` 无法稳定取得运行期断言结果，未将其误报为通过。

#### 未验证事项与限制

- 当前尚未连接真实 iPhone，不能确认最终设备、滚动、下载和异常恢复行为。
- Instruments 不能在当前代理环境中替代用户真实 Mac 性能记录。
- 当前网格未在代理环境执行视觉、布局、焦点或指针验收；缩略图和真实 ImageCaptureCore 原片传输需用户实机确认。

#### 用户验收

- 结果：自动化验收通过；真实 Mac+iPhone 最终验收待用户
- 说明：用户回来后打开构建产物，连接并信任 iPhone，验证月份网格、单项/月份选择、重复文件名不覆盖、失败继续、锁定/拔线/重连和下载目录无 `.tmp` 文件。

#### 最终 Commit message

feat(omyphotos): 收口最小 MVP 主路径

- 串联设备媒体目录、月份网格和三态选择
- 接入 ImageCaptureCore 安全下载与失败恢复边界
- 增加大图库选择压力、目标目录失败和临时文件清理验证

#### 最终提交批准

- 状态：已批准
- 说明：用户明确要求离开期间按阶段自动验收、保存到本地并继续下一阶段；真实设备验收限制保留。

## 关联文档

- [安全下载 Issue](2026-09-30-omy-photos-safe-download-issue.md)
- [Omy Photos Spec](../../../superpowers/specs/2026-09-30-omy-photos-design.md)
- [Omy Photos Plan](../../../superpowers/plans/2026-09-30-omy-photos-mvp.md)

## 历史补充

### 元信息

- 类型：中型任务
- 当前阶段：自动化验收完成；真实 Mac+iPhone 最终验收待用户补做
- 最近更新：2026-09-30

### 历史后续事项

用户回来后按真实 Mac+iPhone 验收清单完成最终设备验证；在此之前不扩展第七阶段功能。
