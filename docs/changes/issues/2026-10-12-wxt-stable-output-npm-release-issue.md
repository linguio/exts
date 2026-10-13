# 公开发布 WXT 稳定产物工具并建立手动发布流程

## 元信息

- 工作项：2026-10-12-wxt-stable-output-npm-release
- 项目：wxt-stable-output
- 类型：架构任务；涉及公共 npm 包兼容边界与发布权限、流程
- 状态：待验收
- 创建日期：2026-10-12
- 当前阶段：此前本地交付已验收并按两笔提交；2026-10-13 目录、README、暂存发布与下拉选择修正已验收并按两笔本地提交；浏览器和远程上传、批准仍待验证
- 用户批准：已批准创建工作项、设计与实施，此前本地交付已批准两笔提交；2026-10-13 用户在看到本轮交付后要求“拆下commit 提交到本地”，表示本轮本地验收通过并批准两笔提交。包名采用个人 scope 下的公开包 `@linguio/wxt-stable-output`；用户表示已配置 `NPM_TOKEN`，代理未独立核验；推送、远程上传和实际发布仍需分别批准。

## 背景

当前 `packages/wxt-stable-output` 是内部工具，通过 `workspace:1.0.0` 由扩展引用，只在 WXT 开发模式下发布稳定产物。用户希望将它公开发布到 npm，并建立可供未来多个包共用的手动发布 Action。

用户确认 npm 用户名是 `linguio`，对应个人 scope `@linguio`，无需创建同名组织；包名可用性与实际发布权限仍需核实。

已只读核对本地 WXT `0.21.4`：开发服务器完整启动会清空工作产物目录，普通增量重建不先清空整个目录。当前新标签页 HTML 从 Vite 开发服务器加载页面代码，因此稳定目录未重新复制也能正常热更新。工具仅监听 `build:done`，普通增量重建的磁盘产物同步仍需验证，不能将当前页面正常使用推广为全部扩展类型均已支持。

## 目标

将现有工具整理为可独立安装的公开 npm 包 `@linguio/wxt-stable-output`，准确说明其稳定加载目录与失败恢复能力，建立在 GitHub Actions 页面手动选择包名、验证后发布的共用流程。

## 范围

- 2026-10-13 最新批准：Actions 改为上传 npm 暂存区，正式发布由用户在 npm 网页完成 2FA 后批准。首发使用用户自行配置的 `NPM_TOKEN`（stage only），发布流程固定 npm CLI 11.15.0；不替用户创建 Token、配置 Secret、推送、触发 Action 或批准发布。

- 保持现有新标签页开发和稳定目录加载行为，核对并处理当前 WXT 支持范围内的增量产物同步问题；兼容范围依据验证结果声明，不扩大到其他构建框架。
- 调整包名、仓库内部引用及必要锁文件，完善公开发布配置、文件白名单、许可证、源码地址、Node.js/WXT 兼容说明。
- 保留 monorepo 源码位置，仓库内继续使用精确版本的 workspace 引用，外部项目安装 npm 版本。
- 工具包独立管理版本，明确它与根产品版本的关系并同步必要规范；实际首发版本在实施前确认。
- 提供中英文使用说明、功能边界、变更说明及可复现的接入与验收步骤。
- 建立一个共用的手动 npm 发布 workflow：下拉选择公开包，只接受允许发布的 `packages` 包，校验版本和包内容，串行验证，用 stage-only Token 上传暂存区并输出暂存编号；正式发布由用户在 npm 网页审核并完成 2FA 后批准。
- workflow 不自动改版本、提交代码或创建远程 Issue；只发布所选包，不顺带发布应用或其他包。同一包发布串行执行，重复版本明确拒绝，失败不标为成功。
- 为 Token/Secret 配置、首次 Actions 暂存上传和 npm 网页批准提供操作说明；实际外部操作分别取得批准后执行。

## 排除项

- 不创建独立源码仓库或同名 npm 组织，不购买套餐，不索取 Token；由用户自行在 GitHub Secret 保存 stage-only Token，不写入源码或日志。
- 不加入 Changesets、自动版本 PR、批量发布、其他构建框架适配或当前目标不需要的扩展能力。
- 不宣称目录替换完全无间断，也不保证开发服务器不可用时页面或 HMR 仍然正常。
- 不以发布配置为由升级无关依赖，不修改产品功能或现有应用发布流程。
- 未经单独批准不执行 Git 提交、推送、账号设置修改、本地 npm 发布或远程 workflow 发布。

## Todo

- [x] 按用户追加要求将 Actions 包名输入改为原生下拉选择，选项覆盖当前全部公开包（仅 `@linguio/wxt-stable-output`），不含私有工具；发布操作说明已同步，选项与公开包清单核对及 diff 检查通过。GitHub 页面实际展示待提交、推送后验收。

- [x] 将共用发布器及 workflow 改为只上传暂存区，保留同一 tarball 和源码提交校验；补充暂存成功、失败和产物篡改的行为验证，同步发布指导、Spec、Plan 和 Commit 记录。发布工具 8 项通过，npm 11.15.0 实际命令 dry-run 与 prepare 完整验证通过；本轮本地验收及两笔提交已批准。

- [x] 按 2026-10-13 用户要求，将源码目录统一为 `packages/wxt-stable-output`，同步活动引用与锁文件；精简中英文 README，移除内部开发、验收和仓库维护措辞，保留公开接入说明与必要限制。离线冻结安装、包测试 10 项、包与扩展类型检查、独立 tarball/WXT 验证及扩展构建通过；本轮本地验收与两笔提交已批准。

- [x] 查询 npm 官方 registry 确认 1.0.0 未发布，采用首版 1.0.0 与精确兼容版本；Spec/Plan 已形成，用户批准继续实施。实际账号权限待首次发布核实。
- [x] 完善稳定产物同步与真实风险对应的逻辑验证，保留当前新标签页热更新路径。
- [x] 完成包名、内部引用、发布配置、中英文说明和独立版本规则。
- [x] 建立共用手动发布 workflow，2026-10-13 改为 stage-only Token 上传暂存区，提供首次配置与网页批准说明。
- [x] 验证打包文件及独立项目安装、类型与 WXT 接入，完成约定检查并提供用户验收步骤；用户实际验收尚未完成。
- [ ] 用户验收及分别批准后完成提交、首次发布与 Action 发布核验，记录实际结果和限制。

## 验收标准

- 打包产物名称为 `@linguio/wxt-stable-output`，明确公开访问，只包含必要交付文件；独立项目能够安装并解析入口、类型及 WXT 依赖。
- 浏览器加载根 `dist/dev/chrome-mv3-dev-stable/`；成功构建更新完整产物，构建或发布校验失败保留旧产物，恢复成功后更新。当前页面热更新保持正常。
- 声明支持的增量修改能够更新相应产物；Manifest、静态资源、background/content script 等支持范围以实际验证为准，未覆盖事项明确写入 README。
- 使用者能理解工具隔离的是完整重建清空工作目录的影响，不将保留文件等同于独立运行或完全无间断切换。
- 用户在 GitHub Actions 页面通过原生下拉框选择公开包即可触发所选包的验证与暂存上传；选项覆盖当前全部可发布包且不含私有工具，后端继续拒绝非法包、私有包、重复版本和验证失败的产物。
- 上传暂存使用精确工具版本及用户配置的 stage-only Token，摘要展示包名、版本、暂存编号及源码提交。Action 成功不等于正式发布，正式发布必须由用户在 npm 网页批准；不自动批准。
- 代理仅进行逻辑、配置、打包和必要兼容验证；浏览器实际使用由用户完成，远程发布状态以实际执行或用户提供的结果记录，不将自动化通过写成用户验收通过。

## 用户前置与后续操作

- 已确认：npm 用户名为 `linguio`，采用个人 scope。
- 后续确认：账号能够发布，邮箱验证和 2FA 状态满足 npm 发布要求，GitHub 仓库有推送与运行 Actions 权限。
- 用户自行创建 `@linguio` scope 的 stage-only Token 并保存到 GitHub `NPM_TOKEN` Secret；首个包可直接由 Actions 暂存创建。无需当前配置 Trusted Publisher。
- 按交付说明自行完成 Chrome/Edge 的成功→失败→恢复验收，分别决定本地提交、推送和实际发布。

## 关联文档

- [Commit 记录](../commits/2026-10-12-wxt-stable-output-npm-release-commit.md)
- [工作台](../README.md)
- [现有包说明](../../../packages/wxt-stable-output/README.md)
- [构建与分发规范](../../build-release.md)
- [发布与验收指导](../../npm-release.md)
- [Spec](../../superpowers/specs/2026-10-12-wxt-stable-output-npm-release-design.md)：已批准。
- [Plan](../../superpowers/plans/2026-10-12-wxt-stable-output-npm-release.md)：当前会话串行执行。

## 唯一下一步

用户分别决定推送与 Action 暂存上传，再按摘要到 npm 网页核对并批准；用户表示已配置 `NPM_TOKEN`，实际权限由远程运行验证。浏览器及远程验收未完成前不结项。

## 已完成验证与限制

- 2026-10-13 暂存修正：发布工具测试 8 项通过；真实 npm 11.15.0 `stage publish --dry-run` 支持 tarball 并输出按包名分组的 JSON；完整 prepare 包含包测试 10 项、公开类型与真实 tarball/WXT 集成，全部通过。未进行真实上传、网页批准或远程 Action；本地准备产物为 `dist/.cache/npm-release/wxt-stable-output-32a571c1-a420-45e2-88a2-44b18cac61e8`，独立验证目录为 `dist/.cache/npm-verify/wxt-stable-output-o99LNe`。下列旧验证目录和远程状态为此前记录。

- 包行为测试 10 项通过，发布工具行为测试 3 项通过，扩展逻辑/架构测试 15 项通过。
- 包公开类型检查、扩展类型检查及一次扩展生产构建通过。
- 共用 prepare 全流程通过：官方 registry 查询、目标包串行验证、独立 tarball 安装/类型解析、真实 WXT 首次构建、增量 background 与静态文件同步、缺失依赖构建失败保留、修复恢复及完整重启。
- prepare 产物位于 `dist/.cache/npm-release/wxt-stable-output-fcc6ad33-13b9-43dc-a1af-e975b0ddeb9e`，7 个必要文件；重新以 npm pack dry-run 核对 tarball 包名、版本及清单通过，尚未发布。
- 本次可手动启动的独立 fixture 位于 `dist/.cache/npm-verify/wxt-stable-output-0BUEOV/consumer/fixture`。
- `pnpm install --frozen-lockfile --ignore-scripts` 与供应链核对通过；没有升级既有第三方依赖。
- WXT 入口语法破坏可导致其解析阶段终止进程；失败恢复使用缺失依赖场景验证，不修复或隐藏上游异常。
- 两次 rename 不是无间断原子交换，并发源写入不保证字节快照；支持版本外不宣称兼容。
- 未执行浏览器交互验收、npm 登录或发布、账号设置修改、GitHub Actions 远程运行或推送；两笔本地提交由用户明确批准。
