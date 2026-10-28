# exts 浏览器扩展

统一 Chrome／Edge 扩展，包含 Newtab、Dock、Settings、Studio、历史清理和媒体下载模块。

## 功能文档

- [扩展功能索引](../../docs/extension/README.md)：功能状态与说明入口。
- [Newtab](../../docs/extension/newtab.md)：书签、Dock、工具入口与 Settings。
- [历史清理](../../docs/extension/history-cleaner.md)：启动与关闭时清空访问历史的配置、权限与能力边界。
- [Telegram Download](../../docs/extension/telegram-download.md)：Telegram Web 下载、即时开关、完成提示与保存位置限制。
- [界面规范](../../docs/extension/ui.md)：共用主题、样式和组件规则。

## 目录职责

- `src/entrypoints/`：WXT 入口；`src/app/`：Home／Studio、Provider 与常驻 Dock 的应用组合。
- `src/modules/newtab/`：首页布局、书签配置与文件夹；`utils/bookmarks/` 持有解锁判断与标签组打开辅助。
- `src/modules/dock/`：底部导航、菜单和抽屉入口；`hooks/` 持有入口提示协调。
- `src/modules/settings/`：Settings Sheet 与 General／Media Download 设置界面编排。
- `src/modules/history-cleaner/`：可选权限、配置适配、后台清理与 `views/` 设置区域；后台由独立入口注册。
- `src/modules/media-download/`：`download/telegram/` 保存媒体与请求目录授权，`pages/`、`bridges/`、`background/` 分别接入 MAIN、隔离与后台环境；`stores/` 保存目录句柄和记录读写，`components/`、`views/` 持有菜单、记录行及记录 Sheet；`utils/` 持有定位、文件名、分段读写辅助与记录处理，`types/`、`constants/` 保存共用类型及协议常量。
- `src/modules/studio/`：Studio 页面、ActivityCard 和日历；日期逻辑、Hook 与类型分别归 utils、hooks、types；通过模块入口供 Home 展示活动卡片。
- `src/shared/brand/`：共用 BrandIcon 与尺寸类型；`src/shared/bookmarks/`：共用 BookmarkCard 和基础书签类型。
- `src/shared/settings/`：配置读写和订阅；`src/shared/storage/`：存储工具；`src/shared/theme/`：主题解析与同步。
- `src/shared/ui/`：通用 UI 控件；`src/shared/lib/`：共用工具；`src/shared/browser/`：扩展资源地址工具。
- `src/assets/`：品牌 SVG、应用图标与公共字体；`src/styles/`：全局样式。
- `tests/modules/`：书签、日历、历史清理、TG 下载及记录行为；`tests/shared/`：配置与主题逻辑；`tests/config/`：Manifest 与资源完整性。
- 根 `wxt.config.ts`、`package.json`：构建与应用配置。

模块保留业务归属，shared 不导入业务模块；只为实际需要创建职责目录。UI 入口与后台、页面脚本入口分开，不通过界面聚合入口加载后台逻辑。

历史清理默认关闭，开启时由浏览器请求 `browsingData` 可选权限；必需的 `storage` 用于本机保存配置。不需要打开 Newtab 才能清理，不申请额外站点访问权限。

## 根目录用法

`pnpm ext:dev` 启动 WXT；Chrome／Edge 只加载根 `dist/dev/chrome-mv3-dev-stable/`，不能加载会被重建清空的根 `dist/.cache/extension/chrome-mv3-dev/` 临时目录。应用内部不再生成 dist；修改路径后停止并重新启动旧开发进程。

`pnpm ext:build` 生成根 `dist/build/chrome-mv3/`。Manifest 产品版本由根 `scripts/version.mjs` 读取根 `package.json` 的 `version`，不在子项目维护。包内 `pnpm test`、`pnpm typecheck` 负责逻辑与构建验证，不执行视觉或交互验收。

应用图标为透明黑／白 PNG，系统配色偏好在新标签页挂载后同步到工具栏及 favicon。用户自行检查真实浏览器主题效果；扩展 ID 或加载目录变化不保证旧存储自动继承。

`pnpm ext:release` 独立构建扩展并生成根 `dist/release/exts-chrome.zip`，不构建网站或桌面；再次打包在同目录暂存完成生成和校验后安全替换旧固定包，失败保留旧包；ZIP 解压后可在 Chrome 扩展管理页开启开发者模式并加载解压目录。`pnpm ext:release` 仅供本地扩展验包。从产品 1.2.0 起，正式发布统一通过 Actions → Exts Publish → main／Release，在 macOS 上执行完整 `pnpm release`，生成包含扩展 ZIP 和桌面 DMG 的同版本草稿。每次新发布前提升根版本，两端即使没有改动也一起重新构建和更新版本，用户验收后统一公开。完整版本、产物和稳定目录规则见 [构建与分发规范](../../docs/build-release.md)。
