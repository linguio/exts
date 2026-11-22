# 阶段验收

- 展示实际交付、[验证](flow-verification.md)结果、未验证事项和可复现验收步骤，写进 Issue 的交付记录。
- 实现与必要验证结束后，置为 `awaiting_acceptance`。用户明确验收通过后置为 `awaiting_commit`。用户提出问题时继续处理当前 Issue。
- 项目另有约定时按目标仓库执行。验收通过后保持原路径。用户明确要求本地提交时进入[提交流程](flow-commit.md)。
