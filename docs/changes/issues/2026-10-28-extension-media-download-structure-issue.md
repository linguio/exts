# 按职责整理扩展模块与共用能力

## 元信息

- 工作项：2026-10-28-extension-media-download-structure
- 状态：已完成
- 当前阶段：用户于 2026-10-29 明确要求本地提交，代码与文档按两笔提交完结；沿用已有验证，不追加检查，不推送。
- 批准依据：用户确认整理全部 modules，并确认 SVG 归 src/assets、共用组件归 shared，最新要求有真实需要的 utils 等职责一并归位。
- 任务规模：小型行为保持重构；沿用已排队工作项标识，不另建重复 Issue。

## 背景与目标

六个业务模块已有部分职责目录，但 Hook、品牌资源和共用书签仍存在归属混杂。媒体下载原本按 tg-download、records 聚合，需在完整业务模块内进一步明确下载、运行环境、存储和界面边界。

## 范围与设计约束

- 覆盖 dock、history-cleaner、media-download、newtab、settings、studio；按实际职责归位，不强制相同目录和空层级。
- 品牌 SVG 迁入 src/assets/brand，共用图标组件与尺寸类型归 shared/brand；保留 SVG 内容、CSS 类、主题与尺寸表现。
- 共用 BookmarkCard 和基础 Bookmark 类型归 shared/bookmarks；首页文件夹、配置与打开行为留在 Newtab。
- Dock 和 Studio 的 Hook 归 hooks；历史清理设置界面归 views；Studio 明确导出 ActivityCard，Newtab 只组合展示。
- 媒体下载在模块内区分 components、views、download、pages、bridges、background、stores、types、constants、utils；目录内部按 telegram、records 等功能组织。
- download 持有保存与目录授权；utils 承载媒体定位、文件命名、分段读写辅助、记录校验筛选与格式化，不承载配置订阅、权限申请或通信注册。
- 同步入口、资源复制配置和原有行为测试引用，最后统一更新 README、现行模块规范和功能文档中的相关路径。

## 排除项

- 不改变功能、文案、样式、交互、配置键、downloads 数据格式、权限、文件名、目录句柄和下载方式。
- 不接入 X／Helper，不新增全局 Store、通知层、事件总线、依赖或浏览器模拟环境。
- 不修改根 assets/brand 三端源稿，不改 SVG 内容，不新增视觉、焦点、指针或布局测试。
- 不自动提交、推送、发布或执行浏览器视觉与交互验收。

## Todo

- [x] 固定迁移映射与共用能力边界，更新工作项和实施清单。
- [x] 归位品牌资源、共用书签及六个模块的实际职责，同步入口引用。
- [x] 保留并调整原有行为测试，更新现行职责文档和 README。
- [x] 完成一次逻辑测试、类型检查、生产构建和 diff 检查，停在用户验收。

## 验收标准

- Dock 和下载记录不再从 Newtab 内部引用品牌图标或共用书签基础能力；Newtab 通过 Studio 公开入口展示 ActivityCard。
- 现有书签配置与顺序、文件夹解锁、Dock、Settings、Studio 日历、历史清理和 TG 下载行为不变。
- 品牌 SVG 内容不变，构建产物在新路径包含全部资源；正式配置和既有下载数据保持兼容。
- 后台不导入 React 视图，MAIN 与隔离脚本边界不变，目录授权仍在用户手势内调用。
- 扩展逻辑测试、类型检查和生产构建通过；用户在 Chrome／Edge 加载根 dist/build/chrome-mv3 验收界面及交互。

## 关联文档

- [Commit 记录](../commits/2026-10-28-extension-media-download-structure-commit.md)
- [实施清单](../../superpowers/plans/2026-10-28-extension-media-download-structure.md)
- [工作台](../README.md)

## 唯一下一步

本工作项已按用户本地提交指令完结，无待执行开发步骤；浏览器实测限制保留在 Commit 记录中。
