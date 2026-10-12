# 公开发布 WXT 稳定产物工具并建立手动发布流程：Commit 记录

## 对应 Issue

- [Issue](../issues/2026-10-12-wxt-stable-output-npm-release-issue.md)

## 预期交付边界

将现有内部工具整理为公开的 `@linguio/wxt-stable-output`，明确兼容与同步边界，保留仓库内 workspace 使用，建立可供多个包共用的手动 npm 发布流程及操作说明。

## 实际交付

- 已将包整理为公开发布配置的 `@linguio/wxt-stable-output@1.0.0`，保留本地 workspace 与源码目录，补齐精确 peer、公开类型、许可证、中英文文档和变更说明。
- 在完整构建发布之外，增量重建先同步再转发 WXT 重载通知；失败不转发，后续成功可恢复，关闭取消排队通知。补充目录重叠保护与部分复制失败的暂存清理。
- 新增私有共用发布工具和手动 npm workflow，限制公开目标包，串行验证、打包，发布 job 核对同一提交和 SHA-512，使用 OIDC；不自动改版本或提交。
- 提供独立 tarball/真实 WXT 验证器与浏览器、首发、Trusted Publisher、后续 Action 操作说明。仅完成本地发布准备，未实际公开发布。

## 验证结果

- 包行为 10 项、共用发布规则 3 项、扩展逻辑/架构 15 项测试通过。
- 包公开类型和扩展类型检查通过；一次扩展生产构建通过。
- 共用 prepare 全流程成功：tarball 独立消费、真实 WXT 首次/增量脚本与静态文件/失败保留/恢复/重启通过；最终 tarball 7 个必要文件，包名、版本和清单复核通过。
- 在线 frozen-lockfile 安装及供应链元数据检查通过；第三方依赖未升级。
- `git diff --check`、UTF-8 和新增文档关联链接检查作为最终文档收尾检查。

## 未验证事项与限制

浏览器实际加载、npm 账号发布权限、首次发布、Trusted Publisher 配置及 Actions 远程执行仍待用户操作与分别批准。只声明 WXT 0.21.4、Node.js 24.16.0；入口解析异常属于上游限制；目录替换非无间断原子交换，并发写入不保证字节快照。不推送或发布。

## 用户验收

本地交付已通过。用户在看到交付与拆分材料后明确要求提交到本地，按仓库规则表示接受已展示范围；浏览器实际操作和远程发布仍待验证。

## 最终提交批准

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
