# API 自定义域名交付记录

- [Issue](../issues/2026-10-31-api-custom-domain-issue.md)
- 状态：已完成；用户已确认新域名测试通过并明确批准本地文档提交。

## 预期交付边界

- 外部配置：Vercel api 项目域名与权威 DNS 中对应子域名记录。
- 仓库文档：本 Issue、Commit 记录和工作台；无业务代码修改。

## 实际交付与验证

- 插件添加域名返回 Project not found；改用已登录浏览器，成功将 api.exts.linguio.dev 添加到 api 项目 Production 环境。
- Vercel 显示 Invalid Configuration，要求在 Namecheap 添加 CNAME：Name = api.exts，Value = 1c7e369e49e67a3d.vercel-dns-017.com.。
- 用户登录后已确认 Namecheap BasicDNS；新增 api.exts CNAME 指向指定目标，TTL 为 Automatic，保存后的列表显示记录存在；原官网 exts CNAME 保留。
- 公开 dig 查询已返回正确 CNAME。代理此前两次 HTTPS 检查返回 SSL_ERROR_SYSCALL，最后读取的 Vercel 状态为 Invalid Configuration；随后用户按新域名测试步骤反馈“可以了”，确认验收通过。未追加代理独立复验，不把用户验收记录为自动化验证。
- 未修改 nameservers、官网、邮件记录、接口代码或凭据，未提交或推送 Git。

## 完整 Commit message

文件：域名 Issue、Commit 记录与工作台中对应的状态和索引；Scalar 建档文件另笔提交。

```text
docs(api): 记录自定义域名配置与验收结果

- 记录 Vercel 域名绑定与 Namecheap CNAME
- 保存用户验收结果与代理检查限制
```

用户已批准，将本记录、Issue 与工作台域名索引同步为已完成，随本地提交归档；不推送远端。
