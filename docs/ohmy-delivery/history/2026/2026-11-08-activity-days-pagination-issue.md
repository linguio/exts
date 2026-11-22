---
date: "2026-11-08"
scope: api
status: completed
type: feature
---

# 接入每日活动分页与排序查询

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

Daily 原先仅空表，days 原先无分页。提供服务端分页、多字段排序与真实数据查询，保留图表完整范围读取。

### 排除项

增删改、依赖升级、图表重设计、数据库结构迁移、代理浏览器视觉与交互验收。

## Todo

- [x] 实现请求响应模型、数据库分页排序及行为测试
- [x] 适配后台消息与图表调用
- [x] 接入 Daily 数据、查询/重置及排序配置，必要时最小增加表格工具栏组合入口
- [x] 同步接口与 UI 文档，完成相关逻辑测试、类型检查与构建
- [x] 提供用户验收步骤，停在验收

## 验收标准

分页总数/顺序/空页正确；非法参数与超过 500 条返回 422；图表完整范围数据无截断；查询、即时排序与重置符合上述语义；账号切换和旧响应不串数据。浏览器实际效果由用户验收。

## 唯一下一步

无。

## 交付记录

### 自动化结果与限制（2026-11-09）

- API 完整测试 56 项，51 通过、5 项真实 PostgreSQL 测试因未配置 API_TEST_DATABASE_URL 跳过。新增 SQL 排序/分页与 500/501 隔离夹具已编写，真实执行尚未验证。
- 扩展完整测试 132 项通过，类型检查通过；生产构建和显式指向本地 API 的验收构建通过。
- OpenAPI 示例曾因 null 分页值被生成器省略而失败；调整为实际分页示例后完整测试通过。
- 未执行浏览器视觉、布局、交互或真实账号联调，不把自动化通过视为用户验收。未部署、未提交、未推送。

### 验收反馈修正（2026-11-09）

用户指出排序应在表头，每页条数与跳转不应独立换行。以本条反馈修正此前独立排序区的解释，不新增功能；用户验收尚未通过。

- 本轮修正后：Daily/表格逻辑 9 项、扩展类型检查、本地 API 验收构建通过；API 代码未变化，沿用首轮结果。布局未执行代理浏览器验收，待用户确认。

### 第二轮验收反馈（2026-11-09）

- Loading 进入表格 tbody，首次加载保留表头与 Skeleton，刷新时原记录保留且 Spinner 位于 body 内。
- DataTable 默认表头及内容居中，在组合层适配，不改官方 Table 原语。
- 用户明确第三点不改：撤回普通点击累加的临时改动，保留普通点击单列、Shift 点击组合多列的既有交互。
- 分页的总数、每页、首末页、跳转及无障碍名称统一英文。

- 第二轮修正结果：第三点临时改动已撤回；扩展完整 133 项、类型检查、本地 API 验收构建通过。视觉、布局与交互仍待用户确认，API 未改变且沿用已有结果。

### 第三轮验收反馈（2026-11-09）

- 用户确认表格不需要首次骨架屏，首次与刷新统一使用 Spinner。
- Spinner 在 tbody 区域水平/垂直居中，不再用第一行提示挤占或推动记录；刷新保留已有记录，首次用空白内容区承载加载状态，不改变表头、工具栏和分页布局。
- 只调整表格加载展示，不改变图表或其他 LoadingRegion 的加载规则。

- 用户进一步明确：只有模块级加载遵循首次 Skeleton，表格不适用；已同步现行 UI、DataTable、来源和应用规范。位置建议为整个 body 中央，避免顶部行挤占记录。

- 第三轮实际验证：仅调整加载展示与范围描述，扩展类型检查和本地 API 构建通过，复用第二轮 133 项逻辑测试；未新增布局/交互测试，body 实际居中仍待用户确认。

- 用户最终明确：body 中央只显示 Spinner，不带可见文字。已核对当前实现符合该要求，仅保留 aria-label 读屏名称，不追加代码改动或重复构建；浏览器实际居中待用户确认。

### 仓库级表格规范（用户批准，2026-11-09）

- 新建 docs/table-conventions.md，作为与 API/UI 规范并列的仓库级规范；根 AGENTS 建立强制入口，API 规范及各应用 UI/AGENTS 交叉引用。
- 统一表格加载、默认布局、筛选查询、重置、排序、页脚和列表 API 参数/响应/默认查询/数量上限，明确通用规则与业务契约边界。
- 新增和修改表格时持续补充规范；业务字段和特殊默认条件由业务说明维护，不把 Daily 日期特性强加给所有表格。
- 本轮只整理规范及入口，不修改实现，不触发构建、部署或提交；验收检查文件层级、规则一致性和相对链接。

- 规范已建立：docs/table-conventions.md，与 API/UI 并列；根 AGENTS、业务 API、官网/扩展 UI 与三应用 AGENTS 已建立入口。通用规则集中维护，扩展 DataTable 文档仅为技术接入和 Daily 业务说明。
- 内容覆盖加载/空/失败、布局、查询/筛选、重置、列显隐、排序、分页/跳转、列表请求/返回、默认查询/稳定顺序、不分页上限与持续维护规则。
- 本轮为纯文档调整：14 个新增规范入口及引用链接目标检查通过，git diff --check 通过；未运行代码测试或构建，不把规范建立描述为所有表格已完成改造或用户验收。

### 提交拆分（2026-11-09）

用户要求拆为 API 实现与测试、扩展实现与测试、全部规范与交付文档三笔；完整文件边界与消息见 Commit 记录。当前仅准备，未暂存或提交；不追加验证，不把拆分请求记录为已完成。

### 历史交付记录

- [唯一 Issue](2026-11-08-activity-days-pagination-issue.md)
- 状态：已完成
- 用户验收：2026-11-09 用户明确验收通过
- 最终提交批准：2026-11-09 已批准 API、扩展、文档三笔本地提交；未推送、未部署

#### 实际交付
- days 支持可选分页、多字段白名单排序、空值最后及日期稳定顺序；总数/当前页采用单条 SQL 快照，保留空页与已删除用户的区别。
- 不分页必须完整日期范围，500 为后端具名常量；超过 500 返回 422，不截断。参数错误均统一错误响应。
- Daily 接入真实数据，表头即时多字段排序（普通点击单列、Shift 点击多列），日期点击 Query 生效；Reset 清除草稿和已生效筛选、默认排序及页码，仅请求一次，保留每页条数/列显隐。
- 通用 DataTable 增加可选工具栏组合入口并公开已有列显隐组合；Daily 保留表头默认排序入口，移除独立排序配置区；分页通过组合层取消 Pagination 默认全宽占位，每页条数与跳转各自成组，其余调用方复用该布局修正。
- 图表显式日期升序且不分页，校验记录归属、范围和响应完整性；保留会话取消与迟到响应保护。
- 同步现行接口、UI 与应用规则，移除未接入空状态文案；未升级依赖或修改数据库结构。

#### 实际验证
- dist/.cache/api/venv/bin/python -B -m unittest discover -s apps/api/tests -q：56 项，51 通过、5 跳过。
- 首轮 pnpm --filter @exts/extension exec vitest run --maxWorkers=1：32 文件、132 项通过，串行 worker。验收反馈修正后运行 tests/features/activity/daily.test.ts 和 tests/components/data-table.test.ts：2 文件、9 项通过；本轮仅修改 Daily 排序接入和分页布局，未重复无关测试。
- pnpm --filter @exts/extension typecheck：首轮及三轮验收反馈修正后均通过。
- pnpm ext:build：通过。
- VITE_API_BASE_URL=http://127.0.0.1:8000 pnpm ext:build：首轮及三轮验收反馈修正后均通过；最终本地验收产物 dist/build/chrome-mv3，Manifest 可解析、入口文件存在且有 localhost host permission。
- git diff --check：通过。
- 新契约测试先失败，再实现通过；OpenAPI 示例因生成器省略 null 的失败已定位并改为分页示例，API 完整重跑通过。

#### 未验证与限制
- 未配置 API_TEST_DATABASE_URL，5 项 PostgreSQL 集成测试跳过（包括新增 SQL 排序分页和真实 500/501 边界）；没有向真实 Neon 写测试数据，数据库 SQL 尚未实际执行验证。
- 未启动长期服务、未调用真实业务接口、未执行 Chrome/Edge 视觉/布局/交互验收。用户步骤见 [DataTable](../../../extension/data-table.md#本次用户验收)。
- 新 API 与扩展契约需同步使用；线上 API 未部署，最终本地验收产物指向 127.0.0.1:8000。以后正式分发需按部署目标重新构建。
- 构建有 theme-init.js 非 module 提示与大于 500kB chunk 提示，退出码为 0；本次不改构建体系。API 测试有既有 TestClient 弃用提示。
- 按仓库约束直接串行审查 diff，未启动独立审查子代理。

#### 验收反馈修正（2026-11-09）
- 用户未通过初轮验收，指出排序应位于表头，条数与跳转不应被拆成独立行。已恢复默认表头排序、删除独立排序区并修正分页组合占位；不改变 API 契约。
- 根因：独立排序区来自对“左侧排序”的偏重解释；Pagination 默认 w-full/mx-auto 与父级 flex-wrap 组合不适配。仅调整组合层，不改官方原语或引入自绘控件。
- 实际视觉结果仍待用户重新加载确认，不把代码审查及逻辑测试当作浏览器验收。

#### 第二轮验收反馈修正（2026-11-09）
- Loading 移入 tbody，首次保留表头，刷新保留原记录；DataTable 组合层默认表头与内容居中，官方 Table 原语不改。
- 分页总数、每页、首末页、跳转与无障碍名称统一英文。
- 用户明确第三点不改，临时 isMultiSortEvent 覆盖已撤回，表头组件恢复既有实现；普通点击单列，Shift 点击组合多列。
- 上一次扩展测试被用户中断，不作为验证成功依据。撤回第三点后串行完整测试：32 文件、133 项通过；类型检查和显式本地 API 构建通过。API 未变化，沿用现有结果。
- 未执行浏览器视觉/布局/交互检查，仍待用户验收。

#### 加载规则最终澄清（2026-11-09）
- 首次 Skeleton、后续 Spinner 仅属于模块级 LoadingRegion；DataTable 首次/刷新统一官方 Spinner，不使用骨架屏，不改变其他模块加载代码。
- 先前刷新提示位于 body 第一行，造成顶部 loading；已移除该提示行，改为以整个 tbody 为定位范围，在内容中央展示 Spinner。首次保留空白内容区和表头，刷新保留记录，不加毛玻璃或背景覆盖，不改变内容区高度。
- 最新扩展类型检查和显式本地 API 构建通过；本轮仅加载展示与文档适用范围变化，复用此前 133 项逻辑测试。未执行浏览器视觉/布局/交互验收，仍待用户重新加载确认。

#### 默认日期排序优先级修正
- 用户批准默认日期仅为后端兜底：Daily 初始、Reset 与清空排序均保持 sorting=[]，请求 sort=[]；用户字段优先，后端已有逻辑追加日期在末尾，主动选择 Date 仍按用户顺序。
- 删除前端空排序自动补 date 的 resolveDailyQuery 包装，直接使用已有状态更新器，不修改普通点击/Shift 交互或后端契约。
- 更新现有行为测试：先失败，再验证首次以多字段方式选择时长也不会保留日期优先级；相关 2 文件、9 项测试通过，扩展类型检查和显式本地 API 构建通过。其他无关检查复用已有结果；浏览器交互尚待用户验收。

#### 仓库级表格规范交付
- 用户明确要求表格规范与业务 API/UI 规范并列，已新增 docs/table-conventions.md，并在根 AGENTS 增加强制入口；API、官网/扩展 UI 和 API/官网/扩展 AGENTS 交叉引用。
- 通用加载、查询/重置、排序、布局、页脚、列表参数/响应、默认条件/兜底、数量上限和后续维护集中到仓库级文档。Daily 业务字段与范围约束保留业务归属，不推广为所有表格；扩展接入文档明确从属职责。
- 本轮仅文档：14 个相关入口/引用文件目标检查及 git diff --check 通过，未运行代码测试或构建；规范不宣称所有旧调用方已改造或已通过用户验收。
- 文档保持待用户审阅，未批准本地提交、推送或部署。

#### 三笔提交方案

用户于 2026-11-09 要求拆为三笔：API、扩展、文档。用户已明确验收通过并批准三笔本地提交；API 与扩展两笔已成功，文档及终态随第三笔提交。前两笔存在 API/客户端契约依赖，完整交付需三笔全部成功，不将中间提交单独视为可发布版本。

##### 第一笔：API 实现与测试

- `apps/api/modules/activity/repository.py`
- `apps/api/modules/activity/router.py`
- `apps/api/modules/activity/schemas.py`
- `apps/api/modules/activity/service.py`
- `apps/api/tests/test_activity.py`
- `apps/api/tests/test_activity_connection.py`
- `apps/api/tests/test_activity_pagination.py`
- `apps/api/tests/test_app.py`
- `apps/api/tests/test_postgres.py`

完整 Commit message：

```text
feat(api): 支持每日活动分页与多字段排序

- 增加分页排序参数及统一列表响应元数据
- 限制不分页查询最多五百条并保留身份与空页边界
- 更新接口行为测试和隔离数据库验证夹具
```

##### 第二笔：扩展实现与测试

- `apps/extension/src/api/activity.ts`
- `apps/extension/src/components/custom/data-table/data-table.tsx`
- `apps/extension/src/components/custom/data-table/index.ts`
- `apps/extension/src/components/custom/data-table/pagination.tsx`
- `apps/extension/src/components/custom/data-table/toolbar.tsx`
- `apps/extension/src/components/custom/data-table/types.ts`
- `apps/extension/src/features/activity/background.ts`
- `apps/extension/src/features/activity/charts/provider.tsx`
- `apps/extension/src/features/activity/daily/columns.tsx`
- `apps/extension/src/features/activity/daily/daily-empty.tsx`
- `apps/extension/src/features/activity/daily/daily-records.tsx`
- `apps/extension/src/features/activity/daily/state.ts`
- `apps/extension/src/features/activity/data/chart-data.ts`
- `apps/extension/src/features/activity/data/query.ts`
- `apps/extension/src/features/activity/data/response.ts`
- `apps/extension/src/features/activity/requests.ts`
- `apps/extension/tests/features/activity/background.test.ts`
- `apps/extension/tests/features/activity/daily.test.ts`
- `apps/extension/tests/features/activity/data.test.ts`

完整 Commit message：

```text
feat(extension): 接入每日活动查询与表格交互

- 接入 Daily 分页筛选和表头排序并适配图表完整范围查询
- 统一表格居中加载与英文分页并保留查询重置状态边界
- 将默认日期排序交由后端兜底并补充相关行为验证
```

##### 第三笔：规范与交付文档

- `AGENTS.md`
- `apps/api/AGENTS.md`
- `apps/api/README.md`
- `apps/extension/AGENTS.md`
- `apps/website/AGENTS.md`
- `docs/api-conventions.md`
- `docs/ohmy-delivery/readme.md`
- `docs/ohmy-delivery/history/2026/2026-11-08-activity-days-pagination-issue.md`
- `docs/ohmy-delivery/history/2026/2026-11-08-activity-days-pagination-issue.md`
- `docs/extension/data-table.md`
- `docs/extension/ui.md`
- `docs/superpowers/plans/2026-11-08-activity-days-pagination.md`
- `docs/table-conventions.md`
- `docs/web-ui-sources.md`
- `docs/website/ui.md`

完整 Commit message：

```text
docs(repo): 建立表格规范并记录活动查询交付

- 建立与 API 和 UI 并列的表格规范及强制入口
- 同步列表契约、应用规则和表格接入验收说明
- 记录实际交付、验证结果及未验证限制
```

#### 执行与终态更新边界（已批准）

- 顺序：API 代码与测试 → 扩展代码与测试 → 全部文档；AGENTS、README、Issue、Plan、工作台和本记录全部归第三笔。
- 提交时复用已有验证，不追加测试、类型检查或构建。API 51 项通过、5 项隔离 PostgreSQL 跳过；扩展曾完整 133 项通过，最新默认排序改动后相关 9 项、类型检查和本地 API 构建通过。
- 已展示限制：真实数据库 SQL 执行、浏览器视觉/布局/交互和真实业务联调未验证；API 未部署，当前本地产物指向 127.0.0.1:8000。
- 获得明确本地提交指令后，仅随第三笔执行机械性终态更新：Issue 状态与本记录改为已完成，记录用户批准按现状完结和本地提交；不将未执行的浏览器验收写成通过；工作台当前 Issue 清空并加入已完成索引，Plan 的停止状态改为按用户批准本地提交完结。
- 三笔全部成功后才完结。若中间提交失败，保留已成功提交，未完成部分恢复待提交/待批准，不自动撤销或重做成功提交。
- 不推送、不部署、不 amend 或重写历史。

#### 最终批准与完结

2026-11-09 用户明确“验收通过 commit”，已批准按上述三笔本地提交及预先展示的机械性终态更新。API 与扩展代码已分别提交；本记录、Issue、工作台和 Plan 的完成状态纳入第三笔文档提交。此前真实数据库执行等未验证限制保持原样，不重复测试、构建，不推送或部署。三笔全部成功后工作项完结。

## 关联文档

- [实施计划](../../../superpowers/plans/2026-11-08-activity-days-pagination.md)
- [业务 API 规范](../../../api-conventions.md)
- [DataTable](../../../extension/data-table.md)

## 历史补充

### 元信息

- 用户批准：2026-11-08 批准实施；2026-11-09 明确验收通过并批准按 API、扩展、文档三笔本地提交，不推送
- 规模：涉及现有公共 API 契约与调用适配

### 范围与设计

- POST /api/activity/days 保持记录字段与认证归属；sort 为有序数组，每项 field/order，日期和五项时长白名单，asc/desc，禁止重复字段。
- 未传或空排序默认 date desc；未包含日期则追加 date desc；时长 NULL 始终最后。Daily 初始化、重置和清空排序时保持前端 sorting 为空，仅由后端提供默认日期倒序，不占用户排序优先级；主动选择日期仍按选择优先级参与。
- pageIndex/pageSize 同传或同省略；页码从 0 开始，每页 1–100，界面默认 20，可选 10/20/50/100。
- 分页时日期可选；不分页必须完整起止日期，最多 500 条，超过返回 422，不截断。500 为后端具名常量。
- 返回 data: {days,total,pageIndex,pageSize}，不分页页码/页大小为 null；total 为筛选后的总数。超页空数组，保留真实 total。
- 后端先筛选排序再分页，计数与列表使用一致快照，保留用户不存在的未认证行为。
- Daily 恢复表头即时排序：普通点击单列，Shift 点击组合多列，沿用 TanStack 默认交互，不另设排序配置区；日期条件位于工具栏左侧，查询、重置、显示列位于右侧。分页在常规宽度下一行排列，每页条数及跳转各自成组，修复 Pagination 默认全宽导致的换行。
- 排序立即请求，使用已生效筛选并回首页；筛选输入点击查询后生效；翻页使用已生效条件。
- 重置待查询与已生效筛选、默认日期倒序及第一页，只请求一次，保留每页条数及列显隐。
- 图表明确日期升序、不分页，适配现有后台请求及会话取消/迟到响应保护。

### 默认排序优先级修正（2026-11-09）

用户批准：默认日期排序仅为后端兜底，前端不预置 date；选择时长后按用户字段排序、日期由后端追加在最后；清空用户排序恢复后端默认，普通点击/Shift 交互不变。

- 默认优先级修正已实现：相关逻辑 9 项、类型检查、本地 API 构建通过；删除无必要的空排序强制还原包装，保留标准排序状态更新。API 未修改，浏览器验收未执行。

### 历史后续事项

无，已按用户验收与批准完成三笔本地提交；保留已有未验证限制，未推送或部署。
