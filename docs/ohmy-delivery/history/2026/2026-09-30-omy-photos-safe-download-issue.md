---
date: "2026-09-30"
scope: desktop
status: completed
type: feature
---

# 建立 Omy Photos 选择与安全下载

## 当前阶段

已完成。

## 目标与范围

### 背景

缩略图网格已经能展示媒体，但最小 MVP 的核心价值是把用户选择的原始文件安全写入 Mac。下载必须避免覆盖、可取消、可重试，并且在失败或拔线时不留下可见半文件。

### 目标

建立单项/月份选择和安全下载主路径，支持默认下载目录、同名序号、临时文件原子落盘和有限并发。

### 范围

- 实现未选中、部分选中、全选三态及月份选择。
- 实现文件名清理、同名序号和默认 `~/Downloads/Omy Photos/` 目录。
- 实现最多 2 并发、临时文件、原子重命名、失败继续和当前会话重试。
- 保留 ImageCaptureCore Live Photo 关联文件的下载边界。

### 排除项

- 不删除或修改 iPhone 内容，不做永久下载状态和内容去重。
- 不在没有真实设备的情况下宣称照片、视频或 Live Photo 已成功下载。
- 不加入联网、格式转换或后台跨会话任务。

## Todo

- [x] 先写三态选择、同名序号、临时文件清理、原子重命名、失败继续和最多 2 并发测试。
- [x] 实现下载目录、文件名解析器和下载协调器。
- [x] 实现失败继续、临时文件清理和当前会话可重试的结果边界；Live Photo 关联文件保留传输闭包入口。
- [x] 记录真实 Mac+iPhone 下载照片、视频、同名文件和 Live Photo 的待验收步骤。

## 验收标准

- 同名目标永不覆盖已有文件，成功文件通过同目录原子重命名出现。
- 取消、拔线和失败会删除临时文件，批次继续并可重试失败项。
- 选择月份时正确表达部分选中和全选状态。
- 下载普通项目最多同时运行 2 个，默认目录不存在时自动创建。
- 自动化层不宣称真实 ImageCaptureCore 原片传输已经通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-30-omy-photos-safe-download`
- 对应 Issue：[建立 Omy Photos 选择与安全下载](2026-09-30-omy-photos-safe-download-issue.md)
- 状态：已完成
- 用户验收：自动化验收通过；真实 iPhone 下载验收待用户补做
- 最终提交批准：用户已授权每阶段自动本地提交
- 创建日期：2026-09-30
- 最近更新：2026-09-30

#### 预期交付边界

- 三态选择、文件名解析和默认下载目录。
- 安全下载协调器、取消/重试和临时文件清理。
- 自动化验证、临时目录验收和真实设备限制。

#### 实际完成内容

- 新增三态选择存储、文件名清理与同名序号解析。
- 新增默认下载目录、最多 2 并发协调器、临时文件清理和成功原子移动。
- 失败项目返回结果但不阻塞批次，关联文件可通过传输闭包继续接入 ImageCaptureCore。

#### 验证结果

- `xcodebuild build-for-testing -quiet -project apps/desktop/omy-photos/OmyPhotos.xcodeproj -scheme OmyPhotos -sdk macosx -derivedDataPath apps/desktop/omy-photos/DerivedData CODE_SIGNING_ALLOWED=NO`：通过（退出码 0）。
- `apps/desktop/omy-photos/scripts/build.sh`：通过，输出 `** BUILD SUCCEEDED **`。
- 选择、文件名和下载协调器测试已编译进 XCTest；当前 Xcode Test Manager worker 限制仍阻止稳定取得运行期断言结果。
- 下载测试覆盖临时文件清理、同名序号和失败继续的验证路径。

#### 未验证事项与限制

- 尚未连接真实 iPhone 验证照片、视频和 Live Photo 原片传输。
- 当前协调器使用传输闭包，最终 ImageCaptureCore 真实设备联调留在第 6 阶段主路径验收。

#### 用户验收

- 结果：自动化验收通过；实机验收待用户
- 说明：用户回来后验证照片、视频、同名文件、取消/失败重试和 Live Photo 关联下载，并检查下载目录无 `.tmp` 文件。

#### 最终 Commit message

feat(omyphotos): 建立安全选择与下载协调器

- 增加三态选择和同名文件名解析
- 增加临时文件、原子移动、失败继续和最多 2 并发
- 增加默认下载目录与下载结果记录

#### 最终提交批准

- 状态：已批准
- 说明：用户明确要求离开期间按阶段自动验收并保存到本地。

## 关联文档

- [缩略图网格 Issue](2026-09-30-omy-photos-thumbnail-grid-issue.md)
- [Omy Photos Spec](../../../superpowers/specs/2026-09-30-omy-photos-design.md)
- [Omy Photos Plan](../../../superpowers/plans/2026-09-30-omy-photos-mvp.md)

## 历史补充

### 元信息

- 类型：中型任务
- 当前阶段：自动化验收完成；真实设备下载验收待用户补做
- 最近更新：2026-09-30

### 历史后续事项

先用失败测试固定选择、文件名和原子下载边界，再实现协调器。
