# WXT 稳定产物 npm 发布设计

## 状态与关联

- 状态：已批准；用户在查看设计状态后明确要求继续，按本设计串行实施。
- [Issue](../../changes/issues/2026-10-12-wxt-stable-output-npm-release-issue.md)
- [Commit 记录](../../changes/commits/2026-10-12-wxt-stable-output-npm-release-commit.md)

## 交付目标

公开发布 `@linguio/wxt-stable-output`，维护浏览器加载的完整开发目录，隔离 WXT 完整重建清空目录的影响；提供适用于多个包的共用手动发布 Action。代码保留在 monorepo，仓库内使用本地 workspace 包，npm 为外部使用者提供版本化产物。

## 已核实事实

- 当前只存在新标签页源码入口；稳定 HTML 从 `http://localhost:3000` 加载页面代码及 Vite client，当前正常热更新不依赖稳定目录逐次复制。
- 本地 WXT `0.21.4` 的 `internalBuild` 清空工作产物目录，成功后触发 `build:done`；普通增量修改由 `rebuild` 生成产物、更新 `server.currentOutput`，随后发出页面、扩展或 content script 重载通知，没有触发 `build:done`。
- 已有校验、暂存、备份恢复逻辑可以复用，不新增常驻复制程序或轮询。
- npm 用户名 `linguio` 由用户确认；实际包名可用性和发布权限尚未验证。

## 同步方案与取舍

可选方案：只支持完整重启并在文档注明增量限制；接入 WXT 成功重建后的通知；等待 WXT 上游提供统一完成 hook。选择第二种，避免公开工具要求使用者每次静态修改都重启，也不引入文件监听和时间窗口猜测。

- 保留 `publishStableBuild` 与 `createStableDevelopmentHooks`，默认稳定后缀和自定义目标能力不变。
- 完整构建继续在 `build:done` 校验并发布。
- 用 `server:created` 接入公开类型中的 `reloadExtension`、`reloadPage`、`reloadContentScript` 通知方法。保留并委托原方法；仅在 `serve` 中启用，不修改 WXT 的编译逻辑或私有模块。
- 收到重载通知时读取 `server.currentOutput`。新成功产物先串行校验、发布，再转发原通知；同一产物对应的多个通知不重复复制。首次构建后仅建立已发布产物记录，不多发布一次。
- 重载方法的返回约定仍为 void；包装器内部排队完成同步再转发。发布失败记录错误且不发送这次针对新产物的重载，不把失败标为成功；后续成功产物允许恢复。
- 原方法的参数与调用上下文必须保留，服务器重启不得重复包装，关闭后不得再发布旧任务。生产构建不接入同步。
- Vite 模块 HMR 不拦截、不逐次全量复制；只有 WXT 重新生成磁盘产物并通知重载时才发布。
- 接入依赖 WXT 的通知时序，必须用真实 WXT 集成验证。若无法证实通知覆盖或恢复行为，暂停公开通用承诺，报告事实并请用户决定范围，不引入私有补丁或无限重试。

## 公共包边界

- 包名：`@linguio/wxt-stable-output`；首版沿用现有版本 `1.0.0`，仅在该版本未被发布时使用。
- 首版声明并验证 WXT `0.21.4`、Node.js `24.16.0`；WXT 作为精确版本 peer dependency 和开发验证依赖，不在首版宣称支持未验证版本。全部仓库依赖和工具版本保持精确。
- ESM 入口与类型声明保留，发布白名单包含源码、类型、中英文 README、许可证和变更说明，不包含测试、缓存、开发产物或账号配置。
- 2026-10-13 用户批准将源码目录统一为 `packages/wxt-stable-output`；包内元信息和活动路径引用同步更新，仓库内继续精确 workspace 引用。
- 工具包版本独立于根产品版本；更新时同步包版本、内部精确引用和锁文件，不自动升级。
- 类型描述与运行时 API 对齐，原 hook 与新增 server hook 都可直接在 WXT 配置中展开；现有扩展的 bundle-size hook 保持兼容。
- 不宣传绝对原子或无间断切换。目录替换失败尽量恢复旧目录，恢复失败时报告备份位置；开发页面和 HMR 仍依赖开发服务器。

## 发布流程

- 新增一个仓库级手动 workflow，输入完整包名，在 main 的明确提交上运行；不因 push 自动发布。
- 发布工具只从 `packages` 中选择名称完全匹配、允许公开发布的包，拒绝路径输入、私有包、应用包、重复名称和已存在的 npm 版本。参数通过环境变量或参数数组传递，不拼接执行输入。
- 串行完成目标包测试、类型检查、必要构建与 tarball 消费验证；先验证打包元信息和文件清单，再发布同一份已验证 tarball。
- 同一包串行发布，不取消运行中的发布；失败退出非零，日志和摘要给出所选包、版本、Git 提交及实际结果。不改版本、锁文件、Git 状态或其他包。
- 使用 GitHub 托管 runner、精确 Node/pnpm/npm 和 Action 版本，发布 job 获得 `id-token: write`，使用 npm Trusted Publishing；不保存长期 npm Token。
- 每个包在 npm 设置中分别绑定同一 GitHub 仓库和 workflow 文件。首版包尚未存在时，先引导用户批准并完成本地首发，再绑定 Trusted Publisher；后续版本用于验收 Action 发布，不能重复发布同一个版本。
- 可在未提交前执行本地验证，但远程运行需 workflow 已提交并推送，实际发布需用户分别批准。Actions 验收不以 YAML 或本地测试通过替代。

## 验证与停止点

- 保留已有成功发布、无效 Manifest、缺失文件、复制失败、Windows 替换失败测试；新增同步通知的必要行为验证，不写 UI 或源码字符串测试。
- 真实 WXT 验证首次构建、增量磁盘产物更新、失败保留及恢复，使用程序调用和有界运行，不启动长期后台服务。独立安装 tarball 验证入口与 TypeScript 类型。
- 用户自行在 Chrome/Edge 加载 `dist/dev/chrome-mv3-dev-stable`，确认页面 HMR、完整重启和失败恢复；代理提供具体操作与预期结果，不执行视觉或交互验收。
- 完成约定自动化后停在待验收，列出文件、diff、验证与限制；Git 提交、推送、首次 npm 发布、npm 账号设置和 workflow 触发分别等用户批准。
- 同一失败最多一次定位与一次修复重试；遇系统内存告警立即停止，按根 AGENTS.md 执行。

## 未包含内容

不加入 Changesets、批量发布、自动版本 PR、独立仓库、npm 组织、额外构建框架或无关功能，不改变现有产品发布与部署流程。
