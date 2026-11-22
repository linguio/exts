# 完善 Studio 品牌头部与 About

## 元信息
- 工作项：2026-11-14-extension-studio-brand-header
- 状态：已完成
- 规模：小型
- 批准依据：用户确认采用sidebar-07头部排版，不使用下拉；保留Home按钮，第二行Ideas into action。

## 背景与目标
将现有单行品牌头部调整为指定官方两行品牌布局。

## 范围
复用官方SidebarMenuButton lg、32px品牌图标和两行文字组合；品牌使用既有Exts资源，名称Exts，说明Ideas into action；右侧独立Home按钮沿用现有实现。移除旧品牌行padding覆盖，使用官方组合。

- 用户验收修正：移除新增的rounded-lg背景容器（全局16px圆角会将32px容器变圆），直接使用32px既有Exts Logo，保留SVG自带外形。

- 补充批准：Account 账户菜单 Settings 下方增加 About 入口，使用现有官方 DropdownMenuItem 与 Dialog；展示既有 Logo、Exts、Ideas into action、动态 Manifest 版本，内容居中、版本只显示数字；底部使用 Built by Lin Gui · Source on GitHub，分别链接用户 X 与项目仓库，替代 Website / Changelog；合并本 Issue，不另建工作项。

- 补充批准：studio/login 改为 studio/account；采用 index.tsx、menu.tsx、login-dialog.tsx、login-required.tsx、state.ts 命名；About 迁入 about-dialog.tsx，导出 LoginDialog / LoginRequired，其余组件名称保留；同步源码、既有测试与现行文档引用，不改变行为。

- 补充批准：Dock 与 Studio 账户菜单统一固定 200px，不再跟随触发按钮或内容宽度；保留原内边距，长账户信息继续省略。

- 最新批准：About 宽 400px、内边距 24px、Logo 48px、名称 20px、描述 14px、版本 12px、分区间距 24px；页脚 12px 单行 Built by Lin Gui · Source on GitHub，链接保持用户 X 与项目仓库。

- 最新微调批准：移除 About 分割线；Source on GitHub 整段仍为链接，但只给 GitHub 加下划线。

- 最新批准：账户菜单 About 图标使用原 Lucide Info，保留原尺寸与样式。

## 排除项
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

## 关联文档
- [Commit记录](../commits/2026-11-14-extension-studio-brand-header-commit.md)

## 唯一下一步
用户已明确验证通过并批准本地提交；随代码与文档两笔提交完结，不推送或发布。
