# 更新官网 Activity 编辑日志与产品版本

## 元信息

- 工作项：2026-11-10-website-activity-editing-changelog
- 状态：已完成
- 当前阶段：本地提交
- 已批准范围依据：用户确认的三条 Changelog 文案及产品版本 2.2.0。
- 规模：小型官网内容与版本更新。
- 执行分工：Codex 审查与验证；Cursor `composer-2.5` 实施，不自行提交。

## 背景与目标

将近期 Activity 编辑、更新接口和 Cursor 串行开发工作流以三条公开日志记录到官网，并将产品版本更新为 2.2.0。

## 范围与排除项

- 官网 Changelog 新增一个 2026-11-10 条目，包含 Extension、API、Skills 三个标签及用户确认的三条文案。
- 根 `package.json` 产品版本更新为 2.2.0。
- 排除：发布、推送、构建产物、其他文案或功能修改。

## Todo

- [x] 在官网 Changelog 数据新增三标签条目。
- [x] 更新根产品版本为 2.2.0。
- [x] 尝试运行官网范围的最小验证并等待用户验收。

## 验收标准

- Changelog 顶部出现 2026-11-10 的新条目，含 Extension、API、Skills 标签及三条确认文案。
- 根产品版本为 2.2.0。
- 不修改其他日志正文、发布状态或构建产物。

## 关联文档

- [交付记录](../commits/2026-11-10-website-activity-editing-changelog-commit.md)

## 唯一下一步

无。用户已验收并要求本地提交。
