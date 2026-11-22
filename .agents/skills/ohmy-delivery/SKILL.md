---
name: ohmy-delivery
description: Use when starting or resuming an approved work item, selecting validation, handling acceptance or local commits, or preparing a product release.
---

# 开发交付

读取适用的仓库规则、交付宪章及当前 Issue。用户最新明确指令和仓库规则优先。按请求意图加载流程，分别确认修改、验证、提交及发布授权。只读讨论不改变工作项，已批准范围无需重复确认。

| 意图 | 流程 |
| --- | --- |
| 新建、继续、补充或取消工作项 | [建档与推进](references/flow-issue.md) |
| 选择、执行或复用检查 | [验证](references/flow-verification.md) |
| 展示阶段结果或处理验收意见 | [验收](references/flow-acceptance.md) |
| 仅本地提交、拆分提交或处理提交失败 | [提交](references/flow-commit.md) |
| 更新产品版本或准备发布 | [版本发布](references/flow-release.md)及[验证](references/flow-verification.md) |

仅要求本地提交时进入提交流程，复用已有结果。按实际问题使用专项 Skill，遵守目标仓库的子代理、串行和验证要求。

需要专项设计、排错、计划或验证时，可配合 Superpowers，沿用当前 Issue 和已有设计文档。建档、验收、提交和发布准备仍由本入口分流。
