---
date: "2026-10-29"
scope: [website, extension]
status: completed
type: task
---

# 整理官网入口页面与共享目录

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

最新 main 已完成扩展模块整理及官网品牌资源整理。本项从该基础重新实施，不恢复被放弃的本地两笔提交，不重复处理已归位的品牌资源。官网仍存在入口方式不一致、页面专用内容分散及 features 名称含义冲突。

### 排除项

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

### 用户验收步骤

1. 在仓库根运行原命令 pnpm web:dev，用输出地址访问 /、/features/、/changelog/，分别直接打开和刷新。
2. 检查三页页头页脚和导航、首页文字动效与卡片展示，预期与改造前一致。
3. 检查首页分类卡片与 /features/#quick-start、#extension、#desktop、#packages、#skills，未知 hash 仍回到快速开始。
4. 检查产品说明、日志和下载链接目标不变；是否实际下载由用户决定。

## 唯一下一步

无。

## 交付记录

### 验证结果与限制

- 原官网卡片池／分类解析测试 10 项通过，根构建／分发边界 19 项通过，TypeScript 类型检查、Vite 生产构建和 diff 检查通过。
- 32 个迁移文件源码正文核对一致（仅入口／导入路径适配），CSS 声明和顺序可无损拼回；迁移后两份构建 CSS 与本轮最新 main 基准逐字节一致。
- 三页 HTML 正文与 SEO 在忽略换行和生成资源标签后相同；23 个本地资源引用存在，品牌与 public 指纹一致，public 产物一致。
- 官网迁移验证时 Extension 无 diff；随后用户追加批准仅修正其 components.json 的 components 别名，单独验证配置。品牌资源、public、package.json、锁文件不变。未恢复旧本地提交，所有迁移从最新 main 实施。
- Vite 页面根改为 src/entrypoints；Tailwind source 显式维持原网站扫描范围，产物和缓存仍在根 dist。
- 构建和根测试使用已确认可用的执行环境，避免沙箱原生依赖／子进程限制；不重装依赖，不修改测试规避环境问题。
- 未执行浏览器视觉、布局、动画、导航或真实下载验收，不启动 dev/watch，未部署；按用户要求本地提交完结，未执行的浏览器实测不记为通过。

### 历史交付记录

#### 对应工作项

- [Issue](2026-10-29-website-directory-structure-issue.md)

#### 预期交付边界

基于远端最新 main，仅整理官网目录、必要引用、构建入口路径、测试与现行说明；保留已完成的品牌资源整理，不恢复旧本地提交，不改变业务与外观。代码与文档最终分别展示，不自动提交。

#### 实际交付

- 追加批准：Extension 仅将 components.json 的 components 别名从 Newtab 改为 @/shared，不迁移模块；该配置修正单独提交。JSON 解析、四项别名和目标路径、主题 CSS 存在性检查通过，diff 确认仅一行配置改变。最初检查脚本因子进程权限限制无法调用 Git，改为直接检查配置并用独立 Git diff 核对后通过；未执行组件生成或扩展构建。

该追加修正的已批准提交消息：

```text
chore(extension): 修正通用组件生成目录别名

- 将通用组件生成位置从 Newtab 调整为 shared
```
- 基于已同步远端的最新 main 迁移 32 个路径：entrypoints 统一启动、pages 持有专用内容、shared 归置跨页能力，移除纯 App 转发。
- styles 按原声明拆分，Vite 与组件生成路径作必要适配，原测试迁移保持覆盖；根产物／缓存及三页 URL 不变。
- 品牌 SVG 与 public 保持最新 main 原样，未恢复旧本地改造或复制已清理资源。
- 更新应用 README／AGENTS 与现行路径文档，不修改其他应用、功能文案、样式声明、依赖或产品版本。

#### 验证与限制

- 10 项官网逻辑测试通过：node --experimental-strip-types --test --test-isolation=none apps/website/tests/pages/home/showcase/card-pool.test.ts apps/website/tests/shared/products/categories.test.ts。
- 19 项根构建边界通过：node --test --test-isolation=none tests/build-release.test.mjs。
- 官网目录执行 node node_modules/typescript/bin/tsc --noEmit 和 node node_modules/vite/bin/vite.js build，通过；git diff --check 通过。
- 32 个迁移文件正文等价，CSS 原声明顺序无损；两份生成 CSS 与最新 main 基准字节一致，三页 HTML 正文和 SEO 等价（忽略换行与生成资源标签），23 处资源引用存在。
- 品牌／public 源码和 public 产物指纹一致；官网迁移验证时 Extension 无变更，后追加批准一行别名修正；品牌、public、package.json、锁文件无变更。
- 基准及最终构建、根测试在已确认可用环境执行，无依赖重装；真实浏览器视觉、导航、动画和下载未实测；按用户要求本地提交完结，未推送或部署。

#### 用户验收

用户于 2026-10-29 明确要求本地提交完结；浏览器未实测，不记为通过。

#### 文件边界与完整 Commit message

- 代码：官网 src 的入口／页面／共享／样式目录迁移、三个 HTML、Vite 和 components.json 配置适配、两份原有测试迁移。品牌、public、依赖和其他应用不在修改范围。
- 文档：apps/website/README.md、apps/website/AGENTS.md、docs/website/README.md、docs/website/ui.md、docs/web-ui-sources.md、本 Issue、Commit 记录及工作台。
- 以下完整消息已获用户本地提交指令批准。

```text
refactor(website): 基于最新主线整理官网目录职责

- 集中三页入口并归位页面专用与共享内容
- 原样分离主题布局并调整构建和测试路径
- 保留品牌资源与现有访问地址和页面行为
```

```text
docs(website): 同步官网目录与等价验证记录

- 更新入口页面共享能力的职责与路径说明
- 记录最新主线上的迁移结果及验收边界
```

#### 最终提交批准

用户于 2026-10-29 明确要求 commit，批准代码与文档本地提交并完结；不推送。

#### 完成状态补充提交

代码及交付文档已本地提交，首次终态脚本未成功执行，本笔仅补充 Issue、Commit 记录和工作台的完成状态，不修改代码，不追加验证。

完整 Commit message：

    docs(website): 完结目录整理工作项状态

    - 同步 Issue 交付记录与工作台为已完成

## 关联文档

- [工作台](../../readme.md)
- [已完成的官网品牌资源整理](2026-10-29-website-brand-assets-issue.md)

## 历史补充

### 元信息

- 当前阶段：基于远端最新 main 完成官网目录迁移，10 项官网测试、19 项根构建测试、类型与构建通过，用户于 2026-10-29 要求本地提交完结，代码与文档已提交；浏览器实测限制保留。
- 批准范围：整理 apps/website 目录、归属及必要引用；用户追加批准单独修正 Extension components.json 的通用组件别名。不改变功能、文案、外观、交互、访问地址或依赖。
- 任务规模：单一目录整理目标，一个 Issue，以本文件 Todo 说明实施顺序。

### 目录决定与范围

- src/entrypoints 集中三个 HTML 与 React 启动入口；Vite 页面根随之适配，保持 /、/features/、/changelog/ 以及 public URL、根 dist 产物及缓存路径。
- src/pages/home 持有首页、binary-text、平台下载入口及 showcase；src/pages/products 持有产品介绍与 Quick Start，对外仍为 /features/；src/pages/changelog 集中页面、时间线及日志数据。
- src/shared 持有真实共用的 layout、ui、config/site.ts、products/categories.ts、lib/utils.ts。src/assets/brand 和 public 保留远端原样，不能恢复已清理的 SVG 副本或未引用资源。
- src/styles 由 index、theme、layout 按原声明顺序拆分旧 styles.css，并显式保持 Tailwind 原扫描范围。
- 删除只转发 HomePage 的无状态 App，三个启动入口保留 StrictMode；原测试按对应页面／共享职责迁移，不删除行为覆盖。
- 同步 Vite、components.json、应用 README／AGENTS 及现行官网文档的引用；不改历史交付文档。

### 实际冗余核对

- 纯 HomePage 转发 App 已移除，三个启动入口统一组织并保留 StrictMode。
- 首页专用下载、动效和展示归入 home/components；日志页面、时间线与数据集中；分类数据因跨页共用保留在 shared/products。
- SiteLayout 与 SiteDocumentLayout 具有全站壳／阅读布局的不同职责，保留组合；没有为减少文件而合并不同职责。
- 最新 main 已完成品牌 SVG 合并和无引用资源清理，本项不重复处理，未恢复任何已删除的资源。
- 独立 HTML 的 SEO／canonical／noscript 虽有相似结构但有页面语义，保留现状，不新增模板引擎。内部组件函数名不作无关重命名。

### 历史后续事项

本工作项按用户明确要求本地提交完结，无待实施步骤，不自动推送。
