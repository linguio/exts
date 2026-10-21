# Telegram Download

Telegram Web 的图片、视频右键下载，独立模块位于 `apps/extension/src/modules/telegram-download/`。迁入保留旧实现的页面取流、系统另存为和流式写文件，不连接 desktop，不额外登录 Telegram。

## 配置与下载

- Newtab → Settings → Features → Telegram Download，默认开启；Tooltip 解释 Telegram Web 用途和关闭边界。
- `telegramDownload.enabled` 保存于扩展本机 `storage.local`。缺省默认开启，显式 false 始终关闭；读取失败不开放下载入口，保存失败在设置区域提示。
- 仅注入 `https://web.telegram.org/*`。保持旧版 Telegram Web K 媒体查看器（`.media-viewer-mover`）识别范围，不宣称所有 Telegram 页面版本都能命中。
- 在媒体查看器右键选择“下载资源”，系统另存为确认后开始取流；取消另存为不下载、不建立视频任务。
- 关闭开关立即移除菜单、恢复网页原本右键行为，不能发起新下载；已开始的图片/视频写入继续。重新开启不要求刷新。
- 下载菜单使用现有官方 DropdownMenu，Shadow DOM 隔离网页样式；主题 Token 与 Newtab、Popup 同源，主题偏好通过扩展存储副本同步。网页菜单沿用系统字体后备，不额外把字体内联到脚本。

## Downloads Popup

工具栏 Popup 只读展示文件名、Telegram 来源、字节进度、下载中/完成/失败/中断状态。图片维持原有保存行为，当前视频才建立记录；没有取消、重试、清理或打开目录按钮。

记录由独立 `src/modules/downloads/` 模块合并、验证和持久化，Popup 不执行下载。数据键为 `downloads.records`，含来源、任务 ID、文件名、字节数、状态、创建时间和页面归属；不保存媒体 URL、账号凭据或文件内容。最多保留最近 200 条终态记录，活动任务不淘汰。重复下载建立独立任务，重名仍由系统另存为处理。不读取旧 OhMy DL 历史，不为尚未接入的 X 建入口。

通用任务协议由 downloads 持有；Telegram 模块校验网页来源后报告任务，记录层不反向导入 TG。WXT 入口只声明匹配网址/执行环境并注册模块；不保留旧消息、手动清理接口或独立应用发布结构。工具栏标题与图标始终属于 Exts，Popup 内标题为 Downloads。

视频开始与终态立即同步，进度每 250ms 合并；完成只在文件写入关闭成功后报告。页面刷新/导航、关闭标签页及浏览器真实重启会把相关未结束记录标为中断；普通后台唤醒不会误标失败。记录不是可恢复队列，刷新后不承诺续传。

Popup 使用 extension 全局主题、Geist 字体、Separator 和 Token，Light/Dark/System 与 Newtab 一致，已打开的 Popup 同步主题变化。

## 保存位置的能力边界

当前调用 `showSaveFilePicker({ id: 'telegram-download', startIn: 'downloads', suggestedName })`。

- `downloads` 只是预定义初始目录；相同 id 可供浏览器记住上次位置，不能锁住位置。
- `startIn` 只接受预定义目录名或已取得的 FileSystemHandle，不接受 `~/Downloads/Exts Downloads/Telegram/` 这样的任意路径字符串。
- `suggestedName` 只建议文件名，不创建父目录；当前不能无授权自动创建并定位上述固定文件夹。
- 首次授权目录后可以取得句柄，但这是另一种需要用户批准的流程，本次不增加。

依据：[File System Access Starting Directory](https://wicg.github.io/file-system-access/#starting-directory) 与 [showSaveFilePicker](https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker)。以上是接口及源码核对，不能表述为已经完成 Chrome/Edge 系统保存窗口实测。

## 用户验收

1. 运行根 `pnpm ext:build`，在 Chrome/Edge 扩展管理页加载根 `dist/build/chrome-mv3/`；已有相同目录的扩展点击重新加载，再刷新已打开的 Telegram Web。
2. 打开 Newtab Settings，确认默认开启的 Telegram Download 和 Tooltip；分别选择 Light/Dark/System，再打开 Popup，检查一致的主题与系统变化。
3. 在 Telegram Web K 媒体查看器测试图片及视频：右键“下载资源”，先取消另存为，应不取流且无视频记录；再实际保存，确认文件可打开，视频进度可在 Popup 查看，关闭 Popup 不影响下载。
4. 菜单打开时在另一个 Newtab 关闭开关，确认菜单立即消失，原 Telegram 页面右键不再出现 Exts 下载入口；已有视频继续，记录仍可查看。重新开启后不用刷新即可下载。
5. 同时保存两个视频，确认独立进度；重复保存同一视频作为新记录，重名按系统提示处理。成功只在写入完成后显示。
6. 下载期间刷新或关闭标签页，检查相应任务标为中断；已完成任务保留。重启浏览器后检查未结束记录状态，不要求续传。
7. 系统另存为手动选定 Telegram 文件夹后再保存一次，观察浏览器是否记住位置；不能据此断言代码已写死或锁定目录。

代理只执行纯逻辑、类型和构建检查；菜单、焦点、布局、主题、浏览器权限、保存窗口及真实 Telegram 媒体由用户验收。
