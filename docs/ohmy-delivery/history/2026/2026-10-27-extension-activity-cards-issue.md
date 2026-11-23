---
date: "2026-10-27"
scope: [extension]
status: completed
type: task
---

# 将活动日历迁入 Studio

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

现有 Newtab 打卡卡片读取 JLPT／Workout 的模拟 JSON 并展示 24 周日历。最新批准将日历组件与日期逻辑一并归位 Studio，只删除模拟记录，图表视图留空。此前代理误删日历，现按用户明确纠正恢复。

### 范围

- Studio 沿用 Newtab 按职责组织的方式；components/activity 持有 Card、日历和日期 Hook，types/activity.ts 持有记录与每日格子类型，utils/activity/calendar.ts 持有纯计算。Home 的卡片区域引入 ActivityCard。
- 沿用现有卡片尺寸、材质、首行高度、内边距与官方 ToggleGroup，左侧两个切换项改用 CalendarDays／ChartColumn 图标，默认日历；配套英文 Tooltip 与可访问名称 Calendar／Chart。
- 切换状态使用组件 useState，重复选择当前项不清空选择；Home／Studio 切换沿用现有 React Activity 状态保留，刷新恢复日历。
- 日历视图保留现有 24 周格子、周日开始、未来日期留白、跨日更新及灰阶规则，记录变量初始为空，不导入假数据；只有图表内容留空。Card 不额外复制到 Studio 页面。
- 删除旧 check-in 目录和两份模拟 JSON；其中日历视图、日期推进、计算和格式化逻辑迁入 Studio 并使用 activity 名称，不删除对应行为覆盖。主题灰阶改为 --activity-level-*。

### 排除项

- 不实现录入、活动类型管理、目标配置、圆环或图表，不接入真实记录。
- 不创建活动记录 Store、订阅接口、持久化或跨标签页同步；不预建空 views/types/utils/stores 目录。
- Studio 页面仍保留现有空页面；不调整 Dock、Settings、品牌资源或媒体下载结构，不更新应用 README。
- 不添加布局、截图、样式、焦点、键盘、Tooltip 或切换交互自动化测试，不引入假 DOM；用户负责 Chrome/Edge 验收。
- 不自动提交、推送或开始后续工作。

## Todo

- [x] 将空卡片迁入 Studio，Home 改为引用 ActivityCard。
- [x] 复用官方切换和提示，增加日历／图表的静态图标映射。
- [x] 按用户纠正恢复日历组件、日期逻辑与纯逻辑测试，保留空记录变量；仅删除模拟数据，图表留空。
- [x] 同步现行 UI 规范，执行一次剩余完整测试、类型检查、生产构建与 diff 检查，停在验收。

## 验收标准

- Chrome/Edge 加载根 dist/build/chrome-mv3，新标签页右侧卡片保持现有尺寸、位置、材质；顶部是日历／图表图标，默认选中日历。
- 悬停或聚焦切换项可获得 Calendar／Chart 名称；可正常切换，取消选择不会让两项均为空，选中反馈沿用官方实现。
- 日历视图显示完整最近 24 周网格，已有日期均为无记录灰阶，未来格子留白；无 JLPT／Workout 示例记录。图表视图为空，无占位文字。
- 切换 Studio 再返回 Home 保留所选视图，刷新后恢复日历；Dock、Settings 和下载行为不受影响。
- 日历实现迁入 Studio，旧 check-in 路径与 JSON 已移除；日历行为测试保留并覆盖空记录。逻辑测试、类型检查和构建通过，自动化不代替用户验收。

## 唯一下一步

无。

## 交付记录

### 验证结果与限制

- 日历组件、日期推进和计算逻辑已恢复并迁入 Studio；两份模拟 JSON 不恢复，记录状态为空，只有图表视图留空。灰阶改为 --activity-level-*，保留原数值。
- 15 个测试文件、77 项逻辑测试通过：原 4 项日历测试迁移保留，新增 1 项空记录仍生成完整日历的测试。类型检查与生产构建通过。
- 首次新增测试因待迁移模块不存在失败，恢复后通过。首次全量测试误在仓库根使用 --root 启动，配置中的资源绝对路径受 cwd 影响失败；改在扩展目录执行后全部通过，未修改业务或构建配置规避该问题。
- 构建保留既有 theme-init.js 非 module 脚本提示，最终产物存在。未执行浏览器视觉、布局、焦点或切换交互验收。
- 前轮将空内容错误扩大到日历，已按用户明确纠正修复；之前 72 项结果不作为本轮验收结果。

### 历史交付记录

#### 对应工作项

- [Issue](2026-10-27-extension-activity-cards-issue.md)

#### 预期交付边界

Studio 按 Newtab 的职责目录组织，ActivityCard 归 components/activity，Home 引用展示；删除模拟数据，迁移并保留日历组件、类型与日期逻辑，图表内容为空。本项不增加活动数据层或完整操作界面。

#### 实际交付

- 新增 studio/components/activity/index.tsx，Home 卡片区域改为引入 ActivityCard；Card 尺寸、材质和位置沿用。
- 使用官方 ToggleGroup 和 Tooltip，日历／图表图标通过 UiIcon 静态映射引入，默认日历，组件状态拒绝空选择；日历保留 24 周完整网格并使用空记录状态，只有图表内容为空。
- 删除旧 check-in 路径和两份模拟 JSON；日历格子、日期推进、计算和格式化逻辑迁入 Studio 的 components/types/utils，改用 activity 命名。原 4 项测试迁移保留，并新增空记录日历测试。颜色 Token 改为 --activity-level-*，数值保留。
- 更新当前 UI 规范与应用模块归属规则；未修改 README、Studio 空页面、Dock、Settings、媒体下载或品牌资源。
- 未创建空目录、记录 Store、持久化或订阅；后续按真实功能再增加。

#### 验证与限制

- 扩展目录执行 node node_modules/vitest/vitest.mjs run --pool=threads --maxWorkers=1 --no-file-parallelism：15 个文件、77 项通过。
- node node_modules/typescript/bin/tsc --noEmit：通过。
- node node_modules/wxt/bin/wxt.mjs build：通过，产物在根 dist/build/chrome-mv3，Manifest 和页面、后台、主题入口存在。
- git diff --check：通过；旧路径和模拟记录引用清理完成，日历实现已恢复迁移。
- 前轮误删日历已按用户纠正修复，原 4 项测试恢复并迁移，新增 1 项空记录行为覆盖；未新增 UI 或源码结构测试。
- 首次文档 CRLF 匹配与测试工作目录错误均在工具层纠正，未改变正常业务代码；构建仍有既有 theme-init.js 提示，最终产物正常生成。
- 用户自行验收 Chrome/Edge 视觉与交互；README 留到整轮整理最后更新；未提交或推送。

#### 用户验收

用户于 2026-10-28 明确表示验证通过并要求本地提交；按已展示代码范围提交，沿用已有验证，不重复测试、类型检查或构建。代理未独立执行的浏览器验收仍如实保留。

#### 文件边界与完整 Commit message

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

#### 最终提交批准

用户于 2026-10-28 明确要求剩余全部提交，覆盖此前暂不提交 Issue 的指示。已批准代码提交保留，本轮将所有剩余规范、Issue、Commit 记录和工作台合并为一笔文档本地提交，随提交完成本工作项；未重复验证，不推送，README 未修改。

#### 本轮统一文档提交

文件范围：apps/extension/AGENTS.md、docs/extension/ui.md、docs/web-ui-sources.md、docs/ohmy-delivery/readme.md，以及 module-boundaries、activity-cards、download-drawer、media-download-structure 四组 Issue／Commit 记录。前三项终态为已完成，media-download-structure 仍为已排队，未实施能力不记为交付。此前单项文档消息仅为历史提交方案，本轮以以下实际统一消息为准：

```text
docs(extension): 完结模块迁移并同步抽屉规范

- 记录导航设置与活动日历迁移及验收结果
- 同步原 Sheet 样式、左侧圆角和关闭反馈规范
- 保存媒体下载内部结构整理的后续工作项
```

## 关联文档

- [前项模块迁移](2026-10-28-extension-module-boundaries-issue.md)
- [工作台](../../readme.md)

## 历史补充

### 元信息

- 当前阶段：代码已独立提交、用户验收通过；用户最新要求剩余全部本地提交，本轮随统一文档提交完结，沿用已有结果，不追加验证或推送。
- 批准范围：Activity Card 完整归 Studio，Home 引用展示；删除旧模拟数据，保留并迁移完整日历、日期逻辑及日历／图表图标切换；只有图表内容留空。
- 任务规模：小型任务，实施步骤记录在本 Issue，不创建空的 Store、类型或工具目录。
- 顺序说明：前项代码已提交、用户验收通过，文档按用户要求暂不提交；用户随后明确要求开始本项，本次按最新指示切换唯一活动 Issue，前项文档仍待提交。

### 后续讨论，非本项实施范围

后续再确认学习／运动／编程类型、录入与完结规则、目标配置、日历／图表统计、颜色等级和持久化。此前草稿中的 Todo、圆环与时长示例均不作为本项已批准功能；不保留旧模拟数据等待后续使用。

### 历史后续事项

本项完成。后续工作按工作台队列和明确批准范围推进，README 按用户要求留到整轮整理最后更新，不自动实施排队功能或推送。
