---
date: "2026-11-27"
scope: [extension, api]
status: completed
type: feature
---

# 在 Studio Accounts 列表展示管理员角色

## 当前阶段

用户已确认全部验收通过，并批准结项。

## 目标与范围

用独立角色分配表记录手动指定的管理员。Accounts 只对当前页联查角色，显示 Admin 或 `-`。现有登录规则照旧。角色编辑、Guest 分配、字典、管理授权和生产操作不在范围内。

## Todo

- [x] 新增只接受 admin 的角色分配表迁移。
- [x] 在 Accounts 分页结果上关联角色并返回字段。
- [x] 增加 Role 列并完成扩展类型检查。

## 验收标准

- 有 admin 分配的账户显示 Admin，无分配账户显示 `-`。
- 角色关联保留账户筛选、排序、分页与总数。
- Accounts 按 Name、Email、Role、Registered 的顺序展示四列，账号 ID 作为稳定行标识。
- Email 的文字沿用表格排版，保留复制、长文本省略和 Tooltip。

## 唯一下一步

无，工作项已完成。

## 交付记录

用户已批准实施上述范围。

- 扩展类型检查通过。pnpm 启动器无法创建临时目录，改用项目已安装的 TypeScript 直接执行。
- API 测试未运行，现有虚拟环境引用的 Python 解释器不可用。未配置隔离 PostgreSQL 测试连接，迁移和联查未实库验证。
- 经用户批准，在 Exts 的 Neon `neondb` 应用 `0011_user_role_assignments.sql`。应用前只读预览仅有 0011 待执行，应用后待执行迁移为 0。
- 用户已手动添加一条角色分配记录，并确认全部验收通过。
- Accounts 最终展示 Name、Email、Role、Registered 四列，Email 保留复制、长文本省略和 Tooltip。调整后扩展类型检查和 Git 差异检查通过。
- 未部署 API。代理未执行实库联查或浏览器验收，用户未提供具体操作记录。


用户已明确批准两笔本地提交及 Issue 结项归档。

实现提交 `e989bdc` 包含 API 的角色迁移、Accounts repository 和 schemas，以及扩展的 Accounts API 类型、复制单元格、Accounts 页面和查询适配。

    feat(extension): 在 Accounts 列表展示管理员角色

    - 增加管理员角色分配表并随账户分页结果返回角色
    - 调整账户列顺序并统一邮箱复制单元格的文字排版

文档提交包含 API README 和本归档 Issue。

    docs(extension): 归档 Accounts 管理员角色展示工作项

    - 记录角色迁移、接口契约和验收结果

## 关联文档

[Accounts 列表](./2026-11-26-studio-accounts-list-issue.md)
