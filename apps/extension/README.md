# exts 浏览器扩展

统一 Chrome／Edge 扩展，包含 Newtab、Dock、Settings、Studio、历史清理和媒体下载模块。

## 功能文档

- [扩展功能索引](../../docs/extension/README.md)：功能状态与说明入口。
- [Newtab](../../docs/extension/newtab.md)：书签、Dock、工具入口与 Settings。
- [历史清理](../../docs/extension/history-cleaner.md)：启动与关闭时清空访问历史的配置、权限与能力边界。
- [Telegram Download](../../docs/extension/telegram-download.md)：Telegram Web 下载、即时开关、完成提示与保存位置限制。
- [界面规范](../../docs/extension/ui.md)：共用主题、样式和组件规则。

## 目录职责

- `src/entrypoints/`：WXT 扩展入口。
- `src/app/`：React 顶层装配与页面状态协调。
- `src/pages/`：Newtab、Dock、Studio、Account、Settings、Download 页面区域和布局组合；`pages/dock/` 组合收藏、账号、下载、设置及 Studio 导航入口，不持有其他 feature 的实现。
- `src/features/bookmarks/`：书签配置、卡片、文件夹、分组打开与访问判断。
- `src/features/activity/`：真实数据请求、后台消息、运行期 Provider、活动卡片/图表、上海日期计算与接口字段适配。
- `src/pages/account/`：Dock 与 Studio 共用的登录对话框和账号菜单；侧栏专用账号入口归 pages/studio。
- `src/features/account/`：OIDC 客户端、会话、后台协调、用户信息与凭据处理。
- `src/lib/api/`：共用 HTTP 请求、固定 API 地址、超时取消和错误类型；不依赖业务页面或保存结果。
- `src/features/settings/`：跨功能设置的结构、存储、消息、General 设置项与主题同步。
- `src/features/history-cleaner/`：配置适配、可选权限、后台清理及设置区域。
- `src/features/media-download/`：总设置与设置区域；`telegram/` 持有页面、桥接、下载菜单和文件保存逻辑，`records/` 持有记录存储、后台和列表；`pages/download/` 持有记录抽屉。
- `src/components/ui/`：shadcn 来源组件；`src/components/custom/`：自定义公共组件与 IconSize、UiIconName 类型；`src/hooks/`：公共 Hook；`src/lib/`：浏览器资源、存储、主题偏好解析和通用工具，不反向引用业务。
- `src/assets/`、`src/styles/`：品牌资源、字体与全局样式；env 保留在应用根目录，产物仍输出到根 dist。
- `tests/features/`：与业务功能对应的行为测试；`tests/lib/`：公共逻辑；`tests/config/`：Manifest 与资源完整性。
- 根 `wxt.config.ts`、`package.json`：构建与应用配置；`components.json` 的 shadcn 别名指向新的公共目录。

入口、页面和功能各自保持职责；功能内部默认平铺，确有体量时按业务细分，不铺设空目录或多余转导出层。后台与网页脚本直接导入对应功能文件，不通过界面聚合入口加载。

验证按 [分级验证规范](../../docs/verification.md) 选择影响范围。目录迁移等跨模块调整检查整个扩展，局部文案或资源修改不默认运行全部业务测试；已有有效结果在本地提交时复用，不追加验证。

## 根目录用法

`pnpm ext:dev` 启动 WXT；Chrome／Edge 只加载根 `dist/dev/chrome-mv3-dev-stable/`，不能加载会被重建清空的根 `dist/.cache/extension/chrome-mv3-dev/` 临时目录。应用内部不再生成 dist；修改路径后停止并重新启动旧开发进程。

`pnpm ext:build` 生成根 `dist/build/chrome-mv3/`。Manifest 产品版本由根 `scripts/version.mjs` 读取根 `package.json` 的 `version`，不在子项目维护。包内 `pnpm test`、`pnpm typecheck` 负责逻辑与构建验证，不执行视觉或交互验收。

应用图标为透明黑／白 PNG，系统配色偏好在新标签页挂载后同步到工具栏及 favicon。用户自行检查真实浏览器主题效果；扩展 ID 或加载目录变化不保证旧存储自动继承。

## Studio GitHub / Google 登录

Account 使用标准 `oidc-client-ts` 3.5.0 进行 OIDC 授权码 + S256 PKCE 登录。官网承载认证中转、授权确认与同源注销，GitHub/Google 密码及授权在对应官方页面完成。插件按钮选择提供方，官网认证页通过窗口 sessionStorage 保留选择，原始授权和签名查询不改写。未登录仍可使用本地功能；不新增 FastAPI 接口、业务表或管理员权限。

Manifest 包含 identity、cookies 与唯一 Neon Auth 主机权限，固定公钥保持不变。所有插件认证请求省略网页 Cookie，后台统一处理授权、令牌刷新及撤销；凭据保存在扩展源 IndexedDB，不返回给页面或内容脚本。配置与部署顺序见 [认证配置清单](../../docs/extension/auth-setup.md)。将同目录 .env.example 复制为 .env.local，填写公开的 VITE_OIDC_CLIENT_ID 后重新构建；不要填写 Client Secret。缺少 Client ID 时保持访客状态并明确提示未配置。

实际验收使用根 dist/build/chrome-mv3；部署网页并配置 Neon public client 后，在 Studio → Account → Login with GitHub 或 Login with Google 发起。成功显示真实账户，取消/拒绝不能成为已登录。刷新及重启恢复仍有效身份，退出先撤销刷新令牌，再短暂打开官网同源注销窗口调用 Neon signOut 并确认网页会话消失，收到固定回跳后清理指定 Cookie 与插件身份；失败保留身份以便重试。详情见认证配置清单；再次登录要求 Neon 显示 Exts 授权确认，官网向所选 GitHub/Google 请求显示账号选择器；第三方自身可能仍沿用已有应用授权。这不注销 GitHub/Google 网站账号，已签发 access token 可能在原有效期内仍有效。本地设置、书签和下载记录不随登录退出清除。真实授权、账号选择、浏览器 Cookie 和恢复/退出尚待用户验收。

## Activity 本地 API 联调

业务请求统一基于 Axios 1.21.0，在 lib/api/client.ts 配置 fetch adapter、POST/JSON、超时取消与标准异常；后台读取会话并执行账号隔离，不写业务缓存、不自动重试。

先在仓库根运行 `pnpm api:dev`，保持本地服务可用。扩展开发默认连接 `http://127.0.0.1:8000`；生产构建默认正式 API。VITE_API_BASE_URL 可显式选择本地或正式地址，OAuth resource 仍使用正式 API 标识，不改受众、不把令牌发给页面或写入环境文件。

本次已生成的 `dist/build/chrome-mv3` 显式绑定本地 API。重新加载该扩展产物并打开新标签页，初始化确认已登录后自动获取本人 Activity，无需从 IndexedDB 复制 token；未登录保留图表的空数据表现，不发业务请求。切换 Check-ins/Trends/Summary 重新请求，Growth/Sleep 只改变展示；Home/Studio 切换、窗口聚焦、跨天或改库不会自动刷新数据。

数据仅保留当前视图运行状态，不写本地存储、不缓存历史查询。切换视图清空并取消上次请求；账号变化时拒绝旧身份/迟到结果。日历、趋势和周图表始终渲染；无数据、未登录、加载和失败均沿用图表本身的空数据表现，不加入 Empty/错误图标/占位文字，失败只调用共用 Sonner toast.error「加载失败」。Growth 分组由前端组合，分钟数 null 与 0 区分；所有范围按上海日期计算，趋势仍排除今天。

业务请求从扩展 Service Worker 发出，新标签页 Network 不一定显示。可在扩展管理页检查 Service Worker 的 Network，或从本地 API 终端观察收到的 POST /api/activity/days。API 终端日志是入站请求；单独启动本地 API 不会自动请求 Activity，也不会启动定时器。

PowerShell 重新生成相同本地联调产物（环境变量仅对当前终端进程有效）：

```powershell
$env:VITE_API_BASE_URL = 'http://127.0.0.1:8000'
pnpm --filter @exts/extension build
```

验收只加载根 `dist/build/chrome-mv3`；若使用开发命令则只加载成功发布的 `dist/dev/chrome-mv3-dev-stable`，本次未更新该稳定开发目录。不能加载构建时清空的缓存目录。生产发布前使用独立终端/移除该环境变量，避免将本地地址带入发布产物。完整退出持久化清理由后续 Issue 实施，此项不改变现有退出存储规则。

## 固定本地扩展 ID

`wxt.config.ts` 的 Manifest `key` 固定为一份 RSA 公钥，开发和正式构建共用。未打包加载的新产物预期 ID 为 `gclkjdfiiibgahheiejgbmkglebbbgeh`；换目录或机器时保留该公钥即可保持相同 ID，不要重新生成。其候选登录回跳来源为 `https://gclkjdfiiibgahheiejgbmkglebbbgeh.chromiumapp.org`，具体回跳路径、Neon 来源兼容性与会话流程留待登录工作项确认，本次不配置 Domains。

该公钥只固定未打包加载的身份；生成时未保存私钥，不用于 CRX 签名发布。首次从旧 ID 切换后会被浏览器识别为新扩展，旧 ID 的设置、下载记录等存储不会自动迁移；不要为切换主动删除旧扩展。实际 ID、换目录及重建后的一致性由用户在 Chrome/Edge 验收。

未来发布 Chrome 或 Edge 商店时，须核对各商店分配的 ID；当前本地公钥不保证商店 ID 相同。如需开发版与 Chrome 商店版同 ID，应按 [Chrome 官方说明](https://developer.chrome.com/docs/extensions/reference/manifest/key) 使用对应商店条目的公钥重新确认，并同步登录白名单。

`pnpm ext:release` 独立构建扩展并生成根 `dist/release/exts-chrome.zip`，不构建网站或桌面；再次打包在同目录暂存完成生成和校验后安全替换旧固定包，失败保留旧包；ZIP 解压后可在 Chrome 扩展管理页开启开发者模式并加载解压目录。`pnpm ext:release` 仅供本地扩展验包。从产品 1.2.0 起，正式发布统一通过 Actions → Exts Publish → main／Release，在 macOS 上执行完整 `pnpm release`，生成包含扩展 ZIP 和桌面 DMG 的同版本草稿。每次新发布前提升根版本，两端即使没有改动也一起重新构建和更新版本，用户验收后统一公开。完整版本、产物和稳定目录规则见 [构建与分发规范](../../docs/build-release.md)。
