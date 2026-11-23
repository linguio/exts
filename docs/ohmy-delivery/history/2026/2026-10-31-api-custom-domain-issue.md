---
date: "2026-10-31"
scope: [build, api]
status: completed
type: task
---

# 绑定 API 自定义域名

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

API 已部署在 Vercel api 项目，用户已确认线上接口验证通过。本轮使用 api.exts.linguio.dev 作为正式 API 地址。

### 范围与排除项

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

## 唯一下一步

无。

## 交付记录

### 历史交付记录

- [Issue](2026-10-31-api-custom-domain-issue.md)
- 状态：已完成；用户已确认新域名测试通过并明确批准本地文档提交。

#### 预期交付边界

- 外部配置：Vercel api 项目域名与权威 DNS 中对应子域名记录。
- 仓库文档：本 Issue、Commit 记录和工作台；无业务代码修改。

#### 实际交付与验证

- 插件添加域名返回 Project not found；改用已登录浏览器，成功将 api.exts.linguio.dev 添加到 api 项目 Production 环境。
- Vercel 显示 Invalid Configuration，要求在 Namecheap 添加 CNAME：Name = api.exts，Value = 1c7e369e49e67a3d.vercel-dns-017.com.。
- 用户登录后已确认 Namecheap BasicDNS；新增 api.exts CNAME 指向指定目标，TTL 为 Automatic，保存后的列表显示记录存在；原官网 exts CNAME 保留。
- 公开 dig 查询已返回正确 CNAME。代理此前两次 HTTPS 检查返回 SSL_ERROR_SYSCALL，最后读取的 Vercel 状态为 Invalid Configuration；随后用户按新域名测试步骤反馈“可以了”，确认验收通过。未追加代理独立复验，不把用户验收记录为自动化验证。
- 未修改 nameservers、官网、邮件记录、接口代码或凭据，未提交或推送 Git。

#### 完整 Commit message

文件：域名 Issue、Commit 记录与工作台中对应的状态和索引；Scalar 建档文件另笔提交。

```text
docs(api): 记录自定义域名配置与验收结果

- 记录 Vercel 域名绑定与 Namecheap CNAME
- 保存用户验收结果与代理检查限制
```

用户已批准，将本记录、Issue 与工作台域名索引同步为已完成，随本地提交归档；不推送远端。

## 关联文档

- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：域名与 DNS 配置已保存，用户已反馈新域名测试通过；代理此前 HTTPS 检查失败，不将用户验收记作代理独立复验。
- 批准依据：用户在部署修复验收及本地提交完结后，明确要求继续绑定 api.exts.linguio.dev。
- 任务规模：小型域名配置工作项。

### 历史后续事项

用户已批准本地文档提交，本工作项随提交完结；后续实施 Scalar 与官网入口，不自动推送。
