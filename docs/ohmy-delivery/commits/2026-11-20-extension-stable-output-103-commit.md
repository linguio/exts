# 准备公共包新版本并统一消费来源：交付记录

## 对应工作项

- [Issue](../issues/2026-11-20-extension-stable-output-103-issue.md)

## 本阶段实际交付

- exts-ui本地包0.4.0、主页直达packages/exts-ui、keywords为shadcn-ui/ui/components；扩展同步workspace:0.4.0与锁文件。
- WXT源码包准备1.1.0、主页直达packages/wxt-stable-output、keywords为wxt/chrome/extension。两包Git URL及repository.directory保留，中文Changelog写入审定的元数据更新，不修改README或根产品版本。
- 扩展仍消费线上WXT 1.0.3：1.1.0尚未正式发布，不能提前引用。相对HEAD的1.0.1消费升级至1.0.3及目标精确发布年龄例外属于此前已验证的中间状态，本阶段保留。
- 更新消费/发布说明，元数据队列已并入本Issue。最终目标“线上WXT 1.1.0 + 本地UI 0.4.0”尚未全部完成。

## 本轮验证与限制

- pnpm install --no-frozen-lockfile及pnpm install --frozen-lockfile通过。
- UI verify:npm：7项逻辑、类型、ESM/CSS、真实tarball独立类型/消费者构建通过；fixture：dist/.cache/exts-ui-verify/c3ae6602-6e64-44ff-b2dc-4d09bc700686。
- WXT verify:npm：10项、类型、真实tarball独立安装、WXT首次/增量/失败保留/恢复/完整重启通过；fixture：dist/.cache/npm-verify/wxt-stable-output-2AedsS。
- 两个真实tarball独立安装后的package.json已逐项核对版本、homepage、keywords、repository.url/directory，字段未丢失。
- 扩展typecheck及ext:build通过，产物dist/build/chrome-mv3。实际解析：UI指向packages/exts-ui 0.4.0；WXT为.pnpm的线上1.0.3。未跑无关181项业务测试，未引入新框架或数据镜像测试。
- registry复核UI 0.4.0与WXT 1.1.0均404，没有上传/正式发布。既有peer、theme-init及大chunk提示保留。浏览器与macOS实机未验证，不称为完成验收。

## 用户验收

2026-11-20用户明确“验收通过 push”，批准发布前阶段交付、代码/文档两笔提交及推送。复用既有验证，不追加检查。只有正式发布后npm展示字段才会更新，WXT 1.1.0最终消费切换尚未完成。

## WXT 1.1.0 消费切换

- npm 官方源确认 1.1.0 可安装。扩展精确引用、锁文件及发布年龄例外切换至 1.1.0，安装后的包版本已核实。exts-ui 继续使用本地 Workspace 0.4.0。
- 安装、冻结安装、扩展类型检查及 Chrome 生产构建通过。安装报告 peer 警告，构建报告 theme-init 非 module 与大 chunk 警告。Chrome 或 Edge 的稳定目录加载与更新尚未验证。
- 用户于 2026-11-21 确认本次消费切换验收通过并批准本地提交。浏览器具体验收步骤未提供，macOS 实机未执行。

### 本次消费切换提交

代码文件为 `apps/extension/package.json`、`pnpm-workspace.yaml`、`pnpm-lock.yaml`。

```text
fix(extension): 切换到正式发布的 WXT 稳定产物工具

- 固定消费 npm 1.1.0 并同步锁文件与精确版本例外
```

文档文件为 `docs/build-release.md`、`docs/npm-release.md`、本 Issue、本记录和工作台中的该 Issue 条目。

```text
docs(repo): 完结公共包依赖切换

- 记录线上 WXT 1.1.0 与本地 exts-ui 0.4.0 的消费结果
- 记录验收与验证结果并归档本地工作项
```

本次批准范围为上述两笔本地提交及 Issue、Commit 记录和工作台终态更新。

## 当前阶段提交方案

代码7文件：apps/extension/package.json、pnpm-lock.yaml、pnpm-workspace.yaml、两包package.json及各自CHANGELOG.md。

```text
chore(packages): 准备UI0.4.0与稳定产物工具1.1.0

- 统一双包主页、关键词及中文更新记录
- 同步UI本地Workspace引用与锁文件
- WXT消费暂保留已发布的线上1.0.3
```

文档7文件：docs/build-release.md、docs/npm-release.md、docs/ohmy-delivery/README.md、本Issue/本记录及已并入的主页关键词Issue/Commit记录。

```text
docs(repo): 记录双包发布前准备与线上切换顺序

- 记录包元数据及独立消费者验证结果
- 明确WXT正式发布后的依赖切换步骤
```

若用户批准本阶段提交，先展示最终文件范围及状态更新；记录阶段验收/批准与提交结果，保留未发布及最终依赖尚未切换的事实，不追加无关检查，不自动推送或正式发布。

## 最终提交批准

已批准：2026-11-20用户“验收通过 push”。按已展示的7个代码/配置文件、7个文档文件及消息分两笔提交，再推送main。授权只覆盖当前阶段及既有自动暂存，npm正式发布仍由用户手动批准，后续线上依赖切换需按实际新diff展示与验收。
