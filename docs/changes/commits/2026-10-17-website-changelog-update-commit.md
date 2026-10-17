# 官网发布日志更新交付记录

- 对应 [Issue](../issues/2026-10-17-website-changelog-update-issue.md)
- 状态：已完成
- 预期交付边界：仅更新用户确认的官网日志条目与必要工作记录，不改页面结构或样式。
- 实际交付：分别新增 2026-10-17 Extension“新增扩展设置”和 2026-10-16 Extension“新增历史清理功能”，沿用确认文案；既有文案、页面结构及样式不变；首次 Chrome 发布条目补充“exts-chrome.zip · 1.0.0”，固定指向已核实的对应 Release。“新增历史清理功能”按用户指定补充 v1.1.0 Release 链接，文字为 exts-chrome.zip · 1.1.0；“新增扩展设置”暂不加链接。
- 追加交付：按用户明确要求将官网共用分类名统一为单数 Extension，同步官网 UI 规范；Changelog 扩展平台类型及三个扩展条目标签同步为 Extension，标题与正文不变。
- 版本展示：扩展与 npm 链接文字统一不加 v，Release URL 保留实际标签的 v；最终构建产物中的三个包名与版本已核对。
- 自动化验证：更正后官网类型检查、生产构建、两个标题及六条文案产物核对通过；既有日志仅首次 Chrome 条目新增 v1.0.0 链接，其他历史正文与 HEAD 一致，扩展标签统一为 Extension，diff 检查通过。
- 未验证事项：实际页面展示与浏览器链接跳转待用户验收；v1.1.0 Release API 核对返回 404，发布后的实际链接可用性待验收。
- 用户验收：用户明确要求升级版本并提交到本地，视为确认已展示的交付；代理未执行浏览器视觉验收。
- 最终提交批准：已批准三笔本地提交，不推送、不部署、不上传 Release。
- 产品版本：根 package.json 从 1.0.0 升级至 1.1.0，扩展 Manifest 继续读取根版本，独立 npm 工具包版本不变。
- 本次版本验证：node scripts/version.mjs 输出 1.1.0；构建发布逻辑测试 17 项通过。
- 本次版本验证限制：pnpm 扩展类型检查与发布打包触发自动安装，因 registry DNS 解析失败已停止重试；现有 TypeScript 安装不完整，直接检查报 MODULE_NOT_FOUND。未生成并核实 1.1.0 ZIP，不能将既有 dist/release/exts-chrome.zip 当作本次新版本发布包。依赖恢复后需运行 pnpm ext:release 并核对 ZIP 根 Manifest。官网验证结果为此前最终官网文案阶段的通过结果，不冒充本次扩展版本验证。
- 提交拆分：按批准的范围拆为产品版本、官网内容、工作记录三笔。
- 最终 Commit message：

第一笔：package.json。

```text
build(repo): 将产品版本升级至 1.1.0

- 将根产品版本从 1.0.0 升级至 1.1.0
- 保持扩展 Manifest 从根版本读取，独立 npm 包版本不变
```

第二笔：changelog-data.ts、categories.ts、docs/website/ui.md。

```text
docs(website): 补充扩展更新日志并统一分类名称

- 分别记录扩展设置与历史清理功能，补充对应版本发布链接
- 将官网分类和更新日志扩展标签统一为 Extension
```

第三笔：当前 Issue、Commit 记录、工作台、排队的产品命名 Issue 和 Commit 记录。

```text
docs(repo): 记录官网日志交付与产品命名后续工作

- 记录官网日志、产品版本及验证限制
- 整理 Newtab 命名与 History Cleaner 介绍的排队工作项
```

随第三笔提交执行已展示的终态更新：当前 Issue 和本 Commit 记录改为已完成，工作台将其移入已完成；产品命名工作项继续排队。提交失败时恢复为待提交，不记录虚假的完成状态。
