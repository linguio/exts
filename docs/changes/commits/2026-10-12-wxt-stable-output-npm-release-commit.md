# 公开发布 WXT 稳定产物工具并建立手动发布流程：Commit 记录

## 对应 Issue

- [Issue](../issues/2026-10-12-wxt-stable-output-npm-release-issue.md)

## 预期交付边界

将现有内部工具整理为公开的 `@linguio/wxt-stable-output`，明确兼容与同步边界，保留仓库内 workspace 使用，建立可供多个包共用的手动 npm 发布流程及操作说明。

## 实际交付

- 用户追加批准将 Actions 包名输入改为原生下拉选择，配置和发布说明已同步；选项覆盖当前全部 1 个公开包 `@linguio/wxt-stable-output`，排除私有工具，选项清单及 diff 检查通过。GitHub 页面展示待远程验收，不改变暂存流程，不触发远程运行。

- 2026-10-13 用户追加批准 Actions 暂存发布、npm 网页人工批准；发布器改为 `stage`，移除直接发布路径，返回暂存编号；workflow 用 stage-only Token 和精确 npm CLI 11.15.0，摘要明确尚未正式发布。发布指导、Issue、Spec、Plan 和工作台已同步；不执行外部发布或账号配置。

- 2026-10-13 追加修正：源码目录统一为 `packages/wxt-stable-output`，同步 workspace 锁文件、包元信息、规范与当前工作项引用；精简中英文 README，移除内部验收和仓库维护流程。历史交付记录及归档源码保留当时名称。用户已验收本轮本地修正并要求拆分本地提交，批准仅覆盖本轮已展示范围。

- 已将包整理为公开发布配置的 `@linguio/wxt-stable-output@1.0.0`，保留本地 workspace 与源码目录，补齐精确 peer、公开类型、许可证、中英文文档和变更说明。
- 在完整构建发布之外，增量重建先同步再转发 WXT 重载通知；失败不转发，后续成功可恢复，关闭取消排队通知。补充目录重叠保护与部分复制失败的暂存清理。
- 新增私有共用发布工具和手动 npm workflow，限制公开目标包，串行验证、打包，上传 job 核对同一提交和 SHA-512；2026-10-13 改用 stage-only Token 暂存，不自动改版本、提交或批准发布。
- 提供独立 tarball/真实 WXT 验证器与浏览器验收、首次 Actions 暂存上传、网页人工批准说明。仅完成本地发布准备，未实际公开发布。

## 验证结果

- 暂存流程：发布工具 8 项通过，覆盖仅调用 stage publish、上传失败、不完整返回提示人工核对、提交与校验和不符；真实 npm CLI 11.15.0 dry-run 通过，无上传。完整 prepare 的包测试 10 项、类型检查、真实 tarball/WXT 生命周期验证与打包通过，产物为 `dist/.cache/npm-release/wxt-stable-output-32a571c1-a420-45e2-88a2-44b18cac61e8`。本地 CLI 仅安装到根 dist 缓存，没有改变系统 npm、业务依赖或锁文件版本。
- 暂存修正的 `node --check` 与 `git diff --check` 通过。根据实际 npm CLI dry-run，JSON 按包名分组解析；Windows 临时目录短路径在目录边界比较前统一 realpath，相关行为测试通过。

- 2026-10-13 修正验证：离线冻结安装通过，包测试 10 项、包与扩展类型检查通过；真实 tarball 独立安装及 WXT 首次构建、增量同步、失败保留、恢复和重启通过；扩展生产构建通过。验证目录为 `dist/.cache/npm-verify/wxt-stable-output-qZPHs4`。安装及 Vitest 初次受沙箱权限限制，在沙箱外各重试一次通过，未改业务代码。

- 包行为 10 项、共用发布规则 3 项、扩展逻辑/架构 15 项测试通过。
- 包公开类型和扩展类型检查通过；一次扩展生产构建通过。
- 共用 prepare 全流程成功：tarball 独立消费、真实 WXT 首次/增量脚本与静态文件/失败保留/恢复/重启通过；最终 tarball 7 个必要文件，包名、版本和清单复核通过。
- 在线 frozen-lockfile 安装及供应链元数据检查通过；第三方依赖未升级。
- `git diff --check`、UTF-8 和新增文档关联链接检查作为最终文档收尾检查。

## 未验证事项与限制

浏览器实际加载、npm stage-only Token/Secret 配置、Actions 真实上传、网页人工批准及公开安装仍待用户操作与分别批准。workflow YAML 仅本地审查，未由 GitHub 远程执行。只声明 WXT 0.21.4、Node.js 24.16.0；入口解析异常属于上游限制；目录替换非无间断原子交换，并发写入不保证字节快照。不推送或发布。

## 用户验收

本地交付已通过。2026-10-13 用户在看到目录、公开说明、暂存发布与下拉选择交付后明确要求“拆下commit 提交到本地”，按仓库规则确认本轮本地验收并批准两笔本地提交；浏览器实际操作和远程发布仍待验证。用户表示已配置 `NPM_TOKEN`，代理未独立核验 Secret 或账号权限。

## 最终提交批准

2026-10-13 本轮修正已验收并批准拆为两笔本地提交，按下列边界完成；完成事实以两笔 Git Commit 成功为准。不推送或发布。

第一笔范围：工具包目录迁移、中英文 README、包元信息、锁文件、根规范和文档中的目录引用。第二笔范围：workflow、发布器及测试、发布指导、Spec/Plan 暂存设计，以及 Issue、Commit 记录和工作台本轮验收与提交状态。

第一笔完整 message：

```text
chore(wxt-stable-output): 统一源码目录并精简公开说明

- 统一工具包目录与工作区路径引用
- 精简面向使用者的中英文 README
```

第二笔完整 message：

```text
ci(npm-release): 改用暂存发布并提供包名选择

- 使用 stage-only Token 上传已验证产物到 npm 暂存区
- 提供公开包下拉选择与网页人工批准说明
```

随提交仅更新本轮验收、提交批准及提交完成记录；整体 Issue 保持待验收，不关闭、不推送、不发布。提交失败时恢复本轮待提交、待批准，已成功的第一笔事实不回退。下文两笔提交批准仅对应 2026-10-12 已提交范围。

已批准两笔本地提交。用户于 2026-10-12 明确要求提交到本地；提交完成事实以两笔 Git Commit 成功为准，不推送或发布。

## 用户要求的 Commit 拆分

用户于 2026-10-12 要求拆分本次 Commit，并在看到完整范围与 message 后批准两笔本地提交，作为本工作项通常只对应一笔最终交付 Commit 的例外。不新增活动 Issue，测试与说明跟随对应交付，不单独创建测试或文档 Commit。

### 第一笔：修复稳定产物同步

文件范围：

- `packages/stable-extension-dev/src/index.mjs`
- `packages/stable-extension-dev/src/index.d.ts`
- `packages/stable-extension-dev/tests/publish-stable-build.test.mjs`

交付：WXT 增量构建先同步再重载、失败保留及恢复、关闭取消旧通知、重叠目录拒绝与暂存清理。此提交不更换 npm 包名或发布配置。

```text
fix(wxt-stable-output): 修复增量产物同步与失败恢复

- 在转发 WXT 重载通知前同步完整开发产物
- 构建失败时保留旧产物并拒绝重叠目录和过期通知
```

### 第二笔：准备公开 npm 包与手动发布

文件范围：

- `packages/stable-extension-dev/package.json`、`README.md`、`README.zh-CN.md`、`LICENSE`、`CHANGELOG.md`
- `packages/stable-extension-dev/scripts/verify-package.mjs`、`scripts/verify-wxt.mjs`、`tests/consumer-types.mts`
- `packages/npm-release-tools/package.json`、`publish.mjs`、`tests/publish.test.mjs`
- `apps/extension/package.json`、`apps/extension/wxt.config.ts`、`pnpm-lock.yaml`
- `.github/workflows/npm-packages-publish.yml`、`.github/workflows/exts-chrome-release.yml`
- `docs/npm-release.md`、`docs/build-release.md`、`docs/changes/README.md`
- 本工作项 Issue、Commit 记录、Spec、Plan

交付：公开包配置、内部改名、独立消费验证、共用手动 workflow、发布验收说明和工作项记录。独立验证器复用共用发布工具，保持两者同一笔交付，避免中间提交缺少验证工具。

```text
chore(wxt-stable-output): 配置公开包与手动发布流程

- 准备个人 scope 公开包并验证独立安装与类型
- 建立共用 npm 手动发布流程和验收说明
```

## 批准后随提交执行的终态更新

- 本记录本地用户验收改为已通过，两笔本地提交批准改为已批准。
- Issue 与工作台记录本地交付已验收并提交；整体仍待验收，唯一下一步为用户实际加载与首次发布准备，不关闭 Issue。
- npm 首发、Trusted Publisher 与 Action 远程验收仍未完成，不推送或发布。
- 第二笔提交失败时恢复本地待提交、待批准，不留下虚假的两笔提交完成状态；第一笔成功记录不被回退或改写。
