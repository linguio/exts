---
date: "2026-11-04"
scope: extension
status: completed
type: feature
---

# 接入 Studio Google 登录

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

Neon 已由用户配置 Google 提供方，插件仍提示未接入。让用户从 Studio 的 Google 按钮发起 Google 登录，并显示真实身份。

### 排除项

不增加业务表、账户合并策略、API、权限、SDK 或其他依赖；不自动操作 Google/Neon、不部署、不提交或推送，不执行浏览器视觉/交互验收。

## Todo

- [x] 建立提供方选择与请求行为的纯逻辑测试，验证旧行为与无效目标拒绝。
- [x] 接通插件两个登录入口及官网提供方选择，保留签名查询和现有会话边界。
- [x] 完成相关全量逻辑测试、类型检查与生产构建。
- [x] 同步认证说明和交付记录，提供 Chrome/Edge 验收步骤，停在待验收。

## 验收标准

- Login with Google 不再提示未接入，经 Google 与 Neon 授权回到 Studio 显示身份；GitHub 仍可登录。
- 关闭窗口或授权失败可重试，重复发起不并发登录；刷新、退出继续复用既有流程。
- 登录引导仅跳转固定 Neon HTTPS 授权端点，提供方限定为 GitHub/Google；不泄露密钥或令牌、不重建签名查询。
- 未登录可使用原本地功能；登录后的真实行为由用户在 Chrome/Edge 验收。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项

- [Issue](2026-11-04-extension-google-login-issue.md)

#### 预期交付边界

接通插件 Google 按钮与官网提供方选择，保留 GitHub，沿用 OIDC、会话和退出；不增加依赖/权限、不提交或部署。

#### 实际交付

- Account 的 Google 按钮与 GitHub 共用后台 OIDC 登录；两个按钮在登录中均禁用，保留各自加载提示，不改变官方登录组合样式。
- 后台仅接受 github/google，旧消息未指定提供方时默认 GitHub；沿用串行登录、nonce、PKCE、回跳验证、资料隔离、刷新与退出流程，不增加权限或依赖。
- 标准库生成授权 URL 后，经现有官网 /auth/sign-in/ 引导；提供方与授权 URL 放在片段，网页仅在当前窗口 sessionStorage 保存提供方。引导只允许跳转固定 Neon HTTPS 授权端点，拒绝未知提供方、外部目标、带凭据或片段的目标。
- 官网根据提供方显示并发起 Google/GitHub 社交登录，均传 select_account；签名查询按原始字符串传回。旧入口默认 GitHub，已有 Neon 网页会话继续原 SSO 流程。
- 同步应用约束、扩展 README 和认证配置清单；不修改历史 GitHub Issue 的交付事实。

#### 验证与限制

- 新测试先观察到缺少引导读取/构建函数、未知提供方未拒绝和 Google 提供方未传递；实现后针对性插件 11 项与官网认证 5 项通过。
- pnpm --filter @exts/extension test --maxWorkers=1：21 个文件、99 项测试通过。
- 官网 tests 下 3 个文件通过 node --test --test-concurrency=1 串行执行，16 项通过。
- 插件与官网 typecheck 均通过；pnpm ext:build 与 pnpm web:build 均通过。
- 产物：dist/build/chrome-mv3、dist/build/exts-web。插件保留既有 theme-init 非 module 与超过 500 kB chunk 警告。
- 沙箱内首次官网测试被 spawn EPERM 阻止；在获准启动子进程的环境执行后得到真实测试结果，不属于业务逻辑失败。
- 已自查提供方传递、固定目标校验、签名查询原样保留及 React 状态/禁用行为；未执行浏览器视觉、布局或交互验收。
- Google/Neon 云端配置完成由用户说明，代理未读取密钥、未独立验证配置；本次按用户指令本地提交，未推送或部署。新版官网必须配套部署，旧版不识别登录引导片段，不能直接验证新版插件完整流程。
- 已有 Neon 网页会话仍可继续原身份；切换提供方先从插件退出。Google 和 GitHub 是否按请求显示账号选择、跨站返回时 sessionStorage 是否保留及真实身份恢复/退出均待 Chrome/Edge 验收，不把构建成功等同真实登录成功。

#### 用户验收

用户于 2026-11-04 明确要求 commit，批准本地提交并完结。未提供真实登录验收结果，自动化通过不代表浏览器已验收；以下保留可复现步骤。

1. 在另行批准后部署 dist/build/exts-web，覆盖官网认证页；Chrome/Edge 扩展管理页加载或重新加载 D:\GitHub\exts\dist\build\chrome-mv3。此次不是更新 dist/dev 稳定开发产物，加载旧开发目录不会获得本次修改。
2. 若已登录，先从 Studio 账户菜单 Log out；再次进入 Account → Login with Google。应不再出现未接入提示，官网登录页应显示“使用 Google 登录”，进入 Google 官方页选择账号，完成 Neon 授权后回到 Studio 显示真实头像/昵称/邮箱。
3. 退出后改用 GitHub，应进入 GitHub 流程；确认未登录可用本地功能。Google/GitHub 自身已登录时可能无需再次输入密码。
4. 关闭窗口或拒绝授权应保持未登录，可重新发起；登录期间重复点击或其他页面发起应只保留一个流程。刷新或重启应恢复有效身份，退出不弹窗口；本地 Settings、书签和下载记录不受影响。

#### 提交方案与最终批准

用户于 2026-11-04 明确批准本地 commit，代码与文档按以下边界分两笔提交；不推送或部署。

##### 代码与测试

- 文件：apps/extension/src/modules/studio/components/account-login.tsx；services/account-background.ts、account-controller.ts、auth-client.ts；apps/extension/tests/modules/studio/account-background.test.ts、account-controller.test.ts；apps/website/src/pages/auth/index.tsx、requests.ts；apps/website/tests/auth-requests.test.mjs。
- diff 摘要：接通 Google 并保留 GitHub，增加提供方消息、固定官网引导与 Neon 目标校验，官网按选择发起社交登录，补充纯逻辑回归测试。

```text
feat(extension): 接通 Google 登录并复用现有认证流程

- 插件与官网传递所选提供方，保留 GitHub 登录
- 校验官网引导目标并保留原始 OAuth 签名查询
- 覆盖提供方选择与受信跳转逻辑
```

##### 文档

- 文件：apps/extension/AGENTS.md、README.md；apps/website/AGENTS.md；docs/extension/auth-setup.md；docs/ohmy-delivery/readme.md；本 Issue 与 Commit 记录。
- diff 摘要：同步双提供方登录、云端配置边界、验证结果与验收步骤。

```text
docs(extension): 记录 Google 登录配置与验收边界

- 同步 GitHub 与 Google 登录规则及配置说明
- 记录自动化结果和配套部署后的浏览器验收步骤
```

随文档提交将 Issue 改为已完成、交付记录改为用户批准完结与提交，工作台移入已完成索引；如提交失败，未完成部分恢复待提交与待批准。

## 关联文档

- [认证配置](../../../extension/auth-setup.md)

## 历史补充

### 元信息

- 当前阶段：用户于 2026-11-04 明确要求本地 commit，按代码与文档两笔提交完结；未推送或部署。
- 批准依据：用户完成 Google OAuth 与 Neon 配置后明确要求“开始”；范围为插件与官网接通 Google，保留 GitHub，复用 OIDC 会话与退出。
- 任务规模：小型；沿用既有认证架构、权限与数据模型，不增加依赖。

### 范围与实施决定

- 插件两个按钮传递明确提供方；后台仍以标准 OIDC/PKCE 验证并交换授权码。
- identity 窗口先进入现有官网 /auth/sign-in/，在片段中携带提供方和标准库生成的授权地址；官网在该窗口的 sessionStorage 保存选择，再跳转唯一受信 Neon 授权端点。该选择只用于选择社交登录，不作为身份或权限凭据。
- 不修改 Neon 返回的原始签名查询；官网向对应社交登录提供方请求账号选择，已有网页会话继续原授权请求。
- 保留 GitHub、取消/失败、串行会话、刷新、退出及访客可用行为，复用既有按钮样式。

### 历史后续事项

本工作项按用户本地提交指令完结。官网部署及真实 Chrome/Edge 登录仍未验证，需另行批准部署后按 Commit 记录验收；不自动推送或部署。
