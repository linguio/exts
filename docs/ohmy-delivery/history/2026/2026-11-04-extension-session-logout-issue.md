---
date: "2026-11-04"
scope: [extension]
status: completed
type: task
---

# 退出插件时结束 Exts 登录会话

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

当前只撤销插件刷新令牌并删除本地身份，Neon 官网会话仍然有效。退出后再次登录会跳过登录页。本次同时结束 Neon 的 Exts 会话，使再次登录重新进入登录流程。

### 范围与排除项

- 插件只删除 Neon Auth 指定名称的浏览器会话 Cookie，并撤销刷新令牌、清除插件本地身份；退出不弹窗。远端账户已删除且撤销返回 `invalid_request / token not found` 时继续本地退出。
- 用户 2026-11-04 反馈再次登录仍跳过授权；插件再次登录时向 Neon 明确发送 `prompt=consent`，要求每次显示 Exts 授权确认。
- 用户 2026-11-04 批准解决退出后 GitHub 重新登录直接进入原账号：官网登录页发起 GitHub 社交登录时要求 GitHub 显示账号选择器；请求位置兼顾后续 Google 接入，但本次不接入 Google。
- 保留刷新令牌撤销；远端退出未确认时不提示退出成功，保留重试入口。
- 不退出 GitHub/Google 网站账号，不接入 Google 登录、资料同步或业务数据变更。
- 不推送、部署、提交 Git 或代用户执行浏览器验收。不新增 localStorage 凭据，不清理其他网站的 Cookie。

## Todo

- [x] 补充指定 Cookie 删除、失败与退出顺序的逻辑测试。
- [x] 接入无弹窗 Cookie 删除并保持串行账户操作。
- [x] 再次登录时要求 Neon 显示授权确认。
- [x] 同步当前认证规则、配置与交付记录。
- [x] 执行扩展相关验证，停在用户验收。
- [x] 在官网 GitHub 社交登录请求中要求账号选择，并验证参数与现有授权查询原样传递。
- [x] 同步认证说明与交付记录，执行受影响应用验证并停在用户验收。

## 验收标准

1. 插件退出时不出现新窗口，只删除 Neon Auth 的浏览器会话 Cookie。
2. Cookie 删除及其他令牌撤销失败时不显示退出成功，并允许重试；仅远端明确报告令牌不存在时允许继续退出。
3. 退出后再次点击插件登录，应显示 Neon 的 Exts 授权确认；GitHub 自身仍可保留登录状态，不保证重新输入密码或重新展示 GitHub 应用授权。
4. 本地设置、书签与下载记录保留。
5. 退出后再次点击 GitHub 登录，GitHub 展示账号选择器；选择其他账号后插件展示所选账号。Google 登录仍保持未接入。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-04-extension-session-logout-issue.md)

#### 预期交付边界

插件退出时撤销刷新令牌、删除当前 Neon Auth 来源的指定浏览器会话 Cookie，再清除插件身份；全程不弹退出窗口。失败允许重试。不清理其他网站 Cookie。

#### 实际交付

- Manifest 增加 `cookies` 权限，沿用唯一 Neon Auth 主机权限。
- 后台在撤销刷新令牌后仅查询 `__Secure-neonauth.session_token`，核对主机并按路径、存储及分区信息删除；未发现 Cookie 视为本机已无该会话，删除失败保留插件身份并提示重试。
- 用户删除远端账户后，Neon 撤销刷新令牌返回 `invalid_request / token not found`；仅此响应视为令牌已失效，继续本地退出，其他撤销失败仍提示重试。不记录令牌值。
- 再次登录时向 Neon 添加 `prompt=consent`，使 Exts 授权确认不依赖之前的同意记录；官网登录页发起 GitHub 社交登录时另传 `additionalParams.prompt=select_account` 请求账号选择，不要求 GitHub 重复展示其应用授权。
- 原 OIDC end-session 的未提交试作已撤去，没有新增官网退出页或要求 Neon 客户端配置额外字段。
- 插件凭据继续保存在扩展源 IndexedDB；本机 Cookie 删除不会删除 Neon 服务端会话或使已签发的 access token 即时失效。同一浏览器配置共享该 Neon Auth Cookie 的其他页面也会失去会话。

#### 验证与限制

- 新增针对性测试先观察到缺少 Cookie 权限与删除实现，之后相关 11 项测试通过。再次登录的测试先确认缺少 `prompt=consent`，实现后通过。
- `pnpm --filter @exts/extension test --maxWorkers=1`：21 个文件、96 项测试通过。
- `pnpm --filter @exts/extension typecheck`：通过。
- `pnpm ext:build`：通过，产物为根 `dist/build/chrome-mv3`；保留既有 theme-init 非 module 和大于 500 kB chunk 警告。
- 初次沙箱测试因 spawn EPERM 无法启动 worker，终止后在允许子进程的环境串行完成测试；不是业务测试失败。
- 官网 GitHub 请求测试先确认缺少账号选择参数，补充后 2 项通过；修正原测试把请求断言错误误收为预期拒绝的问题。官网类型检查通过；`pnpm web:build` 初次在沙箱因 Windows `spawn EPERM` 和原生模块加载失败，在允许子进程的环境重试一次通过。
- 用户提供了远端删除后的错误类型及说明，没有保存其令牌。用户表示已验证可以；代理未自行部署官网或执行 Chrome/Edge 实际加载、Cookie 列表、退出后重新登录、GitHub 账号选择、Neon 实际授权确认及设置保留检查，也未独立检查 Neon 当前分支是否将 `additionalParams` 透传到 GitHub。Cookie 名称依据 Neon 当前认证文档；若实际分支/浏览器采用不同名称或分区，需要按真实结果处理。

#### 用户验收

用户于 2026-11-04 表示已验证可以，并明确要求本地 commit；以下步骤为可复现的验收参考，代理未代为执行。

1. Chrome/Edge 重新加载根 `dist/build/chrome-mv3`，确认新增 cookies 权限后进入 Studio 登录。
2. 部署根 `dist/build/exts-web` 后，点击账户菜单的 Log out，包括远端账户已删除的情况；预期没有新窗口，插件恢复未登录。再次点击 Login with GitHub，应出现 GitHub 账号选择器，可选另一账号，再出现 Neon 的 Exts 授权确认并显示所选身份。GitHub 网站已有应用授权时仍可能跳过其授权页。
3. 断网或 Cookie 删除失败时不提示成功，可重新打开账户菜单重试；本地 Settings、书签、下载记录保留。GitHub 网站自身可能仍有登录会话；Google 登录继续提示未接入。

#### 提交方案与最终批准

用户于 2026-11-04 明确批准本地提交，代码与文档分两笔提交；不推送远端。

##### 代码与测试

- 文件：`apps/extension/wxt.config.ts`、`src/modules/studio/components/account-login.tsx`、`src/modules/studio/services/account-background.ts`、`account-controller.ts`、`remove-session-cookie.ts`、`revoke-oauth-token.ts`、`tests/config/manifest.test.mjs`、`tests/modules/studio/account-controller.test.ts`、`remove-session-cookie.test.ts`、`revoke-oauth-token.test.ts`；`apps/website/src/pages/auth/requests.ts`、`apps/website/tests/auth-requests.test.mjs`。
- diff 摘要：增加限定的 Cookie 权限和删除逻辑，保持令牌撤销与失败重试；再次登录要求 Exts 授权确认，官网向 GitHub 请求账号选择。

```text
fix(extension): 退出后允许重新选择 GitHub 账号

- 撤销刷新令牌后只删除指定 Neon 会话 Cookie，令牌已不存在时继续退出
- 删除失败保留插件身份并允许重试
- 再次登录要求 Exts 授权确认并向 GitHub 请求账号选择
```

##### 文档

- 文件：apps/extension/AGENTS.md、apps/extension/README.md、apps/website/AGENTS.md、docs/extension/auth-setup.md、docs/ohmy-delivery/readme.md、本 Issue 与 Commit 记录。
- diff 摘要：记录真实退出行为、账号选择请求、权限变化、验证结果及浏览器验收限制。

```text
docs(extension): 记录退出与 GitHub 账号选择边界

- 同步退出规则、账号选择请求和新增 Cookie 权限
- 记录自动化结果与浏览器验收步骤
```

## 关联文档

- [认证配置](../../../extension/auth-setup.md)

## 历史补充

### 元信息

- 规模：小型任务
- 批准：用户于 2026-11-04 明确要求修改现有退出，避免再次登录自动进入原账户。
- 验收与提交：用户于 2026-11-04 表示已验证可以，并明确要求本地 commit；代码与文档按两笔提交完结，不推送远端。

### 历史后续事项

无；当前工作项按用户本地提交指令完结。Google 登录作为后续独立工作项，本次不继续实施。
