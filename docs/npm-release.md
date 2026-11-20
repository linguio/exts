# npm 包发布与验收

## 包与版本

组件包 `@linguio/exts-ui` 首版0.1.0已由用户发布且线上消费验收通过，扩展当前使用精确Workspace源码引用0.4.0继续开发，不消费线上UI包；0.4.0为本地准备版本，尚未正式发布。默认中文README与英文README.en.md共同打包，CHANGELOG仅维护中文。编译产物统一在根 `dist/build/npm/exts-ui`，包内CHANGELOG独立维护，不创建额外Git tag/Release。

公开包：`@linguio/wxt-stable-output`，首版 `1.0.0`。`linguio` 是用户的 npm 账号，对应个人 scope，公开发布免费，不需要组织或独立仓库。

当前已核实npm正式版本为 `1.0.3`，扩展固定消费该版本。README默认中文、保留英文入口，发布沿用按版本变化自动暂存及用户手动批准流程。

本地WXT工具已准备1.1.0（包主页及关键词修正），当前尚未正式发布；扩展不提前引用不可安装版本。用户批准npm正式发布且registry确认可用后，再同步扩展精确1.1.0及锁文件，保留UI本地Workspace。

源码仍在 `packages/wxt-stable-output`，用于维护与发布。扩展与外部项目均安装 npm 正式包，扩展当前锁定精确 `1.0.3`，不通过 workspace 引用本地源码。工具版本独立于根产品版本；升级时同步包 `package.json`、消费方引用和 `pnpm-lock.yaml`，写变更说明，再验证。已发布的同版本不能覆盖。

本地及 CI 固定 Node.js `24.16.0`、pnpm `12.21.0`，发布 npm CLI `11.15.0`。首版 WXT peer 为 `0.21.4`，不默认兼容未验证版本。

## 当前阶段与批准

本地完成不代表已在 npm 发布，也不代表 Actions 已远程通过。Git 提交、推送、npm 账号配置、workflow 上传暂存区和最终批准发布需分别批准；本文中的外部操作在对应批准后进行。

## 本地验证

在仓库根串行运行：

```sh
pnpm --filter @linguio/wxt-stable-output test
pnpm --filter @linguio/wxt-stable-output typecheck
node packages/wxt-stable-output/scripts/verify-package.mjs
node --test --test-isolation=none packages/npm-release-tools/tests/publish.test.mjs
```

第三条命令将真实 tarball 安装到独立消费者，复用本地精确 WXT/Node type peer 缓存；检查包清单、公开类型，以及真实 WXT 首次构建、增量脚本/静态资源更新、失败保留、恢复与完整重启。临时服务不启动浏览器，有超时保护，完成后关闭。

产物与 fixture 均在根 `dist/.cache/npm-verify`；控制台输出本次验证目录。验证包应只含 package.json、src、两份 README、LICENSE、CHANGELOG，不含测试和发布工具。验证期间出现缺失依赖错误是故意触发的失败场景，最终应退出 0 并输出通过。

## 用户验收：当前新标签页

1. 停止旧开发进程，重新执行 `pnpm ext:dev`，等待“稳定开发产物已发布”日志。
2. 在 `chrome://extensions` 或 `edge://extensions` 开启开发者模式，加载根 `dist/dev/chrome-mv3-dev-stable`，不要加载 `.cache` 临时目录。
3. 打开新标签页，确认现有内容与功能正常；页面代码更新仍通过 WXT/Vite HMR，不需要重新加载扩展。
4. 停止并重新启动开发命令，成功后重新打开新标签页；稳定目录在完整重建期间保留，完成后更新。
5. 开发服务器停止时页面可能无法加载 localhost 资源，这是明确限制；不得把保留文件理解为离线运行。

## 用户验收：独立失败与恢复 fixture

为避免更改业务代码，使用本地验证器输出目录中的 `consumer/fixture`。下文 `<fixture绝对路径>` 与 `<验证目录>` 替换为本次输出。

```sh
pnpm --filter @linguio/wxt-stable-output exec wxt --root "<fixture绝对路径>"
```

1. 等待构建成功，在 Chrome/Edge 加载 `<fixture绝对路径>/stable`，名称为 Lifecycle fixture。通过扩展管理页打开 Service Worker 控制台，应有 `recovered-marker` 日志。
2. 修改 fixture 的 `entrypoints/background.ts`，只把 marker 改为 `manual-marker`；保存后应先看到稳定发布日志，Service Worker 重载后显示新 marker，不需要手动重新加载。
3. 修改 fixture 的 `public/marker.txt`，保存后稳定目录中的同名文件应更新。
4. 在 background 回调里临时加入 `void import('../missing-dependency')`，保持入口语法有效。预期 WXT 构建失败，稳定 background 文件保留上一份内容，不转发这次失败重载。
5. 删除该 import 并把 marker 改为 `manual-recovered`。预期成功后稳定文件更新，Service Worker 显示新 marker。
6. 结束 fixture 开发进程并移除测试扩展，继续使用业务扩展。

不要用破坏入口语法替代第 4 步：当前 WXT 入口解析错误可能终止开发进程，本包不修复上游解析器。两次 rename 间存在短暂路径窗口；并发改写源文件不是逐字节快照，必须一进程一目标。

## Actions 上传暂存区

当前流程：GitHub Actions 验证并打包 → 上传 npm 暂存区 → 用户在 npm 网页审核、完成 2FA 并批准 → 正式发布。Action 成功只表示暂存成功，不表示已正式发布。首次发布也采用此流程，不要求本地先发布 1.0.0。

暂存发布要求 npm CLI 11.15.0 或更高；本流程固定 11.15.0，Node.js 仍为 24.16.0。提交前可使用仓库专属缓存中的 CLI 验证，不修改系统 npm 或业务依赖。

### 首次配置

1. 确认 npm 用户为 `linguio`，账号已启用 2FA，邮箱已验证。
2. npm 头像 → Access Tokens → Generate New Token：
   - 名称：`github-actions-exts-npm-publish`。
   - Packages and scopes：**Read and write (stage only)**，仅授权 `@linguio` scope。
   - Organizations：**No access**；Allowed IP ranges 留空。
   - 无需 Bypass 2FA；选择符合使用周期的有效期，Token 过期后需重新生成并替换 Secret。
3. GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret，名称 `NPM_TOKEN`，值填写生成的 Token。不要把 Token 写入仓库或聊天。
4. 用户验收并批准提交、推送后，确认 main 上包含本次 workflow 和源码。

Token 仅提供给串行包任务的最后上传步骤；版本检测、安装、验证与打包均不接收Token。任务不具备OIDC发布权限，缺少Token明确失败，不降级为正式发布。认证配置只在该上传步骤创建并清理，不向日志输出Token。

### 自动触发

推送到main时按两个包各自package.json比较本次推送前后的版本。版本未变化时跳过，普通代码或文档提交不会重复上传待审核草稿；版本变化且registry返回该版本404时才继续验证和暂存，已正式发布则跳过，网络或其他HTTP错误中止。首次创建分支或新增包无旧版本时按registry判断。

两个包串行运行，沿用固定Node、pnpm和npm CLI。每包验证通过后生成tarball及同提交SHA-512凭据，保留独立Actions artifact，再暂存同一份文件。失败可通过下述手动入口重试；未修改版本的后续push不会自动重试。

### 手动运行

1. GitHub 仓库 → Actions → **NPM Publish** → **Run workflow**。
2. 分支选 `main`，在包名下拉框选择 `@linguio/wxt-stable-output` 或 `@linguio/exts-ui`；只验证、打包及暂存所选包，私有发布工具不列入选项。手动运行忽略push版本对比，但已正式发布的版本仍跳过。
3. 包任务串行检查版本、验证、打包并上传独立tarball/receipt artifact。
4. 上传步骤核对同一源码提交、文件清单与 SHA-512，执行 `npm stage publish` 上传同一 tarball。
5. 摘要显示包名、版本、源码提交和暂存编号，并明确“尚未正式发布”。不自动执行 `npm publish` 或 `npm stage approve`。

非法输入、私有包、已发布版本、验证或校验失败均不上传。相同版本已在暂存区时 npm 会拒绝再次上传；先检查已有暂存项，不盲目重跑。上传命令成功但结果解析失败时也先检查 Staged Packages，不重传同版本。

新包首次暂存会建立公开占位版本 `0.0.0-stage`；待审核版本及其内容不会公开。占位版本不表示 `1.0.0` 已发布。

### npm 网页审核与批准

1. 登录 npm，打开 **Staged Packages**，找到摘要中相同的暂存编号。
2. 核对包名 `@linguio/wxt-stable-output`、本次所选源码中声明的包版本、文件清单和包内容；必要时下载 tarball 检查。
3. 点击 **Approve** 并完成 2FA。Token 不会跳过人工批准。
4. 打开 [npm 包页面](https://www.npmjs.com/package/@linguio/wxt-stable-output)，确认正式版本出现；在仓库外安装该精确版本并按 README 接入 WXT。
5. 不接受产物时拒绝暂存项；不需要以虚构新版本绕过已有暂存项。

远程 Action 上传、网页批准与公开安装必须分别实际验证；本地测试通过不代表这些操作完成。本轮代理不操作 Token、Secret、推送、workflow 或 npm 批准。

## 本地准备

在仓库根执行下列命令只查询、验证和打包，不上传或发布：

```sh
node packages/npm-release-tools/publish.mjs prepare @linguio/wxt-stable-output
```

该产物不替代Action中基于所选源码提交准备的tarball。发布工具提供check（版本是否需要暂存）、prepare与stage，不提供直接正式发布或自动批准命令。

## 未来增加包

需要编译的包可配置 `npmRelease.directory` 为源码包相对路径，指向根dist内的独立发布目录。prepare先运行该包验证脚本，再核对编译目录真实路径、包名及版本，从编译目录打包；未配置时保留源码包原打包行为。发布目录不得越出根dist或通过链接指向仓库外。

公开包放在 `packages`，使用 `@linguio/<包名>`、精确独立版本和 `publishConfig.access: public`，并声明本包串行验证脚本：

```json
{
  "npmRelease": { "verify": "verify:npm" },
  "scripts": { "verify:npm": "本包必要的串行验证命令" }
}
```

复用同一workflow，新增公开包时同步加入workflow_dispatch包选项与串行matrix；手动选择后只暂存所选包，push按各包版本变化选择。应用和私有工具不列入选项，也不能发布；Changesets与自动版本PR不属于本流程。

以后改为 OIDC 暂存上传时需另行配置每个包的 Trusted Publisher，并修改当前 Token 认证配置；正式发布仍由用户在 npm 网页批准。不在本轮自动配置。

## exts-ui 本地准备

```sh
pnpm --filter @linguio/exts-ui verify:npm
```

串行执行包类型、迁移的纯逻辑测试、ESM/声明/CSS构建及真实tarball独立消费验证。tarball与fixture在根 `dist/.cache/exts-ui-verify`，独立消费者不链接仓库源码，检查CSS类型入口、实际ESM导入与Vite构建。不会上传npm。扩展当前消费Workspace版本，dev/build先构建本地UI包；包自身样式或工具类变化后重新build，不新增长期watch。

获准正式准备时沿用 `node packages/npm-release-tools/publish.mjs prepare @linguio/exts-ui`；它查询版本占用、重新验证并生成带校验凭据的产物。真实上传仍只允许已批准的Actions stage步骤，latest是npm渠道而不是额外版本号。首版本地prepare已通过并确认产物与独立消费者验证tarball一致；用户已完成0.1.0发布，registry查询确认该版本存在，不据此推断远端Actions或stage的具体执行情况。

依据：[npm 暂存发布](https://docs.npmjs.com/staged-publishing/)、[npm stage 命令](https://docs.npmjs.com/cli/v11/commands/npm-stage/)、[Token 配置](https://docs.npmjs.com/creating-and-viewing-access-tokens/)。
