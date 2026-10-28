# 扩展模块职责整理实施清单

**目标：** 整理六个模块与实际共用能力，保持行为、样式与数据不变。
**执行：** 本会话按 executing-plans 串行实施，遵循仓库规则，不启动子代理、不自动提交。
**依据：** [Issue](../../changes/issues/2026-10-28-extension-media-download-structure-issue.md) 中已批准的范围与设计约束。

## 迁移映射

- newtab/assets/brand → src/assets/brand；WXT 和资源完整性测试同步新路径。
- newtab/components/bookmark-icon → shared/brand/brand-icon.tsx；尺寸类型 → shared/brand/types.ts。
- newtab/components/bookmark-card → shared/bookmarks/bookmark-card.tsx；基础 Bookmark → shared/bookmarks/types.ts。
- Newtab 文件夹类型保留 types/bookmarks；tab 和 folder-access 辅助 → utils/bookmarks。
- dock/components/use-dock-sheet-tooltip → dock/hooks/use-dock-sheet-tooltip。
- history-cleaner/settings-section → history-cleaner/views/settings-section；UI 由模块入口导出，后台独立。
- studio/dock-entry → studio/components/dock-entry；use-local-date → studio/hooks/activity；ActivityCard 由模块入口导出。
- media-download/tg-download/components → media-download/components/telegram。
- media-download/tg-download/page/index → pages/telegram；content-bridge → bridges/telegram；events → constants/telegram；media-target → utils/telegram。
- media-download/tg-download/download/save-media、directory-target → download/telegram。
- media-download/tg-download/download/range、filename → utils/telegram；directory-store → stores/telegram/directory。
- media-download/records/views → views/records；其中记录行 → components/records。
- media-download/records/store、index → stores/records/repository、client；background → background/records。
- media-download/records/schema → types/records、constants/records、utils/records/schema 与 format，分别保存类型、协议常量、数据处理和显示格式化。
- 下载中跨文件共用的类型归 types/telegram，单文件内部类型保持就近；设置数据适配入口保持简洁。
- media-download/index 仅导出 UI，worker 和页面脚本直接引用各自环境入口，不经过 UI 聚合。
- Settings 保持 Sheet 与 views 的既有职责，更新引用；其他已合理归位的代码保留。

## 实施步骤

- [x] 更新 Issue、Commit 记录、工作台并展示范围，提醒可切换较低成本模型。
- [x] 移动文件并修正引用，拆分必要共用类型、协议常量与纯辅助函数；移除被替代旧目录。
- [x] 同步现有行为测试引用和资源断言；更新应用 README、AGENTS 与功能文档中受影响的职责及路径。
- [x] 自查跨模块依赖、SVG 内容和运行环境边界；运行一次 pnpm --filter @exts/extension test、typecheck、根 pnpm ext:build、git diff --check。
- [x] 记录实际结果和未验证事项，交付可复现浏览器验收步骤，停在待验收。

## 验证重点与停止点

- 复用既有书签、文件夹、日历、历史清理、下载保存、目录避重与记录测试，不新增实现形式断言或 UI 模拟。
- 资源复制必须与 BrandIcon 地址一致，27 份 SVG 内容保持一致。
- 下载类型使用纯类型导入；后台与隔离桥接不能导入 UI 入口。
- 权限请求、MAIN world、消息名称、存储键与默认值保持不变。
- 浏览器主题、交互、真实历史与真实下载由用户验收，代理不执行这些操作。
