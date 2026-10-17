# 访问历史自动清理

功能源码位于 apps/extension/src/modules/history-cleaner，与 Newtab 独立；后台不要求打开新标签页。

## 开启与关闭

进入 Newtab → Dock 右侧 Settings → Features，使用 Clear history on startup and close 开关。悬停或键盘聚焦标题旁的问号可查看清理范围与触发说明；错误直接显示。默认关闭，配置仅保存在本机，不同步到其他设备；多个已打开的新标签页会同步配置变化。

开启时申请清理浏览数据的可选权限。browsingData 不带独立权限警告，Chrome 可以直接授予而不弹窗；有无弹窗不影响权限检查。授权成功且配置保存完成才显示开启，拒绝则保持关闭；开启本身不会立即删除历史。关闭后停止后续自动触发，已开始的删除不能撤回。权限被撤销后也停止清理，可重新打开设置授权。

## 清理范围与触发

只清空当前浏览器配置文件的全部访问历史。不清 Cookie、缓存或下载记录，不主动改变登录状态；不提供时间筛选或网站例外。

| 场景 | 开启且有权限时的行为 |
| --- | --- |
| 浏览器配置文件启动 | 清空一次全部访问历史 |
| 最后一个普通浏览器窗口或网页弹窗关闭 | 尝试清空一次全部访问历史 |
| 关闭标签页或仍有普通窗口/网页弹窗 | 不触发清理 |
| 打开 Settings、开启开关、安装或更新扩展 | 不立即清理 |
| 开关关闭或清理权限缺失 | 不执行自动清理 |

DevTools 不计入浏览器窗口，无痕模式不在支持范围。后台普通唤醒不代表浏览器启动；后台进程仍运行时，重新打开一个窗口未必触发配置文件启动事件。

## 限制

关闭窗口时触发清理不等于浏览器保证等待清理完成；下次启动再次清理可以覆盖上次遗留历史，但不保证关闭期间历史已被删除。启动清理也可能包含刚恢复页面产生的少量新历史。

不处理崩溃、强制结束或断电，不保存清理成功记录，不自动重试；后台 API 失败只记录诊断错误，不能把此功能理解为保证退出前完成的隐私保护机制。

实际加载路径和验证步骤见[当前 Issue](../changes/issues/2026-10-16-extension-history-cleaner-issue.md)。建议用专用测试浏览器配置文件验收，避免删除日常历史；不要打开扩展 worker 调试器，以免影响生命周期。

技术依据：[窗口关闭事件](https://developer.chrome.com/docs/extensions/reference/api/windows#event-onRemoved)、[配置文件启动事件](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onStartup)、[访问历史清理](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeHistory)、[可选权限](https://developer.chrome.com/docs/extensions/reference/api/permissions)、[后台生命周期](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)。

设置入口所在页面见[Newtab](./newtab.md)，扩展功能状态见[功能索引](./README.md)。
