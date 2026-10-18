# Photos 设备媒体

Photos 是 Exts macOS 应用内的设备媒体功能，源码位于 apps/desktop/src/modules/media，基于 Swift/SwiftUI 和 Apple ImageCaptureCore。当前应用和工程名仍为 Exts。

## 主要流程

连接 iPhone 后，应用建立设备会话并读取媒体，提供媒体索引、缩略图、选择和下载到本机的能力。连接时只读取设备媒体，不删除或修改设备内容。

目录读取完成后，月份从新到旧排列；每个月内优先按拍摄／创建时间倒序，缺少时使用修改时间，无日期的归到末尾，同时间使用稳定标识排序。

缩略图仅在照片进入滚动可见范围时请求，离开屏幕后移除尚未启动的任务；最多四个已经交给设备的请求允许完成并缓存。向 iPhone 请求最长边 512 像素的预览，实际清晰度由设备返回的数据决定，不预先下载原图。新预览使用独立缓存键，旧的小图缓存保留但不再复用；图片出现前后显示区域高度固定，滚回已加载照片时复用缓存。

下载结束使用 SwiftUI 原生提示显示成功／失败数量及原因；有成功文件时提供“在 Finder 中查看”，打开实际下载目录。附属文件失败独立提醒，不改变主文件的成功结果；错误详情最多展示五条并注明其余条数。未成功的选择保留，供用户重试。

设备未连接或会话失败时，需要检查连接并重新连接。设备访问、缩略图与实际下载效果需要在 macOS 和真实设备上确认，Windows 无法运行该原生功能。

## 文件与数据

开发版和正式版共用默认下载目录 `~/Downloads/Exts Downloads/Photos/`；后续实际需要下载的功能按 `Exts Downloads/<功能名>/` 建立子目录，不预建空目录。同名文件沿用不覆盖规则，追加编号保存。

缩略图缓存继续隔离：正式版为 ~/Library/Application Support/OhMy Photos/Thumbnails，开发版为 ~/Library/Application Support/Exts Dev/Thumbnails。旧的 ~/Downloads/OhMy Photos、~/Downloads/Exts Dev 及已有文件保留，不自动搬动或清理。

应用不自动迁移或删除已有文件。开发与正式配置身份独立，默认下载按用户批准规则共用，不作为数据隔离边界。完整身份与数据规则见[构建与分发](../build-release.md)。

## 运行入口

通过根 pnpm desk:dev 运行开发应用，pnpm desk:build 生成正式应用；所需 macOS、Xcode 与 XcodeGen 环境，以及工程结构见[应用 README](../../apps/desktop/README.md)。

