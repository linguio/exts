# Telegram Download

Telegram Web 图片、视频右键下载，模块位于 apps/extension/src/modules/tg-download/。保留页面取流、系统另存为和流式写文件，不连接 desktop，不额外登录。

## 模块与配置

- components/download-menu：图标加“下载资源”的官方菜单/按钮组合和 Shadow DOM 样式，宽度随内容，复用主题、hover 和手形指针。
- views/settings：TG 开关区域，由 Newtab Settings → Features 组合；不是 Newtab 通用设置。
- download-core：保存流程、分段响应写入与文件名生成，原文件名规则保持。
- page：媒体识别、页面注册及开关/主题桥接；没有下载历史消息或进度上报定时器。
- settings.ts：业务配置键与默认值。telegramDownload.enabled 保存于 storage.local，默认开启，缺省按开启处理，读取失败不开放下载入口；设置 Tooltip 仅保留功能简介。

仅注入 https://web.telegram.org/*，保留 Telegram Web K 的 .media-viewer-mover 媒体识别边界。关闭配置即时阻止新下载，已开始的保存继续；重新开启无需刷新。开关和 exts.theme 主题副本由隔离环境发布到页面，沿用原配置/主题事件，避免改名丢失设置。

## 下载与完成提示

1. 在媒体查看器右键“下载资源”，当前用户手势内打开另存为；浏览器确认后关闭菜单并开始取流，取消不请求媒体。
2. 图片/视频按响应数据流写入，分段响应继续 Range 请求，多个已确认下载各自运行，不依赖 Popup。
3. 只有 writable.close() 成功后显示“下载完成”，附实际保存文件名。开始、进度、失败和取消不弹提示；失败时中止写入并记录开发日志，释放读取锁，后续仍可下载。
4. Toast 使用 shared/ui/sonner.tsx 的官方样式组件，TG 自己提供文案和触发条件。多个完成提示沿用 Sonner 默认折叠堆叠、关闭和交互；没有自建通知队列或全局业务层。

Popup、modules/downloads 及其持久化、历史协议、后台适配与任务上报已移除；不迁移或清除旧存储数据，不提供下载列表、续传或取消/重试按钮。后续统一下载界面另行设计。

扩展重载后不再发送旧的任务消息；打开菜单前核对隔离环境，失效时关闭页面入口，刷新 Telegram 后恢复新脚本。已开始的页面流式保存不改为后台任务，不承诺关闭页面后继续。

## 保存位置

当前调用 showSaveFilePicker({ id: 'telegram-download', startIn: 'desktop', suggestedName })。desktop 建议从系统桌面打开，浏览器可能记住相同 id 的上次位置，用户仍能选择其他目录；不能锁定任意绝对路径。仅文件名作为建议，不创建文件夹，不引入目录授权或免另存为流程。

## 用户验收

1. Chrome/Edge 加载根 dist/build/chrome-mv3/；重新加载后刷新 Telegram，确认工具栏不再有 Popup。
2. Newtab 设置切换 Light/Dark/System，检查 TG 菜单和完成 Toast 一致；设置简介不含关闭行为的英文说明。
3. 右键媒体检查图标加“下载资源”、内容宽度、hover 和手形；取消另存为不下载、不提示。确认后可在另一个媒体继续发起下载。
4. 完成多个图片/视频保存，确认文件可用，仅成功完成显示带文件名的 Toast，多个提示折叠堆放；失败不弹提示，也不能误报完成。
5. 在 TG 保持打开时重新加载扩展，再右键应不报未捕获上下文失效错误，刷新后恢复使用。
6. 开关关闭时不再创建新下载，已开始任务继续；桌面只是建议位置，确认系统另存为实际表现。

代理仅验证逻辑、类型、配置和构建，真实下载、系统保存窗口、主题、hover、菜单和 Toast 折叠交互由用户验收。
