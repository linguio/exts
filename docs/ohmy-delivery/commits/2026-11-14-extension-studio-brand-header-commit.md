# Studio 品牌头部与 About 交付记录

- [对应Issue](../issues/2026-11-14-extension-studio-brand-header-issue.md)
- 状态：已完成
- 用户验收：通过
- 提交批准：已批准

## 预期交付边界
按已确认的sidebar-07头部组合调整两行品牌文字，保留独立Home，无下拉。

补充边界：Account 账户菜单 Settings 下方 About 入口、官方 Dialog、动态 Manifest 纯版本号与居中内容；底部作者 X 与项目 GitHub 链接。

## 实际交付与验证
- Studio 头部采用固定官方来源的两行品牌组合，展示 32px 原有 SVG、Exts 与 Ideas into action，独立 Home 按钮保留；无额外圆角背景容器、全局 Token 或品牌资源变更。
- studio/login 迁为 studio/account：index.tsx、menu.tsx、login-dialog.tsx、login-required.tsx、state.ts、about-dialog.tsx；统一 Dock、Studio、Daily 与既有测试引用。账户菜单固定 200px，名称和邮箱超长省略，About 使用原 Info 图标。
- About 从账户菜单 Settings 下方打开，内容居中；最大宽 400px、内边距 24px、Logo 48px、名称 20px、描述 14px、纯版本号 12px。版本直接读取 Manifest；初始焦点放标题，保留关闭按钮键盘焦点反馈。
- 品牌区与页脚以 24px 留白分隔，无分割线。12px 单行页脚 Built by Lin Gui · Source on GitHub，分别链接用户 X 和项目仓库；Source on 不带下划线，GitHub 带下划线。无新依赖或权限。
- 最后一次代码调整后扩展 typecheck 通过；目录迁移后的状态测试 4 项通过；已有 git diff --check 通过。现有 dev 服务曾确认迁移后模块及更新后的 About 内容可编译。
- 正式 build 曾在早期头部和 About 实现时通过，保留 theme-init.js 非 module 与 chunk 超过 500kB 警告；后续按用户要求使用 dev，最终调整未重跑正式构建或全量测试。代理未执行浏览器视觉与交互验收。

## 用户验收
用户明确表示“验证通过 commit”，验收通过并批准本地代码与文档两笔提交。验收入口为 dist/dev/chrome-mv3-dev-stable，覆盖品牌头部、账户菜单、目录命名及 About 当前效果；不额外推断逐项测试记录。未推送或发布。

## 提交边界与完整消息
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
