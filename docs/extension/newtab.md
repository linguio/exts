# Newtab 新标签页

Newtab 是 Exts 扩展的新标签页模块，源码位于 apps/extension/src/modules/newtab。加载扩展后，打开新标签页进入书签页面。

## 书签与文件夹

- 页面按文件夹组织网站书签；EDU 文件夹默认带模糊遮罩。
- 普通书签提供网站名称和图标，链接打开目标网站；工具分组中的部分入口可批量创建标签组。
- 当前书签来自模块配置，没有可用的用户编辑、拖拽或自定义书签设置。

## Dock

底部收藏入口依次为 ChatGPT、Gmail、GitHub、Exts，直接打开对应网站。Exts 使用已有的完整正式圆角 Logo，保留黑底白色主体，不随页面主题反色。

Components 和 DevTools 提供工具菜单；入口悬停或键盘聚焦时显示名称提示，点击工具入口打开菜单。

## Settings

Dock 右侧的 Settings 打开右侧设置面板，面板跟随当前明暗主题。目前只有面板外壳，没有可配置功能。

[历史清理方案](./history-cleaner.md)计划在此提供开关，后台功能将独立运行；当前尚未接入，不应把该方案理解为现有功能。

## 使用与限制

- 面向 Chrome、Edge，不要求其他浏览器兼容。
- 明暗主题跟随系统或浏览器的配色偏好，单色书签按现有规则改色。
- 开发时加载根 dist/dev/chrome-mv3-dev-stable，生产构建加载 dist/build/chrome-mv3；具体操作见[应用 README](../../apps/extension/README.md)。
- 本模块不要求其他扩展功能依赖 Newtab 页面保持打开。

共用样式和组件规则见[界面规范](./ui.md)，构建产物规则见[构建与分发](../build-release.md)。
