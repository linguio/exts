# Exts 产品官网

React 静态产品官网，使用 Vite、TypeScript、Tailwind CSS 与 shadcn/ui。首页显示 Exts 标语、Tabs／Media 叠放示意卡片、Chrome 与 macOS latest 直链入口；页头保留品牌 Logo，独立产品介绍页介绍模块用途，独立 Changelog 页面记录产品进展，页脚为 © 2026 Lin Gui。

## 开发与构建

在仓库根目录执行，使用根配置固定的 Node.js 24.16.0、pnpm 12.4.2：

```sh
pnpm install --frozen-lockfile
pnpm web:dev
```

按开发命令输出的本地地址打开页面。生产构建与逻辑检查分别执行：

```sh
node --test tests/build-release.test.mjs
pnpm --filter @exts/website typecheck
pnpm web:build
```

产物为根 dist/build/exts-web，Vite 缓存在根 dist/.cache/website/vite；只清理网站自己的生产目录。构建通过 scripts/version.mjs 校验根产品版本，不在网站维护第二份 version。GitHub Pages 后续只运行 web:build，不运行 macOS 专用根 build。

## 工程组织

- src/app：React 启动、顶层页面组合与全局设计变量。
- src/pages/home：首页正文布局，组合布局组件与下载模块。
- src/components/layout：SiteLayout 统一装配页头、页脚和正文，SiteDocumentLayout 统一产品介绍与更新日志的阅读框架；src/components/ui：纳入 Git 的 shadcn 基础组件。
- src/features/download：组合 shadcn 平台下载链接。
- src/features/showcase：首页模块示意卡片与轮换行为；assets 为现有扩展书签 SVG 的本地副本，网站不直接依赖扩展业务模块。
- src/pages/changelog：更新日志页面与独立 React 入口；src/features/changelog：静态日志数据与时间线模块。
- src/pages/features：功能介绍页面、独立 React 入口及本地静态模块文案。
- src/config/site.ts：产品文案、GitHub 地址、固定 latest 下载链接与署名。
- src/assets：用户提供的单色 Chrome、Apple 与 GitHub 品牌 SVG；public：已有正式品牌资源、favicon 与第三方许可声明。
- src/lib/utils.ts：class-variance-authority 配合的本地样式合并工具，不提取共享 UI 包。

## 组件与资源

视觉规则统一维护在[官网视觉规范](../../docs/website-ui.md)，包含已批准的主题、排版、间距和共享固定布局。三页使用同一个 SiteLayout 与固定页头页脚；产品介绍与更新日志使用同一个 SiteDocumentLayout，统一阅读宽度、标题及基础排版。各页使用共享 site-shell/site-container 样式，正文及锚点偏移引用相同高度变量，包含设备安全区；实际布局由用户验收。

Tooltip 使用现有 radix-ui 的 Provider、Trigger、Content 与 Portal；提示显示在入口下方，沿用语义颜色和固定页头之上的层级。实际交互由用户验收。全局 html 使用 scrollbar-gutter: stable 预留滚动条空间，减少长短页面切换的横向偏移。

Button 来源于 shadcn 官方 new-york-v4 registry，保持 Radix Slot、variant、size 与 disabled 语义。仅把官方源码的 cn 导入改为本地已固定 clsx、tailwind-merge 工具；未引入新的 cn 包。components.json 保存网站组件生成配置；如使用 CLI，固定为 shadcn@4.21.4，生成后检查源码和依赖，禁止保留浮动版本或直接运行 @latest。

Lucide React 用于通用状态图标，平台与 GitHub 用品牌 SVG。Google Chrome 与 Apple SVG 使用用户提供的原文件，不在运行时读取 Downloads。public/exts.svg 及各尺寸 PNG 沿用根 assets/brand/website 正式派生资源；不重绘或修改源稿。主体与跨平台外形见 [Logo 规范](../../docs/exts-logo.md)。第三方许可证随产物保留在 public/third-party-notices.txt，不作为页脚署名。

## 首页模块展示

正式卡片池只包含 Tabs、Photos，不保留示例卡。最多展示连续三张，少于三张时不重复补卡。自动轮播每次推进池起点，补入下一张，整池循环；点击只临时将当前可见卡片置前，自动下一组仍按原池顺序推进。十张卡片的补位与循环规则通过纯逻辑测试覆盖，无需将假模块加入正式页面。

右侧为独立 Tabs／Media 示意，不是真实截图或业务入口。Tabs 只显示书签 SVG 与底部 Dock；Media 只显示图片和视频占位、月份、“已选 2”和文字“下载”。点击卡片仅置前，不下载媒体。点击与自动切换共用过渡，鼠标点击焦点不会阻止移开后继续轮换。

默认 Tabs 在前，每 3 秒自动轮换；鼠标悬停或键盘焦点进入展示区时暂停，离开后重新计时。两张卡片为原生按钮，可用 Enter/Space 置前；没有底部切换栏。页面隐藏时暂停，减少动态效果时只手动切换，组件卸载清理定时器和监听。窄展示区自动收紧图标与 Dock 尺寸，实际布局由用户验收。

卡片池规则检查：node --test apps/website/tests/showcase/card-pool.test.ts。测试覆盖十张池两轮循环、末尾补位、点击临时置前与小池场景；不覆盖浏览器动画、焦点或布局。

## 更新日志

页头 FileClock 图标以“更新日志”为提示，链接到 /changelog/，点击 Exts 返回首页。首页、changelog/index.html 和 features/index.html 是独立 Vite HTML 入口，共享页头、页脚和样式；正式产物包含三个页面，支持 GitHub Pages 直接访问与刷新，不依赖 SPA 回退或额外路由库。

日志维护在 src/features/changelog/changelog-data.ts，按相关交付 Git 提交的实际时间倒序，日期统一转换为北京时间；同一天按实际提交顺序排列。按年份分组，桌面年份位于最左侧且每组仅显示一次，日期仅显示月日；手机端年份置于该组记录上方。年份可点击返回该年第一条，使用现有 shadcn Button 和原生锚点，具有悬停、按下及焦点反馈。每条只包含事件标题、平台标签和无序列表，无版本号或副标题。平台限定 Website、Chrome、macOS，使用官方 shadcn Badge 的黑底白字样式与小圆角；更新日志入口沿用现有 Button，并使用共享 Tooltip。

首批记录为“产品官网上线”和“Chrome 插件首次发布”；官网条目合并产品介绍、Latest 下载入口与更新时间线，日期按官网完善后的实际交付 Git 提交北京时间确认。日志不会自动从 Git 或 GitHub 生成；修改日志后需手动部署官网，不要求改根产品版本。

## 产品介绍

页头 BookOpen 图标位于更新日志入口旁，链接到 /features/；提示与页面标题均为“产品介绍”。两个入口共用基于现有 radix-ui 的 Tooltip，悬停或键盘聚焦显示名称，取代原生 title，不新增依赖。左侧提供“浏览器扩展”“桌面应用”“协同功能”三个分类，默认展示浏览器扩展；右侧每个模块仅包含标题和一句介绍。

首批内容为 Tabs 与 Photos；协同分类显示“暂无协同功能”，不承诺上线时间。页面不放截图、卡片、能力标签或详细使用步骤。文案维护在 src/pages/features/features-page.tsx，不请求外部数据；已有模块用途改变或新模块交付时再更新。

## 下载行为

构建通过 scripts/version.mjs 校验根产品版本，但不向下载链接注入版本。Chrome 与 macOS 分别使用 https://github.com/linguio/exts/releases/latest/download/exts-chrome.zip、https://github.com/linguio/exts/releases/latest/download/exts-mac.dmg，正式 Release 为 Latest 且包含同名附件时直接转向对应包。

不查询 API、不检查文件存在、不判断下载结果，不添加加载状态或成功/失败提示。用户已知当前 DMG 地址不存在，仍要求开放链接。后续产品版本发布不需要为下载链接重新构建官网；缺少对应附件时不自动回退旧包。源码入口为 https://github.com/linguio/exts。

扩展 ZIP 需解压后在 Chrome 扩展管理页开启开发者模式并选择“加载已解压的扩展程序”，不是 Chrome 商店安装包。此版官网仅标注 Chrome，未宣称 Edge 已通过验收。

## 验证与上线边界

使用类型检查、构建、产物直链核对与现有根构建边界测试；无 API 测试、假 DOM、截图或浏览器交互测试。页面布局、键盘与指针流程、真实下载由用户在 Chrome 验收。

## 手动部署

官网复用 .github/workflows/exts-deploy.yml，Actions 显示名称为 Exts Deploy，目标选择 Website。仅支持手动触发并限制 main；提交代码不会自动部署。流程使用固定工具版本执行冻结安装、网站类型检查与 web:build，上传 dist/build/exts-web 后部署 GitHub Pages；检查或构建失败不会执行部署。同一时间只运行一条官网部署流水线，运行中的部署不会被新请求取消。

首次上线先在仓库 Settings → Pages 将 Source 设为 GitHub Actions，将 Custom domain 保存为 exts.linguio.dev；随后在 DNS 管理平台配置 CNAME：exts → linguio.github.io。使用 Actions 发布时无需在源码添加 CNAME 文件。DNS 检查及证书就绪后开启 Enforce HTTPS。

配置提交并推送到 main 后，用户打开 Actions → Exts Deploy → Run workflow，分支选择 main，target 选择 Website 并手动运行。成功后访问 https://exts.linguio.dev/，确认静态资源、页面与原有下载链接。其他分支触发会跳过构建和部署。实际网站视觉与交互由用户在 Chrome 或 Edge 验收。

Exts Deploy 的 Chrome 目标由用户从 main 手动触发，生成扩展 ZIP 与 Release 草稿；公开 Release 仍由用户审核操作。Website 与 Chrome 每次只执行所选目标，不互相触发。Desktop 当前只显示尚未接入提示，不构建或发布产物。官网依赖固定 latest 下载链接，不需要随产品版本重新部署。

GitHub Pages 使用 workflow 的 GITHUB_TOKEN 与 OIDC，不需要额外 PAT 或部署密钥。仓库或组织的 Actions 策略及 github-pages 环境规则需要允许所用 Actions 与 main 部署；已有审批规则仍需由用户处理。

- [部署 Issue](../../docs/changes/issues/2026-10-11-website-manual-pages-deploy-issue.md)
- [GitHub 官方自定义 workflow 说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

- [当前 Issue](../../docs/changes/issues/2026-10-11-website-product-homepage-issue.md)
- [设计](../../docs/superpowers/specs/2026-10-11-website-product-homepage-design.md)
- [Plan](../../docs/superpowers/plans/2026-10-11-website-product-homepage.md)
- [构建规范](../../docs/build-release.md)
