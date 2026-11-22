# 接入 Studio GitHub 真实登录

## 元信息

- 工作项：2026-11-02-extension-github-login
- 状态：已完成
- 当前阶段：用户于 2026-11-04 要求拆成四笔本地提交并完结。
- 批准依据：用户要求仅提供登录，后明确要求通用方案并批准 OIDC/PKCE 与官网认证托管页；用户确认官网不要求额外登录后再次要求继续。用户随后要求本地提交，并明确拆成四笔；不包含推送或部署。
- 任务规模：涉及身份、会话和外部 OAuth 配置的架构任务；恢复时确认设计、数据与权限边界，不预定 SDK 版本或实施阶段。

## 背景与目标

静态 Studio 提供 Account 与 GitHub/Google 登录入口，当前都提示未接入。后续接通真实 GitHub 授权和应用会话，保持未登录也能使用 Studio 与本地功能。

## 当前范围

- 复用用户已配置的 Neon Managed Better Auth 与 GitHub OAuth App，插件使用标准 OIDC/PKCE；官网通过 Neon SDK/REST 承接签名请求，不自行管理认证表或发行令牌。
- 新增 identity 权限与唯一 Neon Auth 主机的访问权限，通过浏览器 identity 流程回到固定 ID 的 /auth 路径；不扩展为所有网站权限。
- 用户已配置 Github 凭据与 https://gclkjdfiiibgahheiejgbmkglebbbgeh.chromiumapp.org 受信来源；本轮不改外部配置，不请求或保存 Client Secret。
- 从现有 Account Dialog 发起登录，处理用户取消、错误、回跳、重复点击及页面关闭；成功后回到原 Studio 上下文并展示真实用户。
- 处理会话恢复、过期、退出及私人数据清理，不每次进入 Studio 强制重新授权；GitHub 是否显示重复授权确认由提供方决定。
- 不提供独立注册/邮箱密码页面；首次 GitHub 授权按最终批准的用户策略建立身份。Google 继续提示未接入，除非用户另行批准。
- 不增加管理员角色、注册白名单或业务权限；仅展示认证身份，不将登录视为管理授权。

## 排除项

- 不新增 FastAPI 接口、业务表或管理员。仅增加获批的两页官网认证托管；OAuth Provider 与 public client 的具体云端配置/部署不自动执行，按配置清单另行完成。
- 不恢复图标管理，不修改 Media Download，不自动接入 Google，不推送、不部署，也不把 Client ID 写入仓库。

## Todo

- [x] 记录标准 OIDC/PKCE、官网托管及用户批准边界。
- [x] 验证身份发起接口、约束回跳来源及处理会话交换，不输出授权参数。
- [x] 实现真实身份与会话、错误/取消/退出处理。
- [x] 完成逻辑与鉴权边界验证，提供 Chrome/Edge 用户验收步骤并记录限制。

## 验收标准

- GitHub 登录后显示真实用户，取消与失败能重试，不停留假加载状态；Google 仍明确未接入。
- 刷新/重启、会话过期与退出行为符合最终批准方案，未登录可使用本地功能。
- 凭据不进入客户端；若存在受保护接口，未认证和无权限请求均不能执行管理操作。
- 生产与开发回跳及用户实际登录由明确记录的检查和 Chrome/Edge 用户验收覆盖，不将模拟状态写成真实登录通过。

## 关联文档

- [Commit 记录](../commits/2026-11-02-extension-github-login-commit.md)
- [Spec](../../superpowers/specs/2026-11-02-extension-github-login-design.md)
- [Plan](../../superpowers/plans/2026-11-02-extension-github-login.md)
- [静态 Studio 前置 Issue](2026-11-02-extension-studio-static-shell-issue.md)
- [工作台](../README.md)

## 唯一下一步

本工作项完结。线上认证页仍返回 404，真实 GitHub 登录尚未通过；推送 main 与官网部署需另行批准。
