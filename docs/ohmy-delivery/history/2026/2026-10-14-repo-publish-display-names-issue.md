---
date: "2026-10-14"
scope: repo
status: completed
type: task
---

# 统一发布入口与任务展示名称

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

Actions 显示内部 job ID，且产品入口名称与 NPM Publish 不统一。按已讨论方案统一展示，让运行标题显示本次目标，jobs 显示对象和职责。

### 范围

- Exts Deploy 展示名称改为 Exts Publish。
- 动态标题：Exts Publish · 目标；NPM Publish · 包名。
- 六个 job 展示为 Website · Build、Website · Deploy、Chrome · Draft Release、Desktop · Draft Release、Package · Verify & Pack、Package · Stage Upload。
- 同步当前构建规范与官网操作指引；不改写历史工作项。

### 排除项

不修改文件名、内部 job ID、依赖、条件、权限、并发、版本与执行步骤；不接入 Desktop 发布；不推送或运行远程流程。

## Todo

- [x] 修改两份 workflow 展示名称和动态标题。
- [x] 同步当前操作文档名称。
- [x] 对比配置确认仅展示字段变化，检查 diff，提供验收步骤。
- [x] 用户验收通过并批准本地提交，完成状态随交付提交结项。

## 验收标准

新运行显示 Exts Publish 或 NPM Publish，标题包含所选目标或包名，六个 jobs 使用批准名称。Desktop 名称虽为 Draft Release，仍明确提示未接入且不产生发布产物；执行行为和跳过规则不变。

## 唯一下一步

无。

## 交付记录

### 验证结果与验收步骤

- 两份 workflow 的入口、run-name 输入表达式、六个 job name 核对通过。剔除新增 run-name/job name 并恢复顶层旧名称后，文件与 HEAD 完全一致，确认执行配置未改。
- 构建规范和官网 README 与 HEAD 对比仅有 Exts Deploy → Exts Publish 替换，git diff --check 通过。
- 仅配置展示与文档变更，不运行应用测试、类型检查或构建；未执行独立 YAML 解析器或远程 Actions。
- 用户审核两份 workflow 的名称表和表达式。批准提交并自行推送后，Actions 入口应显示 Exts Publish 与 NPM Publish。
- 用新运行检查标题：Exts Publish · Website/Chrome/Desktop，NPM Publish · 所选完整包名；All jobs 显示本 Issue 范围内的名称，未选中目标仍按原规则跳过。
- Desktop · Draft Release 仅为批准的展示名称，步骤和摘要仍明确发布未接入、不生成产物。不要为名称验收重复上传已有 npm 版本或重复创建 Release；真实发布运行由用户自行决定。
- 本地修改不会改变 GitHub 当前配置，历史运行不作为新名称验收依据。

### 历史交付记录

#### 对应 Issue

[Issue](2026-10-14-repo-publish-display-names-issue.md)

#### 预期交付边界

只调整两份 workflow 展示字段和当前操作文档，保留原执行行为。

#### 实际交付

- Exts 入口展示为 Exts Publish；两份 workflow 的 run-name 分别显示 target 和完整 package 输入。
- 六个 jobs 添加批准的对象与职责名称，保留内部 ID 和原执行配置。
- 更新构建规范与官网 README 的当前入口名称，保留历史工作项记录。

#### 验证结果

- 核对顶层名称、动态标题和六个 job name；去除展示字段并恢复原入口名称后，两份 workflow 与 HEAD 完全一致。
- 两份操作文档仅替换当前入口名称，git diff --check 通过。
- 无应用行为变化，不运行应用测试、类型检查或构建；未执行独立 YAML 解析器或远程 Actions。

#### 未验证事项与限制

未运行远程 Actions。Desktop 尚未接入实际发布，历史运行名称不作为验收依据。

#### 用户验收

已通过。用户看到名称修改、配置对比及远程未验证限制后，明确要求完结 Issue 并提交到本地；不将此视为远程展示已验证。

#### 最终提交批准

已批准本地提交和 Issue、Commit 记录、工作台的完成状态更新；不推送或运行远程流程。完成事实以本次 Git Commit 成功为准。

#### 最终 Commit message

```text
ci(repo): 统一发布入口与任务展示名称

- 统一 Exts Publish 入口并动态显示运行目标
- 设置发布任务展示名称并同步操作文档
```

#### 随提交执行的终态更新

- Issue 改为已完成，验收提交 Todo 完成，唯一下一步为无。
- 本记录验收为已通过、提交为已批准；工作台移入已完成，当前 Issue 留空。
- 提交失败时恢复待提交、待批准，不留下虚假完成状态。

## 关联文档

- [工作台](../../readme.md)

## 历史补充

### 元信息

- 类型：小型配置展示调整
- 当前阶段：本地交付已验收并批准结项提交，远程 Actions 尚未验证
- 用户批准：用户要求“按照讨论的改下去”，批准 Exts Publish、动态运行标题及六个 jobs 展示名称；随后要求“改完 完结issue 然后提交到本地”，表示本地验收通过并批准提交和记录终态更新，不包含推送或远程运行。

### 历史后续事项

无；用户已验收并批准本地结项提交，不自动推送、运行远程流程或开始队列事项。
