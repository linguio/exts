---
date: "2026-10-31"
scope: [api, website]
status: completed
type: feature
---

# 接入 Scalar 文档并添加官网入口

## 当前阶段

已完成。

## 目标与范围

### 背景

现有 FastAPI /docs 使用默认 Swagger UI，文档内容和阅读体验尚不适合官网公开入口。API 生产域名为 api.exts.linguio.dev。官网共用 Header 已有产品介绍、更新日志和 GitHub 图标入口，可沿用同一组件体系添加文档链接。

### 目标

- 用户能在 Scalar 中阅读中文接口说明、查看示例并携带自己的令牌调试接口。
- 用户能从官网任意复用 Header 的页面打开生产 API 文档。
- 用户验收反馈要求更换 API 图标，使用已有 Lucide Cable 连接图标，尺寸与交互保持不变。
- 先提供本地可验收效果，不自动部署或发布。

### 范围

- 在 apps/api 接入官方 scalar-fastapi，使用精确 Python 依赖版本和固定版本的 Scalar 前端资源；版本在实施时核对并记录。
- /docs 改用 Scalar，继续读取现有 /openapi.json；关闭被替代的 Swagger 与默认 ReDoc 入口，保留单一文档入口，不另建文档站。
- 补充 /hello 的中文用途、Bearer 授权方式、成功返回模型，以及 401、503 返回说明与示例；保持实际接口行为与返回格式。
- 使用 Scalar 官方默认样式，不做独立主题重设计；前端资源采用固定版本 CDN，不引入第三方请求代理，不预填令牌，不默认持久保存令牌，不启用无关 AI 功能。
- 官网 shared/config/site.ts 集中配置 API 文档 URL 为 https://api.exts.linguio.dev/docs；共用 Header 在 GitHub 前添加 API 文档图标入口，复用既有 Button、Tooltip、尺寸及焦点规则，新标签页打开并提供可访问名称，不重排现有入口。
- 同步 API README 的依赖、资源来源、本地启动与验收说明。

### 排除项

- 不修改数据库、API 鉴权逻辑、令牌、生产域名、Vercel 构建设置或其他业务接口。
- 不在官网中嵌入令牌、数据库连接串，不自动调用受保护接口。
- 不新增产品分类、更新日志条目、产品版本升级或独立文档平台。
- 不保留多个文档 UI，不增加自建组件层或请求代理。
- 不推送、部署、发布或自动创建 Git Commit。

## Todo

- [x] 核对并固定 Scalar Python 包及前端资源版本，补充必要依赖和来源记录。
- [x] 替换 /docs 并补充 OpenAPI 中文说明、模型与响应示例，清理被替代的文档入口。
- [x] 在官网共用 Header 添加 API 文档入口，URL 集中维护并沿用现有控件样式。
- [x] 验证接口逻辑、OpenAPI 与文档路由配置，执行官网必要测试、类型检查和构建，不运行无关三端 build。
- [x] 更新交付记录与验收步骤，停在用户本地效果验收。

## 验收标准

- 本地运行 pnpm api:dev 后，/docs 展示 Scalar，包含 /hello 中文说明、授权入口、请求与响应示例。
- 用户在 Chrome 或 Edge 验证：无令牌或错误令牌调用 /hello 返回 401；正确令牌返回 200 和 database: ok；文档准确说明 503，不人为破坏数据库以制造错误。
- 文档调试请求直达当前 API 服务，不经第三方代理；不预填令牌，不默认持久保存令牌，浏览器由用户验收。
- 官网共用 Header 的 API 文档入口样式与现有入口一致，新标签页打开正式域名 /docs；无需登录即可阅读说明，调用受保护接口仍需令牌。
- 生产 /docs 尚未部署 Scalar 时如实标明；本地通过不等于线上已更新。
- 视觉、布局、键盘与指针交互由用户在 Chrome 或 Edge 验收，代理不新增或运行此类 UI 自动化测试。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

- 对应 [Issue](2026-10-31-api-scalar-docs-issue.md)
- 状态：已完成；用户明确批准代码与交付文档两笔本地提交，完成状态随文档提交归档。

#### 预期交付边界

- 代码：apps/api 中 Scalar 接入、依赖、OpenAPI 文档描述和必要逻辑测试；官网 shared/config/site.ts 与 shared/layout/site-header.tsx 的文档入口。
- 文档：本 Issue、Commit 记录、工作台、API README 和必要的 UI 来源记录。
- 代码与文档最终分开提交；仅在用户明确批准本地提交后执行，不推送或部署。

#### 实际交付

- 官方 scalar-fastapi 固定 1.9.1，前端 @scalar/api-reference 固定 1.76.4 的 jsDelivr standalone.js，未升级其他依赖。
- /docs 使用 Scalar，读取同源 /openapi.json；默认 Swagger、ReDoc 关闭。沿用官方样式，关闭 Agent 与遥测，不启用请求代理、令牌预填和默认认证持久保存。
- /hello 补充中文说明、分组、成功响应模型及 401／503 模型与示例；原有鉴权、数据库查询及响应 JSON 保持不变。
- 官网集中配置正式文档 URL，共用 Header 在 GitHub 前增加 Cable 连接图标（按用户验收反馈替换）、API 文档 Tooltip 与可访问名称，复用原 Button 和 Tooltip，新标签页打开。
- API README 与 Web UI 来源记录同步；未新增官网日志、产品分类或版本变更。

#### 验证结果

- API 6 项测试通过，包含既有 4 项业务行为与新增 OpenAPI 和文档入口检查；新增检查实施前曾因缺少说明及 ReDoc 仍开放而失败。
- 文档 HTML 配置检查通过：固定 CDN、同源 OpenAPI，无代理、预填令牌或认证持久化，Agent 和遥测关闭；固定 CDN 资源可成功获取。
- 官网现有 10 项逻辑测试、pnpm --filter @exts/website typecheck、pnpm web:build 通过；构建产物位于 dist/build/exts-web。
- Starlette 对 httpx 的既有弃用提示保留，不影响测试；未新增 UI 自动化测试，不运行无关三端 build。

#### 用户验收与限制

用户明确要求本地提交完结，不再追加验收或验证。代理未进行浏览器视觉或交互验收，未使用真实令牌执行数据库请求；更换 Cable 后仅核对图标导出可用，未重跑全量构建。文档需要浏览器可访问 jsDelivr；代码已提交，交付文档单独提交，未推送或部署，生产地址尚未更新为 Scalar。

#### 完整 Commit message

##### 本轮建档提交

文件：本 Issue、Commit 记录及工作台队列。

```text
docs(api): 建档 Scalar 文档与官网入口需求

- 明确 Scalar 接入与 Header 入口范围
- 添加配套交付记录和工作台队列
```

上述建档已完成，用户本轮明确批准实现与交付文档本地提交。

##### 实现提交

文件：apps/api/app.py、requirements.txt、tests/test_app.py，以及官网 shared/config/site.ts、shared/layout/site-header.tsx。

```text
feat(api): 接入 Scalar 文档并添加官网入口

- 补充中文接口说明和响应模型
- 固定 Scalar 版本并关闭代理及认证持久保存
- 在官网 Header 添加 API 文档连接图标
```

##### 交付文档提交

文件：API README、本 Issue、Commit 记录、工作台与 docs/web-ui-sources.md。

```text
docs(api): 记录 Scalar 文档与官网入口交付

- 补充本地验收步骤与组件来源
- 记录验证结果并完结当前工作项
```

用户已批准本地提交；代码提交成功后同步 Issue、Commit 记录与工作台为已完成，随文档提交归档，不推送或部署。

## 关联文档

- [工作台](../../readme.md)
- [前置域名 Issue](2026-10-31-api-custom-domain-issue.md)
- [API README](../../../../apps/api/README.md)
- [Scalar FastAPI 官方集成](https://scalar.com/products/api-references/integrations/fastapi)
- [Web UI 来源](../../../web-ui-sources.md)

## 历史补充

### 元信息

- 当前阶段：用户明确批准本地提交完结；代码已提交，完成状态随交付文档提交归档，尚未推送或部署。
- 批准依据：用户同意引入 Scalar 试用效果，并要求在官网 Header 添加入口；随后明确要求先写 Issue。
- 任务规模：小型任务，单一文档访问目标，不创建 Sub-issue、独立 Spec 或 Plan。

### 历史后续事项

本工作项按用户批准本地提交完结。后续获批推送并分别部署 API 与官网后，Header 的正式域名入口才显示 Scalar；本轮不自动推送或部署。
