---
date: "2026-11-24"
scope: [extension, api]
status: completed
type: feature
---

# 建立字典归属并展示分组层级

## 当前阶段

本轮已通过用户验收并批准本地提交，工作项已完成。

## 目标与范围

现有字典组缺少明确归属，通用组名难以区分。建立 Namespace → Group → Item 三层关系。技术名称用 `namespace` 表示分组标识的命名范围，界面直接展示归属显示名，例如 `Issue › Scope`。

| 表 | 字段与关系 |
| --- | --- |
| `dictionary_namespaces` | UUID 主键 `id`、全局唯一的 `key`、`label`、`created_at` |
| `dictionary_groups` | 保留 UUID 主键、`key`、`label`、`description`、`created_at`，新增必填的 `namespace_id` 外键，并对 `(namespace_id, key)` 实施唯一约束 |
| `dictionary_items` | 保留 UUID 主键、`group_id` 外键、`value`、`label`、`sort_order`、`created_at` 和 `(group_id, value)` 唯一约束 |

迁移只创建 `issue` / `Issue` 归属，给现有 Status、Scope、Type 回填 `namespace_id`，保留原有 UUID 和选项。本轮不新增、删除或重建任何 Group 或 Item 业务记录。保留 Group 的 UUID 主键，并将全局 key 唯一约束替换为 `UNIQUE (namespace_id, key)`。变更前核对调用方与迁移依赖。归属外键限制删除仍被引用的记录。

保留两个读取接口。POST `/api/dictionaries/groups` 接收 `search`、`pageIndex`、`pageSize`，服务端搜索全部分组，响应为当前页及筛选后的总数，每个分组增加 `namespace: { id, key, label }`。POST `/api/dictionaries/items` 继续只接收 `groupId`，读取选中组的字典项。发布时先完成数据库迁移和 API 部署，再发布依赖归属字段的扩展。

服务端先过滤，再按归属 key、分组创建时间及分组 key 排序分页。同一归属跨页时，每页重复显示归属段名。Studio 左栏复用 ScrollArea、分段标题和分组按钮，右栏浅底卡片显示归属及组名，表格显示字典项。

前端输入仅编辑搜索草稿，点击搜索按钮时提交并回到第一页，清空后提交恢复全部分组。左栏请求期间右栏显示等待空态，每次提交搜索后选中结果首组，普通翻页选中新页首组。同组已有详情直接恢复，新选中组再查询字典项，无匹配时右栏展示空态。

左栏分段与分组行复用 Studio Sidebar Menu 样式，编辑铅笔布局在同一行，点击单独触发编辑占位。右栏详情卡片复用 Studio 顶部导航的正常字重 Breadcrumb。字典项与 Daily 复用 DataTable 和行编辑按钮，字典项按组完整显示，表头、内容及 Actions 左对齐。共用固定 Actions 列跟随行悬停和选中反馈。

用户确认保留四个占位入口。左栏搜索框旁放 Add group 加号图标按钮，组行右端常显 Edit group 铅笔。右栏表格工具栏右端显示带加号和文字的 Add item，空组也保留。表格末尾 Actions 列放 Edit item 铅笔。四个入口统一显示现有 Toast 的 `Not integrated`。真实增改、表单、写接口和权限变更列入后续范围。

搜索去掉输入首尾空白后，不区分大小写，按归属 label、归属 key、组 label、组 key 任一字段做字面连续子串匹配。同组同时命中多个字段只计一次。搜 `Issue` 会命中该归属下的组，搜 `Scope` 会命中各归属下同名的组。完整路径匹配留待后续有需求时讨论。

迁移验证覆盖从空库初始化和已有字典升级。若发现三组之外的数据，先确认其实际归属再回填。应用发布前验证旧版扩展仍可读取原有字段，新扩展在分组接口提供归属后发布。

## Todo

- [x] 核对现有调用方，确认联合唯一约束、迁移顺序和分页契约。
- [x] 实现归属表、数据迁移及分组读取。
- [x] 接入按归属分段、详情层级和四个占位入口。
- [x] 验证读取接口和扩展类型及构建。
- [ ] 在显式隔离 PostgreSQL 库验证迁移、同名分组和跨页查询。

## 验收标准

- 原分组及字典项的记录数和 ID 不变，原三组显示在 Issue 下。
- 不同归属可使用同一个分组 key，同一归属内重复 key 被拒绝。
- 同名组在列表和搜索结果中显示各自归属，详情显示对应的归属和组名。
- 跨页时，仍有分组的归属在每页显示段名，标题不占分页名额。固定数据下各组不重复、不遗漏，total 统计匹配的组。正常翻到另一页后默认选中新页首组。
- 分组查询维护现有按钮提交、分页和空态行为。四个入口仅显示 `Not integrated`，分组行铅笔常显并与选组操作分开。
- 选中非首组后提交搜索，即使搜索词未改变，返回后也选中首组。Daily 和字典项的固定 Actions 单元格随整行显示悬停背景。

## 唯一下一步

无。本地交付已完成，生产 API 部署另行授权。

## 交付记录

- 0010 迁移新增归属表、回填 Issue 外键并替换 Group 唯一约束，保留 Item 字段和查询。扩展新增归属分段、详情路径和四个信息 Toast 入口。
- 字典 API 三项测试通过。原虚拟环境解释器缺失，使用本机捆绑 Python 3.12.14 和现有依赖运行。未配置 `API_TEST_DATABASE_URL`，隔离 PostgreSQL 测试跳过。
- 扩展 TypeScript 和 WXT 构建通过，最后一次将验收产物 `dist/build/chrome-mv3` 指向本地 API `http://127.0.0.1:8000`。未执行数据库迁移、部署和实际浏览器验收。
- 用户批准生产建表后，仅应用 `0010_dictionary_namespaces.sql`。迁移事务内核对原有字段、UUID 及全部字典项，确认 3 个既有分组全部关联到新增的 Issue 归属，17 个字典项与迁移前一致。生产 API 部署及浏览器验收待完成。
- 按验收反馈调整左栏菜单、搜索首选行为和详情面包屑。字典项改用共用 DataTable，固定 Actions 列的悬停背景由共用组件处理。扩展类型检查和指向本地 API 的 WXT 构建通过，实际外观及交互待浏览器验收。
- 共用 DataTable 新增外框和间距配置。Daily 沿用默认配置，字典项选择无外框。扩展类型检查和指向本地 API 的 WXT 构建通过，外观待验收。
- 将表格外观配置收拢到 `appearance` 并支持按列 ID 指定宽度。Daily 保留自动列宽，字典项的 Order 和 Actions 各用 80 px。扩展类型检查和 WXT 构建通过，宽窄窗口表现待用户验收。
- 按用户要求将字典项的 Label、Value、Order、Actions 改为四列等宽，各占 25%。扩展类型检查和 WXT 构建通过。
- 字典项列宽更新为 Label 30%、Value 30%、Order 30%、Actions 10%。WXT 构建通过。
- 将共用表格默认外观、页面可配置范围和统一交互职责写入仓库表格规范，并关联扩展 DataTable 配置说明。
- 用户确认本轮全部验收通过并批准本地提交。沿用已有验证结果。隔离 PostgreSQL 测试未运行，生产 API 未部署。
- 实现提交 `0a09a0e` 包含归属迁移、字典仓储和响应模型、字典 API 与 PostgreSQL 测试、扩展字典类型和页面、共用 DataTable 与 Daily 调用方。

  ```text
  feat(extension): 展示字典归属并统一表格配置

  - 迁移现有字典归属并接入分组搜索分页
  - 展示归属层级并提供新增和编辑占位入口
  - 复用共用表格并配置字典项列宽和外框
  ```

- 文档提交包含 API README、扩展 UI 与 DataTable 说明、仓库表格规范及本 Issue 和后续字典维护待办。

  ```text
  docs(extension): 归档字典归属和表格配置交付

  - 同步字典查询契约与共用表格规范
  - 记录验收和生产迁移结果并归档当前工作项
  - 保留字典维护待办并更新关联链接
  ```

## 关联文档

- [后续维护操作待办](../../issues/2026-11-24-dictionary-maintenance-issue.md)
- [字典分组查询与详情](2026-11-24-extension-dictionary-group-search-and-heading-issue.md)
