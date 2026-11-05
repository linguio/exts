# 按 React 功能模块整理扩展目录

## 元信息

- 工作项：2026-11-05-extension-feature-structure
- 状态：已完成
- 当前阶段：用户验收通过，代码提交成功，随文档提交完结
- 规模：小型任务，一个 Issue，不另建 Spec、Plan 或子 Issue。
- 批准依据：用户确认方案并建档后明确要求开始，随后确认微调和冗余清理，最终表示“验证通过 commit 把删除issue那条也一起提交了”，批准本地提交，不推送。

## 背景与目标

当前扩展以 modules、shared 组织代码，部分模块内部重复使用完整项目层级。改为常见 React 功能组织方式，让入口、页面、业务功能与公共能力各有明确职责，同时保持现有行为。

## 范围

- src/entrypoints 保留 WXT 薄入口，只声明配置并调用启动函数，不增加 register/index.ts。Telegram 入口命名为 telegram-page.content.ts、telegram-bridge.content.ts，增加中文职责注释，保留原执行环境、注入时机与匹配范围。
- src/app 负责初始化、Provider 与顶层装配；src/pages 负责 Newtab、Studio、Settings 页面组合。
- 用户最终批准共享 Account 登录框和账号菜单统一归 pages/account，由 Dock 与 Studio 共用；仅 Studio 使用且依赖 Sidebar 的 account-login.tsx 归 pages/studio。OIDC、会话、凭据和用户信息逻辑继续归 features/account，不与 Settings 合并。
- 用户追加要求互换 Dock 中 Settings 与 Account 的位置，其他入口顺序保持不变；该项为明确批准的界面顺序差异，不属于纯目录迁移。
- 用户后续批准将首页专用样式从 app/newtab.css 移至 pages/newtab/newtab.css，保留明确文件名、样式内容与原导入顺序，不改名为 index.css。
- 用户最终确认 GeneralSettings 跟随主题与设置业务保留在 features/settings，与其他业务设置项一致；pages/settings 只组合抽屉和分区。下载记录 Sheet 归 pages/download，业务读写及记录列表保留 feature。检查迁移遗留的冗余、失效文件和变量，只清理已确认无用内容，不扩大至无关功能；不机械按 JSX 与逻辑函数分层。
- src/features 按 bookmarks、activity、account、history-cleaner、media-download 等业务组织；默认平铺，较大功能按 telegram、records 等业务细分，不强制建立 components/hooks/services/utils/types 或转导出文件。
- 各业务设置留在所属 feature；跨功能设置的数据结构、存储与通信统一归入 features/settings，pages/settings 只负责组合。
- 公共内容按职责归入 components/ui、components/custom、hooks、lib、config、styles、assets；只建立实际需要的目录。公共工具可放 lib/utils.ts，功能专用工具、常量与类型留在 feature，不建立顶层 utils、const、types 大杂烩目录。
- 用户后续批准自定义公共组件归 components/custom；BrandIcon、UiIcon、StatusIcon 保持独立，IconSize 与 UiIconName 在 custom/types.ts 集中维护，不让数据类型引用组件实现。components/ui 保留 shadcn 来源组件与已批准适配，含已有对自定义图标的引用。
- 实际职责映射：Dock 现有实现组合账号、下载、设置和 Studio 入口，按用户最新要求整体归入 pages/dock，与 Newtab、Studio 并列，不把业务装配放进公共 components；通用主题偏好解析归入 lib/theme，依赖业务设置的主题运行逻辑归入 features/settings/theme.ts。config 无独立实际内容时不建空目录。
- pages 组合 feature，feature 使用公共代码；公共代码不反向引用业务或页面。现有跨 feature 调用逐处核对，不新增全局管理层。
- modules、shared 全部迁出后移除空目录；同步引用、测试路径、components.json、构建配置中的资源与源码路径及相关文档。
- 保留全局主题和公共组件样式、根品牌源稿位置、各应用根目录的 env 与根 dist 产物规范。

## 排除项

- 不改变功能、界面、权限、公共 API、数据模型、依赖版本或构建产物路径，不新增抽象、依赖或假 DOM。
- SVG 减重、线上文件存储与图标管理不属于本工作项。
- 不执行浏览器视觉或交互验收，不自动提交或推送。

## Todo

- [x] 核对当前职责与引用，确定现有文件到目标目录的对应关系。
- [x] 迁移入口、页面、feature 与公共代码，清理被替代目录并同步配置和文档。
- [x] 调整既有逻辑测试；核对现有 21 个文件均为逻辑或配置测试，无需移除，保留 102 项覆盖。
- [x] 执行扩展完整测试、类型检查与构建；修复 CSS inline 引用后构建重试一次通过。
- [x] 记录交付、限制和可复现的 Chrome/Edge 验收步骤，停在用户验收。

## 验收标准

- src 按已确认职责组织，不残留旧 modules、shared 实现或失效引用；不强制铺设空目录。
- Newtab、Studio、设置、书签、Activity、账号、Dock、历史清理与媒体下载保持迁移前功能和外观；两个 Telegram 入口保留原运行边界。
- 既有有效逻辑测试、类型检查和构建通过；资源引用可解析，产物位置与现有发布规则一致。
- 本次生产构建验收加载 dist/build/chrome-mv3。若沿用开发方式，运行原 pnpm ext:dev 成功后再加载 dist/dev/chrome-mv3-dev-stable；本次未运行开发服务，旧稳定目录不能作为迁移结果。检查上述页面和功能主流程、设置保存与恢复、下载记录及既有失败/禁用边界，预期行为与迁移前一致。
- 自动化结果与用户验收分别记录，未执行项不得记为通过。

## 关联文档

- [Commit 记录](../commits/2026-11-05-extension-feature-structure-commit.md)
- [工作台](../README.md)
- [构建与分发规范](../../build-release.md)

## 唯一下一步

用户已确认验收通过并要求本地提交；按批准完结工作项，不自动推送。

## 完结后文档修正

用户于 2026-11-05 要求修正扩展 README 重复的 app 职责说明并本地提交。仅将首条改为 WXT 入口说明，app 职责由下一条保留；作为本迁移文档的补充修正，不涉及应用行为，工作项保持已完成。
