# 恢复本地 UI 联调并验证双包自动暂存

## 元信息

- 工作项：2026-11-19-extension-registry-ui（沿用原文件与关联记录，不新建Issue）
- 状态：已完成
- 当前阶段：用户确认README修正并批准本地文档提交；未推送、升版本或发布
- 批准依据：用户要求改回本地、改写本Issue，准备exts-ui 0.2.0及wxt-stable-output 1.0.2；最新明确不接入OIDC，只自动上传npm暂存区，手动正式发布。
- 规模：公共包发布流程变更，不修改业务、组件API或根产品版本。

## 背景与目标

用户已发布并验收exts-ui 0.1.0的真实npm消费。该版本用于测试，库仍需持续开发；恢复Workspace联调，沿用本工作项完成两个包的说明与版本准备，为现有手动暂存流程增加按版本检测的自动触发。

## 范围与排除项

- 扩展恢复精确workspace:0.2.0与dev/build前置包构建，不升级扩展当前消费的wxt-stable-output 1.0.1。
- exts-ui 0.2.0参考wxt工具包完善默认中文README、英文README.en.md、安装与能力说明、源码/npm及许可入口；保留现有MIT（两包已相同）与第三方声明。
- wxt-stable-output 1.0.2默认README改中文，保留英文文档入口及已有中文入口兼容，功能/API/依赖要求不变。
- 同一NPM Publish在main推送时逐包判断版本，验证后使用既有stage-only NPM_TOKEN上传暂存区，保留手动重试；用户手动正式发布，不接入OIDC，不添加Git tag或GitHub Release。
- 复用既有产物与校验凭据；push按推送前后包版本变化触发，版本不变或已正式发布时跳过，registry异常或校验失败中止。已有同版本暂存项的手动重试由npm拒绝，并提示先检查旧草稿。双包串行处理。
- 同步规范与发布文档。用户已确认双包版本及中文Changelog草稿；Git提交和推送须展示具体范围与消息，不将预期自动触发记为已上传或发布。

## Todo

- [x] 收敛双包中英文README与WXT旧中文入口，仅保留定位、价值、要求、安装和文档导航。
- [x] 详细接入移至独立使用文档，维护流程指向已有仓库文档；检查链接与语言对应，不运行无关业务测试。

## README交付修正

- 用户反馈npm README混入组件手册与仓库维护内容，批准统一收敛。沿用本Issue重新打开，不改历史提交，不新增版本或Changelog，不修改源码、配置、测试及发布流程。
- exts-ui默认中文与英文各29行，wxt默认中文、英文与旧中文各31行；保留定位、价值、必要要求、安装及文档/许可链接。
- 详细接入迁入docs/packages中两包各自中英文使用文档，原API与示例保留；本地构建/联调/发布指向既有build-release与npm-release维护文档。
- 44处本地文档链接检查及git diff --check通过；GitHub文档链接映射仓库文件核对，未声称远端新链接已上线。npm页面读取受限，未修改线上内容。
- 本次纯文档，不运行扩展181项测试、类型检查或构建；用户审阅两包README的定位、结构与中英文对应即可验收。未提交、推送、升版本或发布。

- [x] 恢复Workspace联调并更新锁文件和消费说明。
- [x] 审定并写入双包版本、Changelog，完善README与许可说明。
- [x] 实现逐包版本检测与自动暂存，覆盖跳过、失败和校验边界。
- [x] 完成受影响包及消费者验证，记录验收、NPM_TOKEN与远端待验证事项。

## 验证与验收步骤

- 双包verify:npm通过：exts-ui类型、7项逻辑、ESM/CSS构建、真实tarball独立安装与消费者类型/构建；wxt类型、10项逻辑及真实tarball的WXT首次构建、增量、失败保留、恢复与重启。两个包打包检查均要求中文默认及英文README，MIT存在，exts-ui保留第三方声明。
- 发布工具11项测试通过；扩展typecheck、43文件181项逻辑及ext:build通过。registry只读核对目标0.2.0及1.0.2均未发布。不使用旧阶段结果替代本轮验证。
- 保留既有声音/复制/消息纯逻辑、稳定发布文件及恢复行为测试、发布凭据校验；补充版本检测的真实发布决策覆盖及双语文档产物完整性校验，不引入视觉/DOM测试。
- 安装仍有既有peer提示，扩展仍有theme-init非module及大chunk提示。本次只发布独立npm包，不更改根产品版本，不运行无关网站/API/macOS产品发布检查。
- workflow已人工核对main入口、串行matrix、Token仅最后上传步骤、同提交产物校验及无OIDC/正式发布命令；本机没有可直接解析该YAML的既有模块，未新增依赖，不声称Actions已验证。
- 浏览器可加载dist/build/chrome-mv3检查Edit Daily与Toast；开发模式重启pnpm ext:dev后使用dist/dev/chrome-mv3-dev-stable。本地包真实路径指向packages/exts-ui。
- 审阅两个包中英文README和中文CHANGELOG；授权提交并推送main后检查NPM Publish两个串行任务、artifact及暂存编号；在npm Staged Packages检查0.2.0、1.0.2再手动批准。缺少/失效NPM_TOKEN会中止，需用户核实Secret。
- 远端Actions、npm暂存和正式发布尚未执行，浏览器交互由用户验收。

## 验收标准

- 本地UI源码可通过既有ext:dev/ext:build入口进入扩展；固定Workspace版本与包版本一致。
- npm最终包包含正确版本、默认中文README、MIT及必要第三方声明；wxt英文入口可用。
- main推送时只有新版本被暂存，重复推送不覆盖或重复上传；registry异常或验证失败不继续上传。
- 无OIDC、正式自动发布及额外tag/Release；npm暂存项由用户检查和批准。实际Actions与暂存结果须远端核实。
- Toast/Sheet视觉交互由用户验收；此前线上0.1.0消费已通过，不代替本次最终验收。

## 关联文档

- [Commit记录](../commits/2026-11-19-extension-registry-ui-commit.md)
- [前置交付](2026-11-18-exts-ui-toast-package-issue.md)
- [发布说明](../../npm-release.md)

## 唯一下一步

本轮README修正随本地文档提交完结；推送、版本与发布另行批准，当前不修改npm线上页面。
