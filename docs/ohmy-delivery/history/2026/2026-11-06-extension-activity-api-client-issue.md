---
date: "2026-11-06"
scope: extension
status: completed
type: feature
---

# 封装前端请求并接通 Activity 数据

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

复用首项 API 契约，通过扩展后台安全请求数据库中的 Activity 数据，替换模拟 JSON，并保留现有图表展示和统计规则。

### 范围与排除项

- 用户追加批准引入 Axios：以固定版本 Axios 实例替换共用层手写 fetch、JSON、超时取消与 HTTP 处理，使用适配扩展 Service Worker 的 fetch adapter；保留账号隔离、安全地址、标准错误和 no-store，不增加缓存、自动重试或额外请求框架。后端仅只读核对现有成熟库使用，不新增依赖或改动后端业务。
- 共用请求能力统一固定 API 地址、参数编码、Authorization/Accept、有 JSON 请求体时的 Content-Type、超时取消、HTTP 与响应解析错误；不直接弹业务 Toast、不新增通知包装器，不记录令牌。
- 访问令牌留在后台，复用现有认证刷新协调；页面只获得业务结果，后台验证消息来源。不引入 Activity 数据持久化或结果缓存。
- 本地目标 http://127.0.0.1:8000；共用请求配置支持开发本地/生产 API 标识，验收构建显式选择本地。添加精确主机权限，不接受页面传入任意 URL；OAuth resource 继续 https://api.exts.linguio.dev，不改令牌受众。
- 用户追加批准：所有业务接口统一 POST，在本项同步修改 Activity 前后端与 OpenAPI；日期使用 JSON 请求体，无请求体或 {} 查询本人全部记录。根目录维护共用 API 规范；文档与 Vercel 内部定时触发保留 GET。
- POST /api/activity/days 使用 cache:no-store；Activity 数据仅作为当前页面展示状态，不写 IndexedDB、chrome.storage 或 Web Storage，不保留历史类型结果，不用旧结果兜底失败。
- 初始化确认已登录、登录成功、切换 Calendar/Trends/Summary 时请求；Growth/Sleep 使用同一响应变量切换字段，不请求。Home/Studio、窗口聚焦、跨天、改库不触发 Activity 请求。
- 请求触发规则与最终初始化工作项衔接，不将 React Activity 隐藏/恢复导致的 Effect 重启当作新的业务请求事件。
- 前端按视图计算 startDate/endDate：日历含今天，Trends 为截止昨天的 14 天，Summary 沿用当前周范围。日期口径与首项一致，不擅自随设备变化。
- 后端仅返回已有行；前端生成日期、显示无记录并保留 NULL/0 语义。成长平均沿用最近 14 天累计除以 14，其他统计保持既有规则。
- 用户最新验收修正：仅替换数据源，日历/趋势/周图表始终保留；未登录、加载中、无记录及失败时使用原图表的空数据表现，不用 Empty、图标或文字替换图表。失败由业务直接调用现有 Sonner toast.error「加载失败」，不新增通知层或重试交互。
- 联调排错：区分后台消息无响应、认证阶段失败与 HTTP 网络失败；新标签页 Console 只记录 code/status/requestId，不输出凭据或原始错误。不能用 Toast 或未见 Network 记录认定 HTTP 已发出，实际失败阶段仍待证据确认。
- 用户已提供真实错误码 BACKGROUND_UNAVAILABLE：只确认页面未取得后台有效回复，不等同 API 不可达。增加固定 reason 分类 EMPTY_RESPONSE/NO_RECEIVER/CHANNEL_CLOSED/RUNTIME_ERROR 诊断，不输出原始消息；定位完成后清理此临时诊断。
- 用户追加批准：Spent 无数据时绘制 --muted 灰色圆形占位，禁止占位参与统计或 Tooltip；直接连接现有 Neon 做只读接口查询验证，不写业务数据，不把受控身份测试误记为真实浏览器登录验证。
- 登录身份变化立即阻止旧账号响应应用到新账号；完整存储清理与会话初始化由第三项交付。
- 排除项：上述 POST 调整之外的 API 契约重设计、数据库新业务、写入/删除接口、轮询、自动聚焦刷新、缓存库、重设计图表、完整退出重置；不执行 Vercel 部署、生产迁移或 Git 提交。

## Todo

- [x] 以 Axios 替换底层请求，删除被替代实现并验证相关请求行为、类型及构建。
- [x] 同步业务 POST 契约、请求体、统一规范与相关验证。
- [x] 核对前项实际契约，确定最小请求封装与消息边界。
- [x] 实现后台认证请求和统一异常解析，处理取消及失效响应。
- [x] 将 Activity 接入真实数据，落实请求时机、字段适配和空/错/加载状态。
- [x] 验证请求头、数据隔离、禁缓存、错误分类与纯统计逻辑，按风险检查所属应用。
- [x] 交付本地 API 联调构建与用户验收步骤，真实浏览器结果待用户确认。

## 验收标准

- 登录用户能看到其数据库实际记录，未登录不发业务查询；所有状态保留图表，失败清空当前数据并用 Sonner 提示，不沿用旧结果，不新增图表区域占位。
- 请求次数符合约定；Growth/Sleep 和 Home/Studio 切换不增加 Activity 查询。
- Activity 不写本地持久化，不复用历史查询结果；切换身份后不显示旧账号响应。
- 图表统计和空值处理符合既有规则；视觉与交互由用户在 Chrome/Edge 加载产物验收。

## 唯一下一步

无。

## 交付记录

### 实际验证与限制

- 完整扩展测试：24 文件、112 项通过；类型检查通过。本次 VITE_API_BASE_URL=http://127.0.0.1:8000 的生产构建成功，产物 dist/build/chrome-mv3；检查产物后台实际绑定本地地址、Manifest 有精确 API 主机权限及固定 key。
- 保留 theme-init 非 module 脚本与大 chunk 既有构建警告。稳定开发目录本次未更新。
- 初始 Vitest sandbox fork 出现 EPERM，停止后改用获准的单工作进程和文件串行执行；一项测试夹具未提供后续会话值，定位后只修正夹具，通过重试。未为测试失败修改正常业务逻辑。
- 采用 react-best-practices 检查 Hook 依赖、隐藏边界、异步取消与状态清空；按用户最新要求移除状态页，保留图表及现有 Sonner。最新类型检查和本地目标构建通过，未执行浏览器视觉/交互验收，不以自动结果认定真实用户数据已加载。
- 无新增依赖、持久化或业务缓存；未读取真实令牌、手动操作登录、修改数据库/Vercel 或部署。完整退出清理仍未实现。

### 用户可观察验收步骤

1. 仓库根运行 pnpm api:dev，保持服务可用；Chrome/Edge 扩展管理页重新加载 dist/build/chrome-mv3，确认新增主机权限后新开标签页。不要加载旧稳定开发产物或临时缓存目录。
2. 未登录保留空图表；通过已有 Account 登录，初始化应自动请求本人数据，页面无需复制 token，模拟数据不再出现。请求发生在 Service Worker 后台，新标签页 Network 没有记录不代表未发请求。
3. Check-ins 包含今天，Trends 仅到昨天，Summary 按上海本周累计；NULL 不变成睡眠零时长，原均值/目标/配色保持。
4. 切换三种视图会重新请求；Growth/Sleep、Home/Studio、窗口聚焦不产生额外 Activity 查询。可从本地 API 终端观察请求路径和日期，无需查看含令牌的请求头。
5. 手动改库后当前视图不自动更新；切换到其他视图再切回时显示新值。停止 API 并切换视图时只提示 Sonner「加载失败」，图表保持原有空数据结构，不显示旧结果或另建占位；启动 API 再切换视图可恢复。
6. 退出后不得显示上一账号数据；换账号应仅显示新账号自己的数据。设置和其他持久化数据仍遵循现有流程，后续重置 Issue 才统一清除。

### 实际连通验证

- 用户批准直接连库测试后，对本地 http://127.0.0.1:8000/api/activity/days 发起一次无凭据真实 HTTP 请求，返回预期 401，本地 API 可达；不是 Vercel 上的调用。
- 使用 FastAPI TestClient 与真实 Neon，只替换测试进程的 JWT 验签返回身份，保留用户存在查询、路由、service、repository 和数据库连接。全部历史/完整九字段、单日、起点单边、终点单边均返回 200；非法范围 422；不存在用户 401。未写业务数据、未读取用户 token。
- 首次默认执行环境的测试在后段遭遇 DATABASE_UNAVAILABLE/OperationalError，停止重复默认路径；在明确获准的网络权限环境中完成上述完整只读测试。没有修改正常连接策略或加入自动重试。
- 上述结果不等于浏览器令牌/消息链路已通过。BACKGROUND_UNAVAILABLE 仍待浏览器通道原因，不能因数据库测试通过宣布整个接入完成。
- Spent 空数据灰色圆已使用全局 muted，关闭占位 Tooltip/无意义辅助数值，不参与原始记录或统计；类型检查和本地 API 构建通过。共用请求分类修正后完整扩展测试为 115 项通过。

### POST 契约调整验证

- 后端 28 项测试中 25 项通过、3 项隔离 PostgreSQL 测试未配置连接而跳过；覆盖无请求体、{}、单边/双边日期、身份、响应及 OpenAPI，原 GET 返回 405。
- 扩展受影响请求测试 2 文件/7 项通过，类型检查和本地 API 目标构建通过；既有构建警告保留。
- 已生成 dist/build/chrome-mv3；用户保持 API 运行，刷新 /docs 应显示 POST 与 JSON 请求体，重新加载扩展并新开标签页后，登录/切换视图应在 API 终端看到 POST /api/activity/days。
- 本次未修改数据库结构或部署、提交。原 BACKGROUND_UNAVAILABLE 的浏览器实测仍未通过，方法调整不视为该问题已修复。

### Axios 迁移验证与验收

- 固定 Axios 1.21.0 安装及锁文件更新完成；完整扩展 25 文件/115 项、类型检查、本地 API 目标构建通过。产物 dist/build/chrome-mv3，既有脚本与 chunk 警告保留；未执行浏览器验收、数据库变更或 Git 提交。
- 迁移仅覆盖自有业务 HTTP，未改 OIDC 登录、日期范围、图表、数据库或后端依赖。FastAPI 已有 Pydantic/psycopg/PyJWT，公共响应为项目契约，不增加额外框架。
- 用户当前加载 dist/dev/chrome-mv3-dev-stable。现有开发流程已更新该稳定目录，实际后台文件已包含 Axios 1.21.0、fetch adapter、withCredentials: false 和 no-store。扩展管理页重新加载后新开 Newtab；构建产物核对不等于浏览器已加载新后台。
- 保持 pnpm api:dev 运行，登录后或切换视图，在后台 Network 检查 POST /api/activity/days 为 JSON、Bearer 认证、不携带 Cookie；Growth/Sleep 不新增请求，失败仍保留空图表并提示加载失败。不要提供完整请求头或 token。
- 用户刷新后已看到请求，不再只有 EMPTY_RESPONSE；本地 HTTP 只读诊断曾得到 ConnectionRefusedError/10061，与参数 JSON 展示无关。当前仍待完整真实账号到数据库的浏览器验收。

### 最新验收反馈与下一步

用户确认已有数据，后台链路已能返回业务结果；当前性能反馈未解决。只读计时两轮分别约 7.8 秒、7.3 秒，身份查用户和业务查数据分别建立 Neon 连接；每次建立连接约 1.7–2.0 秒，另有事务设置与查询往返。真实 JWT 及浏览器整段耗时未测，详见交付记录。

用户在方案展示后再次要求拆分 Commit，本次按已展示边界批准代码/文档两笔本地提交并完结；复用现有验证，不追加检查或继续性能改造。

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-06-extension-activity-api-client-issue.md)

#### 预期交付边界

共用后台 HTTP 请求与异常处理、Activity 真实数据接入、禁缓存及明确请求时机。用户批准后端先本地提交，再实施本项连接本地 API；不包含 Git 提交、Vercel 部署或完整退出重置。

#### 实际交付

已实现 lib/api 共用请求、后台会话读取和 Activity 消息处理；令牌只留后台，复用既有串行刷新；只接收受信 Newtab 的固定资源请求，支持页面隔离取消与迟到身份拒绝。

Provider 在隐藏边界外，只有登录初始化和三项视图切换请求；Growth/Sleep 使用同一结果。移除模拟 JSON，按上海日期和现有图表结构适配真实数据；图表在未登录/加载/无数据/失败时也始终保留，不增加替代图表的状态页。无缓存或本地持久化；按用户追加批准引入 Axios 1.21.0。

增加固定本地/生产 API 主机权限和配置，当前联调产物显式绑定 http://127.0.0.1:8000，OAuth resource 不变。更新 README、应用约束和 UI 数据来源说明。

按用户最新验收修正，移除先前引入的 Empty、错误图标/标题和周投入无数据文字；日历、趋势、饼图及进度环始终渲染空数据，失败只由业务直接调用共用 Sonner toast.error「加载失败」。不新增交互或通知封装。后台请求在 Service Worker 发出，API 入站日志不代表 API 主动请求自己。

用户进一步批准 Spent 空数据灰色圆，采用全局 muted 的纯图形权重占位，禁止占位 Tooltip 和业务统计；不写假业务记录。前端消息无回复与认证阶段失败分别分类，页面 Console 保留安全错误码；临时通道原因分类待联调定位后清理。

#### 验证与限制

- 扩展最新完整测试 25 文件/115 项通过，类型检查通过；Spent 占位和消息诊断后的本地 API 目标构建成功，产物 dist/build/chrome-mv3，1.72 MB。
- 检查产物 Manifest API 主机、固定 key、Newtab 入口，以及后台显式本地 baseUrl；保留既有脚本和大 chunk 警告。未更新稳定开发目录。
- 初始测试 fork EPERM，停止后以获准单工作进程串行执行；会话测试夹具返回次数不足，只修夹具后通过。没有新增假 DOM 或交互测试。
- React 规则自查完成；未进行真实 Chrome/Edge 登录、网络/权限或视觉验收，未读取真实 token。除用户追加批准的 POST 契约外未改变后端；未修改数据库、部署或提交。
- 最新恢复图表始终渲染、移除状态页和周投入文字后，类型检查及本地 API 目标构建通过；请求/统计逻辑未变，沿用 112 项行为测试结果，不新增或执行视觉交互测试。
- 真实本地 HTTP 无凭据查询返回 401，确认服务可达。真实 Neon + TestClient 查询/筛选/完整字段通过，非法范围 422、不存在用户 401；测试进程受控注入 JWT 身份，未验证浏览器实际 token，未写数据。默认环境曾出现 OperationalError，改在获准网络权限环境完成验证，没有加入业务重试。
- 用户先前实测 BACKGROUND_UNAVAILABLE；后续刷新已看到业务请求，但本地端口曾拒绝连接。完整浏览器到数据库链路仍待验收，不能将后端受控身份验证等同前端接入成功。

#### 用户验收

用户已确认能够显示真实数据，但反馈接口非常慢，尚未确认整个验收通过；图表持续保留及 Spent 空圆已按用户修正。按 Issue 继续核对新标签页安全错误码/通道原因；自动化和真实数据库查询通过不等于浏览器登录和数据展示通过。

#### 提交方案

用户在方案展示后再次要求拆分 Commit，批准按所列代码/文档两笔执行本地提交。Python __pycache__、忽略的环境配置、构建产物与凭据不纳入提交。

##### 第一笔：代码

- apps/api/modules/activity/router.py
- apps/api/tests/test_activity.py
- apps/api/tests/test_app.py
- apps/extension/.env.example
- apps/extension/package.json
- apps/extension/src/app/App.tsx
- apps/extension/src/entrypoints/background.ts
- apps/extension/src/features/account/account-background.ts
- apps/extension/src/features/account/account-controller.ts
- apps/extension/src/features/activity/activity.tsx
- apps/extension/src/features/activity/mock-records.json
- apps/extension/src/features/activity/use-local-date.ts
- apps/extension/src/features/activity/week-charts.tsx
- apps/extension/tests/config/manifest.test.mjs
- apps/extension/tests/features/account/account-controller.test.ts
- apps/extension/wxt.config.ts
- pnpm-lock.yaml
- apps/extension/src/features/activity/background.ts
- apps/extension/src/features/activity/data.ts
- apps/extension/src/features/activity/provider.tsx
- apps/extension/src/features/activity/requests.ts
- apps/extension/src/lib/api/client.ts
- apps/extension/src/lib/api/config.ts
- apps/extension/tests/features/activity/api-client.test.ts
- apps/extension/tests/features/activity/background.test.ts
- apps/extension/tests/features/activity/data.test.ts
- apps/extension/tests/features/activity/requests.test.ts

```text
feat(extension): 基于 Axios 接入 Activity 真实数据

- 统一后台认证请求、异常处理及账号隔离，禁止业务数据缓存
- 接入 Activity 每日记录并保留图表展示与既有统计规则
- 同步 POST 查询契约与 JSON 请求体，固定 Axios 依赖版本
```

##### 第二笔：文档

- AGENTS.md
- apps/api/README.md
- apps/extension/AGENTS.md
- apps/extension/README.md
- docs/ohmy-delivery/readme.md
- docs/ohmy-delivery/history/2026/2026-11-06-extension-activity-api-client-issue.md
- docs/ohmy-delivery/history/2026/2026-11-06-extension-activity-api-client-issue.md
- docs/extension/ui.md
- apps/api/AGENTS.md
- docs/api-conventions.md
- docs/superpowers/plans/2026-11-06-extension-activity-api-client.md
- docs/superpowers/specs/2026-11-06-extension-activity-api-client-design.md

```text
docs(repo): 记录 Activity 接入与 Axios 请求规范

- 明确业务 POST 契约、请求分层和 Axios 配置
- 记录验证结果、实库联调及数据库耗时限制
- 同步工作项交付记录与用户验收步骤
```

复用已有验证：扩展完整 115 项、类型检查与构建通过，后端 25 项通过、3 项隔离数据库测试跳过；本次拆分不重跑检查。用户已确认有真实数据，接口性能仍有反馈，不将整个验收记为通过。

按用户最新指令先提交代码，再随文档提交将本 Issue、交付记录和工作台同步为已完成；提交批准状态为已批准，性能限制保留。提交失败按规范保留成功部分并恢复剩余待提交状态。不修改数据库或推送远端。

#### 最终提交批准

已批准：用户于 2026-11-06 在方案展示后再次要求拆分 Commit，按已展示文件和消息执行两笔本地提交，工作项已完成。用户已确认真实数据展示；性能问题未修复、完整浏览器验收未另行声明通过，不推送或部署。

#### 追加交付：业务 POST 规范

用户明确所有业务接口统一 POST；Activity 前后端改为 POST + JSON 日期条件，不传请求体或 {} 查询本人全部记录，公开文档和内部任务保留 GET。新增根 docs/api-conventions.md、API AGENTS 并由根 AGENTS 引用，同步 API/扩展 README、当前设计与计划。历史后端交付记录保留当时状态。

验证：后端 25 项通过/3 项隔离实库跳过；扩展受影响 7 项请求测试、类型检查、本地目标构建通过。未重复运行真实 Neon 查询，沿用此前仓储实库验证；浏览器消息链路仍待用户验收。新增规范与 AGENTS 归入文档提交，不执行 Git 提交。

#### 追加交付：Axios 请求层

使用 Axios 1.21.0 实例与 fetch adapter，默认业务 POST/JSON；移除手写 fetch、序列化、定时器、取消信号转接和传输注入。保留后台会话、前后身份核对、固定地址、统一安全错误及 no-store；withCredentials: false 保持 Cookie 隔离，不加自动重试或缓存。后端只读核对既有库及分层，未修改后端。

安装精确依赖完成；迁移测试夹具曾因参数遮蔽导致取消/超时误报，修正夹具后通过。实际请求测试发现 fetchOptions.credentials 被 Axios 忽略，改用官方 withCredentials 后通过；没有为测试放宽凭据约束。最新扩展完整 25 文件/115 项、类型检查通过，本地 API 目标构建通过（dist/build/chrome-mv3，1.78 MB）；既有构建警告保留，现有开发流程也已更新稳定开发目录，并核对后台包含 Axios 1.21.0、fetch adapter、禁 Cookie 和 no-store；浏览器仍需用户重新加载验证。

#### 实际耗时调查

2026-11-06 用户反馈接口慢，进行两轮真实 Neon 只读计时：仅在诊断进程替换 JWT 验签身份，保留真实用户存在检查和 Activity 查询，不读取 token、不写数据。

- 第一轮用户存在检查 4170 ms、Activity 查询 3633 ms，合计 7803 ms。
- 第二轮用户存在检查 3765 ms、Activity 查询 3532 ms，合计 7297 ms。
- 各次新建连接约 1.7–2.0 秒；当前请求先认证查用户再查 Activity，分别建立连接，初始化还逐条执行时区/超时等事务语句。实测慢发生在后端数据库路径，不能归因于 Axios；未测真实 JWT 验签和浏览器整段耗时。
- 本次尚未优化连接/事务或改库；先按用户最新要求整理两笔提交边界，不把性能反馈写成已修复。

## 关联文档

- [前置：接口与数据库](2026-11-06-api-activity-read-issue.md)
- [后续：初始化与重置](2026-11-06-extension-session-reset-issue.md)
- [接入设计](../../../superpowers/specs/2026-11-06-extension-activity-api-client-design.md)
- [实施计划](../../../superpowers/plans/2026-11-06-extension-activity-api-client.md)

## 历史补充

### 元信息

- 当前阶段：按用户 2026-11-06 最新指令完成代码/文档两笔本地提交；已显示真实数据，性能限制如实保留，未推送或启动重置工作项
- 已批准范围依据：用户于 2026-11-06 明确选择先本地提交后端再开始本项，并选择本地 API 自动携带令牌测试；后端两笔提交已成功，本项获准实施，不包含 Git 提交或 Vercel 部署。

### 历史后续事项

本项按用户指令本地提交完结；等待用户确定下一项，不自动开始性能优化或初始化重置。
