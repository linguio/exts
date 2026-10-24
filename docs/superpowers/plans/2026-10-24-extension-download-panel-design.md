# Download 首轮实施顺序

以 [Issue](../../changes/issues/2026-10-24-extension-download-panel-design-issue.md) 为范围事实来源；用户已批准实施。使用 executing-plans 串行执行，不启用子代理。

## 目标与边界

- TG 成功记录进入 Download；Newtab 读取、订阅、筛选和按来源清空。
- 复用 shared/storage；downloads 独立模块负责格式、后台消息和写入，不混入 settings。
- TG 保持页面保存与成功 Toast，桥接仅传记录元数据。
- 不接入 X 下载、Desktop、权限或新依赖，不自动提交。
- 未批准记录上限，不主动淘汰旧记录；存储错误不得改写原有记录或影响保存成功。

## 实施步骤

1. 在 tests/modules/downloads 验证持久化、排序、并发新增、按来源清空和消息来源；使用现有纯逻辑测试环境。
2. 在 modules/downloads 实现 schema/store、读写订阅与后台；后台入口仅注册模块。
3. 在 TG save-media 添加成功元数据回调，page 发事件、content-bridge 校验转发并沿用上下文失效清理；补充成功关闭、失败不记录的测试。
4. 从项目固定 shadcn commit 引入 Alert Dialog，适配本地路径、主题与现有浮层层级；在来源文档登记差异。
5. 在 newtab/views/downloads 组合 40px 列表、图标工具栏、Tooltip、清空确认和 Sonner；Dock 只组合入口与外壳。
6. 更新功能与边界说明；针对性测试通过后运行一次完整扩展测试、类型检查、生产构建及 diff 检查，停在用户验收。

## 验收风险

- 旧上下文不得继续写入；仅 Telegram 内容脚本可新增 TG，只有扩展页面可清空。
- 取消和写入失败不产生成功记录；记录存储失败不把实际成功保存误报为下载失败。
- 多标签新增与清空串行；首次读取不得覆盖较新的订阅结果。
- Alert Dialog、Tooltip、主题和真实文件授权由用户在 Chrome/Edge 验收，不添加 DOM 或焦点模拟测试。

## 执行结果

- 步骤 1–6 已执行；针对性测试先失败后通过，完整扩展 74 项测试、类型检查、生产构建通过。
- 类型检查仅测试索引可空问题，修正可选访问后通过；既有 theme-init.js 构建提示保留。
- 按仓库规则串行执行且不启动子代理；完成静态自查，浏览器验收待用户执行。不提交或推送。
