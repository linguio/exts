# 修复 Daily 表格滚动并补齐接口说明

## 元信息

- 工作项：2026-11-10-extension-daily-table-body-scroll
- 状态：已完成
- 当前阶段：本地提交
- 已批准范围依据：用户要求“新增一个 bug 优化的 issue 去改下”，目标为仅让表格 body 纵向滚动；随后要求检查其余接口并一并补齐与 Activity 一致的标题和说明。

## 背景与目标

Daily 的 `fillRecords` 当前将整张 Table 包入 ScrollArea，使表头随记录区域一起纵向滚动。调整为表格容器填满父级剩余高度，表头与分页保持可见，只让记录 body 在表格内部的可用空间纵向滚动；表格外层不再产生第二个纵向滚动区域。

公开 API 中 Activity 的两个端点均声明了 OpenAPI `summary` 和 `description`，而 Settings 的读取、更新端点仅有 `summary`。补齐同等说明，使 Scalar 文档完整说明用途、认证边界和写入语义。

## 已批准的 Settings 接口说明

- `POST /api/settings/preferences`：`读取当前用户的主题和功能设置；身份取自令牌，不接受 userId。尚未保存设置时返回 system 主题和关闭的功能默认值，不创建记录。`
- `POST /api/settings/preferences/update`：`仅允许一次更新 theme、mediaDownload 或 historyCleaner 中的一项；身份取自令牌，不接受 userId。theme 仅为 light、dark 或 system，功能项仅接受 enabled 布尔值；更新后返回当前完整设置，其余设置保持不变。`

## 范围与排除项

- 范围：调整 Extension 共用 DataTable 的 `fillRecords` 布局，并让 Daily 使用该行为；默认 Actions 操作列固定在最右侧；空数据记录区撑满可用高度并居中展示空态；将 Studio 未登录右侧内容拆成独立 LoginPage 并保持居中；新增 Studio 一级 Overview 默认页，移除选页兜底提示；将 Newtab/Studio 导航状态统一保存为 session，Studio 只保存用户与字符串 route 并由页面注册表解析；为 Daily 保存成功补齐 toast；禁用 Newtab 与 Studio 的浏览器原生右键菜单；为 `/api/settings/preferences` 和 `/api/settings/preferences/update` 补齐 OpenAPI `description`；同步表格长期规范和交付记录。
- 排除项：不改变横向滚动、查询、筛选、排序、分页、编辑、API 请求/响应契约、主题 Token 或其他未启用 `fillRecords` 的表格；不新增、删除或重命名 API 路由。

## Todo

- [x] 重构 `fillRecords` 的表头与记录区布局，使表格占满剩余高度且仅记录区纵向滚动。
- [x] 将默认 Actions 操作列固定在表格最右侧，横向滚动时保持可见。
- [x] 保持 Daily 的分页、加载、空状态和现有横向滚动行为。
- [x] 让 Daily 空数据记录区占满可用高度并居中展示空态，使用空数据图标。
- [x] 在 `pages/login/index.tsx` 建立独立 LoginPage，并在 Studio 未登录时居中展示。
- [x] 在 `pages/overview/index.tsx` 建立一级 Overview 页面，登录后默认展示并移除选页兜底提示。
- [x] 将 Newtab/Studio 导航状态迁入 `chrome.storage.session`，按用户恢复最后有效的字符串路由。
- [x] 为 Daily 保存成功补齐 toast 提示，保留既有失败提示。
- [x] 禁用 Newtab 与 Studio 的浏览器原生右键菜单，为后续自定义菜单预留根事件入口。
- [x] 为 Settings 两个公开端点补齐与 Activity 同等层级的 OpenAPI 说明。
- [x] 执行 Extension 类型检查与构建、API OpenAPI 文档测试，核对实际 diff。
- [x] 提供用户 Chrome/Edge 验收步骤。

## 验收标准

- Daily 表格占满工具栏与分页之间的全部剩余高度；记录超过可用高度时，只有数据行区域出现纵向滚动，表格外层不再纵向滚动。
- 列标题和分页始终可见，且表头不随数据行滚动。
- 默认 Actions 操作列固定在最右侧；横向滚动时仍可使用行编辑操作。
- 横向滚动、查询、排序、编辑、加载、空状态和分页行为不回归。
- 没有记录时，表格数据区仍占满可用高度，`No activity records` 空态在其中居中显示并使用空数据图标。
- Studio 未登录时，右侧 `Sign in to Studio` 内容在完整可用内容区居中。
- Studio 登录后默认展示侧栏一级 Overview 页面，不显示 `Select a page` 兜底提示。
- 当前浏览器会话内刷新时恢复 Newtab/Studio 位置及当前用户最后有效的 Studio 路由；未知路由回到 Overview，浏览器或扩展重启后恢复默认状态。
- Newtab 与 Studio 任意区域右键均不出现浏览器原生菜单。
- Settings 两个端点在 OpenAPI 中保留既有中文标题并具有准确的说明；不改变路径、方法、认证、请求或响应模型。
- Extension 类型检查和构建、API OpenAPI 文档测试通过；Chrome/Edge 的视觉与交互由用户验收。

## 关联文档

- [交付记录](../commits/2026-11-10-extension-daily-table-body-scroll-commit.md)
- [表格规范](../../table-conventions.md)

## 唯一下一步

无；用户已验收通过并批准本地提交。

### 用户验收步骤（Chrome/Edge）

1. 加载稳定开发目录 `dist/dev/chrome-mv3-dev-stable`（或当前仓库约定的 stable 路径），登录并进入 Studio → Activity → Daily。
2. 确认查询工具栏与分页始终可见；将每页条数调至 50 或 100，在视口高度不足以显示全部行时，仅数据行区域出现纵向滚动条，表头不随数据行纵向滚动，页面外层（Studio 内容区）不再出现第二条纵向滚动条。
3. 横向滚动宽表时，最右侧 Actions 列与 Edit 按钮保持可见；查询、排序、翻页、Reset、列显隐、加载 Spinner 与空状态行为与改前一致。
4. 可选：打开 API 文档页，确认 Settings 两个 POST 端点除中文 summary 外具有与 Issue 一致的 `description` 文本。
