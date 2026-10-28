# 将活动日历迁入 Studio：交付记录

## 对应工作项

- [Issue](../issues/2026-10-27-extension-activity-cards-issue.md)

## 预期交付边界

Studio 按 Newtab 的职责目录组织，ActivityCard 归 components/activity，Home 引用展示；删除模拟数据，迁移并保留日历组件、类型与日期逻辑，图表内容为空。本项不增加活动数据层或完整操作界面。

## 实际交付

- 新增 studio/components/activity/index.tsx，Home 卡片区域改为引入 ActivityCard；Card 尺寸、材质和位置沿用。
- 使用官方 ToggleGroup 和 Tooltip，日历／图表图标通过 UiIcon 静态映射引入，默认日历，组件状态拒绝空选择；日历保留 24 周完整网格并使用空记录状态，只有图表内容为空。
- 删除旧 check-in 路径和两份模拟 JSON；日历格子、日期推进、计算和格式化逻辑迁入 Studio 的 components/types/utils，改用 activity 命名。原 4 项测试迁移保留，并新增空记录日历测试。颜色 Token 改为 --activity-level-*，数值保留。
- 更新当前 UI 规范与应用模块归属规则；未修改 README、Studio 空页面、Dock、Settings、媒体下载或品牌资源。
- 未创建空目录、记录 Store、持久化或订阅；后续按真实功能再增加。

## 验证与限制

- 扩展目录执行 node node_modules/vitest/vitest.mjs run --pool=threads --maxWorkers=1 --no-file-parallelism：15 个文件、77 项通过。
- node node_modules/typescript/bin/tsc --noEmit：通过。
- node node_modules/wxt/bin/wxt.mjs build：通过，产物在根 dist/build/chrome-mv3，Manifest 和页面、后台、主题入口存在。
- git diff --check：通过；旧路径和模拟记录引用清理完成，日历实现已恢复迁移。
- 前轮误删日历已按用户纠正修复，原 4 项测试恢复并迁移，新增 1 项空记录行为覆盖；未新增 UI 或源码结构测试。
- 首次文档 CRLF 匹配与测试工作目录错误均在工具层纠正，未改变正常业务代码；构建仍有既有 theme-init.js 提示，最终产物正常生成。
- 用户自行验收 Chrome/Edge 视觉与交互；README 留到整轮整理最后更新；未提交或推送。

## 用户验收

用户于 2026-10-28 明确表示验证通过并要求本地提交；按已展示代码范围提交，沿用已有验证，不重复测试、类型检查或构建。代理未独立执行的浏览器验收仍如实保留。

## 文件边界与完整 Commit message

- 代码提交：新增 studio/components/activity/index.tsx、Home cards 引用、shared/ui 图标类型与映射、theme.css；将旧 check-in 的日历逻辑与测试迁移至 Studio，删除两份 JSON。仅包含本项实际修改，不纳入其他排队工作。
- 文档提交：本 Issue、Commit 记录、工作台、应用 AGENTS 与当前 UI 规范；应用 AGENTS/UI/工作台包含前项尚未提交内容，最终文档提交时需明确一并展示，当前不暂存。
- 下列完整消息是待审核方案，不表示已经批准 Git 提交。

```text
refactor(extension): 将活动日历迁入工作台

- 首页引用 Studio 活动卡片并提供日历与图表切换
- 保留完整日历和日期逻辑并清空模拟记录
- 按职责迁移活动类型与日历行为测试
```

```text
docs(extension): 记录活动卡片迁移与验收边界

- 同步 Studio 功能归属及空卡片规范
- 记录旧数据清理与自动化验证结果
```

## 最终提交批准

用户于 2026-10-28 明确要求剩余全部提交，覆盖此前暂不提交 Issue 的指示。已批准代码提交保留，本轮将所有剩余规范、Issue、Commit 记录和工作台合并为一笔文档本地提交，随提交完成本工作项；未重复验证，不推送，README 未修改。

## 本轮统一文档提交

文件范围：apps/extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md、docs/changes/README.md，以及 module-boundaries、activity-cards、download-drawer、media-download-structure 四组 Issue／Commit 记录。前三项终态为已完成，media-download-structure 仍为已排队，未实施能力不记为交付。此前单项文档消息仅为历史提交方案，本轮以以下实际统一消息为准：

```text
docs(extension): 完结模块迁移并同步抽屉规范

- 记录导航设置与活动日历迁移及验收结果
- 同步原 Sheet 样式、左侧圆角和关闭反馈规范
- 保存媒体下载内部结构整理的后续工作项
```
