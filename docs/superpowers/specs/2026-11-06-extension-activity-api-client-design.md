# Activity 本地 API 接入设计

## 批准与边界

- [Issue](../../changes/issues/2026-11-06-extension-activity-api-client-issue.md)：用户已明确批准在后端提交后开始前端接入，以本地 API 自动携带令牌测试；沿用前期已确定的分层、无缓存和请求时机。
- 本地 API http://127.0.0.1:8000，后端数据和 Neon 表不改；不执行 Vercel 部署或 Git 提交。完整退出存储重置仍属下一项。
- 不新增依赖、状态框架、缓存库、DOM 模拟或视觉交互测试；不重设计图表。

## 请求与身份

- lib/api 持有共用 HTTP 客户端、固定可配置地址、ApiRequestError；统一 Accept、后台 Bearer、JSON body Content-Type、15 秒超时、AbortSignal、no-store、credentials:omit 及成功/失败解析，不负责 Toast 或业务记录。
- 默认开发本地地址、生产 https://api.exts.linguio.dev；VITE_API_BASE_URL 可显式选择二者，不允许任意来源。此次验收构建显式选本地，扩展只增加这两个 API 精确主机权限。
- 账号 controller 提供仅后台使用的会话读取方法，与既有 get 复用同一串行刷新逻辑；不让页面消息读取 token，也不绕过 OIDC 库刷新或自动重试业务请求。
- Activity 独立后台入口仅接受本扩展 newtab 页面发送的已知操作和日期参数，映射至固定 /api/activity/days，不接受任意 URL/headers/method。请求 id 按发送页面隔离，取消仅取消本页请求；在途状态不是业务缓存。
- 页面传递当前预期身份仅用于拒绝过期请求，实际身份始终来自后台令牌；后台不把令牌写入日志或响应。返回后再确认会话一致，账号变化立即丢弃响应。
- 网络、超时、取消、未登录、HTTP 错误、响应格式错误有稳定错误类别；保留后端 requestId 供排错，固定安全文案，不把原始 fetch 异常/凭据暴露给页面。

## 页面状态与请求时机

- Activity Provider 放在 App 内、React Activity 隐藏边界外，只持有当前 view、当前数据和账号作用域；不维护替换图表的 loading/error 状态页，不建立全局持久 Store 或跨视图查询缓存。
- 初始化确认已登录、账号登录成功、Calendar/Trends/Summary 切换时发请求。依赖稳定 user.id 而非 user 对象，避免窗口 focus 导致对象刷新时多请求。
- Growth/Sleep 在卡片内切换展示字段，共用当前 Trends 响应。Home/Studio 隐藏/显示、跨天、窗口聚焦、数据库修改不触发业务请求。
- 切换视图/身份时清空当前展示数据并取消上次请求；在途响应带身份/请求世代核验，迟到结果不覆盖新视图/新账号。退出立即不显示旧数据，但不在此清理账号以外的持久化设置。
- 活动数据不写 IndexedDB、chrome.storage、Local/Session Storage，不复用上次视图结果或以旧结果兜底失败。
- 用户最新验收修正：只是填充数据，三种图表始终渲染；未登录、加载、无数据和失败均用原图表空数据表现，不以 Empty/图标/标题/提示文字替换。周投入无数据时同样保留图表容器，不显示 No activity this week。
- 取消不提示；其他失败清空当前数据，由业务直接使用现有 Sonner toast.error「加载失败」，不显示原始技术文案，不建立通知管理器或新增重试动作。

## 数据与日期

- POST /api/activity/days 使用 JSON 请求体 startDate/endDate，日历首个展示日至今天、Trends 今天前 14 天至昨天、Summary 本周日到今天。接口仍支持无日期查全部，但当前视图不读取无关历史。
- 校验 data.days、真实日期、所属 userId、时长为非负有限整数或 null、无重复日期及请求范围内；响应异常不静默当空数据。元数据 userId/createdAt/updatedAt 不进入图表统计。
- 接口平铺字段映射为既有 ActivityRecords；growth 仅是前端图表组合，null 不变成已记录的零，sleep null 转为缺失。现有均值/周目标/完成档位保持。
- Intl.DateTimeFormat 按 Asia/Shanghai 确定业务年月日，现有日历数学继续使用该业务日期的年月日；午夜时钟更新只更新显示日期，不拉取数据。固定 UTC+8 的下一上海午夜计算集中维护，无新增时区库。
- mock-records.json 从实际运行入口移除并删除；纯逻辑既有测试保留。

## 验证与交付

- 自动测试：请求头/禁缓存/错误分类、取消、后台来源及 URL 边界、串行刷新、响应适配、日期范围与上海跨日；不通过源码文本或假 DOM 测键盘/视觉交互。
- 扩展完整现有测试、类型检查与指定本地 API 的生产构建串行执行；不追加后端测试，因为接口契约不变。
- 用户运行 pnpm api:dev，加载 dist/build/chrome-mv3，登录后观察真实数据库记录；手动切换类型应产生后台请求，Growth/Sleep 和 Home/Studio 不额外请求。停止 API 后提示加载失败、图表保留为空，重新进入类型后恢复；账号变化不得残留上一账号数据。请求看 Service Worker Network 或 API 入站日志，不依据 Newtab Network 判断没有发请求。
- 本地新增主机权限和 localhost 联调是否触发浏览器权限提示、连接限制及真实登录链路由用户 Chrome/Edge 验收，不宣称构建通过等同浏览器验收。

## 用户追加决定：Axios

- 采用精确版本 Axios 1.21.0，单个客户端实例使用 fetch adapter；默认 POST 并自动序列化 JSON、管理超时和取消。移除手写计时器、信号转接、JSON 编解码和 fetcher 注入。
- withCredentials: false，fetchOptions 禁缓存并拒绝重定向；不加重试、结果缓存、拦截器管理器或通用 CRUD 框架。认证、账号隔离、标准响应和安全异常映射保留在项目层。
- FastAPI 已使用 Pydantic、psycopg、PyJWT 等成熟依赖；本次仅只读核对，项目响应契约及参数化 SQL 保留，不新增 ORM 或后端依赖。
