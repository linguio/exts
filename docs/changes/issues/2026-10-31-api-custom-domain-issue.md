# 绑定 API 自定义域名

## 元信息

- 工作项：2026-10-31-api-custom-domain
- 状态：已完成
- 当前阶段：域名与 DNS 配置已保存，用户已反馈新域名测试通过；代理此前 HTTPS 检查失败，不将用户验收记作代理独立复验。
- 批准依据：用户在部署修复验收及本地提交完结后，明确要求继续绑定 api.exts.linguio.dev。
- 任务规模：小型域名配置工作项。

## 背景与目标

API 已部署在 Vercel api 项目，用户已确认线上接口验证通过。本轮使用 api.exts.linguio.dev 作为正式 API 地址。

## 范围与排除项

- 将 api.exts.linguio.dev 绑定到现有 api 项目的 Production 环境。
- 核对实际权威 DNS，只新增或调整该 API 子域名所需记录；记录值以 Vercel 返回为准。
- 检查域名验证、HTTPS、文档和无令牌接口拒绝结果。
- 不购买或转移域名，不修改 nameservers、官网、邮件记录、接口代码、鉴权凭据或其他项目，不提交或推送 Git。

## Todo

- [x] 添加 Vercel 项目域名并取得实际 DNS 记录。
- [x] 确认 DNS 托管平台并配置目标子域名记录。
- [x] 记录 DNS 检查结果与此前 HTTPS 检查限制；用户已反馈新域名测试通过。

## 验收标准

- 目标域名指向现有 API 生产部署，Vercel 域名验证有效。
- HTTPS 文档可访问，无令牌 /hello 返回 401；用户可携带原有令牌验证数据库查询。
- 无关 DNS 配置保持原状，未验证项如实记录。

## 关联文档

- [Commit 记录](../commits/2026-10-31-api-custom-domain-commit.md)
- [工作台](../README.md)

## 唯一下一步

用户已批准本地文档提交，本工作项随提交完结；后续实施 Scalar 与官网入口，不自动推送。
