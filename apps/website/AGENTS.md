# 官网应用约束

- 通用开发与操作规则遵循根 [AGENTS.md](../../AGENTS.md)。
- 官网视觉规则统一维护在 [docs/website/ui.md](../../docs/website/ui.md)，本文件不复制字号、颜色或布局数值。规范草案待确认时，不把草案当作已实施事实。
- 页面和共享组件按已批准规范实施；交付范围与验收状态以当前 Issue 为准。
- /auth/sign-in/ 与 /auth/consent/ 为插件登录的认证托管页，不改变官网首页或要求访客登录；保留 Neon 原始签名查询，由认证服务完成校验，不在页面重建 OAuth 服务或记录授权参数。GitHub/Google 社交登录向所选第三方请求账号选择；此参数属于社交登录请求，不改写插件发给 Neon 的 OIDC 请求。插件先以 URL 片段进入同一登录页，页面仅在当前窗口 sessionStorage 记住提供方并跳转固定 Neon HTTPS 授权端点；缺少引导片段的旧入口默认 GitHub。片段不是身份凭据，不将令牌写入网页存储。使用既有主题和官方 Button，页面设置 no-referrer/noindex，客户端名称不视为可信身份。

- 全部 Web UI 的选型、来源与主题维护遵循根 AGENTS 的 Web UI 原则；源码版本与必要定制集中记录在 [Web UI 来源](../../docs/web-ui-sources.md)。

## 目录职责

- src/entrypoints 仅持有 HTML 与 React 启动；页面及专用组件归 src/pages，真实共用能力归 src/shared，品牌导入资源保留在 src/assets/brand。
- 产品介绍内部使用 pages/products，外部 /features/ 和分类 hash 不变；Vite 页面根移动不改变三页产物、public URL、根 dist 产物和缓存目录。
- src/styles 按原顺序组织主题与公共布局，页面专用 CSS 与所属组件同放；目录迁移不改样式声明、交互或 Tailwind 扫描范围。
