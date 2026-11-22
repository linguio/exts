---
date: "2026-10-10"
scope: repo
status: completed
type: task
---

# 统一构建产物、版本来源与分发入口

## 当前阶段

已完成。

## 目标与范围

### 背景

三端应用位置已经固定，当前构建产物分散在应用目录。用户希望根目录统一构建和打包入口，按用途归集产物，开发命令保持独立；产品版本只在根 package.json 手动维护一次。

### 目标

建立固定产物路径和统一版本消费规则；开发与正式桌面应用可并存且不共享应用数据；网站可独立构建部署，扩展和桌面可统一生成本地分发包。

### 范围

- 根 scripts/ 新增 version.mjs、build.mjs、release.mjs；版本模块只读取、校验根 package.json 的 version，不改写源版本、不自动升级。
- pnpm build 串行构建三端；pnpm release 调用同一构建流程后生成 ZIP 与 DMG，不复用未经校验的旧产物。
- 保留 web:dev、ext:dev、desk:dev 及现有单端 build 命令；独立调用也使用公共版本读取逻辑，不依赖当前工作目录。
- 三端产品版本及发布包名称只消费根版本；删除不必要的子应用产品版本字段，工具强制需要的字段只能派生，禁止形成第二个手工版本源。内部 packages 的包版本及精确依赖版本不参与产品版本同步。
- 版本采用扩展和 macOS 均可接受的三段数字格式，按平台约束校验；本阶段不支持预发布后缀。桌面营销版本与构建编号使用同一根版本，不增加手工编号源。
- 桌面正式 Bundle Identifier 保持 dev.linguio.exts；开发版使用 dev.linguio.exts.dev。项目配置、desktop 规范和所需 Spec 同步记录完整标识；正式展示名 Exts、开发展示名 Exts Dev。
- 桌面按构建模式隔离内部数据、配置、缓存及现有凭据标识；正式版保留已有用户路径，开发版使用独立路径，不迁移或删除旧数据。默认下载目录也分开；用户主动选择的同一外部目录不承诺自动隔离。
- 网站自动部署只运行 web:build，发布目录为仓库根 dist/build/exts-web；不新增部署平台或远程发布操作。
- 调整引用旧产物路径的脚本、包体积检查、测试及公共工具 API 说明；不重做品牌资源。
- 删除当前工作区应用内旧 dist、旧 DerivedData 和旧网站构建缓存，保留业务数据与归档；统一规范及根、三端入口链接按用户批准另行提交。
- 公共稳定发布 hook 最小增加目标目录配置能力，默认行为保持兼容；扩展不得自行重写复制、校验、替换逻辑。

#### 固定产物布局

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
   ├─ exts-extension-<版本号>.zip
   └─ exts-macos-<版本号>.dmg
```

- WXT 临时开发产物、Xcode DerivedData 和 VitePress 可配置构建缓存统一到根 dist/.cache；应用内不再生成 dist 或 DerivedData，不为网站 dev server 创建分发目录。.wxt 类型及依赖工具目录保留。
- 每个构建只清理自己的输出，不清空公共 dist、dev 或 build；扩展稳定产物仅在构建与校验成功后更新，失败保留旧产物。
- 完整三端 build/release 需要 macOS；启动前检查平台和必要工具，Windows 明确失败，不把部分构建报告为完整成功。Windows 仍能单独构建网站和扩展。
- DMG 使用系统工具生成本机构建架构的基础安装镜像，包含正式 exts.app 和 Applications 入口；ZIP 根层可直接取得扩展 manifest.json，不混入开发产物。
- release 失败不得把残缺 ZIP/DMG 留作正式结果；同版本文件已存在时默认拒绝覆盖并说明冲突，不擅自删除旧包。本次不引入额外打包依赖或平台扩展。

### 排除项

- 不增加统一 dev 命令、不调整业务功能，不修改内部依赖版本或自动升级产品版本。
- 不自动提交、创建 Git 标签、推送、上传商店、部署网站或创建 GitHub Release。
- 不做 Apple 分发签名、公证、通用架构包、自动更新或开发数据自动导入。
- 基础 DMG 不表示已满足公开分发条件；签名、公证另行建立明确范围。
- 不隔离扩展开发版和正式版的浏览器存储身份；本次身份与数据隔离仅针对 desktop。
- 不修复工作台已有 SQLite 分页问题，不处理归档项目或清理用户文件。

## Todo

### Sub-issues

#### 阶段一：统一构建、产物与桌面隔离

- [x] 使用已确认的根初始版本 1.0.0，实现唯一读取模块与版本校验，接入独立及统一构建入口。
- [x] 调整产物布局和必要引用，公共稳定 hook 支持根目标目录，保留失败保护。
- [x] 完成桌面双身份源配置及默认存储路径隔离，并验证 Node 构建入口。（macOS 原生与 Swift 验证按用户批准暂缓）
- [x] 完成 Windows 平台可用自动化验证并交付限制说明；用户允许不等待 macOS 实测继续阶段二。

#### 阶段二：生成本地分发包

- [x] 实现统一 release，串行构建后生成扩展 ZIP 和桌面 DMG的代码流程，验证调度及文件发布逻辑。（真实 macOS 产包未执行）
- [x] 验证版本、失败行为和已有包保护，删除旧产物并更新实现交付记录；规范与链接拆为独立文档提交。（真实包内与挂载检查记录为未验证）

## 验收标准

- 根 version 是唯一产品版本源；从根或单应用入口执行时结果一致，缺失或非法版本明确停止，无默认版本、Git 标签或其他文件兜底。
- pnpm build 在 macOS 生成三端约定产物，扩展 Manifest、桌面 Info.plist 与根版本一致；网站目录含 index.html 及完整静态资源。
- 各单端 dev 命令保留；web 不生成专用 dev 包，扩展稳定目录和桌面开发 app 位于约定路径。
- 单端重建不删除其他产物；扩展公共发布测试覆盖自定义目标、成功更新、失败保留、无效或缺失产物及替换异常。
- macOS 开发与正式 app 身份不同，内部数据位置及默认下载目录不同；开发写入或清空测试数据不影响正式数据，已有正式用户数据仍可访问。
- 用户在 Chrome 或 Edge 加载 dist/dev/chrome-mv3-dev-stable，完成成功→失败→恢复验收；代理不执行视觉、布局或交互验收。
- pnpm release 生成 ZIP 和 DMG，名称及包内应用版本一致，ZIP 无多余包裹层，DMG 只含正式应用及安装入口；同版本冲突与失败结果清楚。
- 自动化仅覆盖版本、构建调度、配置、存储隔离逻辑与真实发布边界；阶段完成时执行一次相关完整检查，不新增视觉或假 DOM 测试。
- Windows 验证可执行的版本、脚本、网站和扩展检查；Xcode、macOS 并存运行及 DMG 挂载仅能在 macOS 完成。用户已批准本次暂缓并记录限制，不伪称原生实测或整体验收通过。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应 Issue

- [Issue](2026-10-10-repo-unify-build-release-issue.md)

#### 预期交付边界

统一根构建和本地分发入口、根 dist 产物布局及唯一产品版本消费；隔离桌面开发与正式身份和数据，保持独立开发命令及正式数据兼容。不包含签名、公证或远程发布。

根产品版本已确认并写入 1.0.0，后续由用户手动维护。

#### 实际交付

- 阶段一已实现根 version.mjs、build.mjs；根产品版本 1.0.0，独立构建消费同一读取逻辑，子应用不再维护产品版本。
- 网站和扩展正式产物迁到根 dist/build；公共 hook 支持将稳定开发产物发布到根 dist/dev，原默认行为保持兼容。
- 桌面源配置区分 dev.linguio.exts.dev 与 dev.linguio.exts，构建时写入根版本，分别发布 exts-dev.app 与 exts.app；新存储入口分离开发缓存、默认下载目录，正式路径保持原值。
- 已实现 release.mjs 和根 pnpm release 命令：构建后检查版本、ZIP 根 Manifest、DMG 正式应用身份与版本，生成和校验基础镜像；已有同版本包拒绝覆盖，校验通过后发布最终文件，失败清理本次暂存与创建的最终文件。
- 用户批准后将 WXT、Xcode 和 VitePress 可配置构建缓存迁往根 dist/.cache；已删除实际存在的应用内旧扩展 dist，其他旧产物目录不存在，未触碰业务数据或归档。
- 公共稳定工具 API 说明随实现提交；统一规范、根与三端 README、AGENTS.md 的文档变更拆入独立文档工作项。macOS 派生工程尚未生成，用户已允许记录限制后完成本次实现。

#### 验证结果

- 最终根脚本与桌面入口 Node 测试 21 项通过；公共稳定发布 Vitest 8 项通过；扩展 Vitest 15 项通过；扩展类型检查通过。
- pnpm web:build、pnpm ext:build 均成功，根 dist/build 含 exts-web 与 chrome-mv3；根版本与扩展 Manifest 均为 1.0.0。
- 扩展构建前后网站 index.html SHA256 一致。扩展体积预算通过，产物总计 509274 字节、JS gzip 112316 字节，无源码映射。
- Windows 实际 pnpm build、pnpm release 和 pnpm desk:dev 均按约定提示 macOS 要求并返回 1；其他平台行为由入口测试覆盖。
- 新版本/调度、稳定目标及桌面版本传递测试分别观察到缺失实现失败后通过；Swift 测试已写但未执行，不声称 XCTest 通过。
- Node 测试首次被沙箱以 spawn EPERM 阻止；获得工具权限后执行成功。没有为此修改业务代码或新增依赖。
- 工作区差异与 UTF-8 文本检查、Git diff 空白检查通过；未修改依赖版本或锁文件。
- 最终网站构建首次因新增 README 指向源码根文档的相对链接被当作站内死链而失败；确认原因后改为源码仓库链接，一次重试成功，未关闭死链检查。
- 最终网站成功重建前后扩展 Manifest SHA256 一致。此前网站失败后的空值哈希比较无效，不计入证据；阶段一成功构建时的反向网站入口哈希证据仍有效。
- release 使用临时目录及系统命令替代实现验证成功发布、同版本保护、build/ZIP/DMG 失败清理；这些不是 macOS 原生 ZIP/DMG 验证。

#### 未验证事项与限制

- 当前 Windows 无 Xcode/XcodeGen，project.yml 已更新；exts.xcodeproj/project.pbxproj 尚未重新生成。macOS desk 命令会首先生成工程，必须核对生成差异并完成真实构建/XCTest。
- 新 AppStoragePathsTests 及应用并存、实际内部版本、存储隔离未在 macOS 执行；既有 SQLite 分页缺陷不在本次修复范围。
- 扩展稳定目录实际由用户运行 ext:dev 产生；代理未启动 watch、dev server 或浏览器交互验收，未声称完成成功→失败→恢复实际加载。
- release 命令与 ZIP/DMG 代码已实现，但真实 macOS 产包和 DMG 挂载尚未执行，不承诺签名、公证或公开分发可用性。
- 应用内旧产物已按用户要求删除。旧开发进程必须停止并重新启动才能采用新根缓存配置，不能用旧进程继续生成旧目录。
- 网站 README 使用源码仓库链接，新的远程文档需本地记录提交并由用户另行推送后才在远程可访问；根 README 和其他应用提供当前可用的本地相对链接。

#### 可复现检查与暂缓验收

1. 在 Windows 运行 pnpm web:build、pnpm ext:build，确认根 dist/build 的两个独立目录完整；根 pnpm build、pnpm desk:dev 应报 macOS 要求并退出。
2. 运行 pnpm ext:dev，在 Chrome 或 Edge 加载根 dist/dev/chrome-mv3-dev-stable，确认新标签页、书签和标签组主流程保持原行为；代理不执行这些交互。
3. 临时制造一个可撤销的扩展编译错误并保存，确认构建失败且已加载稳定产物仍可使用；撤销后保存，确认成功更新。结束后恢复源码并停止 dev 服务。
4. 在 macOS 运行 pnpm build、pnpm desk:dev，确认根 dist/build/exts.app 与 dist/dev/exts-dev.app 同时存在、可以并存运行，开发身份和根版本与输出校验一致。
5. 在两版执行开发测试下载，确认正式默认 Downloads/OhMy Photos 与开发 Downloads/Exts Dev 分开，缓存分别为 Application Support/OhMy Photos/Thumbnails 与 Exts Dev/Thumbnails；正式旧文件不迁移或删除。
6. macOS 可用后生成工程并运行原生 XCTest，传入 EXTS_BUILD_VERSION 的根版本；报告实际结果及已知 SQLite 失败。运行 pnpm release 检查真实 ZIP 根目录及 DMG 内正式应用，并再次运行确认同版本拒绝覆盖；本次已批准暂缓这些实测。
7. 打开 docs/build-release.md，从根 README、三端 README 和 AGENTS.md 核对规范链接；停止并重新启动 ext:dev 后确认临时目录位于根 dist/.cache/extension，应用内不再生成 dist。

#### 实施判断

- 沿用已批准的当前会话与当前工作区实施，不创建新分支、worktree 或阶段 Commit；遵守仓库禁止子代理与并行命令规则，最终 diff 由当前代理核对。
- WXT 当前配置入口采用对象配置；生产输出通过 config:resolved hook 调整实际 outDir，outBaseDir 仅指向根扩展缓存，避免 WXT clean 触碰其他应用。
- 不复制未使用的数据库或凭据设施；SQLiteMediaStore 仍接收显式 URL，只隔离当前实际默认缓存与下载入口。
- 用户最新明确允许暂缓 macOS 实测、不等待阶段停点并完成实现与规范；所有未验证项保持真实，不将 Windows 逻辑通过等同于 macOS 用户验收。

#### 用户验收

已通过：用户于 2026-10-10 查看交付及拆分方案后明确要求本地 Commit 并同步关闭 Issue；macOS 原生及浏览器整体验收未实测的限制保留。

#### 最终提交批准

已批准：按已展示的实现范围和 message 本地提交，并同步结项；规范文档另行提交，不推送。

#### 最终 Commit message

```text
chore(repo): 统一构建产物与版本分发

- 统一根版本、构建和分发入口及产物目录
- 隔离桌面开发身份和默认数据目录
```

## 关联文档

- [Spec](../../../superpowers/specs/2026-10-10-repo-unify-build-release-design.md)：已批准。
- [Plan](../../../superpowers/plans/2026-10-10-repo-unify-build-release.md)：已批准；当前会话串行实施。
- 规范文档工作项：2026-10-10-repo-build-release-docs，由实现提交成功后创建并提交。

## 历史补充

### 元信息

- 用户批准：已批准 Issue、Spec 和 Plan，根初始版本为 1.0.0；已允许暂缓 macOS 实测并完成全部实现，批准临时产物与缓存集中到根 dist、删除应用内旧产物及新增链接规范文档；不自动提交
- 当前阶段：用户已验收并批准本地提交实现；macOS 未验证事项保留，规范文档拆为独立工作项提交
- 规模：涉及构建体系及桌面数据边界的工作项；两个顺序阶段，一个最终交付 Commit

### 待确认与实施停止点

- 根 package.json 目前没有 version：用户已确认从 1.0.0 开始，实施时写入；后续由用户手动维护，脚本不得擅自升级。
- 实施前补充精简 Spec/Plan，只记录构建路径、版本消费和桌面存储边界及必要验证，不展开完整代码；批准后实施。
- 发现工具强制第二版本源、签名或架构要求、必须新增依赖、正式数据迁移或超出最小 hook 调整时暂停并明确请求范围批准。
- 用户已批准跳过等待 macOS 阶段验收，直接完成实现并记录规范；最终仍需本地提交批准，不自动提交。阶段间不创建交付 Commit。

### 历史后续事项

本实现工作项已完成；按用户批准继续提交独立规范文档工作项，不推送。
