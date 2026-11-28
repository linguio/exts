---
date: "2026-11-28"
scope: [api]
status: completed
type: task
---

# 补充 API 生产部署配置说明

## 当前阶段

用户已验收通过。

## 目标与范围

在 API README 记录 Vercel Production 配置步骤、变量值的来源及 503 排查方法。

## Todo

- [x] 补充生产配置与部署步骤。
- [x] 核对配置说明和错误码。
- [x] 交付用户验收。

## 验收标准

- 可按 README 找到配置入口、填入正确变量并重新部署。
- 可根据错误码区分必填配置缺失和数据库连接问题。

## 唯一下一步

已结项。

## 交付记录

README 已补充生产变量、重新部署和 Daily 503 排查步骤。已核对认证地址、后端错误码和 Vercel 部署说明，`git diff --check` 通过。本次为文档变更，未执行部署或业务测试。

## 关联文档

- [API README](../../../../apps/api/README.md)

## 提交记录

用户已验收通过并批准推送。提交包含 API README 和本 Issue，Issue 标记为 `completed` 并归档至 2026 年历史目录。

```text
docs(api): 补充线上服务配置与排查说明

- 记录 Vercel 生产变量、重新部署步骤和 Daily 503 排查方法
- 记录用户验收并归档工作项
```
