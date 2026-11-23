---
date: "2026-11-02"
scope: [extension, website]
status: completed
type: feature
---

# 接入 Studio GitHub 真实登录

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

静态 Studio 提供 Account 与 GitHub/Google 登录入口，当前都提示未接入。后续接通真实 GitHub 授权和应用会话，保持未登录也能使用 Studio 与本地功能。

### 排除项

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

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-02-extension-github-login-issue.md)

#### 预期交付边界

插件使用标准 OIDC 授权码与 PKCE 登录 GitHub，官网只承载登录中转和授权确认。不新增业务接口、业务表或管理员，不把 Client Secret 写入仓库。

#### 实际交付

- 插件使用 oidc-client-ts 3.5.0。后台通过 Chrome identity 发起授权码与 S256 PKCE，凭据保存在扩展源 IndexedDB；页面只接收头像、昵称和邮箱。缺少公开 Client ID 时保持访客，不使用占位值。
- 退出先撤销刷新令牌，成功后再删除插件身份。取消和失败使用共用 Sonner，日志不输出授权码或令牌。Google 仍提示未接入。本地设置、书签和下载记录不随登录退出清除。
- Manifest 新增 identity 与唯一 Neon Auth 主机权限，固定公钥不变。公开 Client ID 只从本地 .env.local 读取，示例文件保持为空。
- 官网新增 /auth/sign-in/ 与 /auth/consent/，使用 @neon/auth 0.8.2 读取网页会话，并把原始签名查询原样交回 Neon。
- 同步扩展与官网规则、README、认证配置清单、设计、计划及工作项记录。

Cookie 直连已停用：退出请求返回 403 INVALID_ORIGIN，Neon 拒绝 chrome-extension 来源。该失败只说明旧方案不可用，不代表本次 OIDC 登录已经通过。

#### 验证与限制

- 本次四笔提交前未重跑扩展或官网测试、类型检查和构建。此前 Cookie 方案的 89 项测试及构建结果不覆盖当前 OIDC 实现，不记为本次通过。
- 2026-11-04 只读检查发现 https://exts.linguio.dev/auth/sign-in/ 与 /auth/consent/ 均返回 GitHub Pages 404。用户在已写入 Client ID 并重新构建后点击登录，插件提示“认证请求失败，请重试并检查 OAuth Provider 配置”。真实 GitHub 授权、取消、刷新恢复和退出均未通过。
- Neon discovery 可读取，issuer 与代码中的授权服务地址一致。用户已在对应分支配置受信域名、OAuth Provider 和 public 客户端；Client ID 只存在于未提交的 .env.local。
- 未推送，未部署官网，未代用户完成浏览器验收。

#### 用户验收

用户于 2026-11-04 要求本地提交，并明确拆成四笔。登录尚未验收通过。可复现步骤：

1. 将官网认证页部署到 https://exts.linguio.dev/ 后，直接打开 /auth/sign-in/ 与 /auth/consent/，无授权参数时应提示从插件发起，而不是 404。
2. 确认 apps/extension/.env.local 含公开 Client ID 后执行 pnpm ext:build，在 Chrome 或 Edge 重新加载 dist/build/chrome-mv3，核对 ID 为 gclkjdfiiibgahheiejgbmkglebbbgeh。
3. 打开新标签页，进入 Studio → Account → Login with GitHub。预期经过官网、GitHub 与官网确认后显示真实账户。关闭窗口或拒绝授权时保持未登录。
4. 刷新、重启后应恢复仍有效的身份；退出应先撤销刷新令牌再回到未登录。这不注销 GitHub 或官网会话。本地设置、书签和下载记录应保留。

#### 提交方案

四笔均只做本地提交。pnpm-lock.yaml 与官网依赖放在第二笔，因此第一笔单独检出时锁文件尚未包含 oidc-client-ts。四笔全部完成后，锁文件与两端 package.json 一致。

##### 第一笔：扩展实现

- 文件：apps/extension/package.json、wxt.config.ts、.env.example、background.ts、account-login.tsx、avatar.tsx、studio/services 下四个账户文件、manifest 测试及三项账户测试。
- diff 摘要：接入 OIDC 授权码与 PKCE，后台管理身份、刷新和退出，并限制扩展权限。

```text
feat(extension): 接入 Studio GitHub 的 OIDC 登录

- 使用授权码与 PKCE 完成后台登录和退出
- 缺少公开 Client ID 时保持访客
- 仅增加 identity 与 Neon Auth 主机权限
```

##### 第二笔：官网认证页

- 文件：apps/website/package.json、vite.config.ts、auth 入口与页面、auth-requests 测试、pnpm-lock.yaml。
- diff 摘要：增加登录与授权确认页，固定 @neon/auth，并更新两端依赖锁。

```text
feat(website): 增加插件登录与授权确认页

- 托管登录中转和授权确认
- 将原始签名查询原样交回认证服务
- 固定官网认证依赖并更新锁文件
```

##### 第三笔：扩展与设计文档

- 文件：apps/extension/AGENTS.md、apps/extension/README.md、docs/extension/ui.md、docs/extension/auth-setup.md、Spec、Plan。
- diff 摘要：记录 OIDC 边界、外部配置顺序和未完成的真实登录验收。

```text
docs(extension): 记录 OIDC 登录规则与配置

- 同步账户规则、说明和认证配置清单
- 记录设计边界与后续配置顺序
```

##### 第四笔：工作项记录

- 文件：apps/website/AGENTS.md、apps/website/README.md、docs/web-ui-sources.md、Issue、Commit 记录、工作台。
- diff 摘要：记录官网认证页约束，并把工作项、交付记录和工作台标为已完成。
- 终态更新：Issue 状态改为已完成，工作台移入已完成索引，最终提交批准改为已批准。

```text
docs(repo): 完结 GitHub 登录工作项记录

- 同步官网认证页约束与组件来源
- 记录四笔交付、404 限制和未完成的真实登录
```

#### 最终提交批准

已批准。用户于 2026-11-04 先要求 commit，随后要求拆成四笔提交。批准上述四笔本地提交及终态更新；不包含推送或部署。

## 关联文档

- [Spec](../../../superpowers/specs/2026-11-02-extension-github-login-design.md)
- [Plan](../../../superpowers/plans/2026-11-02-extension-github-login.md)
- [静态 Studio 前置 Issue](2026-11-02-extension-studio-static-shell-issue.md)
- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：用户于 2026-11-04 要求拆成四笔本地提交并完结。
- 批准依据：用户要求仅提供登录，后明确要求通用方案并批准 OIDC/PKCE 与官网认证托管页；用户确认官网不要求额外登录后再次要求继续。用户随后要求本地提交，并明确拆成四笔；不包含推送或部署。
- 任务规模：涉及身份、会话和外部 OAuth 配置的架构任务；恢复时确认设计、数据与权限边界，不预定 SDK 版本或实施阶段。

### 当前范围

- 复用用户已配置的 Neon Managed Better Auth 与 GitHub OAuth App，插件使用标准 OIDC/PKCE；官网通过 Neon SDK/REST 承接签名请求，不自行管理认证表或发行令牌。
- 新增 identity 权限与唯一 Neon Auth 主机的访问权限，通过浏览器 identity 流程回到固定 ID 的 /auth 路径；不扩展为所有网站权限。
- 用户已配置 Github 凭据与 https://gclkjdfiiibgahheiejgbmkglebbbgeh.chromiumapp.org 受信来源；本轮不改外部配置，不请求或保存 Client Secret。
- 从现有 Account Dialog 发起登录，处理用户取消、错误、回跳、重复点击及页面关闭；成功后回到原 Studio 上下文并展示真实用户。
- 处理会话恢复、过期、退出及私人数据清理，不每次进入 Studio 强制重新授权；GitHub 是否显示重复授权确认由提供方决定。
- 不提供独立注册/邮箱密码页面；首次 GitHub 授权按最终批准的用户策略建立身份。Google 继续提示未接入，除非用户另行批准。
- 不增加管理员角色、注册白名单或业务权限；仅展示认证身份，不将登录视为管理授权。

### 历史后续事项

本工作项完结。线上认证页仍返回 404，真实 GitHub 登录尚未通过；推送 main 与官网部署需另行批准。
