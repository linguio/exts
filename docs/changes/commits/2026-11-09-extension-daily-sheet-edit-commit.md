# 通过 Daily 验证配置驱动的表格编辑：交付记录

## 对应工作项

- [Issue](../issues/2026-11-09-extension-daily-sheet-edit-issue.md)

## 预期交付边界

以 columns 统一展示/筛选/编辑字段配置，以 query 保留真实查询适配；Daily 使用原接口返回记录验证共用 Edit/Sheet/校验/保存流程，仅修改当前响应的前端状态。默认每页 20 条，表格占 Daily 剩余空间并内部滚动，分页紧随表格。移除无用 table-demo 和指定提示，更新交互规范。不造数据、不接后端写接口、不新增删除/批量操作、不提交 Git。

## 实际交付

- columns.tsx 统一字段展示/筛选/编辑；QueryDataTable 在可写字段且存在 updateFn 或显式 previewEdits 时生成 Edit；公共 Sheet 维护回填、草稿、校验、防重、取消/迟到回调与未保存 AlertDialog。
- Daily 使用原 queryDailyRecords 查询；删除种子与替代内存资源，仅对当前成功响应的对应行做临时浅替换，不写后端、不伪造 total 或重排当前页。Query/翻页/刷新重新以接口结果为准，账号/会话重建清除临时状态。
- 日期只读且不进入修改 payload，时长保留整数/非负/null/0 语义；删除未经用户要求的 600/960 演示上限。
- 按用户最新要求移除固定十行视口及其文件；Daily 显式启用 fillRecords，通过 flex 链分配可用空间，官方 ScrollArea 处理记录区纵向滚动，Table 沿用官方横向滚动；筛选单行且窄屏可横向滚动，分页紧随表格。非 Daily 页面仍用官方 ScrollArea 整页滚动，Daily 保留 p-4/md:p-6。
- 默认 pageSize 为 20，页大小仅提供 20/50/100；Reset 仍保留用户每页条数。用户指定的英文顶部提示已删除，未替换其他提示；Sheet 默认 420px/max-w-full 不变，未新增全局宽度 Token。
- Daily 查询工具栏右侧使用仓库已有官方 ButtonGroup 组合 Query 文字与 Reset 图标；Columns 是相邻的独立图标菜单按钮。图标均带 Tooltip 和可读名称；即时模式的旧控件保持原样，无新依赖。
- Daily 编辑 Sheet 移除临时预览英文提示，缺省描述时取消不存在的 aria 描述关联；实际预览行为、Settings 标题与 Date 只读配置不变。
- 共用表格行编辑 Sheet 固定 Edit 标题、SquarePen 图标及与 Settings 一致的标题栏排版，移除未使用的标题覆盖入口；字段 meta 为 text/integer 增加 disabled，禁用字段不参与输入、校验、保存或独立启用 Edit。Daily Date 仍只读。
- 列编辑配置可选 unit；Daily 五项时长共用 `min`，编辑 Sheet 通过官方 Input Group 的右侧文字附加项展示，Date 无单位，单位不影响数字值与保存 payload。迁入固定官方 Input Group 及其源码依赖 Textarea，无新 npm 依赖。
- 编辑 Sheet 打开时焦点统一落在 Edit 标题，避免首个只读 Date 被底层自动聚焦选中；保留主动聚焦和复制 Date 的能力，基础 Sheet 未改。
- 移除已确认仅被开发入口引用的 example.tsx 与 table-demo 分支，没有扩大删除范围。
- 根 AGENTS、表格规范、扩展表格接入、UI 规范与来源差异同步 Sheet/Dialog/AlertDialog 分工及当前返回记录临时编辑边界。
- 仅支持本轮基础文本/整数编辑与只读日期展示，不含真实写接口或完整新增/删除/批量 CRUD。

## 执行与验证

- 执行者：Cursor Agent CLI，固定 composer-2.5；Codex 负责建档、交接、审查与验证证据核对。
- CLI 版本：2026.11.05-86047df。已确认登录，联网模型清单包含 composer-2.5；初次沙箱网络访问被拒，获权限后模型核对成功。
- Cursor 会话：e43a322e-d451-4d95-948f-cdc979ecd1e0；开发、审查返工与用户验收修正均恢复同一会话。
- 上一轮完整扩展检查：35 文件、151 项通过，17.94 秒，覆盖当前响应替换、校验、无效/旧响应防护及保留的真实查询适配；原造数测试随错误实现删除，未删除真实接口覆盖。
- 最新默认分页调整后，执行 `pnpm exec vitest run tests/components/data-table.test.ts tests/components/query-data-table.test.ts --maxWorkers=1`，2 文件、14 项通过，500ms；初次沙箱执行因 `spawn EPERM` 未进入用例，获准重试通过。本轮只核对必要相关行为，未重复扩展全量。
- 最新 `pnpm typecheck`：exit 0；`pnpm build`：exit 0，根 dist/build/chrome-mv3 产物；Studio 非 Daily 滚动分支修改后已重跑。首次类型检查发现 aria-sort 误读 Header 排序状态，交同一 Cursor 会话改为 Column 后通过。保留 theme-init.js 与大分块警告。
- 最新相关测试、类型与构建对应默认二十条与 Daily 弹性表格；不把旧全量结果描述成最新全量结果，浏览器视觉/交互仍由用户复验。
- 按钮组加入后，同一 Cursor 会话执行相关 2 文件 14 项测试通过（716ms），`pnpm typecheck`、`pnpm build` exit 0；产物仍为根 dist/build/chrome-mv3。Tooltip、菜单和实际布局由用户在 Chrome/Edge 验收。
- 将 Columns 移出按钮组后，同一 Cursor 会话再次执行相关 2 文件 14 项测试、`pnpm typecheck`、`pnpm build` 均通过；浏览器视觉与交互仍待用户验收。
- 移除 Daily Sheet 提示后，最新 `pnpm typecheck`、`pnpm build` exit 0；未为纯文案删除追加逻辑测试，浏览器验收仍待用户。
- disabled 字段逻辑测试 8 项通过；标题覆盖入口移除后 `pnpm typecheck` exit 0，最终 `pnpm build` exit 0，产物根 dist/build/chrome-mv3。浏览器内标题排版、只读字段和编辑交互仍待用户验收。
- 单位配置加入后字段逻辑测试 9 项通过，`pnpm typecheck`、`pnpm build` exit 0，产物根 dist/build/chrome-mv3。未进行浏览器视觉、布局或交互验收。
- 初始焦点修正后 `pnpm typecheck`、`pnpm build` exit 0；未按仓库约束新增焦点/浏览器模拟测试，用户 Chrome/Edge 复验待完成。
- 审查修正：共用配置入口、官方 ScrollArea/Field、只读 payload、可配置必填文案、正则重复校验、更新取消、Effect 稳定依赖，以及显式预览能力、旧响应拒绝和重复横向滚动包装。
- 执行偏差：首轮测试命令多传字面 `--`，已改用 pnpm exec vitest 确保单 worker；新增取消用例的同步抛出断言两次失败后 Cursor 再修正通过，超出约定重试上限，记录事实，不将执行过程描述为完全合规。未为通过测试改动正常业务取消语义。
- 未执行浏览器视觉/交互与真实异步写接口验收；字段错误、Sheet/确认框层级、焦点、实际保存与窄屏由用户 Chrome/Edge 验收。

## 用户验收

第一轮因代理擅自造数据、表格未限制高度导致不能滚动，用户验收不通过。已恢复真实接口数据、仅修改当前返回记录；曾按用户要求采用默认十条/固定十行视口，后改为默认二十条、Daily 弹性占高、单行筛选与可见分页。工具栏最终是 Query＋Reset 同组、Columns 独立图标；指定提示已删除。2026-11-09 用户明确验收通过并要求本地提交。

## 提交方案

代码提交：`apps/extension/src/components/custom/data-table/{column-meta,data-table,data-table-edit-sheet,index,query-data-table,row-preview,toolbar,types,use-data-table-edit-lifecycle,use-data-table-query}.ts(x)`、`apps/extension/src/components/ui/{input-group,textarea}.tsx`、`apps/extension/src/entrypoints/newtab/main.tsx`、`apps/extension/src/features/activity/daily/{columns,daily-records}.tsx`、`apps/extension/src/pages/studio/{daily-page,index}.tsx`、`apps/extension/tests/components/{data-table.test.ts,custom/data-table/column-meta.test.ts,custom/data-table/row-preview.test.ts}`，删除 `apps/extension/src/components/custom/data-table/example.tsx`。不含业务查询适配或依赖配置变更。

```text
feat(extension): 接入 Daily 配置驱动编辑与表格交互

- 基于真实查询结果提供行编辑 Sheet、字段校验与当前页临时预览
- 统一 Daily 表格滚动分页、工具栏、输入单位和编辑初始焦点
```

文档提交：根 `AGENTS.md`、`docs/table-conventions.md`、`docs/web-ui-sources.md`、`docs/extension/{data-table,ui}.md`、当前 Issue/Commit 记录与 `docs/changes/README.md`；随提交把用户验收、批准和工作台状态更新为已完成。

```text
docs(extension): 完结 Daily 表格编辑与交互规范

- 记录配置化行编辑、Sheet 表单及表格布局规则
- 同步验收结果、验证限制与当前工作项完成状态
```

## 最终提交批准

2026-11-09 用户明确要求本地 Commit 且验收通过，批准按本记录的代码与文档边界分两笔本地提交；不推送或发布。
