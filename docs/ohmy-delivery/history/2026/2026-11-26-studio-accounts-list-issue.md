---
date: "2026-11-26"
scope: [extension, api]
status: completed
type: feature
---

# 在 Studio 管理分组增加账户列表

## 当前阶段

已完成。

## 目标与范围

在 Management 第一项提供只读 Accounts 页面，从现有认证账户源分页读取名称、邮箱、注册时间和账户 ID。复用登录认证，管理授权留在收件箱。排除角色表、账户写入、登录变更和账户同步。

## Todo

- [x] 实现账户列表查询接口，用户确认整体交付验收通过。
- [x] 接入扩展后台请求和 Studio 表格，并通过扩展类型检查。
- [x] 用户确认全部验收通过；自动化验证限制见交付记录。

## 验收标准

- 登录后在 Management 第一项打开 Accounts，看到最新注册的账户。ID 位于第一列，悬停或键盘聚焦时可查看完整 ID。按名称、邮箱和注册日期范围筛选，支持重置和分页，页脚显示匹配总数。注册时间使用 `YYYY-MM-DD HH:mm:ss`。
- 列表包含没有活动和设置记录的账户，未登录请求返回 401。

## 唯一下一步

无。

## 交付记录

- `POST /api/accounts/list` 已接入 FastAPI。保留 Bearer 认证，管理授权按已批准范围延期。通过现有 Neon Auth 用户表查询，未新增数据库迁移。
- Accounts 位于 Studio → Management 第一项，复用 QueryDataTable，默认每页 20 条，支持邮箱筛选、重置和分页。
- ID 移到第一列，通过共用 CopyableTextCell 在空间不足时显示尾部省略号，复用 Tooltip 展示完整 ID。点击或键盘激活复制完整值，沿用共用 Toast。新增名称和注册日期范围筛选，按上海时区显示数字日期时间。
- Email 与 Account ID 共用可复制单元格。共用工具栏采用固定四列网格，操作组位于第四列。共用表格按标签生成筛选占位提示，并维护英文空状态文案。
- 已有扩展 TypeScript 检查和 `git diff --check` 通过。API 自动化测试启动失败，独立实库验证未执行。用户确认全部验收通过并批准本地提交。
- 代码提交 `6cdca8f` 包含 Accounts API、扩展后台接入、Studio 菜单与页面及共用 DataTable 调整。文档提交包含 API 规范、表格规范、权限收件箱和本 Issue 结项归档。

```text
feat(extension): 在 Studio 增加账户列表

- 接入账户分页查询及名称、邮箱和注册日期筛选
- 统一表格查询栏和英文空状态，支持复制账户 ID 和邮箱
```

```text
docs(extension): 归档 Studio 账户列表工作项

- 记录账户查询契约、共用表格规则和后续权限事项
- 记录验收与验证结果并归档工作项
```

## 关联文档

- [业务 API 规范](../../../api-conventions.md)
- [表格规范](../../../table-conventions.md)
- [权限待办](../../inbox.md)
