# 按职责整理扩展模块与共用能力：交付记录

## 对应工作项

- [Issue](../issues/2026-10-28-extension-media-download-structure-issue.md)
- [实施清单](../../superpowers/plans/2026-10-28-extension-media-download-structure.md)

## 实际交付

- 27 份品牌 SVG 从 Newtab 迁入 src/assets/brand，WXT 资源复制与测试同步；BrandIcon 和尺寸类型归 shared/brand。
- BookmarkCard 与基础 Bookmark 类型归 shared/bookmarks；Newtab 保留首页配置、文件夹、布局和打开逻辑，辅助函数归 utils/bookmarks。Dock 与下载记录不再依赖 Newtab 内部组件。
- Dock 和 Studio 的 Hook 归 hooks，历史清理设置界面归 views；Studio 导出 ActivityCard 和 Dock 入口，Newtab 只组合展示；Settings 同步使用所属模块的公开 UI 入口。
- 媒体下载在模块内部按职责组织，功能目录使用 telegram、records 分组；下载执行与目录授权归 download，MAIN 页面、隔离桥接、后台分别有独立入口，存储、协议常量、共用类型与纯辅助函数分别归位。
- 保留并迁移原有行为测试，更新扩展 README、AGENTS 及相关现行功能文档；未改变正式配置、数据格式、权限、SVG 内容或 UI 样式。

## 验证与限制

- pnpm --filter @exts/extension test：15 个文件、77 项测试全部通过。
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过，产物位于根 dist/build/chrome-mv3。
- 27 份 SVG 与迁移前及构建产物逐字节一致；14 个未拆分文件除导入外内容一致，记录处理、媒体保存、目录授权函数主体保持一致；后台产物未包含 React。
- git diff --check 与新增文件空白检查：通过。
- 构建对原有 theme-init.js 非 module script 给出提示，构建成功；本项未改变该脚本接入方式。
- 未执行浏览器视觉、交互、布局、真实文件下载、真实历史清理或远端验收；自动化通过不代表用户验收通过。

## 用户验收

状态：用户于 2026-10-29 明确要求本地提交，按指令批准本项完结；未提供浏览器实测结果，以下验收步骤保留供参考。

1. 在 Chrome／Edge 重新加载根 dist/build/chrome-mv3，刷新已打开的新标签页和 Telegram Web；沿用同一扩展检查既有设置、下载记录未重置。
2. 打开新标签页，检查原有书签顺序、品牌图标、明暗主题、UI 文件夹与 EDU 解锁；Dock 收藏正常打开，Settings 和 Download 抽屉能正常打开、关闭，入口 Tooltip 行为与原来一致。
3. 检查 Home 活动卡片仍显示原 24 周日历且默认 Calendar，切换 Chart 内容为空；Studio 入口正常切换页面。
4. Telegram 图片或视频预览内右键，检查下载菜单；首次快速保存选目录后继续下载、后续快速保存复用目录、另存为不更改目录、重新选择只影响后续保存，同名文件递增避重。
5. 保存成功后出现原成功提示，并在 Download 显示真实文件名与大小；刷新后记录保留，全部／TG／X 筛选和按筛选清空保持原行为，取消不新增成功记录，清空记录不删除文件。
6. 关闭 Media Download 后不再出现新下载入口，已开始任务继续；历史清理偏好和权限保持原状，如验证真实启动／关闭清理，请使用专用浏览器配置文件。

## 文件边界与完整 Commit message

代码提交范围：apps/extension/src 内的资源、shared、六个模块与入口，apps/extension/tests 的现有行为测试引用与资源断言，以及 apps/extension/wxt.config.ts。

```text
refactor(extension): 按职责整理模块与共用书签品牌能力

- 归位品牌资源与共用图标、书签组件和类型
- 整理媒体下载及各模块职责目录并同步入口引用
- 保留原有行为测试并更新资源路径
```

文档提交范围：apps/extension/AGENTS.md、apps/extension/README.md，docs/extension/newtab.md、telegram-download.md、ui.md，本 Issue、Commit 记录、实施清单及 docs/changes/README.md。

```text
docs(extension): 记录模块职责整理与验证结果

- 同步共用能力归属和模块目录说明
- 记录职责迁移验证、限制与用户验收步骤
```

## 最终提交批准

已批准。用户于 2026-10-29 明确要求本地提交，代码与文档按已展示范围分别提交；Issue、Commit 记录和工作台同步为已完成。提交时沿用此前验证，不追加测试、类型检查或构建，浏览器实测限制保持真实；不推送或发布。
