# 访问历史清理方案

状态：方案已讨论，尚未实现。当前扩展没有历史清理模块、后台清理行为或设置开关；正式实施范围仍需在对应 Issue 中批准和记录。

## 目标与入口

第一版拟在浏览器启动与最后一个窗口关闭时各清空一次访问历史。功能模块拟放在 apps/extension/src/modules/history-cleaner，与 newtab 同级，后台独立执行，不需要打开 Newtab。

配置入口拟放在 Newtab 的 Settings 中，只有一个“启动和关闭时清空访问历史”开关，默认关闭，配置仅保存在本机。

## 已讨论的行为

| 场景 | 开启后的预期行为 |
| --- | --- |
| 浏览器配置文件启动 | 清空一次全部访问历史 |
| 最后一个浏览器窗口关闭 | 尝试清空一次全部访问历史 |
| 关闭标签页或仍有其他窗口 | 不触发关闭清理 |
| 开关关闭 | 不执行自动清理 |

范围限定为当前浏览器配置文件的全部访问历史，不清理 Cookie、缓存和下载记录，不主动改变网站登录状态。第一版不做时间筛选、网站例外或失败补偿状态。

## 能力边界

关闭窗口时触发清理不等于浏览器保证等待清理完成；下次启动再次清理可以覆盖上次遗留历史，但不保证关闭期间历史已被删除。启动清理也可能包含刚恢复页面产生的少量新历史。

不处理崩溃、强制结束或断电场景，不将此功能描述为保证退出前完成的隐私保护机制。

技术依据：[窗口关闭事件](https://developer.chrome.com/docs/extensions/reference/api/windows#event-onRemoved)、[配置文件启动事件](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onStartup)、[访问历史清理](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeHistory)、[后台生命周期](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)。

设置入口所在页面见[Newtab](./newtab.md)，扩展功能状态见[功能索引](./README.md)。
