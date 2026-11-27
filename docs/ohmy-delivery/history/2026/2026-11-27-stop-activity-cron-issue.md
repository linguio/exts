---
date: "2026-11-27"
scope: [api]
status: completed
type: task
---

# 停止定时生成 Activity 记录

## 当前阶段

已按用户批准完成本地交付。

## 目标与范围

从 API 的 Vercel 项目配置移除 Activity 调度，保留现有任务路由、业务接口与历史数据。

## Todo

- [x] 移除 Vercel 中的 Activity 调度声明。
- [x] 同步 API 说明并验证配置。

## 验收标准

- 新的 API 生产部署不再调度 `/internal/jobs/activity-days`。
- 现有 Activity 接口仍可访问历史记录。

## 唯一下一步

后续生产部署完成后，检查 Vercel Cron 列表和已有 Activity 记录。

## 交付记录

用户已批准本地修改。

已验证 Vercel 配置可解析且 crons 为空数组，Git 差异检查通过。未推送或部署，未验证线上 Cron 停用。


用户明确批准本地提交和结项。配置提交 8834a66 仅包含 apps/api/vercel.json。

    chore(api): 停止 Activity 定时调度

    - 清空 Vercel Cron 配置

文档提交包含 apps/api/README.md 和本归档 Issue。

    docs(api): 归档 Activity 定时调度停用工作项

    - 同步 API 调度说明并记录验证结果

## 关联文档

[API README](../../../../apps/api/README.md)
