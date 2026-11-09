# 建立 Cursor 串行委派 Skill

## 元信息

- 工作项：2026-11-09-repo-workflow-cursor
- 状态：已完成
- 当前阶段：用户批准本地提交完结
- 已批准范围依据：用户要求编写 workflow-cursor，并批准试用 Codex 负责规划与审查、Cursor 负责实际开发的默认分工，同步根规范与三个 workflow Skill。
- 规模：小型任务，包含 Skill 流程文档与官网展示数据，不创建独立 Spec、Plan 或 Sub-issue。

## 背景与目标

Cursor CLI 已完成安装、登录及 Composer 2.5 最小只读问答验证。将已讨论的串行委派方式写为可复用 Skill，明确任务交接、模型选择、权限、停止条件和结果审查；连通性验证不代表代码交付质量已验证。

## 范围与排除项

- 在 .agents/skills/workflow-cursor/SKILL.md 维护唯一源码；默认 composer-2.5，用户指定优先，不静默切换模型。
- 明确用户授权、CLI 预检、任务交接、串行执行、会话续接、失败停止和 Codex 审查职责。
- 复用现有 Issue 与验证流程，不增加一套任务管理体系。
- 同步根 AGENTS 的试用分工和串行代理例外；workflow-change 在范围获批后交接 Cursor，workflow-tests 核对并复用有效证据。纯流程文档与本地提交继续由 Codex 按批准处理，用户负责最终及浏览器验收。
- 用户补充批准同步官网 /features/#skills：新增 workflow-cursor 名称、简短分工说明和源码链接，保留既有展示结构。
- 排除项：自动安装或更新工具、存储认证信息、创建全局副本、接入 Grok CLI、实际委派业务开发以及 Git 提交和推送。

## Todo

- [x] 编写精简 Skill，区分只读咨询与实施权限。
- [x] 核对元数据、相对链接、授权边界及典型使用场景。
- [x] 记录实际交付与限制，交给用户检查。
- [x] 同步默认实施分工、根规范串行例外及跨 Skill 引用，并核对规则一致性。
- [x] 通过 Cursor 同步官网 Skills 条目，核对实际 diff 与必要类型检查。

## 验收标准

- Skill 名称为 workflow-cursor；本仓库开发范围获批后默认交接 Cursor，不要求每次重复指定；纯讨论不触发实施。未采用默认约定的仓库仍需明确委派或调用 Skill。
- 普通任务交接保持批准范围，禁止双方同时修改工作区；执行结果以实际 diff 与必要检查为准。
- 默认模型明确，不扩大工具权限，不因加载 Skill 自动获得实施、提交或发布授权。
- 缺少 CLI、未登录、模型不可用、需要新权限或范围变化时说明具体阻塞，不静默安装、提权或换模型。
- 不写本机绝对安装路径、凭据或账号信息；Skill 可在其他具备 Cursor CLI 的环境复用。

## 关联文档

- [Commit 记录](../commits/2026-11-09-repo-workflow-cursor-commit.md)
- [Skill](../../../.agents/skills/workflow-cursor/SKILL.md)
- [工作台](../README.md)

## 唯一下一步

无。用户已批准代码、文档两笔本地提交完结，未推送或发布；实际未验证项保留在 Commit 记录。
