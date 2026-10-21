# 浏览器扩展

Exts 是面向 Chrome 和 Edge 的浏览器扩展，按独立功能组织模块。

## 功能

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| [Newtab](./newtab.md) | 已实现 | 新标签页书签、文件夹、Dock、工具入口与 Settings 面板 |
| [历史清理](./history-cleaner.md) | 已实现 | 默认关闭，在 Settings 开启后于启动和最后窗口关闭时清空访问历史 |
| [Telegram Download](./telegram-download.md) | 已实现 | 默认开启的 Telegram Web 图片/视频另存为下载，工具栏 Downloads 只读展示视频记录 |

## 文档入口

- [界面规范](./ui.md)：主题、共用样式与组件组合规则。
- [应用 README](../../apps/extension/README.md)：源码组织、开发、构建与加载方式。
- [构建与分发](../build-release.md)：版本、产物与稳定开发目录。

功能行为在对应说明中维护，共用界面规则在 ui.md 维护；不在源码模块目录重复建立 README。新增独立功能时，在本目录添加说明并加入索引。
