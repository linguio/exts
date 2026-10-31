# 接入 Scalar 文档并添加官网入口

## 元信息

- 工作项：2026-10-31-api-scalar-docs
- 状态：已排队
- 当前阶段：范围已获批准，先完成建档；待当前域名工作项提交完结后实施。
- 批准依据：用户同意引入 Scalar 试用效果，并要求在官网 Header 添加入口；随后明确要求先写 Issue。
- 任务规模：小型任务，单一文档访问目标，不创建 Sub-issue、独立 Spec 或 Plan。

## 背景

现有 FastAPI /docs 使用默认 Swagger UI，文档内容和阅读体验尚不适合官网公开入口。API 生产域名为 api.exts.linguio.dev。官网共用 Header 已有产品介绍、更新日志和 GitHub 图标入口，可沿用同一组件体系添加文档链接。

## 目标

- 用户能在 Scalar 中阅读中文接口说明、查看示例并携带自己的令牌调试接口。
- 用户能从官网任意复用 Header 的页面打开生产 API 文档。
- 先提供本地可验收效果，不自动部署或发布。

## 范围

- 在 apps/api 接入官方 scalar-fastapi，使用精确 Python 依赖版本和固定版本的 Scalar 前端资源；版本在实施时核对并记录。
- /docs 改用 Scalar，继续读取现有 /openapi.json；关闭被替代的 Swagger 与默认 ReDoc 入口，保留单一文档入口，不另建文档站。
- 补充 /hello 的中文用途、Bearer 授权方式、成功返回模型，以及 401、503 返回说明与示例；保持实际接口行为与返回格式。
- 使用 Scalar 官方默认样式，不做独立主题重设计；前端资源采用固定版本 CDN，不引入第三方请求代理，不预填令牌，不默认持久保存令牌，不启用无关 AI 功能。
- 官网 shared/config/site.ts 集中配置 API 文档 URL 为 https://api.exts.linguio.dev/docs；共用 Header 在 GitHub 前添加 API 文档图标入口，复用既有 Button、Tooltip、尺寸及焦点规则，新标签页打开并提供可访问名称，不重排现有入口。
- 同步 API README 的依赖、资源来源、本地启动与验收说明。

## 排除项

- 不修改数据库、API 鉴权逻辑、令牌、生产域名、Vercel 构建设置或其他业务接口。
- 不在官网中嵌入令牌、数据库连接串，不自动调用受保护接口。
- 不新增产品分类、更新日志条目、产品版本升级或独立文档平台。
- 不保留多个文档 UI，不增加自建组件层或请求代理。
- 不推送、部署、发布或自动创建 Git Commit。

## Todo

- [ ] 核对并固定 Scalar Python 包及前端资源版本，补充必要依赖和来源记录。
- [ ] 替换 /docs 并补充 OpenAPI 中文说明、模型与响应示例，清理被替代的文档入口。
- [ ] 在官网共用 Header 添加 API 文档入口，URL 集中维护并沿用现有控件样式。
- [ ] 验证接口逻辑、OpenAPI 与文档路由配置，执行官网必要测试、类型检查和构建，不运行无关三端 build。
- [ ] 更新交付记录与验收步骤，停在用户本地效果验收。

## 验收标准

- 本地运行 pnpm api:dev 后，/docs 展示 Scalar，包含 /hello 中文说明、授权入口、请求与响应示例。
- 用户在 Chrome 或 Edge 验证：无令牌或错误令牌调用 /hello 返回 401；正确令牌返回 200 和 database: ok；文档准确说明 503，不人为破坏数据库以制造错误。
- 文档调试请求直达当前 API 服务，不经第三方代理；不预填令牌，不默认持久保存令牌，浏览器由用户验收。
- 官网共用 Header 的 API 文档入口样式与现有入口一致，新标签页打开正式域名 /docs；无需登录即可阅读说明，调用受保护接口仍需令牌。
- 生产 /docs 尚未部署 Scalar 时如实标明；本地通过不等于线上已更新。
- 视觉、布局、键盘与指针交互由用户在 Chrome 或 Edge 验收，代理不新增或运行此类 UI 自动化测试。

## 关联文档

- [Commit 记录](../commits/2026-10-31-api-scalar-docs-commit.md)
- [工作台](../README.md)
- [前置域名 Issue](2026-10-31-api-custom-domain-issue.md)
- [API README](../../../apps/api/README.md)
- [Scalar FastAPI 官方集成](https://scalar.com/products/api-references/integrations/fastapi)
- [Web UI 来源](../../web-ui-sources.md)

## 唯一下一步

先按仓库流程完成当前域名工作项的验收与提交，再激活本 Issue，核对 Scalar 固定版本并实施本地预览；本轮仅建档。
