# DMG 窗口与清理修复交付记录

- [Issue](../issues/2026-11-09-repo-dmg-window-cleanup-issue.md)
- 状态：已完成
- 用户验收：用户明确要求 push，批准按当前结果完结；真实安装行为未验证
- 提交批准：已批准提交及推送

## 预期交付边界

窗口关闭窄范围容错、安全核对挂载状态、保留原始失败，补充现有发布流程测试与规范。

## 实际交付与验证

关闭 Finder 窗口仅容忍 -1728，保留布局失败和 .DS_Store 校验。推出失败后核对结构化挂载状态，已卸载才清理；仍挂载或无法确认时保留目录，合并错误并以布局错误为先。

`node --test tests/build-release.test.mjs tests/extension-release.test.mjs tests/release-notes.test.mjs`：29 项通过。`node --check scripts/release.mjs`：通过。

AppleScript 编译受 Finder 服务连接异常阻挡，修改前的 HEAD 原脚本同一位置也失败；没有继续重试。真实 DMG 打包、Actions 及窗口与安装行为待用户验收。用户于 2026-11-09 明确要求 push，代码与文档分开提交后推送，不触发 Release。

## 提交边界与消息

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
