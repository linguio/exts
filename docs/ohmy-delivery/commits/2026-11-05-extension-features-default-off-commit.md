# 默认关闭媒体下载与历史清理：交付记录

## 对应工作项

- [Issue](../issues/2026-11-05-extension-features-default-off-issue.md)

## 预期交付边界

两项功能默认关闭，保留已有选择，同步相关测试和应用规范。

## 实际交付

Media Download 无有效配置时默认关闭；Clear History 沿用默认关闭。保留新旧有效开关值，现行应用规范和既有默认值测试已同步。

## 验证与限制

- `pnpm --filter @exts/extension test tests/features/settings`：2 个文件、11 项通过。
- `pnpm --filter @exts/extension typecheck`：通过。
- 未运行构建，现有 dist 未更新；未执行 Chrome/Edge 视觉或交互验收。
- 用户验收：使用新版构建，在无配置的独立浏览器配置中确认 Settings 两项默认关闭；已有配置保持选择，手动切换后重新打开仍保留。

## 用户验收

用户于 2026-11-05 批准先提交本项再继续 Hook 优化，按本地提交指令完结；浏览器未独立验收。

## 提交方案

按用户指令执行本地提交。代码范围：`apps/extension/src/features/settings/schema.ts`、`apps/extension/tests/features/settings/store.test.ts`；文档范围：`apps/extension/AGENTS.md`、工作台、本 Issue 与交付记录。

代码消息：

```text
fix(extension): 默认关闭媒体下载功能

- 无有效设置时关闭媒体下载并保留已有开关选择
- 同步首次初始化与无效配置的默认值测试
```

文档消息：

```text
docs(extension): 记录功能默认关闭的交付与验收

- 同步媒体下载默认关闭规则
- 记录工作项范围、验证结果与验收步骤
```

本地提交需用户明确要求；届时同步 Issue 和工作台为已完成、用户验收为按本地提交指令完结、最终提交批准为已批准。

## 最终提交批准

已批准本地提交，未批准推送。
