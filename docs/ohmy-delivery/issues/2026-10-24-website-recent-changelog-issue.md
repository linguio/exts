# 整理近期扩展更新并更新官网日志

## 元信息
- 状态：已完成
- 创建日期：2026-10-24
- 完成日期：2026-10-25
- 项目：website
- 当前阶段：用户明确批准本地提交并完结

## 背景
官网最新 Extension 日志是 2026-10-22「完善 Newtab 布局与学习日历」，对应 1.4.0。其后已有新的本地交付，需要整理为用户可读的 Changelog，避免重复记录已公开的内容或把内部重构当作新增功能。

## 目标
将上次官网更新之后的扩展变化整理为准确、简洁的日志，供用户确认后更新到官网。

## 范围
- 更新 apps/website/src/features/changelog/changelog-data.ts，按现有格式新增一条 Extension 日志，保持三点简述。
- 保留已确认的历史日志标题、日期、文案、顺序与链接。
- 用户已确认产品版本升级到 1.5.0，修改根 package.json 唯一版本源；日志交付日期使用本次恢复工作的 2026-10-25，附 v1.5.0 固定版本扩展附件链接，不创建 Release 或声称附件已发布。

## 排除项
不修改产品介绍、首页、扩展功能或图标；不发布、部署、触发工作流、创建 Release、提交或推送。不将文案整理视为真实浏览器或文件保存验收。

## Changelog 文案
标题：完善 Telegram 下载体验。平台：Extension；版本：1.5.0；日期：2026-10-25。

- 优化 TG 下载操作，支持快速保存、文件另存为和保存文件夹选择。
- 新增下载记录，支持查看文件名与大小、按来源筛选和清空记录。
- 规范操作提示，统一提示文案、状态图标与显示位置。

仅记录这三点，不扩写日历、书签或尚未接入的下载能力。滚动条仅只读调研官方 Scroll Area，本工作项不修改扩展滚动条。

## Todo
- [x] 对照最新官网日志、近期提交与交付记录，整理增量和功能边界。
- [x] 按用户确认将根产品版本升级为 1.5.0，并验证版本读取。
- [x] 按用户恢复工作指令确定单条三点日志与 1.5.0 版本附件安排。
- [x] 更新官网日志，保留历史条目。
- [x] 执行官网必要验证，记录结果并交由用户验收。

## 验收标准
- 新日志覆盖确认后的近期用户可观察更新，不重复新增已有 1.4.0 内容。
- 不宣称真实打卡录入、X 下载、Desktop 下载、打开文件夹或历史下载补录已完成。
- 日期和版本均有用户确认依据；如附下载链接，其版本、标签与目标地址一致。
- 历史日志保持原文和顺序；官网相关测试、类型检查与构建结果如实记录。
- 官网页面视觉与链接由用户验收，自动化验证不代替实际验收。

## 关联文档
- [Commit 记录](../commits/2026-10-24-website-recent-changelog-commit.md)
- [TG 保存交付](../commits/2026-10-23-extension-telegram-directory-save-commit.md)
- [TG 按钮组最终交付](../commits/2026-10-24-extension-telegram-browser-save-commit.md)
- [Download 交付](../commits/2026-10-24-extension-download-panel-design-commit.md)
- [Workout 交付](../commits/2026-10-22-extension-workout-check-in-commit.md)
- [Newtab 居中交付](../commits/2026-10-23-extension-newtab-content-centering-commit.md)
- [打卡布局交付](../commits/2026-10-24-extension-check-in-header-commit.md)
- [提示与抽屉交付](../commits/2026-10-24-extension-shared-feedback-sheet-commit.md)
- [书签交付](../commits/2026-10-24-extension-shadcn-bookmarks-commit.md)

## 唯一下一步
本工作项已获本地提交批准，无后续实施步骤；不推送、部署或发布。
