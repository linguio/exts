---
date: "2026-09-20"
scope: desktop
status: completed
type: task
---

# 打包 X Download Helper 固定视频工具链

## 当前阶段

已完成。

## 目标与范围

### 背景

X Download Helper 已能接收扩展提交的 X 单帖地址，但还没有真实视频下载工具。后续下载主路径需要稳定调用 `yt-dlp` 与 `ffmpeg`，不能依赖用户另外安装 Homebrew、Python，也不能从不确定的系统 `PATH` 选择工具版本。

### 目标

将固定版本的 `yt-dlp` 和原生 Apple Silicon `ffmpeg` 放入 Helper App Bundle，并建立明确的准备、校验、定位与版本检查边界，为下一工作项的真实下载引擎提供稳定工具路径。

### 范围

- 固定 `yt-dlp 2026.08.19` 与 `FFmpeg 9.0.2`。
- 从受控来源获取源码或发布资产，校验版本和完整性。
- 使用当前 Mac 的 Apple Silicon 架构构建最小 FFmpeg，不依赖 Rosetta。
- 将两个工具复制到 Helper App Bundle 的固定资源目录。
- Helper 通过 `Bundle` 解析工具位置，不搜索 Homebrew、Python 或系统 `PATH`。
- 增加工具存在、可执行、架构和版本校验。
- 保存必要的第三方许可与来源说明。
- 验证普通 Xcode 构建不会临时下载或自动更新工具。

### 排除项

- 不解析 X 帖子、不访问网络媒体、不下载或合并视频。
- 不改造任务模型、任务列表、按钮或 Native Messaging 协议。
- 不实现工具自动更新、首次启动下载、版本迁移或降级。
- 不处理 Intel Mac、Windows、签名、公证、DMG 或对外分发。
- 不把第三方工具的完整源码提交到仓库。
- 不新增视觉、布局或交互自动化测试。

## Todo

- [x] 完成并批准工具链设计 Spec。
- [x] 编写并批准文件级实施 Plan。
- [x] 实现固定版本工具准备脚本、完整性校验和许可记录。
- [x] 将工具接入 Helper App Bundle，并实现应用内路径与版本检查。
- [x] 完成真实工具生成、工具脚本、Swift 逻辑、Xcode 构建和 App Bundle 验证。
- [x] 提交阶段验收说明并取得用户验收通过。

## 验收标准

- 在当前 Apple Silicon Mac 上，Helper App Bundle 内包含可执行的 `yt-dlp 2026.08.19` 和原生 arm64 `ffmpeg 9.0.2`。
- Helper 能通过固定 Bundle 路径找到两个工具并读取正确版本，不使用 Homebrew、Python 或系统 `PATH`。
- 工具缺失、不可执行、架构错误或版本不符时产生可诊断错误，不静默回退到系统工具。
- 普通 Xcode Test、Build 与运行阶段不联网下载工具，也不执行工具自更新。
- 仓库记录工具来源、固定版本、完整性校验值、构建方式和适用许可。
- 本工作项不产生真实视频文件，也不改变现有扩展唤起 Helper 的行为。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-20-x-download-helper-toolchain`
- 对应 Issue：[打包 X Download Helper 固定视频工具链](2026-09-20-x-download-helper-toolchain-issue.md)
- 状态：已完成
- 用户验收：通过
- 最终提交批准：已批准
- 创建日期：2026-09-20
- 最近更新：2026-09-20

#### 预期交付边界

- 将固定版本的 `yt-dlp` 与 `ffmpeg` 打包进 Helper App Bundle。
- 增加应用内工具路径解析、可执行性检查和版本校验。
- 验证 Helper 构建产物不依赖 Homebrew、Python 或系统 `PATH`。
- 不实现真实媒体解析、下载、任务状态或界面调整。

#### 实际完成内容

- 增加固定版本清单、官方下载来源、SHA-256 校验和第三方许可说明；FFmpeg 优先读取本地官方归档。
- 增加工具准备脚本与 fixture 行为测试，覆盖本地归档优先、摘要、版本、架构失败及旧产物保留。
- 生成并校验真实 `yt-dlp 2026.08.19` 与原生 arm64 `ffmpeg 9.0.2`，接入 App Bundle 的 `Contents/Resources/Tools`。
- 增加 `VideoToolPaths`、`VideoToolValidator` 与 8 个失败/成功分支 XCTest，不搜索系统 PATH。

#### 验证结果

- `zsh apps/helpers/x-download-helper/Tests/PackagingTests/verify_video_tool_preparation.sh` 通过。
- 真实准备脚本通过，`yt-dlp --ignore-config --no-update --version` 输出 `2026.08.19`，`ffmpeg -version` 输出 `9.0.2`，`lipo -archs` 输出 `arm64`。
- 授权环境下 `zsh apps/helpers/x-download-helper/scripts/build.sh` 构建成功，工具复制到 `Contents/Resources/Tools`。
- 授权环境下 `xcodebuild test ... CODE_SIGNING_ALLOWED=NO` 通过，21 个测试零失败。
- `zsh apps/helpers/x-download-helper/scripts/verify_app_bundle.sh` 通过。

#### 未验证事项与限制

- 普通沙箱直接执行 `yt-dlp` 会因 `semctl` 权限限制失败；授权环境版本校验和 Bundle 验证均通过，属于当前执行环境限制。
- 用户已确认桌面环境验收无问题；本阶段不新增视觉或交互自动化测试。

#### 用户验收

- 结果：通过
- 说明：用户已确认桌面环境验收无问题；本阶段未新增视觉或交互自动化测试。

#### 最终 Commit message

```text
build(x-download-helper): 打包固定版本视频下载工具链

- 将固定版本的 yt-dlp 与 ffmpeg 打包进 Helper App Bundle
- 增加应用内工具路径解析、可执行性检查和版本校验
- 验证 Helper 构建产物不依赖 Homebrew、Python 或系统 PATH
```

#### 最终提交批准

- 状态：已批准
- 说明：用户已完成阶段验收并批准本地 Git Commit；未推送远端。

## 关联文档

- [工具链设计](../../../superpowers/specs/2026-09-20-x-download-helper-toolchain-design.md)
- [实施 Plan](../../../superpowers/plans/2026-09-20-x-download-helper-toolchain.md)

## 历史补充

### 元信息

- 类型：架构任务
- 当前阶段：用户验收通过，已完成固定视频工具链交付
- 最近更新：2026-09-20

### 历史后续事项

串行执行最终验证，更新交付记录并停在用户验收，不提交 Git Commit。
