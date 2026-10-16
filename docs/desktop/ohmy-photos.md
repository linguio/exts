# Photos 设备媒体

Photos 是 Exts macOS 应用内的设备媒体功能，源码位于 apps/desktop/src/modules/media，基于 Swift/SwiftUI 和 Apple ImageCaptureCore。当前应用和工程名仍为 Exts。

## 主要流程

连接 iPhone 后，应用建立设备会话并读取媒体，提供媒体索引、缩略图、选择和下载到本机的能力。连接时只读取设备媒体，不删除或修改设备内容。

设备未连接或会话失败时，需要检查连接并重新连接。设备访问、缩略图与实际下载效果需要在 macOS 和真实设备上确认，Windows 无法运行该原生功能。

## 文件与数据

正式版保留已有默认位置：下载目录为 ~/Downloads/OhMy Photos，缩略图缓存为 ~/Library/Application Support/OhMy Photos/Thumbnails。开发版分别使用 ~/Downloads/Exts Dev 和 ~/Library/Application Support/Exts Dev/Thumbnails。

应用不自动迁移或删除已有文件。开发与正式身份独立；用户主动选择同一外部目录时，不能依靠默认目录实现隔离。完整身份与数据规则见[构建与分发](../build-release.md)。

## 运行入口

通过根 pnpm desk:dev 运行开发应用，pnpm desk:build 生成正式应用；所需 macOS、Xcode 与 XcodeGen 环境，以及工程结构见[应用 README](../../apps/desktop/README.md)。

