---
date: "2026-10-11"
scope: [website]
status: completed
type: task
---

# 重建 Exts 产品官网

## 当前阶段

已完成。

## 目标与范围

### 背景

现有网站基于 VitePress，包含文档、应用与工具入口。用户要求全部替换为长期维护的 React 产品官网，不沿用旧站页面、导航或框架。官网内容少，但应用入口、基础组件、页面、下载行为、资源和配置必须有明确职责。

### 目标

交付已确认的 Notion 式黑白产品首页及清晰工程结构，按根产品版本提供 Chrome ZIP 与 macOS DMG 直链；为后续 GitHub Pages 与 exts.linguio.dev 部署提供静态产物。

### 范围

- 完整替换 apps/website 的 VitePress 页面、导航、配置与依赖，采用 Vite、React、TypeScript、Tailwind CSS、shadcn/ui Radix 组件及 Lucide React。
- 首页顶部左侧为 Exts，右侧仅 GitHub 图标，链接 https://github.com/linguio/exts。
- 首页中间左侧两行标语为“将想法与能力”“延伸为实用工具”，下方两个同等尺寸的平台按钮；Chrome 使用用户提供的单色 googlechrome.svg，macOS 使用 apple.svg。按钮保留文字，macOS 在前、Chrome 在后；两个按钮使用完全相同的黑底白字、白色平台图标、尺寸与交互样式；两端均可点击，不写“即将推出”，不预检下载结果。
- 中间右侧复用既有正式品牌 logo，静态展示，不加角标。桌面预览参考 logo 220px、标语 42px，实际布局自适应。
- 页脚只写 © 2026 Lin Gui，不添加 Powered by、重复网址或其他产品版权署名。
- 响应式布局；Chrome 入口不宣称未测试的 Edge 兼容。品牌图标使用独立 SVG，Lucide 用于适合的通用界面图标。
- 使用 scripts/version.mjs 读取并校验根 package.json 的 version，构建时注入网站，分别拼接 v<版本>/exts-chrome-<版本>.zip 与 v<版本>/exts-mac-<版本>.dmg；使用普通链接直接访问，不请求 GitHub API、不判断附件存在或下载结果，不显示成功/失败提示。
- 保持根 web:dev、web:build 命令及网站包名；产物在根 dist/build/exts-web，缓存在根 dist/.cache/website。同步网站 README、相关构建规范和依赖锁文件。
- 配置标题、描述、favicon、分享元信息；采用批准的精确版本，不升级 extension、desktop 或无关工具。

### 排除项

- 不部署 GitHub Pages，不修改 Actions、DNS、域名或 HTTPS；此交付提交完成后另立部署 Issue。
- 不构建或发布 macOS 安装包，不增加动画、多语言、深色模式、登录、数据库、后台或新业务页面。用户已知当前 DMG 地址不存在，仍明确批准开放链接。
- 不更改品牌源稿、不重绘平台图标、不重新生成三端品牌资源，不删除 archive/apps 或历史项目文档。
- 不预建空模块、路由系统、全局状态库或共享 UI 包。
- 不执行浏览器视觉、布局、焦点或指针验收，不新增假 DOM、截图或同类交互测试；不移除其他应用测试。
- 不自动提交、推送或创建远程 Release。

## Todo

- [x] 审核书面设计并批准精简实施 Plan。
- [x] 建立网站应用结构及固定版本依赖，接入 shadcn 基础 UI 与现有资源。
- [x] 实现批准的首页与根版本 Chrome/macOS 直接下载链接。
- [x] 删除被替代的 VitePress 实现，同步命令说明与必要构建集成。
- [x] 完成冻结安装、类型检查、网站构建与受影响构建边界检查，核对生产产物中的两端版本直链。
- [x] 整理交付文件、验证结果和用户可复现验收步骤，停在用户验收。

## 验收标准

- 首页内容、按钮状态与署名符合范围；桌面左右布局，窄屏重排且内容可读，以用户 Chrome 实际验收为准。
- shadcn Button 是真实接入的项目组件；基础 UI、页面布局和下载逻辑职责独立，源码及生成配置纳入 Git。
- Chrome 与 macOS href 分别为根 version 对应的 GitHub ZIP/DMG 地址；没有 API 查询、预检、加载状态或结果提示。
- macOS 和 Chrome 均可点击，GitHub 链接进入指定仓库，平台与品牌资源不被重绘；页面不声称附件已成功下载。
- VitePress 活动实现及网站依赖被移除；网站命令保持可用，构建路径符合根规范，不清理其他端产物。
- 所有新增依赖与 CLI 使用完整精确版本，锁文件一致；必要逻辑测试、类型检查和构建通过，实际视觉与交互验收仍由用户完成。

## 唯一下一步

无。

## 交付记录

### 阶段交付与验证

- React/shadcn 首页与下载功能已实施；原网站 5 个 VitePress 配置与页面文件及对应依赖已移除，历史文档与归档保留。
- 已有构建发布边界测试 13/13 通过；简化后重新执行冻结安装、类型检查与网站生产构建，并核对两端直链。API 逻辑与对应测试已删除，不为字符串拼接新增镜像测试。
- 当前根版本 1.0.0 已注入两端链接；以后修改根版本并重新构建/部署网站即可更新。Tag 与附件命名需继续遵守现有规范。
- 锁文件仅网站 importer 变化，移除 81 个 VitePress 独占 package/snapshot 条目；其他 importer、保留条目与包管理器锁文档不变。
- 使用官方 pnpm 12.4.2 临时二进制执行命令；本机 Volta 全局 pnpm 为 12.4.1，未修改全局工具。正常安装执行 extension 的 wxt prepare，未绕过 postinstall。
- 用户于 2026-10-11 明确批准移除 API 与所有下载判断，改用根版本直链，并开放 macOS。当前 Chrome 1.0.0 ZIP HTTP 检查为 200；DMG 不存在为用户已知情况，未预检或阻止其链接。
- 未执行浏览器视觉、布局、焦点或指针验收；未部署域名，未创建 Git Commit 或推送。验收步骤详见 Commit 记录。

### 历史交付记录

#### 对应 Issue

- [Issue](2026-10-11-website-product-homepage-issue.md)

#### 预期交付边界

完整替换网站 VitePress 实现，建立明确职责的 React 工程与已确认的产品首页；接入 shadcn、静态品牌资源和按根产品版本生成的 Chrome/macOS 下载直链。保留现有根命令与产物规范，不包含部署、DNS 或其他应用修改。

#### 实际交付

- 使用 Vite、React、TypeScript、Tailwind 和 shadcn Radix Button 完整替换网站 VitePress 实现；应用入口、首页、布局、基础 UI、资源、配置和下载功能按职责组织。
- 首页按已认可的布局显示 Exts、GitHub 图标、两行标语、静态正式 logo、Chrome/macOS 平台按钮与 © 2026 Lin Gui；macOS 在前、Chrome 在后，均为相同黑底白字按钮和白色图标；两个入口都可点击，不添加即将推出、Powered by 或网址。
- 构建时读取并校验根 package.json 的 version，再注入网站生成对应 v<版本> 的 ZIP/DMG 直链。按用户最新要求移除 API、请求、加载状态、预检与结果提示，macOS 同时开放。
- 使用用户提供的单色 Chrome/Apple SVG、既有 GitHub SVG 与正式品牌资源；shadcn Button 手工接入官方 registry 源码，只替换为本地 cn 工具导入，未运行 CLI 或新增 cn 依赖。
- 固定批准的依赖版本，移除 VitePress 独占依赖；保留根 web:dev、web:build、网站产物与缓存规范，并同步文档和第三方许可文本。

#### 验证结果

- 正常安装使用 pnpm 12.4.2 完成，extension postinstall 的 wxt prepare 正常执行；阶段冻结安装通过，未使用忽略脚本或其他绕过措施。
- 最终版本已删除不再使用的 API 与对应测试，并移除网站 Vitest 依赖。简单直链不新增镜像测试，使用实际构建产物核对根版本注入和两个地址。
- 网站 TypeScript --noEmit 通过，根 pnpm web:build 入口成功；产物为 dist/build/exts-web，JS 258.17 kB（gzip 81.52 kB）、CSS 17.10 kB（gzip 4.07 kB）。
- node --test tests/build-release.test.mjs：13/13 通过，未运行无关扩展或桌面全量构建。
- 锁文件只更新 apps/website importer，移除 81 个不再需要的 package/snapshot 条目；其余 importer、保留依赖对象与 pnpm 包管理器锁文档一致。
- 用户 SVG 与 Downloads 原文件逐字节一致，public 品牌资源与根正式网站资源逐字节一致；构建 index.html 引用的全部本地资源及许可声明存在，旧网站 apps/docs 路径未残留在新产物。
- 用户要求两个黑色按钮一致且 macOS 在前后，生产构建再次通过；此轮只改变样式和顺序，未新增测试或重复无关验证。
- git diff --check 通过；按 React 组件职责、状态、访问名称与真实按钮/链接语义进行代码自查，遵循仓库禁止子代理规则，未声称独立审查或浏览器验收完成。

#### 未验证事项与限制

当前根版本 1.0.0 的 Chrome ZIP 地址经 HTTP HEAD 检查返回 200，Content-Type 为 application/octet-stream，大小 227279 字节；此检查不等于浏览器成功下载或安装。用户明确知道 macOS DMG 当前不存在，仍批准开放该版本直链。页面按用户要求不判断下载结果。

页面视觉、窄屏布局、键盘/焦点/指针与实际安装由用户在 Chrome 验收。页面主体依赖 JavaScript，禁用 JavaScript 时 HTML 提供 Releases 替代链接。根 GitHub Pages、DNS 和 HTTPS 尚未部署，属于后续独立 Issue。

本机 Volta 全局 pnpm 为 12.4.1，根配置要求 12.4.2；普通入口曾因版本接管无输出。此次下载并校验官方 12.4.2 原生包到 /private/tmp/exts-website-tools，使用该包与固定 Node 24.16.0 完成正常安装和验证，未改变全局安装或版本配置。

#### 可复现验收

1. 仓库根运行 pnpm web:dev，在 Chrome 打开命令输出的地址。若本机 Volta pnpm 仍无输出，可在当前机器使用已验证的临时入口：env PATH=/private/tmp/exts-website-tools:/Users/kevin/.volta/tools/image/node/24.16.0/bin:/usr/bin:/bin:/usr/sbin:/sbin /private/tmp/exts-website-tools/pnpm web:dev；临时目录可能在系统清理后失效，此时需重新准备仓库指定的 pnpm 12.4.2，不能改成浮动版本。
2. 确认左上为 Exts、右上只有 GitHub 图标；正文为两行标语，右侧为静态现有 logo；底部只有 © 2026 Lin Gui。
3. 确认下载按钮顺序为 macOS、Chrome；两者同为黑底白字，图标为白色 Apple/Chrome；均为可点击链接，没有禁用、即将推出或下载状态提示。
4. 点击 GitHub 图标应进入 https://github.com/linguio/exts；Chrome 与 macOS 按钮都可点击，对应根版本的 ZIP/DMG 直链。当前版本 1.0.0；Chrome 链接为 https://github.com/linguio/exts/releases/download/v1.0.0/exts-chrome-1.0.0.zip，macOS 链接为同目录 exts-mac-1.0.0.dmg。
5. 点击后由浏览器直接访问附件地址，不先请求 api.github.com；页面不显示下载成功或失败。macOS 附件当前不存在是已批准状态，不作为本次验收失败条件。
6. 解压下载 ZIP，在 chrome://extensions 开启开发者模式并选择“加载已解压的扩展程序”，确认文件为预期扩展。此项不把 ZIP 下载等同于成功安装。
7. 调整 Chrome 窗口至窄屏，确认内容重排且可读；实际布局与交互由用户判断，不由自动化测试代替。

#### 用户验收

已通过：用户于 2026-10-11 在阶段交付及按钮样式、顺序调整后表示“可以了”，并要求拆分 Commit。代理未独立执行浏览器视觉或交互验收。

#### 最终交付状态

已完成；本记录、Issue 与工作台终态随最终交付 Commit 一并提交，不保存 Commit SHA。提交失败时恢复待提交与待批准。

#### 最终提交批准

已批准：用户于 2026-10-11 确认两次本地 Commit 的拆分范围与标题；执行前已展示完整正文。用户随后明确要求“提交到本地”；批准包括最终交付提交前将 Issue、Commit 记录与工作台结项的机械性更新，不包含推送、部署或开始第二个 Issue。

#### 最终 Commit message

本记录仅对应第二次最终交付 Commit；第一次为独立批准的规划文档 Commit，不保存其 SHA。用户已批准本地提交：

```text
feat(website): 重建 Exts 产品官网与平台下载入口

- 使用 React 与 shadcn 替换 VitePress 并明确网站模块职责
- 按根产品版本生成 Chrome 与 macOS 下载直链
- 固定依赖版本并同步构建说明、验证与验收记录
```

## 关联文档

- [设计](../../../superpowers/specs/2026-10-11-website-product-homepage-design.md)
- [Plan](../../../superpowers/plans/2026-10-11-website-product-homepage.md)
- [构建与分发规范](../../../build-release.md)
- [插头 Logo 规范](../../../exts-logo.md)

## 历史补充

### 元信息

- 类型：架构任务；仅替换网站应用与构建框架，一个独立交付 Issue，不拆 Sub-issue
- 当前阶段：用户已验收并明确批准两次本地 Commit，随最终交付提交结项
- 用户批准：用户明确要求完整重构 apps/website，确认首页预览、最终文案、平台按钮、GitHub Release 下载策略、工程组织与版本清单；2026-10-11 分别在设计与 Plan 交付后要求继续，已批准串行实施，未批准 Git Commit 或部署

### 历史后续事项

无；当前 Issue 随最终交付 Commit 结项，用户尚未要求开始后续域名部署 Issue，不推送。
