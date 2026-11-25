---
date: "2026-11-25"
scope: [build, desktop]
status: completed
type: bug
---

# 修正 Cursor 的 Desktop 任务终端名称

## 当前阶段

用户验收通过并批准本地提交。本次终端已重新命名，后续运行自动保留标题未实现。

## 目标与范围

Cursor 的 Dev 组合包含 Desktop，启动命令是 `pnpm desk:dev`。截图中完成的任务终端显示为 `volta-shim`。核对任务终端标题来源并使 Desktop 任务能明确显示为 Desktop。保留现有构建、启动独立 App 和命令结束行为。

## Todo

- [x] 核对 Cursor 的任务标签和终端标题机制。
- [ ] 修正 Desktop 任务名称显示并核对配置。

## 验收标准

- 在 Cursor 启动 Desktop 或 Dev 后，能识别 Desktop 任务。命令结束时可显示完成，桌面 App 继续独立运行。

## 唯一下一步

无。

## 交付记录

Cursor 实测：单独运行 Desktop 时，任务执行期间显示 Desktop；`pnpm desk:dev` 成功结束后，终端标题回退为 volta-shim。终端信息确认该条任务的实际命令。通过 Cursor 的 Rename 将本次完成的终端改回 Desktop，并确认显示结果。仓库任务配置仍保留现有标签及启动行为。用户已确认本次结果验收通过。

### 本地提交

用户已批准本地提交，只包含本 Issue 的归档记录，沿用 Cursor 实测和用户验收结果。

```text
docs(build): 归档 Cursor 桌面任务名称问题

- 记录任务完成后标题回退的复现结果
- 记录本次终端改名与用户验收
```

## 关联文档

无。
