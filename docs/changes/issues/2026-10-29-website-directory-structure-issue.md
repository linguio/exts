# 整理官网入口页面与共享目录

## 元信息

- 工作项：2026-10-29-website-directory-structure
- 状态：待验收
- 当前阶段：基于远端最新 main 完成官网目录迁移，10 项官网测试、19 项根构建测试、类型与构建通过，等待用户验收；未提交。
- 批准范围：整理 apps/website 目录、归属及必要引用；用户追加批准单独修正 Extension components.json 的通用组件别名。不改变功能、文案、外观、交互、访问地址或依赖。
- 任务规模：单一目录整理目标，一个 Issue，以本文件 Todo 说明实施顺序。

## 背景与目标

最新 main 已完成扩展模块整理及官网品牌资源整理。本项从该基础重新实施，不恢复被放弃的本地两笔提交，不重复处理已归位的品牌资源。官网仍存在入口方式不一致、页面专用内容分散及 features 名称含义冲突。

## 目录决定与范围

- src/entrypoints 集中三个 HTML 与 React 启动入口；Vite 页面根随之适配，保持 /、/features/、/changelog/ 以及 public URL、根 dist 产物及缓存路径。
- src/pages/home 持有首页、binary-text、平台下载入口及 showcase；src/pages/products 持有产品介绍与 Quick Start，对外仍为 /features/；src/pages/changelog 集中页面、时间线及日志数据。
- src/shared 持有真实共用的 layout、ui、config/site.ts、products/categories.ts、lib/utils.ts。src/assets/brand 和 public 保留远端原样，不能恢复已清理的 SVG 副本或未引用资源。
- src/styles 由 index、theme、layout 按原声明顺序拆分旧 styles.css，并显式保持 Tailwind 原扫描范围。
- 删除只转发 HomePage 的无状态 App，三个启动入口保留 StrictMode；原测试按对应页面／共享职责迁移，不删除行为覆盖。
- 同步 Vite、components.json、应用 README／AGENTS 及现行官网文档的引用；不改历史交付文档。

## 排除项

- Extension 仅修正 components.json 的 components 别名，不重构模块；不修改 Desktop、根品牌源稿、产品版本、依赖、部署流程或其他工作项。
- 不引入 SPA、路由库、模板引擎、Store 或新架构；HTML 公共头只保留已有重复，不抽象新生成层。
- 不改产品数据、SEO、下载链接、hash、CSS 数值、类名、动画逻辑或组件交互，不做无关命名重构。
- 不执行截图、布局、焦点、指针或浏览器视觉／交互验收，不引入假 DOM 或源码形状测试；不启动 dev/watch。
- 不自动提交或推送。

## Todo

- [x] 保存最新 main 的必要源码、HTML、CSS 与资源基准，列明实际路径映射。
- [x] 集中入口并迁移页面与共享代码，适配 Vite 和组件生成配置，保留品牌成果。
- [x] 原样拆分样式、迁移测试引用并同步当前目录说明，清理旧空目录及纯转发。
- [x] 运行现有官网逻辑测试、根构建边界、类型检查与生产构建，核对三页及资源等价性。
- [x] 记录实际结果、冗余判断与限制，停在用户验收。

## 验收标准

- 官网目录职责清晰，入口与页面不再散落，已批准调整外无其他业务变化。
- /、/features/、/changelog/、现有分类 hash、SEO、noscript、下载链接和公共资源保持。
- 品牌资源与 public 指纹不变，源码正文只作必要导入／启动路径适配；原样式声明和生成 CSS 保持。
- 现有测试覆盖、类型检查和构建通过；浏览器页面显示、导航、分类与展示效果由用户自行验收，不以自动化结果代替验收。

## 实际冗余核对

- 纯 HomePage 转发 App 已移除，三个启动入口统一组织并保留 StrictMode。
- 首页专用下载、动效和展示归入 home/components；日志页面、时间线与数据集中；分类数据因跨页共用保留在 shared/products。
- SiteLayout 与 SiteDocumentLayout 具有全站壳／阅读布局的不同职责，保留组合；没有为减少文件而合并不同职责。
- 最新 main 已完成品牌 SVG 合并和无引用资源清理，本项不重复处理，未恢复任何已删除的资源。
- 独立 HTML 的 SEO／canonical／noscript 虽有相似结构但有页面语义，保留现状，不新增模板引擎。内部组件函数名不作无关重命名。

## 验证结果与限制

- 原官网卡片池／分类解析测试 10 项通过，根构建／分发边界 19 项通过，TypeScript 类型检查、Vite 生产构建和 diff 检查通过。
- 32 个迁移文件源码正文核对一致（仅入口／导入路径适配），CSS 声明和顺序可无损拼回；迁移后两份构建 CSS 与本轮最新 main 基准逐字节一致。
- 三页 HTML 正文与 SEO 在忽略换行和生成资源标签后相同；23 个本地资源引用存在，品牌与 public 指纹一致，public 产物一致。
- 官网迁移验证时 Extension 无 diff；随后用户追加批准仅修正其 components.json 的 components 别名，单独验证配置。品牌资源、public、package.json、锁文件不变。未恢复旧本地提交，所有迁移从最新 main 实施。
- Vite 页面根改为 src/entrypoints；Tailwind source 显式维持原网站扫描范围，产物和缓存仍在根 dist。
- 构建和根测试使用已确认可用的执行环境，避免沙箱原生依赖／子进程限制；不重装依赖，不修改测试规避环境问题。
- 未执行浏览器视觉、布局、动画、导航或真实下载验收，不启动 dev/watch，未部署或提交；自动化结果不代替用户验收。

## 用户验收步骤

1. 在仓库根运行原命令 pnpm web:dev，用输出地址访问 /、/features/、/changelog/，分别直接打开和刷新。
2. 检查三页页头页脚和导航、首页文字动效与卡片展示，预期与改造前一致。
3. 检查首页分类卡片与 /features/#quick-start、#extension、#desktop、#packages、#skills，未知 hash 仍回到快速开始。
4. 检查产品说明、日志和下载链接目标不变；是否实际下载由用户决定。

## 关联文档

- [Commit 记录](../commits/2026-10-29-website-directory-structure-commit.md)
- [工作台](../README.md)
- [已完成的官网品牌资源整理](./2026-10-29-website-brand-assets-issue.md)

## 唯一下一步

等待用户按上述步骤验收；未批准本轮提交，不自动提交、推送或开始其他改造。
