# 建档与推进

- 先读仓库规则、[交付宪章](../../../../docs/ohmy-delivery/readme.md)及未关闭 Issue。讨论、只读调查和用户明确免建档的改动按对应边界执行。
- 临时想法记入收件箱。成形且获准建档后，按 [唯一模板](../assets/template-issue.md) 在 `issues/` 新建一份 Issue，文件名为 `YYYY-MM-DD-<scope>-<topic>-issue.md`。标题取一级标题，元数据使用 [英文字典](../assets/issue-dictionaries.json)。建档日期与文件名前缀一致，文件名创建后保持稳定。
- 类型按主要验收结果填写：修复已有行为用 `bug`，新增可用能力用 `feature`，维护、文档或迁移用 `task`。无法明确归类的新工作默认 `task`。
- 开始前核对是否已有活动 Issue。六种状态中，`in_progress`、`awaiting_acceptance`、`awaiting_commit` 都占活动名额。`queued` 不占活动名额，默认依建档日期、文件名排序。
- 实施前展示 Issue、已批准范围和下一步。实施启动时置为 `in_progress`，同步当前阶段和唯一下一步；验收、提交和验证均写回同一 Issue。
- 临时追加事项先对照目标、范围和验收标准。现有授权覆盖的修正可推进，独立交付需另行确认。用户取消时记录原因，置为 `cancelled` 并移入 `history/<建档年份>/`，更新受影响链接。
