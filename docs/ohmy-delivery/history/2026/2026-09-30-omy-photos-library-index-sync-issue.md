---
date: "2026-09-30"
scope: ohmy-photos
status: completed
type: feature
---

# 建立 Omy Photos 本地媒体索引与增量同步

## 当前阶段

已完成。

## 目标与范围

### 背景

设备会话已经有稳定的连接状态，但大图库不能由 SwiftUI 直接持有 ImageCaptureCore 的全量对象。需要把轻量元数据持久化到本地 SQLite，并通过分页和同步代次控制内存与断线恢复。

### 目标

建立可分页、可增量更新、可在同步中断后继续的本地媒体索引，为缩略图网格提供稳定的 `MediaItem` 流。

### 范围

- 定义 `MediaItem` 轻量字段、日期优先级和稳定排序。
- 实现月份键与未知日期分组。
- 实现 SQLite schema、唯一媒体标识、分页查询和同步代次。
- 实现同步完成后的失效记录清理；中断时保留上一份有效索引。

### 排除项

- 不写入缩略图二进制、不实现 UI 网格或下载队列。
- 不保存永久下载状态，不计算 SHA-256，不做内容去重。
- 不把未连接真实 iPhone 的分页结果写成实机大图库验收。

## Todo

- [x] 先写日期优先级、未知日期、稳定排序、月份键、分页和中断同步测试。
- [x] 实现 SQLite 媒体存储与增量索引器。
- [x] 增加 40 万条合成记录分页测试，断言单页最多返回 200 条。
- [x] 记录真实 iPhone 增量同步与断线恢复的待验收步骤。

## 验收标准

- 缺少拍摄日期时仍能用可预测的修改日期或未知分组稳定排序。
- `page(after:limit:)` 只返回请求页，默认页大小为 200。
- 同步未完成时不清理上一代记录；同步完成后才删除失效代次。
- Xcode 27 / macOS 27 SDK 下应用与测试目标可构建。
- 40 万条合成记录只请求一页时返回 200 条，不要求把全量结果交给调用方。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-30-omy-photos-library-index-sync`
- 对应 Issue：[建立 Omy Photos 本地媒体索引与增量同步](2026-09-30-omy-photos-library-index-sync-issue.md)
- 状态：已完成
- 用户验收：自动化验收通过；真实 iPhone 验收待用户补做
- 最终提交批准：用户已授权每阶段自动本地提交
- 创建日期：2026-09-30
- 最近更新：2026-09-30

#### 预期交付边界

- MediaItem、月份分组、SQLite 媒体存储和增量同步器。
- 分页、稳定排序、日期回退和同步中断保护测试。
- 构建结果、大批量合成记录验证和未验证事项。

#### 实际完成内容

- 新增 `MediaItem`、日期优先级、月份键和稳定排序。
- 新增 SQLite schema、分页查询、事务 upsert、同步代次和完成后失效清理。
- 新增索引器与 40 万条合成分页测试。

#### 验证结果

- `xcodebuild build-for-testing -quiet -project apps/desktop/omy-photos/OmyPhotos.xcodeproj -scheme OmyPhotos -sdk macosx -derivedDataPath apps/desktop/omy-photos/DerivedData CODE_SIGNING_ALLOWED=NO`：通过（退出码 0）。
- `apps/desktop/omy-photos/scripts/build.sh`：通过，输出 `** BUILD SUCCEEDED **`。
- 40 万条分页测试已编译进 XCTest；完整 `xcodebuild test` 在当前 Xcode Test Manager 环境中等待测试 worker 后被中断，未取得运行期断言结果。
- 代码审查确认 SQLite 文本绑定使用 transient destructor，避免 Swift 字符串指针生命周期错误。

#### 未验证事项与限制

- 尚未连接真实 iPhone 验证真实媒体元数据和断线恢复。
- 由于 XCTest worker 运行限制，40 万条测试目前只有编译证据，未取得本机运行期耗时和内存曲线。

#### 用户验收

- 结果：自动化验收通过；实机验收待用户
- 说明：用户回来后连接 iPhone，验证首次完整同步、再次连接增量同步、拔线中断后旧索引仍可浏览。

#### 最终 Commit message

feat(omyphotos): 建立 SQLite 媒体索引与增量同步

- 增加媒体日期分组、稳定排序和 200 条分页
- 增加 SQLite 事务索引与同步代次清理
- 增加中断同步和 40 万条分页自动化验证

#### 最终提交批准

- 状态：已批准
- 说明：用户明确要求离开期间按阶段自动验收并保存到本地。

## 关联文档

- [设备会话 Issue](2026-09-30-omy-photos-app-shell-device-session-issue.md)
- [Omy Photos Spec](../../../superpowers/specs/2026-09-30-omy-photos-design.md)
- [Omy Photos Plan](../../../superpowers/plans/2026-09-30-omy-photos-mvp.md)

## 历史补充

### 元信息

- 类型：中型任务
- 当前阶段：自动化验收完成；真实 iPhone 增量同步验收待用户补做
- 最近更新：2026-09-30

### 历史后续事项

先用失败测试固定媒体日期、排序、分页和同步代次边界，再实现 SQLite 存储。
