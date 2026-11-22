# 恢复本地 UI 联调并验证双包自动暂存：交付记录

## 对应工作项

- [Issue](../issues/2026-11-19-extension-registry-ui-issue.md)

## 预期交付边界

恢复扩展精确Workspace联调，准备exts-ui 0.2.0、wxt-stable-output 1.0.2中英文说明与中文Changelog，main版本变化时自动验证并暂存，用户手动批准正式发布。不接入OIDC，不新增tag/Release，不修改组件API或业务逻辑。

## 实际交付

- 用户确认双包版本与中文Changelog草稿后写入；扩展恢复workspace:0.2.0及dev/build前置UI构建，锁文件同步，真实路径指向packages/exts-ui。扩展消费wxt正式1.0.1保持。
- 两包README.md默认中文、README.en.md为英文入口并互链；wxt原README.zh-CN.md入口保留。两包打包及产物完整性校验包含英文文档。CHANGELOG仅维护中文。
- 两包LICENSE原本完全一致，保留MIT与2026 Kevin版权，exts-ui第三方声明保持。
- NPM Publish新增main push、推送前后逐包版本比较、registry存在性检查与串行任务，沿用tarball、同提交SHA-512凭据及stage-only Token，仅上传暂存区。版本不变跳过；失败可手动重试，已有暂存项由npm拒绝并提示检查，无OIDC或自动批准步骤。
- 改写本Issue与工作台，更新规范与发布指导，不新建Issue。根产品版本未改。

## 验证与限制

- 安装成功。恢复期间遗留registry锁记录曾触发发布年龄策略；保留原精确例外完成清理后移除例外，未放宽全局策略。
- exts-ui verify:npm通过：类型检查、3文件7项逻辑、ESM/CSS构建、真实tarball独立类型与消费者构建；产物dist/.cache/exts-ui-verify/d66957e1-2a5e-405a-b4e1-cb7a36e6bffe/linguio-exts-ui-0.2.0.tgz。
- wxt-stable-output verify:npm通过：类型、10项逻辑、真实tarball安装和WXT首次构建、增量脚本/静态同步、失败保留、恢复及重启；产物目录dist/.cache/npm-verify/wxt-stable-output-DnwKiM。
- 发布工具11项测试通过，覆盖未变化/已发布跳过、未发布选择、手动重试、查询失败、同提交/校验和及暂存失败；复用对应当前实现的结果。两包README与许可文件检查通过。
- 扩展本轮typecheck、43文件181项逻辑及ext:build通过，产物dist/build/chrome-mv3；没有用线上阶段旧结果代替。
- 只读registry查询确认0.2.0与1.0.2尚未正式发布。workflow人工核对main入口、串行matrix、Token仅上传步骤、校验及无OIDC/正式发布命令；尝试使用既有模块解析YAML时根入口及WXT作用域均不可用，停止工具探测，未新增依赖或声称已通过Actions验证。
- 保留声音/复制/消息纯逻辑、稳定目录恢复行为及发布凭据校验；补充版本选择行为与双语打包完整性检查，无视觉/DOM测试。范围只覆盖独立npm包及直接消费者，不触发根产品/macOS发布检查。
- 安装既有peer提示、扩展既有theme-init非module及大chunk提示保留；未执行浏览器交互或远端CI。未操作Token/Secret、推送、上传或正式发布，NPM_TOKEN有效性待用户远端核实。普通push不重试失败上传，使用手动入口。

## 用户验收

线上0.1.0消费已通过；2026-11-19用户明确“验收通过 push”，批准当前双包交付、代码与文档两笔提交及推送。既有验证结果复用，不追加验证。

授权推送main后检查NPM Publish两个串行任务、artifact与暂存编号；npm Staged Packages核对0.2.0、1.0.2及内容，再由用户手动批准。远端流程尚未运行，本地通过不等于已上传或正式发布。

## 提交方案

代码提交成功；文档提交随本记录完成。代码/配置/发布包内容17文件：

- .github/workflows/npm-packages-publish.yml
- apps/extension/package.json、pnpm-lock.yaml
- packages/exts-ui/package.json、CHANGELOG.md、README.md、README.en.md、scripts/build.mjs、scripts/verify-package.mjs
- packages/wxt-stable-output/package.json、CHANGELOG.md、README.md、README.zh-CN.md、README.en.md、scripts/verify-package.mjs
- packages/npm-release-tools/publish.mjs、tests/publish.test.mjs

```text
ci(repo): 按包版本自动暂存双包并恢复本地联调

- 准备 exts-ui 0.2.0 与 wxt-stable-output 1.0.2，完善双语说明和中文日志
- main 推送版本变化时串行验证并上传 npm 暂存区，保留人工批准
- 扩展恢复精确 Workspace 引用并同步双语文档打包检查
```

计划类文档7文件：AGENTS.md、apps/extension/AGENTS.md、docs/build-release.md、docs/npm-release.md、docs/ohmy-delivery/README.md、本Issue及本记录。

```text
docs(repo): 记录双包自动暂存配置与验证结果

- 同步本地联调与版本自动暂存规范
- 记录双包版本、验证结果和远端验收步骤
```

收到明确本地提交指令后，文档提交随附的机械性终态更新仅为：Issue及工作台改已完成，记录验收/批准状态与实际提交结果，下一步改为等待获准推送验证。代码与文档分开提交，任一失败保留成功结果并恢复未完成部分状态。推送及正式发布另需明确授权。

## 最终提交批准

已批准：2026-11-19用户“验收通过 push”。按已展示范围提交代码与文档，再推送main；本记录提交时尚未推送或上传，远端结果在实际运行后报告，不自动批准npm正式发布。

## README交付修正（本轮）

- 前次代码、文档已提交推送且NPM Publish双包暂存成功；用户随后反馈README范围失当，批准收敛，原Issue重新打开。
- 本轮仅修改两包README中英文及WXT旧中文共5份，新增docs/packages/exts-ui.md、exts-ui.en.md、wxt-stable-output.md、wxt-stable-output.en.md以保留详细使用说明；维护内容指向既有仓库文档。
- README只保留定位、价值、必要要求、安装与文档/许可导航，移走组件示例、参数、声音/层级细节和构建/联调/发布说明。exts-ui中英文各29行，wxt各31行。
- 44处本地文档链接检查与git diff --check通过；远端GitHub链接仅映射本地文件核对，新文件尚未推送。npm页面抓取受限，以已发布对应仓库文本修改，不声称线上已更新。
- 纯文档未运行扩展181项测试、类型检查或构建；版本、Changelog、依赖、源码、配置与发布流程均未改。
- 本轮用户验收及提交批准：2026-11-19用户明确“没问题 commit”，批准纯文档本地提交，随提交将Issue与工作台恢复已完成。历史交付与验证保留，本轮未推送、升版本或发布。
- 本轮纯文档12文件：两包README中英文及WXT旧中文5份、docs/packages内使用说明4份、Issue/本记录/工作台3份。提交消息：

```text
docs(repo): 收敛双包介绍并分离详细使用文档

- 精简中英文 README 为定位、能力、安装和文档导航
- 独立维护详细接入说明并沿用仓库维护文档
```
