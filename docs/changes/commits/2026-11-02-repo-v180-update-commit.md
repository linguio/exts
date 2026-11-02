# 1.8.0 版本与官网更新交付记录

- 对应 Issue：[准备 1.8.0 版本并更新官网日志](../issues/2026-11-02-repo-v180-update-issue.md)
- 状态：已完成
- 用户验收：用户明确要求本地提交，按批准完结；不另核实实机验收
- 最终提交批准：已批准（用户明确要求 commit）

## 预期交付边界

- 代码：根产品版本、官网日志，以及本聊天已批准的账户图标、活动饼图切换与 Social 名称调整。
- 文档：本 Issue、Commit 记录和工作台。
- 用户后续明确批准两笔本地提交，不推送、部署或发布。

## 实际交付

- 根产品版本已改为 1.8.0，未调整依赖声明与锁文件。
- 官网新增 2026-11-02 更新说明，围绕三项完善：Studio 折叠侧栏与返回首页、GitHub/Google 静态登录入口、四端统一调试与独立终端日志。
- 官网三条正文采用用户最终指定原文，不追加登录状态说明；实际仍仅静态登录入口，未接入真实登录，未增加未发布版本下载链接。
- 本聊天此前批准的三个扩展小改动保留，按用户指令纳入本地提交，未部署。


## 验证与限制

- 根 package.json 解析与 1.8.0 版本检查通过。
- pnpm 类型检查触发依赖联网校验，DNS 不可用；停止该过程。
- 直接调用本地 tsc 与 vite 均报 MODULE_NOT_FOUND，类型检查与构建未完成，未继续重试或安装依赖。
- 官网与扩展视觉交互未验收；未生成发布包、Tag 或 Release，未部署。


## 提交方案

### 代码提交

- package.json
- apps/website/src/pages/changelog/data.ts
- apps/extension/src/modules/newtab/constants/bookmarks.ts
- apps/extension/src/modules/studio/components/account-login.tsx
- apps/extension/src/modules/studio/components/activity/index.tsx
- apps/extension/src/shared/ui/types.ts
- apps/extension/src/shared/ui/ui-icon.tsx

```text
feat(repo): 准备 1.8.0 版本并完善扩展入口

- 隐藏未登录账户箭头，新增活动饼图切换并简化 Social 名称
- 将产品版本设为 1.8.0 并补充官网更新说明
```

### 文档提交

- docs/changes/issues/2026-11-02-repo-v180-update-issue.md
- docs/changes/commits/2026-11-02-repo-v180-update-commit.md
- docs/changes/README.md

```text
docs(repo): 归档 1.8.0 版本与官网更新记录

- 记录版本与官网文案交付及验证限制
- 按用户本地提交指令完结工作项并同步工作台
```

终态更新：Issue 与 Commit 记录为已完成，用户本地提交批准为已批准，工作台移入已完成并清空当前活动项。
