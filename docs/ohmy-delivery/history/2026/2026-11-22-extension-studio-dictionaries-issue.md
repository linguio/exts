---
date: "2026-11-22"
scope: extension
status: completed
type: feature
---

# 在 Studio 增加只读字典查看

## 当前阶段

收到表结构与归属反馈，用户确认全部验收通过并批准本地提交。

## 目标与范围

在 Extension Studio 增加 `Management → Dictionaries`，从真实数据库查看 Issue 状态、归属和类型三组字典的英文值、显示名和顺序。英文值沿用仓库字典，共 17 项。

- 数据库使用 `dictionary_groups` 和 `dictionary_items`。分组包含 `id`、唯一的英文 `key`、英文 `label`、`created_at`。选项包含 `id`、`group_id` 外键、英文 `value`、英文 `label`、`created_at`、`sort_order`，同组 `value` 唯一。两表使用数据库生成的 UUID 主键，显示名不能为空，排序为非负整数。迁移初始化 Status、Scope、Type 和 17 个选项，仓库英文字典定义初始业务值，运行时页面从数据库读取显示名和顺序。
- FastAPI 在 `modules/dictionaries/` 沿用 router、schemas、service、repository 分层，两个查询均沿用现有登录认证。POST `/api/dictionaries/groups` 接收 `pageIndex` 和 `pageSize`，返回当前页分组及 `total`、`pageIndex`、`pageSize`，分组包含 `id`、`key`、`label`、`createdAt`。POST `/api/dictionaries/items` 接收 `groupId`，返回该组全部选项，选项包含 `id`、`value`、`label`、`sortOrder`、`createdAt`。不存在的组返回 404，已有组无选项时返回空列表。不分页查询沿用仓库 500 条上限，超限报错。分组按 `createdAt`、`key` 升序；选项在各组内按 `sortOrder`、`value` 升序。
- Studio 沿用现有路由登记文件和侧栏。在 `pages/studio/management/dictionaries/` 组织页面及专用组件，在 `src/api/dictionaries.ts` 集中维护字典请求。
- 内容宽屏双栏。左侧从后端加载分组并负责分页，默认每页 20 条，初次加载选中当前页第一组，翻页后选中项若不在当前页则选第一组。右侧展示选中组的 Value、Label、Order，内容超出时复用现有 ScrollArea，右侧无分页。切换分组时防止迟到响应覆盖当前选择，无分组时右侧显示空态。窄屏将字典选择放在表格上方。
- 首版排除字典新增、编辑、删除及写入接口。账号角色、Home 改名、定时任务、归档同步和统计展示各自独立。

## Todo

- [x] 增加版本化迁移并初始化三组字典。
- [x] 实现只读字典查询，并接入扩展现有请求链路。
- [x] 接入 Studio 菜单、双栏页面和共用表格。
- [x] 验证字典内容、顺序、切换和查询异常，交付用户验收。

## 验收标准

- 从 Studio 打开 Dictionaries，能切换三组字典并看到真实数据。
- 三组合计展示 17 个有效字典项。英文值与仓库字典一致，UUID 唯一，同组英文值不可重复。
- 左栏分组名称和顺序来自接口，服务端分页只作用于分组。选中 Scope 后，右栏一次展示 8 项，溢出可滚动。
- 快速切换组时始终展示当前组数据。查询失败、没有分组、分组没有选项分别显示对应反馈。
- 页面只有查询入口，查询失败提供明确反馈。现有 Activity 与 Studio 入口保持可用。

## 唯一下一步

无。

## 交付记录

### 实际交付

- 迁移 0006 初始化 Status、Scope、Type 三组及 21 个英文选项。
- 两个 FastAPI 查询复用现有认证，分别服务左栏分页和右栏按组完整读取。Studio 接入后台认证消息、双栏和现有滚动及分页组件。
- 按用户确认同步仓库规范与提交流程。新 Commit 的 scope 默认继承 Issue，二者共用英文字典；实现与结项文档的提交类型按实际内容选取。

### 验证与限制

- 隔离 PostgreSQL 环境下 API 测试 69 项通过，无跳过。另通过 FastAPI 路由和真实库确认分页 2 + 1、分组选项 6 / 12 / 3，缺少凭据返回 401。自动化链路使用测试身份，真实浏览器验收由用户完成。
- 扩展类型检查及 12 项针对性现有测试通过。连接本地 API 的 Chrome 构建成功，保留构建中主题脚本与资源体积提示。
- 隔离测试库已关闭。经用户明确确认，在 Neon `production` 的 `neondb` 应用唯一待执行迁移 `0006_dictionaries.sql`。使用 API 运行时连接回查通过，Status 6 项、Scope 12 项、Type 3 项，与仓库字典一致。API 尚未部署。
- 用户指出分组应按创建时间排序。新增迁移 `0007_dictionary_creation_time.sql`，两表补足创建时间，分组移除独立排序，选项继续在各自分组内按顺序排序。隔离 PostgreSQL 的 69 项 API 测试和扩展类型检查通过。
- 复查 211 条本地 Issue，现有 12 种 scope 来自历史清洗。当前应用目录为 api、desktop、extension、website。按 Changelog 七类加 repo 复核当前 212 条 Issue，调整 68 条历史记录的 scope。文件名和正文保持原有记录。迁移 0008 保留仍有效的数据库选项 ID 和显示名，补齐新归属，清理旧归属。隔离 PostgreSQL 下 69 项测试通过，与仓库字典一致。
- 2026-11-23 经用户授权在 Neon `production` 应用 `0007` 和 `0008`，运行时连接回查 3 组、17 项，创建时间、分组排序和八类 Scope 均符合契约。API 尚未部署。
- 前后端复核发现右栏错误沿用了每页 20 条的响应校验。已将右栏设为完整列表校验，并补齐无分组时的右栏空态。扩展类型检查和 13 项针对性测试通过，Chrome 本地 API 验收产物已重新生成。浏览器交互由用户验收。
- 用户反馈字典查询失败，重载扩展后恢复。排查时本地 API 路由及真实库只读查询正常，失败时未观察到 HTTP 请求，具体客户端原因未确认。临时诊断日志已移除。

### 用户验收步骤

1. 使用当前已完成迁移的数据库连接启动本地 API。如果改用其他验收库，先核对并应用字典迁移 0006 至 0008。
2. 加载根目录 `dist/build/chrome-mv3/`。打开 Studio，确认未登录时看不到管理菜单。
3. 登录后进入 Management → Dictionaries。左栏从接口显示 Status、Scope、Type，默认选后端当前页的第一组。Status、Scope、Type 分别显示 6、8、3 条英文选项。快速切换时只显示最终所选组。
4. 左栏应显示分页页脚。当前 3 组在同一页，翻页控件禁用；右栏内容超高时可滚动。

### 用户验收与提交批准

2026-11-23 用户确认全部验收通过并要求本地提交。复用现有验证，生产数据库已迁移，API 尚未部署。

### 提交方案

实现提交包含 Skill 及规范、FastAPI 和迁移、Studio 及测试。结项提交包含 API 与扩展说明、历史归属修正和本 Issue 归档。

```text
feat(extension): 在 Studio 添加只读字典查看

- 接入字典分组分页与选项查询
- 统一字典归属、排序和提交范围规则
```

```text
docs(extension): 归档只读字典查看交付

- 记录数据库迁移、验证和用户验收
- 按统一字典修正历史 Issue 归属
```

## 关联文档

- [Issue 英文字典](../../../../.agents/skills/ohmy-delivery/assets/issue-dictionaries.json)
- [业务 API 规范](../../../api-conventions.md)
- [表格规范](../../../table-conventions.md)
- [想法收件箱](../../inbox.md)
