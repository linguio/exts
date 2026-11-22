# 接入 Studio GitHub 真实登录：交付记录

## 对应工作项

- [Issue](../issues/2026-11-02-extension-github-login-issue.md)

## 预期交付边界

插件使用标准 OIDC 授权码与 PKCE 登录 GitHub，官网只承载登录中转和授权确认。不新增业务接口、业务表或管理员，不把 Client Secret 写入仓库。

## 实际交付

- 插件使用 oidc-client-ts 3.5.0。后台通过 Chrome identity 发起授权码与 S256 PKCE，凭据保存在扩展源 IndexedDB；页面只接收头像、昵称和邮箱。缺少公开 Client ID 时保持访客，不使用占位值。
- 退出先撤销刷新令牌，成功后再删除插件身份。取消和失败使用共用 Sonner，日志不输出授权码或令牌。Google 仍提示未接入。本地设置、书签和下载记录不随登录退出清除。
- Manifest 新增 identity 与唯一 Neon Auth 主机权限，固定公钥不变。公开 Client ID 只从本地 .env.local 读取，示例文件保持为空。
- 官网新增 /auth/sign-in/ 与 /auth/consent/，使用 @neon/auth 0.8.2 读取网页会话，并把原始签名查询原样交回 Neon。
- 同步扩展与官网规则、README、认证配置清单、设计、计划及工作项记录。

Cookie 直连已停用：退出请求返回 403 INVALID_ORIGIN，Neon 拒绝 chrome-extension 来源。该失败只说明旧方案不可用，不代表本次 OIDC 登录已经通过。

## 验证与限制

- 本次四笔提交前未重跑扩展或官网测试、类型检查和构建。此前 Cookie 方案的 89 项测试及构建结果不覆盖当前 OIDC 实现，不记为本次通过。
- 2026-11-04 只读检查发现 https://exts.linguio.dev/auth/sign-in/ 与 /auth/consent/ 均返回 GitHub Pages 404。用户在已写入 Client ID 并重新构建后点击登录，插件提示“认证请求失败，请重试并检查 OAuth Provider 配置”。真实 GitHub 授权、取消、刷新恢复和退出均未通过。
- Neon discovery 可读取，issuer 与代码中的授权服务地址一致。用户已在对应分支配置受信域名、OAuth Provider 和 public 客户端；Client ID 只存在于未提交的 .env.local。
- 未推送，未部署官网，未代用户完成浏览器验收。

## 用户验收

用户于 2026-11-04 要求本地提交，并明确拆成四笔。登录尚未验收通过。可复现步骤：

1. 将官网认证页部署到 https://exts.linguio.dev/ 后，直接打开 /auth/sign-in/ 与 /auth/consent/，无授权参数时应提示从插件发起，而不是 404。
2. 确认 apps/extension/.env.local 含公开 Client ID 后执行 pnpm ext:build，在 Chrome 或 Edge 重新加载 dist/build/chrome-mv3，核对 ID 为 gclkjdfiiibgahheiejgbmkglebbbgeh。
3. 打开新标签页，进入 Studio → Account → Login with GitHub。预期经过官网、GitHub 与官网确认后显示真实账户。关闭窗口或拒绝授权时保持未登录。
4. 刷新、重启后应恢复仍有效的身份；退出应先撤销刷新令牌再回到未登录。这不注销 GitHub 或官网会话。本地设置、书签和下载记录应保留。

## 提交方案

四笔均只做本地提交。pnpm-lock.yaml 与官网依赖放在第二笔，因此第一笔单独检出时锁文件尚未包含 oidc-client-ts。四笔全部完成后，锁文件与两端 package.json 一致。

### 第一笔：扩展实现

- 文件：apps/extension/package.json、wxt.config.ts、.env.example、background.ts、account-login.tsx、avatar.tsx、studio/services 下四个账户文件、manifest 测试及三项账户测试。
- diff 摘要：接入 OIDC 授权码与 PKCE，后台管理身份、刷新和退出，并限制扩展权限。

```text
feat(extension): 接入 Studio GitHub 的 OIDC 登录

- 使用授权码与 PKCE 完成后台登录和退出
- 缺少公开 Client ID 时保持访客
- 仅增加 identity 与 Neon Auth 主机权限
```

### 第二笔：官网认证页

- 文件：apps/website/package.json、vite.config.ts、auth 入口与页面、auth-requests 测试、pnpm-lock.yaml。
- diff 摘要：增加登录与授权确认页，固定 @neon/auth，并更新两端依赖锁。

```text
feat(website): 增加插件登录与授权确认页

- 托管登录中转和授权确认
- 将原始签名查询原样交回认证服务
- 固定官网认证依赖并更新锁文件
```

### 第三笔：扩展与设计文档

- 文件：apps/extension/AGENTS.md、apps/extension/README.md、docs/extension/ui.md、docs/extension/auth-setup.md、Spec、Plan。
- diff 摘要：记录 OIDC 边界、外部配置顺序和未完成的真实登录验收。

```text
docs(extension): 记录 OIDC 登录规则与配置

- 同步账户规则、说明和认证配置清单
- 记录设计边界与后续配置顺序
```

### 第四笔：工作项记录

- 文件：apps/website/AGENTS.md、apps/website/README.md、docs/web-ui-sources.md、Issue、Commit 记录、工作台。
- diff 摘要：记录官网认证页约束，并把工作项、交付记录和工作台标为已完成。
- 终态更新：Issue 状态改为已完成，工作台移入已完成索引，最终提交批准改为已批准。

```text
docs(repo): 完结 GitHub 登录工作项记录

- 同步官网认证页约束与组件来源
- 记录四笔交付、404 限制和未完成的真实登录
```

## 最终提交批准

已批准。用户于 2026-11-04 先要求 commit，随后要求拆成四笔提交。批准上述四笔本地提交及终态更新；不包含推送或部署。
