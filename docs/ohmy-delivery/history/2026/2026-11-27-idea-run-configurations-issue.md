---
date: "2026-11-27"
scope: [repo]
status: completed
type: task
---

# 添加 IDEA 开发运行配置

## 当前阶段

已按用户批准结项。

## 目标与范围

在 IDEA 中一键并行启动扩展和 API，并分别查看日志。官网与 macOS 桌面应用各自独立启动。复用根目录的 pnpm 脚本，保留现有 VS Code 任务。

## Todo

- [x] 添加四个独立的 IDEA 运行配置。
- [x] 添加只启动扩展和 API 的组合配置。
- [x] 验证 XML、脚本映射和组合成员。

## 验收标准

- 运行 Exts · Dev 时，Exts · Ext 与 Exts · API 各有一个 Run 日志标签页。
- Exts · Web 可单独启动。Exts · Desk 可在 macOS 单独启动。

## 唯一下一步

无，工作项已完成。

## 交付记录

已创建五份项目运行配置。静态检查通过，覆盖 XML 解析、脚本存在性、pnpm 与根 package.json 映射，以及组合成员。未启动开发服务，未在 IDEA 界面运行配置。

用户明确批准完整结项并单独提交归档文档。

配置提交 6e25844 包含 `.idea/.gitignore`、`.idea/vcs.xml` 和 `.run/` 下的 Exts API、Desk、Dev、Ext、Web 五份运行配置。

    chore(repo): 添加 IDEA 开发运行配置

    - 配置扩展与 API 并行启动及官网与桌面的独立入口
    - 共享项目 Git 映射并忽略本地数据库和模块文件

文档提交仅包含本归档 Issue。

    docs(repo): 归档 IDEA 开发运行配置工作项

    - 记录运行配置交付、验证结果与结项批准

## 关联文档

无。

