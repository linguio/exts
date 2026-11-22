# 统一发布入口与任务展示名称：Commit 记录

## 对应 Issue

[Issue](../issues/2026-10-14-repo-publish-display-names-issue.md)

## 预期交付边界

只调整两份 workflow 展示字段和当前操作文档，保留原执行行为。

## 实际交付

- Exts 入口展示为 Exts Publish；两份 workflow 的 run-name 分别显示 target 和完整 package 输入。
- 六个 jobs 添加批准的对象与职责名称，保留内部 ID 和原执行配置。
- 更新构建规范与官网 README 的当前入口名称，保留历史工作项记录。

## 验证结果

- 核对顶层名称、动态标题和六个 job name；去除展示字段并恢复原入口名称后，两份 workflow 与 HEAD 完全一致。
- 两份操作文档仅替换当前入口名称，git diff --check 通过。
- 无应用行为变化，不运行应用测试、类型检查或构建；未执行独立 YAML 解析器或远程 Actions。

## 未验证事项与限制

未运行远程 Actions。Desktop 尚未接入实际发布，历史运行名称不作为验收依据。

## 用户验收

已通过。用户看到名称修改、配置对比及远程未验证限制后，明确要求完结 Issue 并提交到本地；不将此视为远程展示已验证。

## 最终提交批准

已批准本地提交和 Issue、Commit 记录、工作台的完成状态更新；不推送或运行远程流程。完成事实以本次 Git Commit 成功为准。

## 最终 Commit message

```text
ci(repo): 统一发布入口与任务展示名称

- 统一 Exts Publish 入口并动态显示运行目标
- 设置发布任务展示名称并同步操作文档
```

## 随提交执行的终态更新

- Issue 改为已完成，验收提交 Todo 完成，唯一下一步为无。
- 本记录验收为已通过、提交为已批准；工作台移入已完成，当前 Issue 留空。
- 提交失败时恢复待提交、待批准，不留下虚假完成状态。
