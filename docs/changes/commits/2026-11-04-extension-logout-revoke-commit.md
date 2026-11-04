# 修复插件退出时的令牌撤销：交付记录

## 对应工作项

- [Issue](../issues/2026-11-04-extension-logout-revoke-issue.md)

## 预期交付边界

插件退出撤销刷新令牌时省略网页 Cookie。撤销成功后才删除本地身份；失败保留身份。不改登录窗口、官网或 Neon 配置。

## 实际交付

- 退出不再调用会附带网页 Cookie 的库撤销方法。插件自行向撤销地址提交刷新令牌、token_type_hint 和 Client ID，并设置 credentials 为 omit。
- 撤销返回成功后才删除本地身份。非成功响应抛出固定错误“撤销刷新令牌失败”，不把响应正文或令牌写入错误信息。
- 登录成功后读取 Neon 已有用户信息接口，补上头像、昵称和邮箱。登录成功、失败、取消，以及退出成功，都在右下角提示。退出不打开回调页。
- 已登录账户改为 dashboard-01 的展开菜单。Log out 在菜单内退出，不再使用弹出框。未登录仍使用原登录框。

## 验证与限制

- 定向测试 2 项通过：请求使用 omit，正文含令牌、refresh_token 和 Client ID；403 时错误文案固定且不包含令牌。账户协调原有 5 项仍通过，撤销失败不会删除本地身份。
- 用户信息合并与读取测试 2 项通过。随后 pnpm --filter @exts/extension test --maxWorkers=1 --no-file-parallelism：20 个文件、92 项通过。pnpm --filter @exts/extension typecheck 通过。
- 退出成功提示和账户展开菜单之后又分别执行 typecheck 或 pnpm ext:build，均通过。产物为 dist/build/chrome-mv3。保留既有 theme-init.js 非 module 警告和大于 500 kB 的 chunk 警告。菜单改动后未再跑全量测试。
- 未在 Chrome 或 Edge 中实际登录、查看资料或退出。用户于 2026-11-04 要求本地提交完结，未推送。

## 用户验收

用户于 2026-11-04 要求本地提交，按规则完结。浏览器里的撤销、资料、提示和展开菜单未复验。

## 提交方案

代码与文档分开提交。文档提交把 Issue、本记录和工作台标为已完成。

### 代码

- 文件：account-login.tsx、account-background.ts、revoke-oauth-token.ts、user-info.ts、dropdown-menu.tsx、types.ts、ui-icon.tsx、revoke-oauth-token.test.ts、user-info.test.ts。
- 摘要：撤销省略 Cookie；登录后补读用户信息并提示；已登录账户改为展开菜单，退出不再用弹出框。

```text
fix(extension): 修复退出撤销并补齐登录资料

- 撤销刷新令牌时省略网页 Cookie，失败保留本地身份
- 登录后读取用户信息，成功与退出在右下角提示
- 已登录账户改为展开菜单，退出不再使用弹出框
```

### 文档

- 文件：Issue、本记录、工作台、docs/web-ui-sources.md。
- 摘要：记录上述交付、验证限制，并标为已完成。

```text
docs(repo): 完结退出撤销工作项记录

- 记录省略 Cookie 撤销、用户资料提示和展开菜单
- 工作项标记为已完成，未推送
```

## 最终提交批准

已批准。用户于 2026-11-04 要求本地提交。不推送、不发布。
