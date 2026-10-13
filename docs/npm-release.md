# npm 工具包发布与验收

## 包与版本

公开包：`@linguio/wxt-stable-output`，首版 `1.0.0`。`linguio` 是用户的 npm 账号，对应个人 scope，公开发布免费，不需要组织或独立仓库。

源码仍在 `packages/wxt-stable-output`。仓库内用精确 workspace 引用本地源码，外部项目安装 npm 版本。工具版本独立于根产品版本；升级时同步包 `package.json`、内部引用和 `pnpm-lock.yaml`，写变更说明，再验证。已发布的同版本不能覆盖。

本地及 CI 固定 Node.js `24.16.0`、pnpm `12.4.2`，发布 npm CLI `11.13.0`。首版 WXT peer 为 `0.21.4`，不默认兼容未验证版本。

## 当前阶段与批准

本地完成不代表已在 npm 发布，也不代表 Actions 已远程通过。Git 提交、推送、首次 npm 发布、npm 账号配置和 workflow 触发需分别批准；本文中的外部操作在对应批准后进行。

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

## 首次发布

首次发布前确认 npm 邮箱和 2FA，`npm whoami` 应为 `linguio`，确认目标包版本未发布。不要把登录 Token 或 OTP 发到聊天中。

完成本地验收、提交与推送并分别批准发布后，可先准备可审核 tarball：

```sh
node packages/npm-release-tools/publish.mjs prepare @linguio/wxt-stable-output
```

此命令只查询版本、验证和打包，不发布。控制台给出根 `dist/.cache/npm-release` 下的产物目录。人工检查包名、版本、文件及对应提交后，在仓库根发布那一份 tarball：

```sh
npm publish "<产物目录>/linguio-wxt-stable-output-1.0.0.tgz" --access public --registry https://registry.npmjs.org/ --ignore-scripts
```

完成 npm 的 2FA 提示，检查 [npm 包页面](https://www.npmjs.com/package/@linguio/wxt-stable-output)。首次建立包后再设置 Trusted Publisher；发布不会自动把本地 workspace 改成远程依赖。

## 配置 npm Trusted Publisher

打开 npm 包页面 → Settings → Trusted Publisher → GitHub Actions，填写：

| 字段 | 值 |
|---|---|
| GitHub owner | linguio |
| Repository | exts |
| Workflow filename | npm-packages-publish.yml |
| Environment | 留空；当前 workflow 不使用 environment |

不要填 workflow 的展示名称 `npm Packages Publish`，也不要填 `.github/workflows/` 前缀。无需添加 NPM_TOKEN。绑定配置需在 npm 要求的有效期内完成首次成功使用；按当前规则是两天，超时需删除后重新配置。配置前应先准备好下一个真实版本，避免绑定后无版本可发布。

依据：[npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)。账号界面字段以实际页面为准；我们不自动修改账号设置。

## 后续 Actions 发布与首次远程验收

1. 有实际修复/更新时提升工具版本，更新内部精确引用、锁文件及 CHANGELOG，完成验收与提交审批后推送 main。
2. GitHub 仓库 → Actions → **npm Packages Publish** → **Run workflow**；分支选 main，包名填 `@linguio/wxt-stable-output`。
3. prepare job 查询版本、测试、类型检查、独立验证和打包，上传 tarball/receipt；此 job 没有 npm 发布权限。
4. publish job 使用 OIDC，核对包名、版本、源码提交、清单和 SHA-512，再发布同一 tarball。摘要给出结果和 npm 链接。
5. npm 页面应出现新版本；在仓库外测试目录安装该精确版本，并按 README 接入一个 WXT 项目。
6. 输入不存在的包名应失败且无发布；同版本再次运行应在准备阶段拒绝，不覆盖线上包。

远程流程需实际运行后才算验收。`1.0.0` 本地首发后不能再用 Action 发布同版本；若暂时没有真实更新，不为验收凭空制造版本，先记录远程待验证。

## 未来增加包

不复制 workflow。公开包放在 `packages`，使用 `@linguio/<包名>`、精确独立版本，明确 `publishConfig.access: public`，并在自身元信息中配置：

```json
{
  "npmRelease": { "verify": "verify:npm" },
  "scripts": { "verify:npm": "本包必要的串行验证命令" }
}
```

每个包单独在 npm 绑定同一 workflow。输入包名后只发布所选包，应用和私有工具包不能发布。批量发布、Changesets 和自动版本 PR 不属于本流程。

registry 查询只有 404 被视为未发布；认证、限流或网络错误中止。发布命令成功而后续查询失败时，先查线上状态，不重复发布同版本。
