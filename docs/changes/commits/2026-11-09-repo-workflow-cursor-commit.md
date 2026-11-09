# 建立 Cursor 串行委派 Skill：交付记录

## 对应工作项

- [Issue](../issues/2026-11-09-repo-workflow-cursor-issue.md)

## 预期交付边界

新增 workflow-cursor，并同步根规范与 workflow-change、workflow-tests，试用 Codex 规划审查、Cursor 实际开发的默认串行分工；补充官网 Skills 展示，不修改业务功能。

## 实际交付

- 新增 .agents/skills/workflow-cursor/SKILL.md，默认固定 composer-2.5，用户指定优先；本仓库范围获批后默认使用，其他仓库根据其规则或明确调用使用。
- 明确 CLI 预检、任务交接、串行执行、会话续接、权限与失败停止、实际 diff 及验证证据审查，不建立新任务管理体系。
- 根规范明确试用分工、唯一的 Cursor 串行委派例外、纯流程文档与提交职责、调用受阻不静默接管；workflow-change 引用交接入口，workflow-tests 引用验证复用规则，不复制调用实现。
- 创建本 Issue、Commit 记录并更新工作台；官网静态条目由 Cursor Composer 2.5 实施，未修改全局配置。
- 官网 `apps/website/src/shared/products/categories.ts` Skills 分类新增 workflow-cursor 条目（名称、分工说明、源码链接），沿用既有模块布局。

## 验证与限制

- 手工核对 name/description、无占位内容、工作项相互链接及 Skill 路径；git diff --check 通过，Git 提示工作台后续可能归一为 CRLF，无空白错误。
- 场景审阅覆盖：讨论不实施；本仓库批准后自动交接；其他仓库按其授权规则；显式只读咨询使用 Ask；模型或权限不可用停止且不静默接管；返工续接确切会话；只提交时不重启执行或验证。
- 官方 quick_validate.py 因本机 Python 缺少 PyYAML 无法执行；未安装额外依赖，不能记录为校验器通过。
- 未运行应用测试或构建；已完成一次官网静态数据的真实委派，不代表复杂业务开发质量或默认触发行为已全面验证。尚待用户验收。
- Cursor Shell 调用失败；Cursor 退出后 Codex 运行 `pnpm --filter @exts/website typecheck` 通过，实际 diff 确认仅新增一条 Skill。未进行视觉或交互验收。
- Windows .cmd 首次交接只收到多行提示首行，Cursor 从 Issue 恢复范围并额外更新本工作项记录；Codex 已核对并修正记录。后续须先确认提示传递完整性，此次不能声称完整任务交接已通过。

## 用户验收

用户于 2026-11-09 明确要求本地 commit，批准按当前交付完结；不推定已执行浏览器验收，未验证事项保留。

## 提交方案

代码提交仅包含 apps/website/src/shared/products/categories.ts，新增一个 Skill 的名称、说明和源码链接：

```text
feat(website): 展示 Cursor 开发工作流 Skill

- 在 Skills 列表新增分工说明与源码入口
```

文档提交包含 AGENTS.md、.agents/skills/workflow-cursor/SKILL.md、workflow-change/SKILL.md、workflow-tests/SKILL.md、本 Issue、Commit 记录和工作台，保存试用分工及实际交付；同步 Issue、工作台为已完成、最终批准为已批准：

```text
docs(repo): 建立 Cursor 串行开发与审查分工

- 新增 workflow-cursor 并同步默认实施与验证复用规则
- 完结工作项并记录交付结果与验证限制
```

## 最终提交批准

已批准。用户于 2026-11-09 明确要求本地提交，按以上代码、文档两笔完结；不包含推送或发布。
