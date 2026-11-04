# GitHub / Google 登录外部配置与验收

本地页面与插件实现不等于线上可用。本清单只说明后续动作，不表示批准部署或修改云端。

## 部署后填写的值

| 配置 | 值 |
| --- | --- |
| 官网登录页 | https://exts.linguio.dev/auth/sign-in/ |
| 官网授权页 | https://exts.linguio.dev/auth/consent/ |
| 官网退出页 | https://exts.linguio.dev/auth/sign-out/ |
| Neon Auth issuer | https://ep-patient-grass-ak8aymgi.neonauth.c-3.us-west-2.aws.neon.tech/neondb/auth |
| 官网受信来源 | https://exts.linguio.dev |
| 插件授权回跳 | https://gclkjdfiiibgahheiejgbmkglebbbgeh.chromiumapp.org/auth |
| Resource URL | https://api.exts.linguio.dev |
| OAuth client 类型 | public（不创建 Client Secret） |
| Skip consent | 关闭 |
| Scopes | openid profile email offline_access |

Resource URL 只用作令牌用途标识，本工作项不创建 API 接口。GitHub OAuth App 回调为 Neon Auth URL 后加 /callback/github；Google Web 应用客户端回调为同一 Auth URL 后加 /callback/google，不改成官网或插件地址。Google Client ID/Secret 只配置到 Neon Google 提供方；插件现有 VITE_OIDC_CLIENT_ID 仍为 Neon public client ID，不替换成 Google Client ID。用户已完成 Google 与 Neon 配置，实际登录仍需验收。不再尝试添加 chrome-extension 来源。

## 操作顺序

1. 批准并部署官网本次产物，确认两个页面可经 HTTPS 打开；直接无授权查询访问时显示应从插件发起，不应空白或 404。
2. 在 Neon 启用 OAuth Provider，填写上面的登录页、授权页和 Resource URL；Domains 添加官网受信来源，保留已有插件 HTTPS 回跳来源。无需启用 MCP、动态注册或其他登录方式。
3. 创建 public 客户端，注册完整插件回跳地址，关联同一 Resource URL，关闭 Skip consent；将公开 Client ID 提供给开发配置，不提供 GitHub Client Secret。
4. 将 apps/extension/.env.example 复制为同目录 .env.local，填入 VITE_OIDC_CLIENT_ID，重新构建插件。不将真实令牌或 Client Secret 写入环境文件；Client ID 是公开配置。
5. 在 Chrome/Edge 加载根 dist/build/chrome-mv3，核对固定 ID。进入 Studio → Account → Login with Google，经官网中转、Google 账号选择/授权和官网确认返回插件，显示真实账户；退出后用 Login with GitHub 检查原登录。
6. 关闭授权窗口或点击拒绝，不能变成已登录；重试和多页同时点击不应重复打开授权。两个提供方按钮在登录期间均禁用，不应出现 Google 未接入提示。
7. 登录后刷新及重启浏览器，应恢复仍有效的身份；过期时按刷新令牌恢复。退出会短暂打开官网同源窗口：先撤销插件刷新令牌，再由官网调用 Neon signOut 并确认网页会话消失，固定回跳后删除残留的指定 Neon Cookie，最后删除插件身份。再次点击插件登录会向 Neon 发送 `prompt=consent`，应显示 Exts 授权确认；官网登录页调用 Neon 所选 GitHub/Google 社交登录时另传 `additionalParams.prompt=select_account`，应出现 GitHub 账号选择器。选择其他 GitHub 账号后，插件应显示该账号。GitHub 网站自己的应用授权页仍可能被跳过。
8. 删除 Cookie 或撤销令牌失败时应提示退出未完成并能重试；Neon 明确返回 `invalid_request / token not found` 表示刷新令牌已不存在时继续完成本地退出。刷新令牌可能已经撤销，因此其他失败后保留的身份不保证仍可刷新。本地 Settings、书签、下载记录保持原有数据。

不会注销 GitHub/Google 网站账号，也不撤销用户已授予插件的 consent；GitHub 账号选择器不要求再次输入密码，也不等于重新授予应用权限。原 access token 可能在原有效期内仍有效，不承诺即时全局注销。Google 同样在社交登录边界要求选择账号，不能只改插件发给 Neon 的 `prompt`。官网存在 Neon 网页会话时继续现有 SSO 身份；要切换提供方或账户，先从插件退出以清除本机 Neon 会话，再重新登录。不在本次增加账户关联或合并策略。

Cookie 名称及 HttpOnly 属性见 [Neon 认证流程](https://neon.com/docs/auth/authentication-flow)；删除需 Chrome `cookies` 权限及现有 Neon Auth 主机权限，见 [Chrome Cookies API](https://developer.chrome.com/docs/extensions/reference/api/cookies)。本流程通过官网同源页面调用 Neon signOut 结束服务端会话；插件只在确认回跳后删除残留本机 Cookie。相同浏览器配置中使用这个 Neon Auth 会话的其他页面也会失去该登录状态。

## 当前限制

未提供 Client ID 时，插件保持访客状态，登录按钮会提示尚未配置，不进行真实授权。Neon discovery/token/userinfo/revocation、网站 Cookie、浏览器回跳和刷新/退出实际行为必须在配置后验收。不要分享 Cookie、完整回跳地址、授权码或令牌。
