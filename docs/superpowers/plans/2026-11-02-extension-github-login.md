# Studio 标准登录实施计划

**依据：** [Issue](../../changes/issues/2026-11-02-extension-github-login-issue.md)、[Spec](../specs/2026-11-02-extension-github-login-design.md)。采用当前工作区，串行实施，不使用子代理、不自动提交。

## 本地交付

- [x] 固定 oidc-client-ts 3.5.0 与官网 @neon/auth 0.8.2，移除插件的 Neon Cookie SDK 依赖。
- [x] 以失败测试驱动后台账户协调，覆盖身份资料隔离、刷新、失效、撤销失败和重复登录。
- [x] 实现 Chrome Identity navigator、扩展源 IndexedDB 存储、后台消息来源校验及现有账户 UI。
- [x] 用标准库验证 S256/nonce 请求及错误 state 拒绝，不自建协议逻辑。
- [x] 完成官网登录与授权页、原始签名查询 REST 请求及对应纯逻辑验证。
- [ ] 运行一次阶段完整测试、两端类型检查及构建；核对产物、配置和固定 ID。
- [ ] 同步交付记录及可操作配置清单，停在本地阶段验收。

## 后续依赖阶段

- [ ] 用户批准部署两个官网托管页面并完成 HTTPS 可访问性确认。
- [ ] 用户配置 Neon OAuth Provider、public client 及资源，提供 Client ID 后重新构建插件。
- [ ] 用户在 Chrome/Edge 验收登录、取消、恢复、退出、拒绝和异常；不将这一阶段提前记为通过。

## 风险与停止点

Neon 需提供标准 discovery、token、userinfo 与 revocation 能力。无 Client ID 时保持明确未配置，不用占位符连接真实服务。网页 Cookie 限制、实际重定向、刷新令牌旋转和撤销均待真实环境验收；若平台能力不满足则记录具体响应，停止扩大范围。
