# Exts 产品官网

React 静态产品官网，使用 Vite、TypeScript、Tailwind CSS 与 shadcn/ui。页面用途、模块展示、产品介绍、更新日志与下载行为统一见[官网功能说明](../../docs/website/README.md)；主题、排版和布局规则见[官网界面规范](../../docs/website/ui.md)。

## 开发与构建

在仓库根目录执行，使用根配置固定的 Node.js 24.16.0、pnpm 12.4.2：

```sh
pnpm install --frozen-lockfile
pnpm web:dev
```

按开发命令输出的本地地址打开页面。生产构建与逻辑检查分别执行：

```sh
node --test tests/build-release.test.mjs
node --test --test-isolation=none apps/website/tests/pages/home/showcase/card-pool.test.ts apps/website/tests/shared/products/categories.test.ts
pnpm --filter @exts/website typecheck
pnpm web:build
```

产物为根 dist/build/exts-web，Vite 缓存在根 dist/.cache/website/vite；只清理网站自己的生产目录。构建通过 scripts/version.mjs 校验根产品版本，不在网站维护第二份 version。GitHub Pages 后续只运行 web:build，不运行 macOS 专用根 build。

## 工程组织

- src/entrypoints：三个 HTML 和 React 启动入口；Vite 页面根位于此处，外部地址仍为 /、/features/、/changelog/。
- src/pages/home：首页正文及 components 下的文字动效、平台下载入口、展示卡片池等首页专用内容。
- src/pages/products：产品介绍与 Quick Start；内部目录改名，不改变外部 /features/ 地址或分类 hash。
- src/pages/changelog：更新日志页面、时间线和 data.ts 日志数据。
- src/shared/layout：共用 SiteLayout、SiteDocumentLayout、页头和页脚；src/shared/ui：纳入 Git 的官方基础组件。
- src/shared/products/categories.ts：首页／产品页共用分类数据和 hash 解析；src/shared/config/site.ts：站点文案、GitHub 和固定 latest 下载地址；src/shared/lib/utils.ts：样式合并工具。
- src/styles：index.css 统一导入，theme.css 保存原主题声明，layout.css 保存原公共布局和基础样式，声明顺序不变；Tailwind 显式保留原网站扫描范围。
- src/assets/brand：保留已统一的品牌 SVG，public 保留固定 URL 的正式 Exts 资源、favicon 和许可声明；本轮不移动或清理任何品牌文件。
- tests/pages/home/showcase 与 tests/shared/products：原卡片池、分类解析行为测试，随职责迁移保留。
- vite.config.ts、components.json、tsconfig.json、package.json：构建、组件生成、类型与依赖配置；产物及缓存仍位于仓库根 dist。

页面持有专用内容，shared 只放实际共用能力，不新增状态或服务框架。纯 HomePage 转发 App 已移除，三页各自的 SEO、canonical 与 noscript 内容保持。

## 组件与资源

视觉规则统一维护在[官网视觉规范](../../docs/website/ui.md)，包含已批准的主题、排版、间距和共享固定布局。三页使用同一个 SiteLayout 与固定页头页脚；产品介绍与更新日志使用同一个 SiteDocumentLayout，统一阅读宽度、标题及基础排版。各页使用共享 site-shell/site-container 样式，正文及锚点偏移引用相同高度变量，包含设备安全区；实际布局由用户验收。

Tooltip 使用现有 radix-ui 的 Provider、Trigger、Content 与 Portal；提示显示在入口下方，沿用语义颜色和固定页头之上的层级。实际交互由用户验收。全局 html 使用 scrollbar-gutter: stable 预留滚动条空间，减少长短页面切换的横向偏移。

Button 来源于 shadcn 官方 new-york-v4 registry，保持 Radix Slot、variant、size 与 disabled 语义。仅把官方源码的 cn 导入改为本地已固定 clsx、tailwind-merge 工具；未引入新的 cn 包。components.json 保存网站组件生成配置；如使用 CLI，固定为 shadcn@4.21.4，生成后检查源码和依赖，禁止保留浮动版本或直接运行 @latest。

Lucide React 用于通用状态图标，平台与 GitHub 用品牌 SVG。Google Chrome 与 Apple SVG 使用用户提供的原文件，不在运行时读取 Downloads。public/exts.svg 及各尺寸 PNG 沿用根 assets/brand/website 正式派生资源；不重绘或修改源稿。主体与跨平台外形见 [Logo 规范](../../docs/exts-logo.md)。第三方许可证随产物保留在 public/third-party-notices.txt，不作为页脚署名。

## 验证与上线边界

使用类型检查、构建、产物直链核对与现有根构建边界测试；无 API 测试、假 DOM、截图或浏览器交互测试。页面布局、键盘与指针流程、真实下载由用户在 Chrome 验收。

## 官网部署

官网复用 .github/workflows/exts-deploy.yml，Actions 显示名称为 Exts Publish。推送 main 自动构建并部署官网，也支持手动选择 Website；其他分支不自动部署。流程使用固定工具版本执行冻结安装、网站类型检查与 web:build，上传 dist/build/exts-web 后部署 GitHub Pages；检查或构建失败不会执行部署。自动与手动官网部署共用并发组，运行中的部署不会被新请求取消。

首次上线先在仓库 Settings → Pages 将 Source 设为 GitHub Actions，将 Custom domain 保存为 exts.linguio.dev；随后在 DNS 管理平台配置 CNAME：exts → linguio.github.io。使用 Actions 发布时无需在源码添加 CNAME 文件。DNS 检查及证书就绪后开启 Enforce HTTPS。

配置提交并推送到 main 后，官网会自动部署。需要手动重部署时，打开 Actions → Exts Publish → Run workflow，分支选择 main，target 选择 Website。成功后访问 https://exts.linguio.dev/，确认静态资源、页面与原有下载链接。其他分支手动触发会跳过构建和部署。实际网站视觉与交互由用户在 Chrome 或 Edge 验收。

Exts Publish 的 Release 目标由用户从 main 手动触发，生成同一版本的扩展 ZIP、macOS DMG 和一个 Release 草稿；即使扩展没有功能更新也同时生成两包。公开 Release 并设为 Latest 仍由用户验收后操作。自动触发只部署官网；手动触发只执行所选目标。官网依赖固定 latest 下载链接，不需要随产品版本重新部署。

GitHub Pages 使用 workflow 的 GITHUB_TOKEN 与 OIDC，不需要额外 PAT 或部署密钥。仓库或组织的 Actions 策略及 github-pages 环境规则需要允许所用 Actions 与 main 部署；已有审批规则仍需由用户处理。

- [部署 Issue](../../docs/changes/issues/2026-10-11-website-manual-pages-deploy-issue.md)
- [GitHub 官方自定义 workflow 说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

- [项目工作台](../../docs/changes/README.md)
- [设计](../../docs/superpowers/specs/2026-10-11-website-product-homepage-design.md)
- [Plan](../../docs/superpowers/plans/2026-10-11-website-product-homepage.md)
- [构建规范](../../docs/build-release.md)
