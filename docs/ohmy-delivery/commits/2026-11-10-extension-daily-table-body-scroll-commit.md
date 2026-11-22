# 修复 Daily 表格滚动并补齐接口说明：交付记录

## 对应工作项

- [Issue](../issues/2026-11-10-extension-daily-table-body-scroll-issue.md)

## 预期交付边界

调整 Extension Daily 的 `fillRecords` 组合：表格填满剩余高度、固定表头和分页，仅记录 body 纵向滚动，且不保留表格外层的第二个纵向滚动区域；默认 Actions 操作列固定在最右侧。保留官方 Table 横向滚动及既有查询、排序、编辑、加载、空状态和分页行为。为 Settings 的读取、更新 API 补齐 OpenAPI `description`，不改变任何接口契约。

读取接口说明明确默认值与不创建记录；更新接口说明明确仅更新一个字段、允许值、身份边界及完整响应语义。

## 实际交付

- Daily `fillRecords` 仅在有记录时启用唯一内部 ScrollArea；表头和 Actions 固定，空态与首次加载在满高数据区居中。
- Studio 增加独立 LoginPage、一级 Overview 默认页和按用户恢复的 session 路由；Newtab/Studio 禁用原生右键菜单。
- UI 位置从 local 迁至 `chrome.storage.session`，只保存 view、当前用户和字符串 route；页面注册表验证未知路由并回退 Overview。
- Settings preferences 两个接口补齐 OpenAPI `description` 与对应测试；移除 Cursor 协作 Skill、官网入口及默认协作规则。

## 验证与限制

- `pnpm --dir apps/extension typecheck`：通过（本次最终源代码变更后）。
- `python -m unittest tests.test_app.DocumentationTests -v`（在 `apps/api`）：通过。
- Extension build 与 API 文档测试后的后续 UI 改动未重跑；用户明确批准提交，不追加检查。
- Daily 滚动、空态/加载居中、Actions 固定、Studio 登录页和 Overview 已由用户在 Chrome/Edge 验收通过。

## 用户验收

用户已明确验收通过。

## 提交方案

代码提交：

- `fix(api): 补齐 Settings 接口说明`
- `fix(extension): 修复 Studio 表格与导航`
- `chore(website): 移除 Cursor 协作入口`

文档提交：

- `docs(repo): 更新表格规范与交付记录`

## 最终提交批准

已批准本地提交；不包含推送或发布。
