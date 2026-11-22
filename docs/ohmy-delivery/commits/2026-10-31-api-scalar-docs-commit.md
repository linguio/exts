# Scalar 文档与官网入口交付记录

- 对应 [Issue](../issues/2026-10-31-api-scalar-docs-issue.md)
- 状态：已完成；用户明确批准代码与交付文档两笔本地提交，完成状态随文档提交归档。

## 预期交付边界

- 代码：apps/api 中 Scalar 接入、依赖、OpenAPI 文档描述和必要逻辑测试；官网 shared/config/site.ts 与 shared/layout/site-header.tsx 的文档入口。
- 文档：本 Issue、Commit 记录、工作台、API README 和必要的 UI 来源记录。
- 代码与文档最终分开提交；仅在用户明确批准本地提交后执行，不推送或部署。

## 实际交付

- 官方 scalar-fastapi 固定 1.9.1，前端 @scalar/api-reference 固定 1.76.4 的 jsDelivr standalone.js，未升级其他依赖。
- /docs 使用 Scalar，读取同源 /openapi.json；默认 Swagger、ReDoc 关闭。沿用官方样式，关闭 Agent 与遥测，不启用请求代理、令牌预填和默认认证持久保存。
- /hello 补充中文说明、分组、成功响应模型及 401／503 模型与示例；原有鉴权、数据库查询及响应 JSON 保持不变。
- 官网集中配置正式文档 URL，共用 Header 在 GitHub 前增加 Cable 连接图标（按用户验收反馈替换）、API 文档 Tooltip 与可访问名称，复用原 Button 和 Tooltip，新标签页打开。
- API README 与 Web UI 来源记录同步；未新增官网日志、产品分类或版本变更。

## 验证结果

- API 6 项测试通过，包含既有 4 项业务行为与新增 OpenAPI 和文档入口检查；新增检查实施前曾因缺少说明及 ReDoc 仍开放而失败。
- 文档 HTML 配置检查通过：固定 CDN、同源 OpenAPI，无代理、预填令牌或认证持久化，Agent 和遥测关闭；固定 CDN 资源可成功获取。
- 官网现有 10 项逻辑测试、pnpm --filter @exts/website typecheck、pnpm web:build 通过；构建产物位于 dist/build/exts-web。
- Starlette 对 httpx 的既有弃用提示保留，不影响测试；未新增 UI 自动化测试，不运行无关三端 build。

## 用户验收与限制

用户明确要求本地提交完结，不再追加验收或验证。代理未进行浏览器视觉或交互验收，未使用真实令牌执行数据库请求；更换 Cable 后仅核对图标导出可用，未重跑全量构建。文档需要浏览器可访问 jsDelivr；代码已提交，交付文档单独提交，未推送或部署，生产地址尚未更新为 Scalar。

## 完整 Commit message

### 本轮建档提交

文件：本 Issue、Commit 记录及工作台队列。

```text
docs(api): 建档 Scalar 文档与官网入口需求

- 明确 Scalar 接入与 Header 入口范围
- 添加配套交付记录和工作台队列
```

上述建档已完成，用户本轮明确批准实现与交付文档本地提交。

### 实现提交

文件：apps/api/app.py、requirements.txt、tests/test_app.py，以及官网 shared/config/site.ts、shared/layout/site-header.tsx。

```text
feat(api): 接入 Scalar 文档并添加官网入口

- 补充中文接口说明和响应模型
- 固定 Scalar 版本并关闭代理及认证持久保存
- 在官网 Header 添加 API 文档连接图标
```

### 交付文档提交

文件：API README、本 Issue、Commit 记录、工作台与 docs/web-ui-sources.md。

```text
docs(api): 记录 Scalar 文档与官网入口交付

- 补充本地验收步骤与组件来源
- 记录验证结果并完结当前工作项
```

用户已批准本地提交；代码提交成功后同步 Issue、Commit 记录与工作台为已完成，随文档提交归档，不推送或部署。
