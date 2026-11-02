# Studio 静态页面实施 Plan

> 执行方式：使用 superpowers:executing-plans 串行执行；用户禁止子代理、并行、浏览器交互验证及自动提交。

**目标：** 交付左右官方 Empty 缺省的 Studio、不可点击 Logo 右侧独立 House 返回和只提示未接入的账户登录框。
**架构：** App 继续用 React Activity 切换 Home/Studio；Home 持有原 Dock 布局，Studio 独立占满视口。Studio 内部组合官方 Sidebar、Empty、Dialog 与 Button，不显示 Overview/Activity，不新增服务层；Home 原卡片保留。
**技术：** 沿用现有 React、Radix、Lucide、Tailwind 及 Sonner 精确版本，不安装或升级依赖。
**事实来源：** [Issue](../../changes/issues/2026-11-02-extension-studio-static-shell-issue.md)，设计已由用户通过本次纯前端范围确认。

## 约束

- Google 和 GitHub 均可点击，仅 toast.info 提示未接入，无接口、OAuth、假会话或持久身份。
- Media Download、Settings、Actions 与暂停的图标管理不变。
- 官方组件来源固定并登记；已存在组件不被 CLI 覆盖，只补当前确需组件及导出。
- 代码注释使用中文；通用图标显式导入，单一 TooltipProvider/Toaster 沿用现状。
- 不新增 UI/布局/焦点/键盘模拟测试，视觉与交互由用户 Chrome/Edge 验收。

## 实施顺序

- [x] 核对固定官方 Sidebar、sidebar-07、login-03 与 Dialog 源码。所需组件放 shared/ui，移动端断点 hook 随官方放 shared/hooks；仅保留实际需要的导出与依赖。
- [x] 在 modules/studio/components 中组合 sidebar 和 account-login；左右缺省直接组合固定官方 Empty，不显示 Overview 或 Studio Activity。Home 回调只绑定到 Logo 右侧独立的官方 House 图标按钮；Logo/文字为非交互布局，折叠时保留 House 而不是可点击 Logo。正文顶部只显示官方触发器、分隔线与 Studio 当前页。
- [x] 调整 App：Home 原区域包含 Dock 并维持 Activity 保留状态；Studio 全高，返回恢复 Home，不另加路由或浏览器历史行为。现有 newtab.css 可直接复用，无需修改。
- [x] 登录内容恢复固定官方 login-03 的 Card 与 form/FieldGroup/Field，标题/说明通过 Dialog asChild 包裹官方 CardTitle/Description；定位外壳透明，官方 Card 提供唯一边框和阴影。用户指定不保留首行 Logo，Welcome back/text-center 与指定说明保留；两个按钮只提示未接入。Account 恢复官方 32px Avatar/Fallback、原文字与尾部图标；共用 Button 补既有 border-border，不修改全局变量。
- [x] 同步 extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md，更新 Issue/Commit/工作台并保留暂停、排队文档。
- [x] 对最新一轮 Empty/独立返回反馈修正串行运行一次扩展 test、typecheck、ext:build，77 项、类型检查及正式构建通过；不增加视觉或交互测试，现停在用户验收。

## 文件边界

- 应用组合：apps/extension/src/app/NewtabApp.tsx、newtab.css。
- Studio：apps/extension/src/modules/studio/index.tsx 及 components 下对应业务组合。
- 通用 UI：固定官方 sidebar、dialog 及确需的基础组件/图标/token；复用已有组件，不修改下载代码。
- 文档：当前工作项、Plan、真实登录排队记录、已暂停图标记录的工作台入口及适用 UI 规范。

## 停止点

自动化验证结束停在用户验收，提供构建产物、进入/返回、折叠、登录按钮及 Media Download 不变的可复现步骤。无 Git 提交、推送、部署或外部配置。
