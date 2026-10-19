# 构建、版本与本地分发规范

三端产品共用根版本，开发命令保持独立；最终产物及可配置的构建缓存统一生成在仓库根 dist。本文是命令、产物路径和版本消费规则的维护入口，本次双包发布接入状态见 [Issue](changes/issues/2026-10-19-repo-desktop-first-release-issue.md)。

## 唯一产品版本

只手动修改根 package.json 的 version，初始版本为 1.0.0。scripts/version.mjs 是所有需要产品版本的步骤共用的读取与校验入口，不改写文件、不自动升级、不从环境变量、子应用、Git 标签或默认值获取替代版本。

版本必须为三段数字，主版本范围 1–9999，次版本和修订版本范围 0–99；无前导零和预发布后缀。同一值用于扩展 Manifest、桌面营销版本、桌面构建编号及 Release Tag；ZIP/DMG 附件文件名固定，不包含版本。内部工具包和第三方依赖版本独立维护，不参与产品版本同步。

从产品 1.2.0 起，extension 和 desktop 统一构建与发布。每次新产品发布前提升根 version；即使某端没有代码改动，两端仍一起重新构建、使用同一新版本并上传到同一份 Release。历史版本不补包、不覆盖；Website 部署和 NPM 发布保持独立。

```sh
node scripts/version.mjs
```

成功只输出根版本；读取或校验失败返回非零退出码。统一构建捕获本次版本，再让下游核对根版本一致，防止构建期间修改版本导致混合产物。传递的 EXTS_BUILD_VERSION 只用于一致性检查，不能覆盖根版本。

## 根命令

公开 npm 工具包独立于应用构建与产品 Release；当前 `@linguio/wxt-stable-output` 使用包目录中的精确版本，扩展消费 npm 官方 registry 的精确 `1.0.1`，本地工具源码仅用于维护与发布。手动发布流程、首次发布与账号配置见 [npm 工具包发布与验收](./npm-release.md)，不通过根 build/release 发布 npm。

| 命令 | 用途 | 支持平台 |
|---|---|---|
| pnpm web:dev | 网站开发服务 | Windows、macOS |
| pnpm ext:dev | 扩展开发服务及稳定开发产物 | Windows、macOS |
| pnpm desk:dev | 构建并打开独立桌面开发应用 | macOS |
| pnpm web:build | 单独构建网站 | Windows、macOS |
| pnpm ext:build | 单独构建正式扩展 | Windows、macOS |
| pnpm ext:release | 独立构建并校验 Chrome 扩展 ZIP | Windows、macOS、Linux |
| pnpm desk:build | 单独构建正式桌面应用 | macOS |
| pnpm build | 串行构建 website、extension、desktop | macOS |
| pnpm release | 完整构建后生成本地 ZIP、DMG | macOS |

没有统一 dev 命令。非 macOS 的根 build/release 和 desktop dev/build 在启动构建前明确报错并退出，不静默跳过桌面。根 release 不自动提交、打 Git 标签、推送、部署或上传发布。

根 scripts/ 只维护 version.mjs、build.mjs、release.mjs；根入口负责公共规则和调度，应用内部脚本负责各端实现，不为小型辅助函数继续拆文件。

## 根 dist 布局

```text
dist/
├─ .cache/
│  ├─ extension/chrome-mv3-dev/
│  ├─ desktop/DerivedData/
│  └─ website/
├─ dev/
│  ├─ chrome-mv3-dev-stable/
│  └─ exts-dev.app/
├─ build/
│  ├─ exts-web/
│  ├─ chrome-mv3/
│  └─ exts.app/
└─ release/
   ├─ exts-chrome.zip
   └─ exts-mac.dmg
```

- 应用内部不再生成 dist 或 DerivedData；dist 不纳入 Git。每端仅清理、更新自己的目标，禁止清空公共 dist、dev、build 或 release。
- 网站和正式扩展直接输出到根 build，没有一份应用内部的正式副本。
- 扩展临时重建输出在根 .cache/extension，成功后由公共稳定发布 hook 更新根 dev 稳定目录。两份目录分别用于构建和加载，不能合并；失败保留上一份稳定版本。
- 桌面在根 .cache/desktop/DerivedData 编译，完整 .app 校验后发布到根 dev 或 build。桌面编译缓存、符号产物不复制到最终目录。
- 网站开发不生成单独的 dev 分发目录。React 网站使用 Vite 构建，Vite 缓存放在根 dist/.cache/website/vite，生产产物仍为根 dist/build/exts-web。
- .wxt 类型目录、node_modules 及工具在依赖目录内部的缓存仍按工具约定保留；它们不是浏览器加载、运行、部署或分发的产物。
- 调整输出位置后，应停止并重新启动此前的开发命令，避免旧进程继续使用旧配置；扩展应重新加载新的稳定目录。

## 网站自动部署

```text
工作目录：仓库根
构建命令：pnpm web:build
发布目录：dist/build/exts-web
```

部署完整目录，包括 index.html 和资源。固定路径不带版本号，不要求部署平台构建桌面或扩展。配置这些值即可；本规范不创建外部部署服务。

## 桌面身份与数据

| 项目 | 开发版 | 正式版 |
|---|---|---|
| 文件 | exts-dev.app | exts.app |
| 展示名 | Exts Dev | Exts |
| Bundle Identifier | dev.linguio.exts.dev | dev.linguio.exts |
| 默认下载目录 | ~/Downloads/Exts Downloads/Photos | ~/Downloads/Exts Downloads/Photos |
| 缩略图缓存目录 | ~/Library/Application Support/Exts Dev/Thumbnails | ~/Library/Application Support/OhMy Photos/Thumbnails |

两种模式共用代码，Organization Identifier 为 dev.linguio。默认下载使用用户批准的 Exts Downloads/<功能名> 规则，Photos 在开发和正式版共用目录，同名文件不覆盖；旧下载目录不自动迁移、复制或删除。配置和缩略图缓存保留各自身份及旧路径。当前未使用的数据库和凭据设施不预建，后续新增时须接入同样身份边界。

project.yml 是原生配置入口，desk 命令先用 XcodeGen 生成工程再构建并传入根版本；不要依赖尚未重新生成的旧工程直接验证新身份。桌面 dev 构建后打开应用，不提供源码自动热更新。

官网固定使用 https://github.com/linguio/exts/releases/latest/download/exts-chrome.zip 与 exts-mac.dmg 对应地址，不查询 API、不使用网站构建版本拼接。正式发布必须设置 Latest 并同时包含两个固定附件；历史仅含扩展的 Release 不补传或覆盖。发布新产品版本无需为下载地址重新构建官网。

## 分发包

附件固定为 exts-chrome.zip、exts-mac.dmg，不上传带版本号副本；包内版本仍取根版本；Tag 使用 v<版本>，Release 标题使用 Exts <版本>。从 1.2.0 起每次新 Release 都从同一提交生成两包，即使某端没有功能更新也不跳过该端。

pnpm ext:release 独立构建扩展，检查 Manifest 版本、新标签页入口及图标资源，生成 ZIP 并校验后发布到根 dist/release。本地允许再次打包，完成暂存生成与校验后替换固定文件，失败保留旧包。Windows 使用系统 PowerShell/.NET ZIP，Linux/macOS 使用 zip/unzip；此命令不构建网站或桌面，不创建 Tag 或上传。

手动流程 .github/workflows/exts-deploy.yml 展示为 Exts Publish，仅允许 main，通过下拉选择 Website 或 Release，不因推送自动运行。Release 使用 xcode-27 arm64 runner，显式选择 Xcode 27.0.0 路径，下载并校验固定 XcodeGen 2.46.0，使用 Node.js 24.16.0、pnpm 12.4.2 冻结安装。执行发布与桌面入口逻辑测试、稳定工具和扩展测试、官网及扩展类型检查，以及 Photos 的 MediaGroupingTests、ThumbnailSchedulerTests、AppStoragePathsTests、DownloadCoordinatorTests 四组原生纯逻辑测试；调用现有 pnpm release 完整构建并校验两包，再检查扩展体积。全部通过后创建指向本次构建提交的 v<版本> Tag 与一个草稿 Release，同时附带固定名 ZIP、DMG。已有 Release 拒绝覆盖，已有 Tag 指向不同提交时失败；失败草稿需人工检查，不自动删除或覆盖。

选择 Website 时只构建、校验官网并部署 dist/build/exts-web 到 GitHub Pages，保留 github-pages 环境。Release 虽随完整构建生成官网产物，但不部署官网。两种目标各用独立并发组，只有官网部署 job 获得 Pages/OIDC 权限，只有 Release job 获得 Release 写权限；已移除 Chrome 单包入口及 Desktop 提示占位。

GitHub Actions → Exts Publish → Run workflow，分支选择 main，在 target 下拉选择目标。NPM 工具包使用独立 NPM Publish 入口，暂存上传与网页批准规则见 [NPM 发布指导](./npm-release.md)。旧 Website Deploy 与 Release Deploy 文件已由统一入口替代。

首次运行需先提交并推送 workflow 到 main，再从 Actions 手动运行 Release；根版本若已对应已有 Release 或其他提交的 Tag，需先由用户批准提升根版本，不能直接重跑覆盖。用户从草稿下载 ZIP，解压后在 Chrome/Edge 扩展管理页加载；下载 DMG 后挂载，将 exts.app 拖入 Applications，从应用程序目录启动并验收 Photos。确认后由用户公开 Release 并设为 Latest，再核实官网两个下载入口。草稿和成功打包都不等于公开发布成功，GitHub 自动生成的 Source code ZIP 不是安装包。

pnpm release 先检查版本、平台与工具，再调用统一 build；本地旧固定包不阻止构建。正式扩展 ZIP 根层直接包含 manifest.json；DMG 含正式 exts.app 和 Applications 安装入口，使用系统 zip、unzip、ditto、hdiutil 等工具生成和校验，不引入打包依赖。

新包在 dist/release/.exts-staging-<随机值> 中生成并校验；两包全部校验后备份旧目标，再以同盘重命名替换固定文件。本地成功替换后清理暂存，生成/校验失败不改旧包；部分替换失败撤销新文件并恢复旧文件。恢复也失败时保留备份目录并给出可诊断路径，不报告成功或删除备份。不清空 release，不删除既有无关或历史文件；正式历史附件保存在各自 GitHub Release。

.app 是可运行的应用，.dmg 是分发容器。本轮仅供本人在 macOS 27 上使用：开发直接运行 pnpm desk:dev，无需安装 DMG 或配置分发证书；下载安装使用正式 DMG。桌面构建在资源处理完成后对完整应用执行 ad-hoc 临时签名并进行严格校验，不依赖外部证书；打包时对复制进 DMG 源目录的应用再次校验签名，失败则保留旧包。包使用构建机架构，本地及 Actions 当前为 arm64，不做旧系统兼容、Apple 分发签名、公证、通用架构或自动更新。临时签名保证应用签名结构完整，不提供 Apple 的开发者身份或公证信任。下载包首次启动若被 macOS 拦截，由用户核对来源后在系统设置的隐私与安全性中处理，流程不自动绕过系统保护。

## 验证与当前限制

- 逻辑检查：node --test tests/build-release.test.mjs tests/extension-release.test.mjs apps/desktop/tests/scripts/desk.test.mjs。
- 稳定工具：pnpm --filter @linguio/wxt-stable-output test。
- 扩展：pnpm --filter @exts/extension test、typecheck、check:bundle-size；先运行 ext:build 再检查体积。
- Chrome/Edge 实际加载根稳定目录，成功→编译失败保留→恢复成功由用户验收；代理不执行视觉、布局或交互验收。
- 2026-10-19 已实际运行 pnpm desk:dev 与 pnpm release：开发及正式 Xcode 构建、官网与扩展生产构建、真实 ZIP/DMG 打包及镜像校验通过，版本为 1.1.0，桌面为 arm64；桌面入口已校验身份和版本并执行开发 app 打开命令。
- Photos 验收修正后的开发构建和双包打包已重新通过；分组／队列针对性原生 XCTest 8 项通过。随后一次完整原生测试在既有 SQLite 压力用例复现 `FROM mediaORDER BY` 错误后停滞，已中止、不重试，不宣称全量通过。实际界面、设备、预览清晰度、双应用并存与数据隔离、DMG 挂载安装和远程 Actions 仍待用户验收；既有 SQLite 问题和 Swift 警告保留。
- 下载结果提示与统一目录追加后，相关原生纯逻辑测试 7 项通过，开发 app 和正式双包重新构建、打包及校验通过；原生提示和 Finder 跳转待用户实测，不重跑已知中止的原生全量测试。

相关入口：[根 README](../README.md)、[desktop](../apps/desktop/README.md)、[extension](../apps/extension/README.md)、[website](../apps/website/README.md)、[Issue](changes/issues/2026-10-10-repo-unify-build-release-issue.md)、[Commit 记录](changes/commits/2026-10-10-repo-unify-build-release-commit.md)。
