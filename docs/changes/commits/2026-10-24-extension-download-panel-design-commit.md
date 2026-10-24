# 记录 Download 历史与文件夹入口方案：交付记录

## 对应工作项

- [Issue](../issues/2026-10-24-extension-download-panel-design-issue.md)

## 预期交付边界

仅保存已确认的 Download 筛选、记录分组、预设目录映射、Desktop 预建目录和 TG 保存行为边界；不实施功能。

## 实际交付

- Issue 记录「全部 / TG / X」筛选、统一记录入口、对应 Finder 目录与缺失提示。
- 明确 Desktop 启动预建目录、TG 继续由用户在浏览器选择实际保存位置、X 尚未迁入。
- 标出跨应用通信和记录字段等尚待实施工作项决定的事项，不把方案写成已完成的功能。

## 验证与限制

- 核对现有 Newtab 空抽屉、TG 目录句柄边界及 Desktop 的 Photos 目录规则；执行文档 diff 与链接检查。
- 未运行代码测试、类型检查、构建或浏览器/macOS 验收；未修改产品代码、权限或资源，不推送。

## 用户验收

用户明确批准先保存并本地提交 Issue 方案；仅代表文档交付，不代表功能验收。

## 提交方案与完整 Commit message

- 待提交文件：本 Issue、本 Commit 记录、`docs/changes/README.md`。
- Diff 摘要：新增可追踪的 Download 方案和实施边界，并将文档工作项列入已完成索引。

```text
docs(extension): 记录 Download 历史与目录入口方案

- 明确三种筛选、记录分组和对应文件夹入口
- 记录 Desktop 预建目录与 TG 保持任意目录选择的边界
- 标出跨应用通信和记录字段的后续实施决策
```

## 最终提交批准

用户已明确要求本方案 Issue 提交到本地；同步本 Issue、交付记录和工作台为已完成，不推送。
