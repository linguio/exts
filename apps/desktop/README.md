# exts 桌面应用

macOS 原生应用，正式 Bundle Identifier 为 `dev.linguio.exts`，开发为 `dev.linguio.exts.dev`，Organization Identifier 为 `dev.linguio`。

## 功能文档

- [桌面功能索引](../../docs/desktop/README.md)：当前产品与功能入口。
- [Photos 设备媒体](../../docs/desktop/ohmy-photos.md)：功能流程、使用限制与数据位置。

## 当前结构

- `src/app/`：ExtsApp 入口与窗口组合。
- `src/modules/media/`：设备会话、媒体索引、缩略图、选择与备份，含模块 UI。
- `src/resources/`：应用 Assets 和已确认的 AppIcon。
- `tests/modules/media/`：现有媒体纯逻辑 XCTest；`tests/scripts/`：desk 入口逻辑测试。
- `project.yml`／`exts.xcodeproj/`：工程配置；`scripts/`：原生构建入口；编译缓存集中到根 `dist/.cache/desktop/DerivedData/`。最终应用发布到仓库根 `dist/`。

当前没有需要跨模块复用的 Swift 能力，故不创建空 shared 目录；后续功能按模块迁入，不将业务混入 app。

## 根目录命令

`pnpm desk:dev` 构建 Debug，发布完整应用到根 `dist/dev/exts-dev.app` 并打开；重新运行前先退出旧开发应用，避免 macOS 激活仍在运行的旧进程。`pnpm desk:build` 生成根 `dist/build/exts.app`。两种模式都从根 `package.json` 读取产品版本，构建入口会用 XcodeGen 重新生成工程。

需要 macOS 27、Xcode 27 和 xcodegen；非 macOS 或缺少工具时明确报错。逻辑入口检查：`node --test apps/desktop/tests/scripts/desk.test.mjs`。

正式与开发共用默认下载目录 `~/Downloads/Exts Downloads/Photos/`，下载结束显示原生结果提示，成功时可在 Finder 中查看；缓存和配置保持隔离，旧下载文件不迁移。完整数据位置见 [Photos 文件与数据](../../docs/desktop/ohmy-photos.md#文件与数据)。不同 Bundle Identifier 的配置独立，开发版可能需要重新授权设备或目录。

[当前 Issue](../../docs/changes/issues/2026-10-19-repo-desktop-first-release-issue.md)

根 `pnpm release` 同时生成本地 `dist/release/exts-chrome.zip` 与 `dist/release/exts-mac.dmg`；开发只使用 `.app`，无需安装 DMG 或配置分发证书。Actions → Exts Publish → Release 从 main 手动生成双包草稿，用户下载 DMG，将 exts.app 拖入 Applications 后启动；公开 Release 仍由用户验收后操作。首版仅供本人在 macOS 27 上使用，当前为 arm64，不接入开发者分发签名、公证或旧系统兼容。完整版本、产物及数据隔离规则见 [构建与分发规范](../../docs/build-release.md)。

## 本轮验证限制

2026-10-19 已通过开发及正式 Xcode 构建和本地双包打包，DMG 镜像校验通过，开发 app 打开命令成功。实际设备、界面、图标、备份、DMG 挂载安装和远程 Actions 由用户验收。

本次 Photos 验收修正包含可见范围缩略图加载、512 像素设备预览、稳定显示尺寸和月内倒序；相关分组／队列纯逻辑 XCTest 8 项通过。完整原生测试在既有 SQLite 压力用例复现 `FROM mediaORDER BY` 错误后停滞，已中止且不重试，不宣称原生全量通过。当前媒体界面未使用该 SQLite 分页路径，历史问题和既有 Swift 编译警告保留；滚动表现和设备返回的预览清晰度由用户验收。

后续下载结果／目录纯逻辑测试 7 项通过，开发 app 与正式双包已再次更新并校验；原生提示、Finder 跳转和真机下载仍由用户验收，未重跑已知中止的原生全量测试。
