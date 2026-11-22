# 统一发布入口与任务展示名称

## 元信息

- 工作项：2026-10-14-repo-publish-display-names
- 项目：repo
- 类型：小型配置展示调整
- 状态：已完成
- 创建日期：2026-10-14
- 当前阶段：本地交付已验收并批准结项提交，远程 Actions 尚未验证
- 用户批准：用户要求“按照讨论的改下去”，批准 Exts Publish、动态运行标题及六个 jobs 展示名称；随后要求“改完 完结issue 然后提交到本地”，表示本地验收通过并批准提交和记录终态更新，不包含推送或远程运行。

## 背景与目标

Actions 显示内部 job ID，且产品入口名称与 NPM Publish 不统一。按已讨论方案统一展示，让运行标题显示本次目标，jobs 显示对象和职责。

## 范围

- Exts Deploy 展示名称改为 Exts Publish。
- 动态标题：Exts Publish · 目标；NPM Publish · 包名。
- 六个 job 展示为 Website · Build、Website · Deploy、Chrome · Draft Release、Desktop · Draft Release、Package · Verify & Pack、Package · Stage Upload。
- 同步当前构建规范与官网操作指引；不改写历史工作项。

## 排除项

不修改文件名、内部 job ID、依赖、条件、权限、并发、版本与执行步骤；不接入 Desktop 发布；不推送或运行远程流程。

## Todo

- [x] 修改两份 workflow 展示名称和动态标题。
- [x] 同步当前操作文档名称。
- [x] 对比配置确认仅展示字段变化，检查 diff，提供验收步骤。
- [x] 用户验收通过并批准本地提交，完成状态随交付提交结项。

## 验收标准

新运行显示 Exts Publish 或 NPM Publish，标题包含所选目标或包名，六个 jobs 使用批准名称。Desktop 名称虽为 Draft Release，仍明确提示未接入且不产生发布产物；执行行为和跳过规则不变。

## 关联文档

- [Commit 记录](../commits/2026-10-14-repo-publish-display-names-commit.md)
- [工作台](../README.md)

## 唯一下一步

无；用户已验收并批准本地结项提交，不自动推送、运行远程流程或开始队列事项。

## 验证结果与验收步骤

- 两份 workflow 的入口、run-name 输入表达式、六个 job name 核对通过。剔除新增 run-name/job name 并恢复顶层旧名称后，文件与 HEAD 完全一致，确认执行配置未改。
- 构建规范和官网 README 与 HEAD 对比仅有 Exts Deploy → Exts Publish 替换，git diff --check 通过。
- 仅配置展示与文档变更，不运行应用测试、类型检查或构建；未执行独立 YAML 解析器或远程 Actions。
- 用户审核两份 workflow 的名称表和表达式。批准提交并自行推送后，Actions 入口应显示 Exts Publish 与 NPM Publish。
- 用新运行检查标题：Exts Publish · Website/Chrome/Desktop，NPM Publish · 所选完整包名；All jobs 显示本 Issue 范围内的名称，未选中目标仍按原规则跳过。
- Desktop · Draft Release 仅为批准的展示名称，步骤和摘要仍明确发布未接入、不生成产物。不要为名称验收重复上传已有 npm 版本或重复创建 Release；真实发布运行由用户自行决定。
- 本地修改不会改变 GitHub 当前配置，历史运行不作为新名称验收依据。
