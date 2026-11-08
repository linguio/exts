# 每日活动分页与排序交付记录

- [唯一 Issue](../issues/2026-11-08-activity-days-pagination-issue.md)
- 状态：已完成
- 用户验收：2026-11-09 用户明确验收通过
- 最终提交批准：2026-11-09 已批准 API、扩展、文档三笔本地提交；未推送、未部署

## 实际交付
- days 支持可选分页、多字段白名单排序、空值最后及日期稳定顺序；总数/当前页采用单条 SQL 快照，保留空页与已删除用户的区别。
- 不分页必须完整日期范围，500 为后端具名常量；超过 500 返回 422，不截断。参数错误均统一错误响应。
- Daily 接入真实数据，表头即时多字段排序（普通点击单列、Shift 点击多列），日期点击 Query 生效；Reset 清除草稿和已生效筛选、默认排序及页码，仅请求一次，保留每页条数/列显隐。
- 通用 DataTable 增加可选工具栏组合入口并公开已有列显隐组合；Daily 保留表头默认排序入口，移除独立排序配置区；分页通过组合层取消 Pagination 默认全宽占位，每页条数与跳转各自成组，其余调用方复用该布局修正。
- 图表显式日期升序且不分页，校验记录归属、范围和响应完整性；保留会话取消与迟到响应保护。
- 同步现行接口、UI 与应用规则，移除未接入空状态文案；未升级依赖或修改数据库结构。

## 实际验证
- dist/.cache/api/venv/bin/python -B -m unittest discover -s apps/api/tests -q：56 项，51 通过、5 跳过。
- 首轮 pnpm --filter @exts/extension exec vitest run --maxWorkers=1：32 文件、132 项通过，串行 worker。验收反馈修正后运行 tests/features/activity/daily.test.ts 和 tests/components/data-table.test.ts：2 文件、9 项通过；本轮仅修改 Daily 排序接入和分页布局，未重复无关测试。
- pnpm --filter @exts/extension typecheck：首轮及三轮验收反馈修正后均通过。
- pnpm ext:build：通过。
- VITE_API_BASE_URL=http://127.0.0.1:8000 pnpm ext:build：首轮及三轮验收反馈修正后均通过；最终本地验收产物 dist/build/chrome-mv3，Manifest 可解析、入口文件存在且有 localhost host permission。
- git diff --check：通过。
- 新契约测试先失败，再实现通过；OpenAPI 示例因生成器省略 null 的失败已定位并改为分页示例，API 完整重跑通过。

## 未验证与限制
- 未配置 API_TEST_DATABASE_URL，5 项 PostgreSQL 集成测试跳过（包括新增 SQL 排序分页和真实 500/501 边界）；没有向真实 Neon 写测试数据，数据库 SQL 尚未实际执行验证。
- 未启动长期服务、未调用真实业务接口、未执行 Chrome/Edge 视觉/布局/交互验收。用户步骤见 [DataTable](../../extension/data-table.md#本次用户验收)。
- 新 API 与扩展契约需同步使用；线上 API 未部署，最终本地验收产物指向 127.0.0.1:8000。以后正式分发需按部署目标重新构建。
- 构建有 theme-init.js 非 module 提示与大于 500kB chunk 提示，退出码为 0；本次不改构建体系。API 测试有既有 TestClient 弃用提示。
- 按仓库约束直接串行审查 diff，未启动独立审查子代理。

## 验收反馈修正（2026-11-09）
- 用户未通过初轮验收，指出排序应位于表头，条数与跳转不应被拆成独立行。已恢复默认表头排序、删除独立排序区并修正分页组合占位；不改变 API 契约。
- 根因：独立排序区来自对“左侧排序”的偏重解释；Pagination 默认 w-full/mx-auto 与父级 flex-wrap 组合不适配。仅调整组合层，不改官方原语或引入自绘控件。
- 实际视觉结果仍待用户重新加载确认，不把代码审查及逻辑测试当作浏览器验收。

## 第二轮验收反馈修正（2026-11-09）
- Loading 移入 tbody，首次保留表头，刷新保留原记录；DataTable 组合层默认表头与内容居中，官方 Table 原语不改。
- 分页总数、每页、首末页、跳转与无障碍名称统一英文。
- 用户明确第三点不改，临时 isMultiSortEvent 覆盖已撤回，表头组件恢复既有实现；普通点击单列，Shift 点击组合多列。
- 上一次扩展测试被用户中断，不作为验证成功依据。撤回第三点后串行完整测试：32 文件、133 项通过；类型检查和显式本地 API 构建通过。API 未变化，沿用现有结果。
- 未执行浏览器视觉/布局/交互检查，仍待用户验收。

## 加载规则最终澄清（2026-11-09）
- 首次 Skeleton、后续 Spinner 仅属于模块级 LoadingRegion；DataTable 首次/刷新统一官方 Spinner，不使用骨架屏，不改变其他模块加载代码。
- 先前刷新提示位于 body 第一行，造成顶部 loading；已移除该提示行，改为以整个 tbody 为定位范围，在内容中央展示 Spinner。首次保留空白内容区和表头，刷新保留记录，不加毛玻璃或背景覆盖，不改变内容区高度。
- 最新扩展类型检查和显式本地 API 构建通过；本轮仅加载展示与文档适用范围变化，复用此前 133 项逻辑测试。未执行浏览器视觉/布局/交互验收，仍待用户重新加载确认。

## 默认日期排序优先级修正
- 用户批准默认日期仅为后端兜底：Daily 初始、Reset 与清空排序均保持 sorting=[]，请求 sort=[]；用户字段优先，后端已有逻辑追加日期在末尾，主动选择 Date 仍按用户顺序。
- 删除前端空排序自动补 date 的 resolveDailyQuery 包装，直接使用已有状态更新器，不修改普通点击/Shift 交互或后端契约。
- 更新现有行为测试：先失败，再验证首次以多字段方式选择时长也不会保留日期优先级；相关 2 文件、9 项测试通过，扩展类型检查和显式本地 API 构建通过。其他无关检查复用已有结果；浏览器交互尚待用户验收。

## 仓库级表格规范交付
- 用户明确要求表格规范与业务 API/UI 规范并列，已新增 docs/table-conventions.md，并在根 AGENTS 增加强制入口；API、官网/扩展 UI 和 API/官网/扩展 AGENTS 交叉引用。
- 通用加载、查询/重置、排序、布局、页脚、列表参数/响应、默认条件/兜底、数量上限和后续维护集中到仓库级文档。Daily 业务字段与范围约束保留业务归属，不推广为所有表格；扩展接入文档明确从属职责。
- 本轮仅文档：14 个相关入口/引用文件目标检查及 git diff --check 通过，未运行代码测试或构建；规范不宣称所有旧调用方已改造或已通过用户验收。
- 文档保持待用户审阅，未批准本地提交、推送或部署。

## 三笔提交方案

用户于 2026-11-09 要求拆为三笔：API、扩展、文档。用户已明确验收通过并批准三笔本地提交；API 与扩展两笔已成功，文档及终态随第三笔提交。前两笔存在 API/客户端契约依赖，完整交付需三笔全部成功，不将中间提交单独视为可发布版本。

### 第一笔：API 实现与测试

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

### 第二笔：扩展实现与测试

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

### 第三笔：规范与交付文档

- `AGENTS.md`
- `apps/api/AGENTS.md`
- `apps/api/README.md`
- `apps/extension/AGENTS.md`
- `apps/website/AGENTS.md`
- `docs/api-conventions.md`
- `docs/changes/README.md`
- `docs/changes/commits/2026-11-08-activity-days-pagination-commit.md`
- `docs/changes/issues/2026-11-08-activity-days-pagination-issue.md`
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

## 执行与终态更新边界（已批准）

- 顺序：API 代码与测试 → 扩展代码与测试 → 全部文档；AGENTS、README、Issue、Plan、工作台和本记录全部归第三笔。
- 提交时复用已有验证，不追加测试、类型检查或构建。API 51 项通过、5 项隔离 PostgreSQL 跳过；扩展曾完整 133 项通过，最新默认排序改动后相关 9 项、类型检查和本地 API 构建通过。
- 已展示限制：真实数据库 SQL 执行、浏览器视觉/布局/交互和真实业务联调未验证；API 未部署，当前本地产物指向 127.0.0.1:8000。
- 获得明确本地提交指令后，仅随第三笔执行机械性终态更新：Issue 状态与本记录改为已完成，记录用户批准按现状完结和本地提交；不将未执行的浏览器验收写成通过；工作台当前 Issue 清空并加入已完成索引，Plan 的停止状态改为按用户批准本地提交完结。
- 三笔全部成功后才完结。若中间提交失败，保留已成功提交，未完成部分恢复待提交/待批准，不自动撤销或重做成功提交。
- 不推送、不部署、不 amend 或重写历史。

## 最终批准与完结

2026-11-09 用户明确“验收通过 commit”，已批准按上述三笔本地提交及预先展示的机械性终态更新。API 与扩展代码已分别提交；本记录、Issue、工作台和 Plan 的完成状态纳入第三笔文档提交。此前真实数据库执行等未验证限制保持原样，不重复测试、构建，不推送或部署。三笔全部成功后工作项完结。
