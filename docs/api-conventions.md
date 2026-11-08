# 业务 API 规范

本规范约束各应用与自有 API 的业务通信。接口实现位于 apps/api，公开 /docs 与 /openapi.json 由 FastAPI 的实际模型生成；示例必须与真实响应模型一致。

## 方法与路径

- 所有业务接口统一 POST，包含查询和未来新增、修改、删除操作；参数使用 application/json 请求体。查询使用 POST 不改变其只读语义。
- 路径按模块及资源组织，使用 /api/<module>/<resource>。当前 Activity 查询为 POST /api/activity/days；当前不增加版本前缀，未来写接口路径随实际 Issue 设计，不提前创建占位接口。
- Settings 独立于用户资料：POST /api/settings/preferences 读取本人完整设置，POST /api/settings/preferences/update 每次只更新一个字段并返回完整设置。
- 文档 GET /、/docs、/openapi.json 与内部任务 GET /internal/jobs/activity-days 保留原方法；内部任务使用独立服务端认证。第三方 OAuth/OIDC 等协议按其自身要求调用。

## 客户端实现

- 扩展业务 HTTP 请求统一使用 Axios 1.21.0，经 lib/api/client.ts 配置实例；使用 fetch adapter 适配 Service Worker，默认 POST，由 Axios 处理 JSON、超时和取消。不再手写同类机制，不引入缓存、自动重试或通用请求框架。
- 公共层仅保留可信地址、后台认证头、账号变化检查、统一响应与安全异常映射；业务模块维护参数、返回类型及提示时机。OIDC 登录与令牌刷新仍由现有认证库维护，不迁入业务请求实例。
- fetchOptions 设置 cache: no-store、redirect: error；withCredentials: false 确保不携带站点 Cookie。

## 请求与身份

- JSON 字段使用 camelCase；日期 YYYY-MM-DD，时间戳包含时区偏移。Activity 业务日期统一 Asia/Shanghai，不增加用户时区配置。
- 认证业务请求发送 Authorization: Bearer <accessToken>、Accept: application/json；存在 JSON 请求体时发送 Content-Type: application/json。服务端通过已验证身份限定数据归属，不接受请求中的 userId 作为授权依据。
- 扩展在后台读取访问令牌、发出业务 HTTP 请求；页面消息不能指定任意 URL、方法或请求头，令牌不传给页面、不输出日志。
- Activity 的 startDate/endDate 都可选；不传请求体或传 {} 查询本人全部历史。单边日期按相应边界筛选；双边日期含首尾，开始不得晚于结束。不传日期不添加隐式限制。当前不分页。
- Settings 读取使用空 JSON 对象；更新仅接受 theme、mediaDownload.enabled 或 historyCleaner.enabled 中的一项，不接收 userId。用户没有设置行时返回 system/false/false 默认值，首次成功更新时才建行；旧本地配置不迁移。

```json
{"startDate":"2026-11-01","endDate":"2026-11-06"}
```

## 响应与异常

- 成功响应统一 {"data": ...}；Activity 为 {"data":{"days":[...]}}。每条记录包含 userId、date、exerciseMinutes、readingMinutes、learningMinutes、creationMinutes、sleepMinutes、createdAt、updatedAt。
- Settings 读取与更新均返回 {"data":{"theme":"system","mediaDownload":{"enabled":false},"historyCleaner":{"enabled":false}}}；数据库使用 user_id 与独立列，本地副本另存当前 userId，不在接口返回中暴露。
- 失败响应统一 {"error":{"code":"...","message":"...","requestId":"..."}}，同时保留真实 HTTP 状态；不使用 200 掩盖失败。X-Request-ID 与响应中的 requestId 对应。
- 401 表示未登录或凭据失效，403 表示禁止访问，422 表示参数错误，500 表示未预期异常，503 表示依赖暂不可用。空记录返回成功空数组；连接失败不能返回空数据冒充成功。
- NULL 表示未填写，0 表示明确为零；不把两者混同。服务端只返回已有记录，图表日期补齐和统计由前端执行。
- 业务响应 Cache-Control: no-store；Activity 客户端使用 cache: no-store，不将结果写入本地持久化、不缓存历史结果或用旧数据兜底。前端展示所需的当前内存状态保留。
- 共用请求层处理身份、请求头、超时取消、HTTP 和标准错误解析；业务层决定提示文案及触发时机。日志只记录安全错误码、状态和请求标识，不输出令牌、连接串或原始数据库异常。
