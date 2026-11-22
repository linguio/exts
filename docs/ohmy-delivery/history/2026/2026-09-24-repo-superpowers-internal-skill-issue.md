---
date: "2026-09-24"
scope: repo
status: completed
type: task
---

# 制作本地 Issue 与 Commit 工作流 Skill

## 当前阶段

已完成。

## 目标与范围

### 背景

内网 Agent 无法直接搜索或安装外部 Skill。用户已经自行下载官方 Superpowers，希望另行获得一项与 Superpowers 独立、同级安装的本地 Issue 与 Commit 管理工作流 Skill。

### 目标

制作一项独立、可离线导入的 `local-issue-commit-workflow` Skill，用于指导 Agent 按本仓库约定管理本地 Issue、Commit 记录、阶段验收与最终 Git Commit 批准。

### 范围

- 在仓库 `skills/local-issue-commit-workflow/` 中维护自定义 Skill 源文件。
- Skill 说明创建 Issue、Commit 记录、可选 Spec/Plan、阶段验收与最终 Git Commit 批准流程。
- 提供 Issue 和 Commit 记录模板，但不复制当前仓库的动态 Issue、队列或完成状态。
- 提供与 Codex/Superpowers 打包兼容的 `agents/openai.yaml` 元数据。
- Skill 与 Superpowers 不互相引用，可分别导入并同级使用。
- 同步修正仓库和 Skill 的验收提交规则：用户在阶段交付后明确要求本地提交时，同时表示验收通过和提交批准。

### 排除项

- 不读取、修改、合并或重新打包用户下载的 Superpowers。
- 不安装到当前用户或内网 Agent。
- 不发布到公共 Marketplace、GitHub Release 或其他外部系统。
- 不在本任务中建立自动更新机制。
- 不生成合并后的 Superpowers ZIP。
- 不执行子代理或并行 Agent 测试。

## Todo

- [x] 创建并验证 `local-issue-commit-workflow` Skill 及模板。
- [x] 验证目录结构、UTF-8、Markdown、链接和 Skill 元数据。
- [x] 整理独立导入步骤并完成用户验收。
- [x] 按验收反馈统一本地提交、验收通过和 Issue 关闭规则。

## 验收标准

- `skills/local-issue-commit-workflow/` 可独立打包和导入。
- Skill 目录包含可发现的 `SKILL.md` 和 Codex 元数据。
- Skill 不包含当前仓库的动态工作状态，只描述可迁移的流程和判断规则。
- Issue 与 Commit 模板包含必要字段，并保持 UTF-8 编码。
- Skill 的目录结构、frontmatter、Markdown、本地链接和文件清单校验通过。
- 提供与 Superpowers 分别导入、同级使用的说明。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-24-repo-superpowers-internal-skill`
- 对应 Issue：[制作本地 Issue 与 Commit 工作流 Skill](2026-09-24-repo-superpowers-internal-skill-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已批准
- 创建日期：2026-09-24
- 最近更新：2026-09-24

#### 预期交付边界

- 创建可独立导入的本地 Issue/Commit 工作流 Skill、对应模板及 Codex 元数据。
- Skill 与 Superpowers 保持独立，不互相引用或修改。
- 提供两个包分别导入、同级使用的说明。

#### 实际完成内容

- 创建独立的 `local-issue-commit-workflow` Skill，区分只读任务与仓库修改任务，并规定单活动 Issue、记录配对和事实来源优先级。
- 增加本地工作流参考，记录文档职责、任务规模、状态流转、阶段验收和最终 Git Commit 批准规则。
- 增加 Issue 与 Commit 记录模板，以及支持 Codex 自动发现的 `agents/openai.yaml` 元数据。
- 保持 Skill 不包含当前仓库的活动 Issue、队列或完成索引。
- Skill 可作为独立目录或 ZIP 导入，不需要合并进 Superpowers。
- 按用户验收反馈修正本地提交语义：阶段交付后的明确本地提交请求同时表示验收通过和提交批准，提交时必须关闭 Issue。

#### 验证结果

- 无依赖结构校验：5 个文件、10,421 字节，必需文件、Skill frontmatter、主体相对链接和 Codex 元数据检查通过。
- UTF-8 严格解码检查：5 个文件全部通过。
- `git diff --check`：通过。
- 串行场景核对覆盖纯问答、修改前批准、已有活动 Issue、待验收、待提交和最终 Commit 批准边界。
- 验收反馈修正后，`file -I` 识别 Skill 文本为 UTF-8 或 ASCII，限定范围的 `git diff --check` 通过。

#### 未验证事项与限制

- 项目规范禁止子代理，因此不执行基于独立 Agent 的 Skill 压力测试；将使用结构校验和串行场景检查替代。
- 官方 `quick_validate.py` 因当前工作区 Python 缺少 `PyYAML` 无法运行；未引入新依赖，已使用无依赖校验替代。
- 项目规范禁止子代理，未执行独立 Agent 压力测试；本次使用已发生的提交后 Issue 未关闭场景验证规则修正。
- macOS `iconv` 在本次批量严格解码复验中两次返回工具错误，已按熔断规则停止重试，改用 `file -I` 和 `git diff --check` 作为替代验证。

#### 用户验收

- 结果：已通过
- 说明：用户明确要求本地提交代表验收通过，且提交成功时 Issue 必须关闭。

#### 最终 Commit message

fix(repo): 让本地提交同步完成验收与 Issue

- 统一仓库规则和本地工作流 Skill 的提交语义
- 按用户验收反馈关闭当前工作项

#### 最终提交批准

- 状态：已批准
- 说明：用户明确要求本地提交代表验收通过，并要求先收口当前 Issue 后继续下一个已批准任务。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 类型：小型任务
- 当前阶段：用户验收通过，工作流规则修正和最终 Git Commit 已完成
- 最近更新：2026-09-24

### 历史后续事项

当前 Issue 已完成，可开始下一个已批准工作项。
