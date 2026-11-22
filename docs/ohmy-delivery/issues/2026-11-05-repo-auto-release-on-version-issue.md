# 版本变化后自动生成 Release 草稿

## 元信息

- 工作项：2026-11-05-repo-auto-release-on-version
- 状态：已完成
- 当前阶段：本地配置与文档提交完成
- 已批准范围依据：用户要求根版本变化时自动运行现有 Release，并明确要求“直接改，改完提交验证”。

## 背景与目标

当前推送 main 自动部署官网，扩展 ZIP 与 macOS DMG 的草稿 Release 仍需手动选择。根产品版本提升并推送 main 后，应自动沿用现有 Release job 创建对应版本的 Tag 与草稿，不因 package.json 其他字段变化触发。

## 范围与排除项

- 范围：在现有 Exts Publish 工作流中比较推送前后根 `package.json` 的 `version`，仅值变化时自动运行 Release；保留 main 官网自动部署和手动 Website／Release 入口；同步构建发布规范。
- 排除项：不自动公开 Release，不改动打包、签名、下载附件或版本来源，不推送、部署或触发线上工作流。

## Todo

- [x] 加入版本差异检查并接入现有 Release 条件。
- [x] 更新发布规范并验证不同触发场景。
- [x] 按已批准范围完成本地提交，记录未执行的线上验证。

## 验收标准

- 推送 main 且根版本值变化时运行现有 Release job，生成草稿；普通推送及 package.json 非版本改动不运行 Release。
- 手动选择 Release 仍可运行；手动 Website 与普通推送仍按原规则部署官网。
- 已有 Tag／Release 冲突检查、固定版本工具链和草稿验收步骤保留。

## 关联文档

- [交付记录](../commits/2026-11-05-repo-auto-release-on-version-commit.md)

## 唯一下一步

本工作项本地提交已完成；线上 Actions 运行留待用户明确推送后验证。
