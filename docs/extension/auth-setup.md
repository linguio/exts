# GitHub 登录外部配置与验收

本地页面与插件实现不等于线上可用。本清单只说明后续动作，不表示批准部署或修改云端。

## 部署后填写的值

| 配置 | 值 |
| --- | --- |
| 官网登录页 | https://exts.linguio.dev/auth/sign-in/ |
| 官网授权页 | https://exts.linguio.dev/auth/consent/ |
| Neon Auth issuer | https://ep-patient-grass-ak8aymgi.neonauth.c-3.us-west-2.aws.neon.tech/neondb/auth |
| 官网受信来源 | https://exts.linguio.dev |
| 插件授权回跳 | https://gclkjdfiiibgahheiejgbmkglebbbgeh.chromiumapp.org/auth |
| Resource URL | https://api.exts.linguio.dev |
| OAuth client 类型 | public（不创建 Client Secret） |
| Skip consent | 关闭 |
| Scopes | openid profile email offline_access |

Resource URL 只用作令牌用途标识，本工作项不创建 API 接口。原有 GitHub OAuth App 回调仍是 Neon Auth URL 后加 /callback/github，不改成官网或插件地址。不再尝试添加 chrome-extension 来源。

## 操作顺序

1. 批准并部署官网本次产物，确认两个页面可经 HTTPS 打开；直接无授权查询访问时显示应从插件发起，不应空白或 404。
2. 在 Neon 启用 OAuth Provider，填写上面的登录页、授权页和 Resource URL；Domains 添加官网受信来源，保留已有插件 HTTPS 回跳来源。无需启用 MCP、动态注册或其他登录方式。
3. 创建 public 客户端，注册完整插件回跳地址，关联同一 Resource URL，关闭 Skip consent；将公开 Client ID 提供给开发配置，不提供 GitHub Client Secret。
4. 将 apps/extension/.env.example 复制为同目录 .env.local，填入 VITE_OIDC_CLIENT_ID，重新构建插件。不将真实令牌或 Client Secret 写入环境文件；Client ID 是公开配置。
5. 在 Chrome/Edge 加载根 dist/build/chrome-mv3，核对固定 ID。进入 Studio → Account → Login with GitHub，经官网中转、GitHub 授权和官网确认返回插件，显示真实账户。
6. 关闭授权窗口或点击拒绝，不能变成已登录；重试和多页同时点击不应重复打开授权。Google 仍提示未接入。
7. 登录后刷新及重启浏览器，应恢复仍有效的身份；过期时按刷新令牌恢复。退出后刷新保持未登录，但不会退出 GitHub 网站或官网 SSO；再次主动登录可能复用它们的已有会话。
8. 退出需先成功撤销刷新令牌再删除插件身份；断网失败时应提示并能重试。原 access token 可能在原有效期内仍有效，不承诺即时全局注销。本地 Settings、书签、下载记录保持原有数据。

## 当前限制

未提供 Client ID 时，插件保持访客状态，登录按钮会提示尚未配置，不进行真实授权。Neon discovery/token/userinfo/revocation、网站 Cookie、浏览器回跳和刷新/退出实际行为必须在配置后验收。不要分享 Cookie、完整回跳地址、授权码或令牌。
