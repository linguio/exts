---
date: "2026-11-14"
scope: extension
status: completed
type: task
---

# 完善 Studio 品牌头部与 About

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

将现有单行品牌头部调整为指定官方两行品牌布局。

### 范围

复用官方SidebarMenuButton lg、32px品牌图标和两行文字组合；品牌使用既有Exts资源，名称Exts，说明Ideas into action；右侧独立Home按钮沿用现有实现。移除旧品牌行padding覆盖，使用官方组合。

- 用户验收修正：移除新增的rounded-lg背景容器（全局16px圆角会将32px容器变圆），直接使用32px既有Exts Logo，保留SVG自带外形。

- 补充批准：Account 账户菜单 Settings 下方增加 About 入口，使用现有官方 DropdownMenuItem 与 Dialog；展示既有 Logo、Exts、Ideas into action、动态 Manifest 版本，内容居中、版本只显示数字；底部使用 Built by Lin Gui · Source on GitHub，分别链接用户 X 与项目仓库，替代 Website / Changelog；合并本 Issue，不另建工作项。

- 补充批准：studio/login 改为 studio/account；采用 index.tsx、menu.tsx、login-dialog.tsx、login-required.tsx、state.ts 命名；About 迁入 about-dialog.tsx，导出 LoginDialog / LoginRequired，其余组件名称保留；同步源码、既有测试与现行文档引用，不改变行为。

- 补充批准：Dock 与 Studio 账户菜单统一固定 200px，不再跟随触发按钮或内容宽度；保留原内边距，长账户信息继续省略。

- 最新批准：About 宽 400px、内边距 24px、Logo 48px、名称 20px、描述 14px、版本 12px、分区间距 24px；页脚 12px 单行 Built by Lin Gui · Source on GitHub，链接保持用户 X 与项目仓库。

- 最新微调批准：移除 About 分割线；Source on GitHub 整段仍为链接，但只给 GitHub 加下划线。

- 最新批准：账户菜单 About 图标使用原 Lucide Info，保留原尺寸与样式。

### 排除项

不增加下拉、团队切换、收起图标轨道或侧栏菜单功能，不修改品牌源稿，不改变登录、Home返回和offcanvas行为。

## Todo

- [x] 调整 About 比例和单行页脚，并检查类型与 dev 编译。
- [x] 居中 About 内容、替换页脚并调整初始焦点。
- [x] 固定账户菜单宽度为 200px 并检查类型。
- [x] 完成账户目录命名迁移并保留既有状态测试。
- [x] 核对并固定官方来源，调整头部。
- [x] 类型检查、构建并核对变更范围。
- [x] 增加 About 入口与弹窗，并验证类型与构建。
- [x] 记录交付，停在用户验收。

## 验收标准

- Account 账户菜单 Settings 下方 About 可打开和关闭弹窗；版本读取 chrome.runtime.getManifest().version，跟随根产品版本构建，无手写版本或额外权限；底部署名和 GitHub 分别打开 https://x.com/lingui_dev 与 https://github.com/linguio/exts；初始焦点放标题，关闭按钮不再自动获得焦点。
- 头部使用32px既有品牌SVG外形与官方两行文字比例，显示Exts及Ideas into action。
- 品牌区域非交互；Home按钮独立可用，不出现下拉。
- 其余布局、路由与登录行为保持原样。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

- [对应Issue](2026-11-14-extension-studio-brand-header-issue.md)
- 状态：已完成
- 用户验收：通过
- 提交批准：已批准

#### 预期交付边界
按已确认的sidebar-07头部组合调整两行品牌文字，保留独立Home，无下拉。

补充边界：Account 账户菜单 Settings 下方 About 入口、官方 Dialog、动态 Manifest 纯版本号与居中内容；底部作者 X 与项目 GitHub 链接。

#### 实际交付与验证
- Studio 头部采用固定官方来源的两行品牌组合，展示 32px 原有 SVG、Exts 与 Ideas into action，独立 Home 按钮保留；无额外圆角背景容器、全局 Token 或品牌资源变更。
- studio/login 迁为 studio/account：index.tsx、menu.tsx、login-dialog.tsx、login-required.tsx、state.ts、about-dialog.tsx；统一 Dock、Studio、Daily 与既有测试引用。账户菜单固定 200px，名称和邮箱超长省略，About 使用原 Info 图标。
- About 从账户菜单 Settings 下方打开，内容居中；最大宽 400px、内边距 24px、Logo 48px、名称 20px、描述 14px、纯版本号 12px。版本直接读取 Manifest；初始焦点放标题，保留关闭按钮键盘焦点反馈。
- 品牌区与页脚以 24px 留白分隔，无分割线。12px 单行页脚 Built by Lin Gui · Source on GitHub，分别链接用户 X 和项目仓库；Source on 不带下划线，GitHub 带下划线。无新依赖或权限。
- 最后一次代码调整后扩展 typecheck 通过；目录迁移后的状态测试 4 项通过；已有 git diff --check 通过。现有 dev 服务曾确认迁移后模块及更新后的 About 内容可编译。
- 正式 build 曾在早期头部和 About 实现时通过，保留 theme-init.js 非 module 与 chunk 超过 500kB 警告；后续按用户要求使用 dev，最终调整未重跑正式构建或全量测试。代理未执行浏览器视觉与交互验收。

#### 用户验收
用户明确表示“验证通过 commit”，验收通过并批准本地代码与文档两笔提交。验收入口为 dist/dev/chrome-mv3-dev-stable，覆盖品牌头部、账户菜单、目录命名及 About 当前效果；不额外推断逐项测试记录。未推送或发布。

#### 提交边界与完整消息
代码：pages/studio/layout/sidebar.tsx、pages/studio/account/（替代 pages/studio/login/ 与 pages/about/）、pages/dock/account-entry.tsx、pages/studio/index.tsx、pages/studio/layout/content.tsx、features/activity/daily/daily-records.tsx、tests/pages/studio/account/state.test.ts（替代旧 login/account-state.test.ts）、components/custom/ui-icon.tsx、components/custom/types.ts。文档：Issue、Commit记录、工作台、应用AGENTS、UI及官方来源说明。

代码消息：
~~~text
feat(extension): 完善品牌头部并增加 About 弹窗

- 采用双行品牌头部与既有 Logo 外形
- 在账户菜单增加 About 与动态版本、作者 X 和项目源码入口
- 统一账户目录与组件职责命名并同步既有引用
~~~

文档消息：
~~~text
docs(extension): 记录品牌头部与 About 交付

- 固定官方来源并记录获批差异和验证结果
- 同步用户验收与本地提交完成状态
~~~

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 规模：小型
- 批准依据：用户确认采用sidebar-07头部排版，不使用下拉；保留Home按钮，第二行Ideas into action。

### 历史后续事项

用户已明确验证通过并批准本地提交；随代码与文档两笔提交完结，不推送或发布。
