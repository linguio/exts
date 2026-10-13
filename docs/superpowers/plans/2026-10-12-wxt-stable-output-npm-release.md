# WXT 稳定产物 npm 发布实施 Plan

> 执行方式：使用 superpowers:executing-plans 在当前会话串行实施。用户已要求继续；根 AGENTS.md 禁止子代理、并行任务与未经批准的 Git 操作，不创建新 worktree，不提交或推送。

## 目标与依据

公开包 `@linguio/wxt-stable-output` 完成稳定产物同步、独立打包消费和共用手动发布准备，交付用户验收。

- [Spec](../specs/2026-10-12-wxt-stable-output-npm-release-design.md)
- [Issue](../../changes/issues/2026-10-12-wxt-stable-output-npm-release-issue.md)
- 架构：完整构建 hook 加开发服务器重载通知，复用校验与目录恢复；手动 workflow 只发布一个明确包的已验证 tarball。
- 技术：Node.js 24.16.0、pnpm 12.4.2、发布流程 npm 11.15.0（2026-10-13 暂存命令所需升级）、WXT 0.21.4、Vitest 5.0.0、TypeScript 7.0.2。
- 全局约束：全部精确版本、中文代码注释、根 dist 产物、内部 workspace 引用、无 UI 自动化、无远程状态变更。

## 任务一：完成开发同步与类型边界

文件：`packages/wxt-stable-output/src/index.mjs`、`src/index.d.ts`、`tests/publish-stable-build.test.mjs`。

接口：保留现有发布器；hook 增加 `server:created`、`server:started`、`server:closed`，完整构建仍用 `build:done`。

- [x] 先写重载前同步、失败保留与恢复、关闭/重启、参数上下文保留的必要行为测试并观察失败。
- [x] 实现串行同步；捕获当前 output、来源和目标，失败不转发，重复通知不重复发布，关闭取消未开始任务。
- [x] 补源/目标重叠保护，避免公开 API 的错误路径触发递归复制或替换源目录；用文件行为验证。
- [x] 运行针对性测试并确认新增行为与原恢复逻辑通过。

## 任务二：独立 npm 包与共用发布准备

文件：包 `package.json`、README/README.zh-CN、LICENSE/CHANGELOG、包内验证脚本；扩展 package/config、已有 release workflow 中的包引用；`pnpm-lock.yaml`、`docs/build-release.md`。

接口：包脚本提供 `test`、`typecheck`、`verify:integration`；每个发布包用 `npmRelease.verify` 声明自己的串行验证脚本，共用发布器执行该脚本，不假设其他包都是 WXT。

- [x] 改名、完善公开包元信息、精确 peer/dev 依赖和发布白名单，更新内部引用并安装锁定依赖。
- [x] 独立 tarball 安装后检查导出与类型，用真实 WXT 有界程序测试首次/增量/失败/恢复；生成物只进根 dist 下的专属缓存。
- [x] 完善中英文说明、首版变更和独立版本规则，不宣传未验证版本或无间断原子切换。

## 任务三：共用手动发布 Action 与交付

文件：`.github/workflows/npm-packages-publish.yml`、`packages/npm-release-tools/publish.mjs`、对应纯 Node 测试、`docs/npm-release.md`、工作项文档。

接口：发布辅助包私有，只接受 `packages` 中完全匹配的公开包；验证脚本通过元信息明确配置，参数不进入 Shell 拼接。

- [x] 先写选择包、拒绝私有/非法包、已有版本/查询失败、tarball 元信息检查的真实风险测试并观察失败。
- [x] 实现准备阶段的查询、串行验证和打包，发布阶段使用准备产物并核对；只查询明确 npm registry，404 以外错误中止。
- [x] 手动 workflow 限 main、包输入经环境传递、精确工具版本、同包串行；2026-10-13 以 stage-only Token 替代 OIDC 直接发布，不变更版本或 Git 状态。
- [x] 完成一次完整验证：包测试/类型/真实集成、发布器测试、扩展测试/类型/生产构建、diff 和包清单检查；无新增变化不重复全量运行。
- [x] 补实际交付记录、待验收状态与验收指导，展示完整 Commit message，停在用户验收。

## Review Focus

2026-10-13 用户追加批准：以 stage-only Token 上传暂存区，网页人工批准替代 Actions 直接发布。实施顺序：

- [x] 先验证暂存命令、失败结果和产物篡改的行为边界，再将共用发布器改为 `stage`。
- [x] workflow 固定 npm 11.15.0，仅 stage 上传步骤接收 `NPM_TOKEN`，不执行正式发布或批准。
- [x] 按用户追加确认改为 GitHub 原生包名下拉选择，选项覆盖全部当前公开包且不含私有工具，发布指导已同步；配置清单与 diff 检查通过，页面实际展示待远程验收。
- [x] 同步发布指导与工作项记录；发布工具 8 项、真实 CLI dry-run 和 prepare 通过；不重复无关扩展验证，不运行远程 Action。
- [x] 提供修改、实际验证和远程限制；2026-10-13 用户明确要求拆分本地提交，确认本轮本地验收并批准两笔提交。浏览器、推送、远程上传与正式发布仍待验证或批准。

- 不同目录之间有父子关系时必须先拒绝，不影响原目录。
- 增量通知的同步和 WXT 后续写入不能把半成品送给浏览器，实际 WXT 验证必须覆盖。
- 同步失败后队列可继续恢复；关闭/重启不把过期通知送给新实例。
- 输入包名、工作目录和 tarball 不得可注入命令，不信任 registry 网络错误为未发布。
- workspace 开发通过不能替代独立 tarball 安装和类型解析。

## 执行记录

- 2026-10-12：用户要求继续；Spec 已批准，采用当前 checkout 串行实施，工作项记录兼任执行 ledger，禁止子代理和未经批准的 Git 操作优先于技能默认流程。
- 自动化、浏览器验收、远程发布分别记录，最终验收未通过前不标已完成。
- 本地三个任务已实施并验证，唯一未完成项是用户浏览器及远程验收；具体命令、结果与产物路径记录在 Issue/Commit。
- 判定：按用户串行约束自行审查全量改动，不启动 requesting-code-review 技能默认的 reviewer 子代理。
- 判定：增量失败用缺失依赖覆盖；入口语法错误导致 WXT 解析阶段终止属于上游限制，不为测试更改正常业务代码。
- 判定：无依赖私有工具 importer 手动补为 `{}`；离线缺少供应链元数据时用 frozen 在线只读元数据核对，成功且依赖版本未变。
