# 访问历史自动清理设计

- 工作项：2026-10-16-extension-history-cleaner
- 状态：已批准；用户于 2026-10-16 确认继续
- 对应 [Issue](../../changes/issues/2026-10-16-extension-history-cleaner-issue.md) 与 [Commit 记录](../../changes/commits/2026-10-16-extension-history-cleaner-commit.md)

## 第一版交付

一个开关同时控制启动和关闭清理，默认关闭，本机保存。只清当前浏览器配置文件的全部访问历史，不提供时间、网站或数据种类选择。开启开关不会立即清理，下一次符合条件的事件才执行。

## 模块边界

- src/modules/history-cleaner 持有设置、清理操作、事件监听和设置区域。
- src/entrypoints/background.ts 仅注册模块，后台不依赖 Newtab 或 React。
- Newtab Settings 引入模块设置区域，只负责页面组合；功能运行不依赖页面打开。
- 使用现有 Chrome API、React、Button 与主题 Token，不新增库或通用设置框架。

## 触发定义

| 事件 | 开启且有权限时的行为 |
| --- | --- |
| runtime.onStartup | 清空一次访问历史 |
| windows.onRemoved | 查询剩余普通窗口和网页弹窗；没有剩余窗口时尝试清理 |
| 扩展安装、更新、worker 普通唤醒 | 不主动清理 |
| 打开 Settings、切换开关 | 只读写设置，不清理 |

DevTools 不计入浏览器窗口，无痕模式不在第一版支持范围。多个窗口同时关闭时，进程内合并重叠的清理调用，不引入持久队列或重试状态。

“启动”指当前浏览器配置文件的 onStartup 事件：浏览器后台进程持续运行时，重新打开一个窗口未必触发该事件。关闭时的清理和启动时的清理分别触发，不依赖上次清理结果。

## 权限与配置

- 保留已有 tabGroups，新增 storage，配置只写 storage.local，不同步到其他设备。
- browsingData 使用 optional_permissions；用户主动开启时申请，授权成功并保存配置后才显示开启，拒绝则保持关闭。相比安装时强制申请，可选授权与默认关闭功能一致。
- 实测反馈后的事实澄清：browsingData 没有独立权限警告，Chrome 的请求可以静默成功；设计不要求必然出现授权弹窗，拒绝分支由 API 替身验证。
- 使用 browsingData.removeHistory({ since: 0 })，不申请读取 URL 所需的 history、tabs 或站点权限。
- 每次事件从持久存储读取开关并检查权限，不依赖 worker 内存长期保存状态。权限被撤销后停止清理，设置区域显示未启用并允许重新授权。
- 关闭开关先保存关闭状态；不要求用户在扩展管理页额外操作。已开始的清理不能撤回。

## Settings 区域

沿用现有英文界面，在 Sheet 正文中放一个区域：

- 区域标题：Browsing history。
- 开关标题：Clear history on startup and close。
- 描述：Clears all browsing history when the browser starts and the last window closes. Cookies, cache, and downloads are kept.
- 默认关闭；加载、保存或授权中禁止重复操作；保存失败或缺少权限时显示就地文字反馈，不假装保存成功。

复用现有 Button 提供开关语义与状态，不引入新的 shadcn 原语、全局状态库或额外页面。多个已打开的新标签页通过 storage 变更同步状态，不互相覆盖旧值。

## 失败与限制

关闭事件不能阻止浏览器退出，不能保证退出前完成。下次启动再次清理不意味着历史在关闭期间一定为空；启动时也可能删除刚恢复页面产生的新历史。

清理失败仅记录可诊断错误，不自动重试，不新增失败补偿或清理记录界面。测试不操作用户真实历史，真实操作由用户用专用浏览器配置文件验收。

## 验证与停止点

纯逻辑验证覆盖默认关闭、授权拒绝、配置持久化、启动触发、多窗口判断、缺少权限和失败处理；配置验证权限及后台产物，复用现有完整测试、类型检查、构建和体积检查。

不新增假 DOM、布局、焦点、指针或截图测试。用户在 Chrome/Edge 实际确认授权、设置持久化、启动和最后窗口关闭行为，期间不打开 worker 调试器以免影响生命周期。自动化后停在用户验收，不主动提交。

## 官方依据

- [Chrome 窗口事件](https://developer.chrome.com/docs/extensions/reference/api/windows#event-onRemoved)
- [配置文件启动事件](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onStartup)
- [历史清理 API](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeHistory)
- [可选权限](https://developer.chrome.com/docs/extensions/reference/api/permissions)
- [后台生命周期](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
- [WXT 后台入口](https://wxt.dev/guide/essentials/entrypoints.html)
