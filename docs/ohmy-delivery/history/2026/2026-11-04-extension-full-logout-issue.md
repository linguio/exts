---
date: "2026-11-04"
scope: extension
status: completed
type: bug
---

# 退出后重新选择登录账号

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

退出后重新登录直接到 Exts 授权确认页，不能切换 Google/GitHub 账号。退出应结束 Neon 网页会话，再清除插件身份；重新登录需经过所选提供方的账号选择。

### 范围

- 通过官网同源页面调用 Neon Auth signOut；插件等待受信回跳后再清除本地身份。
- 退出失败保持插件身份并允许重试；再次登录不沿用旧 Neon 会话直接授权。
- 保留注册记录、本地数据和第三方网站会话。

### 排除项

不新增业务权限、数据库或依赖；不自动部署、提交、推送；浏览器验收由用户执行。

## Todo

- [x] 增加退出回跳来源的逻辑测试；网页注销的实际效果留待真实浏览器验收。
- [x] 实现 Neon 同源注销及固定插件回跳。
- [x] 运行逻辑测试、类型检查与生产构建。
- [x] 同步交付记录和验收步骤，停在用户验收。

## 验收标准

- 退出成功后再次登录进入 Google/GitHub 账号选择，再到 Exts 授权确认；不需要删除用户。
- 注销失败不提示成功，仍可重试；未登录的本地功能可用。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 对应工作项
- [Issue](2026-11-04-extension-full-logout-issue.md)

#### 预期交付边界
官网同源注销 Neon 会话，插件收到可信回跳后清理身份；重新登录允许选账号。

#### 实际交付
- 官网新增 /auth/sign-out/ 同源页面，调用 Neon Auth SDK 的 signOut，再确认 getSession 不再返回用户，才跳转固定插件 /logout 回跳。
- 插件退出先撤销刷新令牌，再短暂打开官网注销窗口。只接受匹配的插件回跳，随后清理残留指定 Neon Cookie 与本地身份；失败继续保留插件身份供重试。
- 登录页原有逻辑在 Neon 无会话时进入所选 Google/GitHub 社交登录。未修改账户注册数据、第三方网站会话、权限或依赖。
- 同步应用约束、扩展 README 和认证配置清单，说明退出窗口与验收边界。

#### 验证与限制
- 新增回跳验证测试先因缺少函数失败，补充实现后针对性插件 5 项、官网认证 6 项通过。
- 插件完整逻辑测试：21 文件、100 项通过。官网完整逻辑测试：17 项通过。
- 两端 TypeScript 类型检查通过；插件与官网生产构建通过。官网产物包含 auth/sign-out/index.html；插件构建保留既有 theme-init 与大文件警告。
- 未在 Chrome/Edge 中实际调用 Neon signOut；真实服务端会话删除、Cookie 清理、浏览器回跳、Google/GitHub 账号选择、失败重试仍待用户验收。不能将逻辑测试或构建通过写成真实退出成功。
- 本次改变既有“不打开退出窗口”的行为：会短暂打开官网注销窗口以避开插件来源被 Neon 拒绝的问题。窗口关闭、网络失败或页面未部署时退出提示失败并保留插件身份。
- 用户实际操作后报告“退出未完成，请重试”；该错误来自插件统一失败提示，无法仅凭它判断是旧官网注销页 404、Neon 注销请求、会话复查还是回跳失败。线上注销页尝试只读访问未连通，原因未确认；不得写成真实退出已通过。
- 用户随后明确要求本地 commit；按其批准完结并保留上述未解决的验收结果。未推送或部署；旧官网没有注销页，必须与新版插件配套部署。

#### 用户验收
用户于 2026-11-04 明确要求本地 commit，按仓库规则批准完结。实际退出此前返回“退出未完成，请重试”，未证明功能通过；以下仍为后续可复现步骤。

1. 另行批准并部署 D:\GitHub\exts\dist\build\exts-web，确认 /auth/sign-out/ 页面不为 404。Chrome/Edge 重新加载 D:\GitHub\exts\dist\build\chrome-mv3。
2. 用 Google 登录 Exts，点击 Log out。预期短暂出现“退出 Exts”窗口，自动关闭后插件显示未登录。再点 Login with Google，应经过 Google 账号选择，选另一个账号后才到 Exts 授权确认，并显示新账号。
3. 重复上述步骤检查 GitHub。注册用户不应被删除；退出后本地 Settings、书签、下载记录保留。
4. 断网或在退出窗口关闭页面时应提示退出未完成，身份保留，可恢复网络后重试。未部署新版官网时应出现失败提示，而不显示成功。

#### 提交方案与批准
用户于 2026-11-04 明确要求本地 commit，批准按代码与文档两笔提交完结。随文档提交机械更新 Issue、交付记录和工作台为已完成；未推送或部署。

##### 代码与测试

- 文件：apps/extension/src/modules/studio/services/account-background.ts、tests/modules/studio/account-background.test.ts；apps/website/src/pages/auth/index.tsx、requests.ts、src/entrypoints/auth/sign-out/index.html、vite.config.ts、tests/auth-requests.test.mjs。
- diff 摘要：新增官网同源注销页与受限回跳，插件等待注销完成后清除身份，并覆盖回跳校验。

```text
fix(extension): 退出时结束 Neon 会话并允许重新选账号

- 官网同源注销并确认会话结束后回跳插件
- 插件只在受信回跳后清理本地身份
- 验证固定退出回跳与失败重试边界
```

##### 文档

- 文件：apps/extension/AGENTS.md、README.md；apps/website/AGENTS.md；docs/extension/auth-setup.md；docs/ohmy-delivery/readme.md、本 Issue 与 Commit 记录。
- diff 摘要：同步退出窗口、同源注销、测试结果和真实浏览器验收要求。

```text
docs(extension): 记录 Neon 注销与账号切换验收

- 同步官网注销页及插件退出流程
- 记录验证结果和真实账号切换验收步骤
```

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 当前阶段：用户于 2026-11-04 明确要求本地 commit，批准按两笔本地提交完结；实际退出曾返回“退出未完成，请重试”，原因仍待部署后排查。

### 历史后续事项

本工作项按用户本地提交指令完结。需配套部署新版官网后排查实际“退出未完成”结果；未推送或部署。
