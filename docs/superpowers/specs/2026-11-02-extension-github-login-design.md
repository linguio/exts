# Studio GitHub 登录设计

## 当前批准

[Issue](../../changes/issues/2026-11-02-extension-github-login-issue.md)。用户要求通用登录方案，已批准标准 OIDC 授权码 + PKCE，并确认官网只承载中转/授权页，GitHub 密码与 GitHub 授权仍在 GitHub 官方页面完成。不增加业务功能或业务表。

## 方案与边界

- 插件使用 oidc-client-ts 3.5.0：public client、response_type=code、S256 PKCE、每次随机 nonce，协议 state/nonce/issuer/audience 验证交由标准库。
- 官网使用 @neon/auth 0.8.2 读取网页会话，GitHub 发起及继续/同意授权通过 Neon 官方 REST 请求；原始签名查询 oauth_query 不做解码、排序或修改。
- 原 Cookie 直连退出在真实浏览器中返回 403 INVALID_ORIGIN，Neon 又拒绝 chrome-extension 域名，因此删除这条实现，不绕过来源保护。
- 不采用自建认证代理，不在插件中保存 Client Secret，不自行发行令牌。

## 插件实现

- 固定 ID gclkjdfiiibgahheiejgbmkglebbbgeh，运行时使用 chrome.identity.getRedirectURL('auth')；回跳的来源/路径先检查，标准库校验 state 并交换授权码。
- Auth issuer 为 https://ep-patient-grass-ak8aymgi.neonauth.c-3.us-west-2.aws.neon.tech/neondb/auth。
- Resource identifier 为 https://api.exts.linguio.dev；这里只是令牌用途标识，不代表新增 API 接口。
- 身份 scopes 为 openid profile email offline_access；所有插件认证 fetch 使用 credentials=omit，不依赖 Neon 网页 Cookie。
- 后台持有 UserManager、扩展源 IndexedDB 凭据存储和串行队列，避免多标签竞争使用旋转刷新令牌。UI 只接收头像、昵称和邮箱，内容脚本不能发送账户操作消息。
- VITE_OIDC_CLIENT_ID 由 apps/extension/.env.local 提供；缺失时不实例化客户端、不请求认证，访客功能可用，点击登录提示缺少配置。
- 重复登录合并为一个授权；关闭页面不会把令牌交给 UI。后台进程重启后从扩展 IndexedDB 恢复。
- 读取过期身份时以刷新令牌续期；invalid_grant 清除身份，网络失败保留重试机会。
- 退出先撤销 refresh_token，成功后删除插件本地身份；撤销失败不伪装成功。此处退出 Exts 插件，不注销 GitHub 或官网 SSO 会话，已签发 access token 可能在原有效期内仍有效。
- 旧 Cookie 会话不迁移；新实现只读取标准客户端自己的存储，不以旧 Cookie 自动登录。

## 官网托管页面

- /auth/sign-in/：从插件进入，使用 GitHub 登录；已有网页身份时继续原签名授权请求。
- /auth/consent/：显示客户端名称、回调主机、全部 resource、scope，允许或拒绝。客户端名称来自服务端查询但由注册方声明，不作为可信保证；本机回调显式提示。
- 两页 no-referrer/noindex，无官网首页入口或额外注册表单；沿用现有主题与官方 Button，不改首页。
- 外部配置、部署与真实浏览器验收另行完成，不能将本地编译成功写成真实登录通过。

## 依据

- https://authts.github.io/oidc-client-ts/
- https://neon.com/docs/auth/guides/plugins/oauth-provider
- https://developer.chrome.com/docs/extensions/reference/api/identity
