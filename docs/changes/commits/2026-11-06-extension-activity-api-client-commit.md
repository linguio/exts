# 封装前端请求并接通 Activity 数据：交付记录

## 对应工作项

- [Issue](../issues/2026-11-06-extension-activity-api-client-issue.md)

## 预期交付边界

共用后台 HTTP 请求与异常处理、Activity 真实数据接入、禁缓存及明确请求时机。用户批准后端先本地提交，再实施本项连接本地 API；不包含 Git 提交、Vercel 部署或完整退出重置。

## 实际交付

已实现 lib/api 共用请求、后台会话读取和 Activity 消息处理；令牌只留后台，复用既有串行刷新；只接收受信 Newtab 的固定资源请求，支持页面隔离取消与迟到身份拒绝。

Provider 在隐藏边界外，只有登录初始化和三项视图切换请求；Growth/Sleep 使用同一结果。移除模拟 JSON，按上海日期和现有图表结构适配真实数据；图表在未登录/加载/无数据/失败时也始终保留，不增加替代图表的状态页。无缓存或本地持久化；按用户追加批准引入 Axios 1.21.0。

增加固定本地/生产 API 主机权限和配置，当前联调产物显式绑定 http://127.0.0.1:8000，OAuth resource 不变。更新 README、应用约束和 UI 数据来源说明。

按用户最新验收修正，移除先前引入的 Empty、错误图标/标题和周投入无数据文字；日历、趋势、饼图及进度环始终渲染空数据，失败只由业务直接调用共用 Sonner toast.error「加载失败」。不新增交互或通知封装。后台请求在 Service Worker 发出，API 入站日志不代表 API 主动请求自己。

用户进一步批准 Spent 空数据灰色圆，采用全局 muted 的纯图形权重占位，禁止占位 Tooltip 和业务统计；不写假业务记录。前端消息无回复与认证阶段失败分别分类，页面 Console 保留安全错误码；临时通道原因分类待联调定位后清理。

## 验证与限制

- 扩展最新完整测试 25 文件/115 项通过，类型检查通过；Spent 占位和消息诊断后的本地 API 目标构建成功，产物 dist/build/chrome-mv3，1.72 MB。
- 检查产物 Manifest API 主机、固定 key、Newtab 入口，以及后台显式本地 baseUrl；保留既有脚本和大 chunk 警告。未更新稳定开发目录。
- 初始测试 fork EPERM，停止后以获准单工作进程串行执行；会话测试夹具返回次数不足，只修夹具后通过。没有新增假 DOM 或交互测试。
- React 规则自查完成；未进行真实 Chrome/Edge 登录、网络/权限或视觉验收，未读取真实 token。除用户追加批准的 POST 契约外未改变后端；未修改数据库、部署或提交。
- 最新恢复图表始终渲染、移除状态页和周投入文字后，类型检查及本地 API 目标构建通过；请求/统计逻辑未变，沿用 112 项行为测试结果，不新增或执行视觉交互测试。
- 真实本地 HTTP 无凭据查询返回 401，确认服务可达。真实 Neon + TestClient 查询/筛选/完整字段通过，非法范围 422、不存在用户 401；测试进程受控注入 JWT 身份，未验证浏览器实际 token，未写数据。默认环境曾出现 OperationalError，改在获准网络权限环境完成验证，没有加入业务重试。
- 用户先前实测 BACKGROUND_UNAVAILABLE；后续刷新已看到业务请求，但本地端口曾拒绝连接。完整浏览器到数据库链路仍待验收，不能将后端受控身份验证等同前端接入成功。

## 用户验收

用户已确认能够显示真实数据，但反馈接口非常慢，尚未确认整个验收通过；图表持续保留及 Spent 空圆已按用户修正。按 Issue 继续核对新标签页安全错误码/通道原因；自动化和真实数据库查询通过不等于浏览器登录和数据展示通过。

## 提交方案

用户在方案展示后再次要求拆分 Commit，批准按所列代码/文档两笔执行本地提交。Python __pycache__、忽略的环境配置、构建产物与凭据不纳入提交。

### 第一笔：代码

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

### 第二笔：文档

- AGENTS.md
- apps/api/README.md
- apps/extension/AGENTS.md
- apps/extension/README.md
- docs/changes/README.md
- docs/changes/commits/2026-11-06-extension-activity-api-client-commit.md
- docs/changes/issues/2026-11-06-extension-activity-api-client-issue.md
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

## 最终提交批准

已批准：用户于 2026-11-06 在方案展示后再次要求拆分 Commit，按已展示文件和消息执行两笔本地提交，工作项已完成。用户已确认真实数据展示；性能问题未修复、完整浏览器验收未另行声明通过，不推送或部署。

## 追加交付：业务 POST 规范

用户明确所有业务接口统一 POST；Activity 前后端改为 POST + JSON 日期条件，不传请求体或 {} 查询本人全部记录，公开文档和内部任务保留 GET。新增根 docs/api-conventions.md、API AGENTS 并由根 AGENTS 引用，同步 API/扩展 README、当前设计与计划。历史后端交付记录保留当时状态。

验证：后端 25 项通过/3 项隔离实库跳过；扩展受影响 7 项请求测试、类型检查、本地目标构建通过。未重复运行真实 Neon 查询，沿用此前仓储实库验证；浏览器消息链路仍待用户验收。新增规范与 AGENTS 归入文档提交，不执行 Git 提交。

## 追加交付：Axios 请求层

使用 Axios 1.21.0 实例与 fetch adapter，默认业务 POST/JSON；移除手写 fetch、序列化、定时器、取消信号转接和传输注入。保留后台会话、前后身份核对、固定地址、统一安全错误及 no-store；withCredentials: false 保持 Cookie 隔离，不加自动重试或缓存。后端只读核对既有库及分层，未修改后端。

安装精确依赖完成；迁移测试夹具曾因参数遮蔽导致取消/超时误报，修正夹具后通过。实际请求测试发现 fetchOptions.credentials 被 Axios 忽略，改用官方 withCredentials 后通过；没有为测试放宽凭据约束。最新扩展完整 25 文件/115 项、类型检查通过，本地 API 目标构建通过（dist/build/chrome-mv3，1.78 MB）；既有构建警告保留，现有开发流程也已更新稳定开发目录，并核对后台包含 Axios 1.21.0、fetch adapter、禁 Cookie 和 no-store；浏览器仍需用户重新加载验证。

## 实际耗时调查

2026-11-06 用户反馈接口慢，进行两轮真实 Neon 只读计时：仅在诊断进程替换 JWT 验签身份，保留真实用户存在检查和 Activity 查询，不读取 token、不写数据。

- 第一轮用户存在检查 4170 ms、Activity 查询 3633 ms，合计 7803 ms。
- 第二轮用户存在检查 3765 ms、Activity 查询 3532 ms，合计 7297 ms。
- 各次新建连接约 1.7–2.0 秒；当前请求先认证查用户再查 Activity，分别建立连接，初始化还逐条执行时区/超时等事务语句。实测慢发生在后端数据库路径，不能归因于 Axios；未测真实 JWT 验签和浏览器整段耗时。
- 本次尚未优化连接/事务或改库；先按用户最新要求整理两笔提交边界，不把性能反馈写成已修复。
