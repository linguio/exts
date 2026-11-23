---
date: "2026-11-19"
scope: [packages, extension, build]
status: completed
type: task
---

# 恢复本地 UI 联调并验证双包自动暂存

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

用户已发布并验收exts-ui 0.1.0的真实npm消费。该版本用于测试，库仍需持续开发；恢复Workspace联调，沿用本工作项完成两个包的说明与版本准备，为现有手动暂存流程增加按版本检测的自动触发。

### 范围与排除项

- 扩展恢复精确workspace:0.2.0与dev/build前置包构建，不升级扩展当前消费的wxt-stable-output 1.0.1。
- exts-ui 0.2.0参考wxt工具包完善默认中文README、英文README.en.md、安装与能力说明、源码/npm及许可入口；保留现有MIT（两包已相同）与第三方声明。
- wxt-stable-output 1.0.2默认README改中文，保留英文文档入口及已有中文入口兼容，功能/API/依赖要求不变。
- 同一NPM Publish在main推送时逐包判断版本，验证后使用既有stage-only NPM_TOKEN上传暂存区，保留手动重试；用户手动正式发布，不接入OIDC，不添加Git tag或GitHub Release。
- 复用既有产物与校验凭据；push按推送前后包版本变化触发，版本不变或已正式发布时跳过，registry异常或校验失败中止。已有同版本暂存项的手动重试由npm拒绝，并提示先检查旧草稿。双包串行处理。
- 同步规范与发布文档。用户已确认双包版本及中文Changelog草稿；Git提交和推送须展示具体范围与消息，不将预期自动触发记为已上传或发布。

## Todo

- [x] 收敛双包中英文README与WXT旧中文入口，仅保留定位、价值、要求、安装和文档导航。
- [x] 详细接入移至独立使用文档，维护流程指向已有仓库文档；检查链接与语言对应，不运行无关业务测试。

## 验收标准

- 本地UI源码可通过既有ext:dev/ext:build入口进入扩展；固定Workspace版本与包版本一致。
- npm最终包包含正确版本、默认中文README、MIT及必要第三方声明；wxt英文入口可用。
- main推送时只有新版本被暂存，重复推送不覆盖或重复上传；registry异常或验证失败不继续上传。
- 无OIDC、正式自动发布及额外tag/Release；npm暂存项由用户检查和批准。实际Actions与暂存结果须远端核实。
- Toast/Sheet视觉交互由用户验收；此前线上0.1.0消费已通过，不代替本次最终验收。

## 唯一下一步

无。

## 交付记录

### README交付修正

- 用户反馈npm README混入组件手册与仓库维护内容，批准统一收敛。沿用本Issue重新打开，不改历史提交，不新增版本或Changelog，不修改源码、配置、测试及发布流程。
- exts-ui默认中文与英文各29行，wxt默认中文、英文与旧中文各31行；保留定位、价值、必要要求、安装及文档/许可链接。
- 详细接入迁入docs/packages中两包各自中英文使用文档，原API与示例保留；本地构建/联调/发布指向既有build-release与npm-release维护文档。
- 44处本地文档链接检查及git diff --check通过；GitHub文档链接映射仓库文件核对，未声称远端新链接已上线。npm页面读取受限，未修改线上内容。
- 本次纯文档，不运行扩展181项测试、类型检查或构建；用户审阅两包README的定位、结构与中英文对应即可验收。未提交、推送、升版本或发布。

- [x] 恢复Workspace联调并更新锁文件和消费说明。
- [x] 审定并写入双包版本、Changelog，完善README与许可说明。
- [x] 实现逐包版本检测与自动暂存，覆盖跳过、失败和校验边界。
- [x] 完成受影响包及消费者验证，记录验收、NPM_TOKEN与远端待验证事项。

### 验证与验收步骤

- 双包verify:npm通过：exts-ui类型、7项逻辑、ESM/CSS构建、真实tarball独立安装与消费者类型/构建；wxt类型、10项逻辑及真实tarball的WXT首次构建、增量、失败保留、恢复与重启。两个包打包检查均要求中文默认及英文README，MIT存在，exts-ui保留第三方声明。
- 发布工具11项测试通过；扩展typecheck、43文件181项逻辑及ext:build通过。registry只读核对目标0.2.0及1.0.2均未发布。不使用旧阶段结果替代本轮验证。
- 保留既有声音/复制/消息纯逻辑、稳定发布文件及恢复行为测试、发布凭据校验；补充版本检测的真实发布决策覆盖及双语文档产物完整性校验，不引入视觉/DOM测试。
- 安装仍有既有peer提示，扩展仍有theme-init非module及大chunk提示。本次只发布独立npm包，不更改根产品版本，不运行无关网站/API/macOS产品发布检查。
- workflow已人工核对main入口、串行matrix、Token仅最后上传步骤、同提交产物校验及无OIDC/正式发布命令；本机没有可直接解析该YAML的既有模块，未新增依赖，不声称Actions已验证。
- 浏览器可加载dist/build/chrome-mv3检查Edit Daily与Toast；开发模式重启pnpm ext:dev后使用dist/dev/chrome-mv3-dev-stable。本地包真实路径指向packages/exts-ui。
- 审阅两个包中英文README和中文CHANGELOG；授权提交并推送main后检查NPM Publish两个串行任务、artifact及暂存编号；在npm Staged Packages检查0.2.0、1.0.2再手动批准。缺少/失效NPM_TOKEN会中止，需用户核实Secret。
- 远端Actions、npm暂存和正式发布尚未执行，浏览器交互由用户验收。

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-19-extension-registry-ui-issue.md)

#### 预期交付边界

恢复扩展精确Workspace联调，准备exts-ui 0.2.0、wxt-stable-output 1.0.2中英文说明与中文Changelog，main版本变化时自动验证并暂存，用户手动批准正式发布。不接入OIDC，不新增tag/Release，不修改组件API或业务逻辑。

#### 实际交付

- 用户确认双包版本与中文Changelog草稿后写入；扩展恢复workspace:0.2.0及dev/build前置UI构建，锁文件同步，真实路径指向packages/exts-ui。扩展消费wxt正式1.0.1保持。
- 两包README.md默认中文、README.en.md为英文入口并互链；wxt原README.zh-CN.md入口保留。两包打包及产物完整性校验包含英文文档。CHANGELOG仅维护中文。
- 两包LICENSE原本完全一致，保留MIT与2026 Kevin版权，exts-ui第三方声明保持。
- NPM Publish新增main push、推送前后逐包版本比较、registry存在性检查与串行任务，沿用tarball、同提交SHA-512凭据及stage-only Token，仅上传暂存区。版本不变跳过；失败可手动重试，已有暂存项由npm拒绝并提示检查，无OIDC或自动批准步骤。
- 改写本Issue与工作台，更新规范与发布指导，不新建Issue。根产品版本未改。

#### 验证与限制

- 安装成功。恢复期间遗留registry锁记录曾触发发布年龄策略；保留原精确例外完成清理后移除例外，未放宽全局策略。
- exts-ui verify:npm通过：类型检查、3文件7项逻辑、ESM/CSS构建、真实tarball独立类型与消费者构建；产物dist/.cache/exts-ui-verify/d66957e1-2a5e-405a-b4e1-cb7a36e6bffe/linguio-exts-ui-0.2.0.tgz。
- wxt-stable-output verify:npm通过：类型、10项逻辑、真实tarball安装和WXT首次构建、增量脚本/静态同步、失败保留、恢复及重启；产物目录dist/.cache/npm-verify/wxt-stable-output-DnwKiM。
- 发布工具11项测试通过，覆盖未变化/已发布跳过、未发布选择、手动重试、查询失败、同提交/校验和及暂存失败；复用对应当前实现的结果。两包README与许可文件检查通过。
- 扩展本轮typecheck、43文件181项逻辑及ext:build通过，产物dist/build/chrome-mv3；没有用线上阶段旧结果代替。
- 只读registry查询确认0.2.0与1.0.2尚未正式发布。workflow人工核对main入口、串行matrix、Token仅上传步骤、校验及无OIDC/正式发布命令；尝试使用既有模块解析YAML时根入口及WXT作用域均不可用，停止工具探测，未新增依赖或声称已通过Actions验证。
- 保留声音/复制/消息纯逻辑、稳定目录恢复行为及发布凭据校验；补充版本选择行为与双语打包完整性检查，无视觉/DOM测试。范围只覆盖独立npm包及直接消费者，不触发根产品/macOS发布检查。
- 安装既有peer提示、扩展既有theme-init非module及大chunk提示保留；未执行浏览器交互或远端CI。未操作Token/Secret、推送、上传或正式发布，NPM_TOKEN有效性待用户远端核实。普通push不重试失败上传，使用手动入口。

#### 用户验收

线上0.1.0消费已通过；2026-11-19用户明确“验收通过 push”，批准当前双包交付、代码与文档两笔提交及推送。既有验证结果复用，不追加验证。

授权推送main后检查NPM Publish两个串行任务、artifact与暂存编号；npm Staged Packages核对0.2.0、1.0.2及内容，再由用户手动批准。远端流程尚未运行，本地通过不等于已上传或正式发布。

#### 提交方案

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

计划类文档7文件：AGENTS.md、apps/extension/AGENTS.md、docs/build-release.md、docs/npm-release.md、docs/ohmy-delivery/readme.md、本Issue及本记录。

```text
docs(repo): 记录双包自动暂存配置与验证结果

- 同步本地联调与版本自动暂存规范
- 记录双包版本、验证结果和远端验收步骤
```

收到明确本地提交指令后，文档提交随附的机械性终态更新仅为：Issue及工作台改已完成，记录验收/批准状态与实际提交结果，下一步改为等待获准推送验证。代码与文档分开提交，任一失败保留成功结果并恢复未完成部分状态。推送及正式发布另需明确授权。

#### 最终提交批准

已批准：2026-11-19用户“验收通过 push”。按已展示范围提交代码与文档，再推送main；本记录提交时尚未推送或上传，远端结果在实际运行后报告，不自动批准npm正式发布。

#### README交付修正（本轮）

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

## 关联文档

- [前置交付](2026-11-18-exts-ui-toast-package-issue.md)
- [发布说明](../../../npm-release.md)

## 历史补充

### 元信息

- 当前阶段：用户确认README修正并批准本地文档提交；未推送、升版本或发布
- 批准依据：用户要求改回本地、改写本Issue，准备exts-ui 0.2.0及wxt-stable-output 1.0.2；最新明确不接入OIDC，只自动上传npm暂存区，手动正式发布。
- 规模：公共包发布流程变更，不修改业务、组件API或根产品版本。

### 历史后续事项

本轮README修正随本地文档提交完结；推送、版本与发布另行批准，当前不修改npm线上页面。
