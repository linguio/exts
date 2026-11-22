---
date: "2026-11-09"
scope: repo
status: completed
type: bug
---

# 修复 DMG 窗口关闭与清理失败

## 当前阶段

已完成。

## 目标与范围

- 状态：已完成
- 日期：2026-11-09
- 规模：小型
- 批准：用户明确要求“改一下”

### 背景与目标

CI 在 Finder 最后关闭窗口时报 -1728，随后推出失败覆盖了原始错误。允许关闭时窗口已消失，同时保留真正布局错误并安全清理镜像。

### 范围与排除项

仅修改窗口关闭容错、挂载状态核对和错误保留，补充发布逻辑测试。不改变外观、版本、依赖、发布工作流，不迁移系统工具，不提交或推送。

## Todo

- [x] 补充推出失败与原始错误保留的发布流程测试
- [x] 修复窗口关闭与安全清理
- [x] 完成逻辑和 JavaScript 语法验证，更新构建规范；AppleScript 编译受环境阻挡

## 验收标准

### 用户验收步骤

将本次修复提交并推送后，在包含修复的提交上运行 Release；预期布局保存后成功生成 ZIP 与 DMG。下载 DMG，确认背景、左右图标和拖拽安装行为正常。如布局仍失败，日志应保留布局首个错误；推出失败且状态不明时日志给出保留路径。不得仅重跑尚未包含修复的旧提交。

关闭阶段仅容忍 Finder -1728；其他布局错误仍阻止发布。推出失败后只有确认目标镜像已解除挂载才允许清理；状态未知或仍挂载时保留暂存。布局错误不被清理错误覆盖，失败保留旧发布包。

## 唯一下一步

无。

## 交付记录

### 验证结果与限制

发布相关 Node 测试 29 项通过，JavaScript 语法检查通过。AppleScript 编译因当前环境 Finder 服务连接异常在第 7 行失败，HEAD 原脚本同样失败，停止重复尝试。未执行真实 DMG 打包或 Actions，也未验收窗口外观。

### 历史交付记录

- [Issue](2026-11-09-repo-dmg-window-cleanup-issue.md)
- 状态：已完成
- 用户验收：用户明确要求 push，批准按当前结果完结；真实安装行为未验证
- 提交批准：已批准提交及推送

#### 预期交付边界

窗口关闭窄范围容错、安全核对挂载状态、保留原始失败，补充现有发布流程测试与规范。

#### 实际交付与验证

关闭 Finder 窗口仅容忍 -1728，保留布局失败和 .DS_Store 校验。推出失败后核对结构化挂载状态，已卸载才清理；仍挂载或无法确认时保留目录，合并错误并以布局错误为先。

`node --test tests/build-release.test.mjs tests/extension-release.test.mjs tests/release-notes.test.mjs`：29 项通过。`node --check scripts/release.mjs`：通过。

AppleScript 编译受 Finder 服务连接异常阻挡，修改前的 HEAD 原脚本同一位置也失败；没有继续重试。真实 DMG 打包、Actions 及窗口与安装行为待用户验收。用户于 2026-11-09 明确要求 push，代码与文档分开提交后推送，不触发 Release。

#### 提交边界与消息

代码：`apps/desktop/scripts/dmg-layout.applescript`、`scripts/release.mjs`、`tests/build-release.test.mjs`。

```text
fix(repo): 修复 DMG 窗口关闭与挂载清理失败

- 容忍关闭时 Finder 窗口已消失并保留真实布局错误
- 推出失败后核对挂载状态，保留不安全清理的暂存目录
```

文档：本 Issue、Commit 记录、工作台及 `docs/build-release.md`。

```text
docs(repo): 记录 DMG 清理修复与验证边界

- 补充窗口关闭和挂载清理规则
- 记录逻辑验证与真实 Release 待验收事项
```

## 关联文档

- [构建与分发规范](../../../build-release.md)

## 历史补充

### 历史后续事项

用户明确要求 push，批准本次提交并推送；本工作项完结，真实 Release 及安装行为仍待用户验证。
