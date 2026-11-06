# 封装前端请求并接通 Activity 数据

## 元信息

- 工作项：2026-11-06-extension-activity-api-client
- 状态：已完成
- 当前阶段：按用户 2026-11-06 最新指令完成代码/文档两笔本地提交；已显示真实数据，性能限制如实保留，未推送或启动重置工作项
- 已批准范围依据：用户于 2026-11-06 明确选择先本地提交后端再开始本项，并选择本地 API 自动携带令牌测试；后端两笔提交已成功，本项获准实施，不包含 Git 提交或 Vercel 部署。

## 背景与目标

复用首项 API 契约，通过扩展后台安全请求数据库中的 Activity 数据，替换模拟 JSON，并保留现有图表展示和统计规则。

## 范围与排除项

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

## 关联文档

- [交付记录](../commits/2026-11-06-extension-activity-api-client-commit.md)
- [前置：接口与数据库](./2026-11-06-api-activity-read-issue.md)
- [后续：初始化与重置](./2026-11-06-extension-session-reset-issue.md)
- [接入设计](../../superpowers/specs/2026-11-06-extension-activity-api-client-design.md)
- [实施计划](../../superpowers/plans/2026-11-06-extension-activity-api-client.md)

## 唯一下一步

本项按用户指令本地提交完结；等待用户确定下一项，不自动开始性能优化或初始化重置。

## 实际验证与限制

- 完整扩展测试：24 文件、112 项通过；类型检查通过。本次 VITE_API_BASE_URL=http://127.0.0.1:8000 的生产构建成功，产物 dist/build/chrome-mv3；检查产物后台实际绑定本地地址、Manifest 有精确 API 主机权限及固定 key。
- 保留 theme-init 非 module 脚本与大 chunk 既有构建警告。稳定开发目录本次未更新。
- 初始 Vitest sandbox fork 出现 EPERM，停止后改用获准的单工作进程和文件串行执行；一项测试夹具未提供后续会话值，定位后只修正夹具，通过重试。未为测试失败修改正常业务逻辑。
- 采用 react-best-practices 检查 Hook 依赖、隐藏边界、异步取消与状态清空；按用户最新要求移除状态页，保留图表及现有 Sonner。最新类型检查和本地目标构建通过，未执行浏览器视觉/交互验收，不以自动结果认定真实用户数据已加载。
- 无新增依赖、持久化或业务缓存；未读取真实令牌、手动操作登录、修改数据库/Vercel 或部署。完整退出清理仍未实现。

## 用户可观察验收步骤

1. 仓库根运行 pnpm api:dev，保持服务可用；Chrome/Edge 扩展管理页重新加载 dist/build/chrome-mv3，确认新增主机权限后新开标签页。不要加载旧稳定开发产物或临时缓存目录。
2. 未登录保留空图表；通过已有 Account 登录，初始化应自动请求本人数据，页面无需复制 token，模拟数据不再出现。请求发生在 Service Worker 后台，新标签页 Network 没有记录不代表未发请求。
3. Check-ins 包含今天，Trends 仅到昨天，Summary 按上海本周累计；NULL 不变成睡眠零时长，原均值/目标/配色保持。
4. 切换三种视图会重新请求；Growth/Sleep、Home/Studio、窗口聚焦不产生额外 Activity 查询。可从本地 API 终端观察请求路径和日期，无需查看含令牌的请求头。
5. 手动改库后当前视图不自动更新；切换到其他视图再切回时显示新值。停止 API 并切换视图时只提示 Sonner「加载失败」，图表保持原有空数据结构，不显示旧结果或另建占位；启动 API 再切换视图可恢复。
6. 退出后不得显示上一账号数据；换账号应仅显示新账号自己的数据。设置和其他持久化数据仍遵循现有流程，后续重置 Issue 才统一清除。

## 实际连通验证

- 用户批准直接连库测试后，对本地 http://127.0.0.1:8000/api/activity/days 发起一次无凭据真实 HTTP 请求，返回预期 401，本地 API 可达；不是 Vercel 上的调用。
- 使用 FastAPI TestClient 与真实 Neon，只替换测试进程的 JWT 验签返回身份，保留用户存在查询、路由、service、repository 和数据库连接。全部历史/完整九字段、单日、起点单边、终点单边均返回 200；非法范围 422；不存在用户 401。未写业务数据、未读取用户 token。
- 首次默认执行环境的测试在后段遭遇 DATABASE_UNAVAILABLE/OperationalError，停止重复默认路径；在明确获准的网络权限环境中完成上述完整只读测试。没有修改正常连接策略或加入自动重试。
- 上述结果不等于浏览器令牌/消息链路已通过。BACKGROUND_UNAVAILABLE 仍待浏览器通道原因，不能因数据库测试通过宣布整个接入完成。
- Spent 空数据灰色圆已使用全局 muted，关闭占位 Tooltip/无意义辅助数值，不参与原始记录或统计；类型检查和本地 API 构建通过。共用请求分类修正后完整扩展测试为 115 项通过。

## POST 契约调整验证

- 后端 28 项测试中 25 项通过、3 项隔离 PostgreSQL 测试未配置连接而跳过；覆盖无请求体、{}、单边/双边日期、身份、响应及 OpenAPI，原 GET 返回 405。
- 扩展受影响请求测试 2 文件/7 项通过，类型检查和本地 API 目标构建通过；既有构建警告保留。
- 已生成 dist/build/chrome-mv3；用户保持 API 运行，刷新 /docs 应显示 POST 与 JSON 请求体，重新加载扩展并新开标签页后，登录/切换视图应在 API 终端看到 POST /api/activity/days。
- 本次未修改数据库结构或部署、提交。原 BACKGROUND_UNAVAILABLE 的浏览器实测仍未通过，方法调整不视为该问题已修复。

## Axios 迁移验证与验收

- 固定 Axios 1.21.0 安装及锁文件更新完成；完整扩展 25 文件/115 项、类型检查、本地 API 目标构建通过。产物 dist/build/chrome-mv3，既有脚本与 chunk 警告保留；未执行浏览器验收、数据库变更或 Git 提交。
- 迁移仅覆盖自有业务 HTTP，未改 OIDC 登录、日期范围、图表、数据库或后端依赖。FastAPI 已有 Pydantic/psycopg/PyJWT，公共响应为项目契约，不增加额外框架。
- 用户当前加载 dist/dev/chrome-mv3-dev-stable。现有开发流程已更新该稳定目录，实际后台文件已包含 Axios 1.21.0、fetch adapter、withCredentials: false 和 no-store。扩展管理页重新加载后新开 Newtab；构建产物核对不等于浏览器已加载新后台。
- 保持 pnpm api:dev 运行，登录后或切换视图，在后台 Network 检查 POST /api/activity/days 为 JSON、Bearer 认证、不携带 Cookie；Growth/Sleep 不新增请求，失败仍保留空图表并提示加载失败。不要提供完整请求头或 token。
- 用户刷新后已看到请求，不再只有 EMPTY_RESPONSE；本地 HTTP 只读诊断曾得到 ConnectionRefusedError/10061，与参数 JSON 展示无关。当前仍待完整真实账号到数据库的浏览器验收。

## 最新验收反馈与下一步

用户确认已有数据，后台链路已能返回业务结果；当前性能反馈未解决。只读计时两轮分别约 7.8 秒、7.3 秒，身份查用户和业务查数据分别建立 Neon 连接；每次建立连接约 1.7–2.0 秒，另有事务设置与查询往返。真实 JWT 及浏览器整段耗时未测，详见交付记录。

用户在方案展示后再次要求拆分 Commit，本次按已展示边界批准代码/文档两笔本地提交并完结；复用现有验证，不追加检查或继续性能改造。
