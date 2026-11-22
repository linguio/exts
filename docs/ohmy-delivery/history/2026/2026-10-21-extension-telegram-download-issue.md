---
date: "2026-10-21"
scope: extension
status: completed
type: feature
---

# 迁入 Telegram Web 下载与统一记录

## 当前阶段

已完成。

## 目标与范围

### 背景与目标

将归档 ohmy-dl 的 Telegram Web 图片、视频右键下载迁入 Exts，保留页面取流、系统另存为与流式写文件。Newtab Settings 统一提供功能配置，Popup 只展示下载状态。

### 范围

- 独立 telegram-download 模块，默认开启；Settings Features 中同名开关及 Tooltip。关闭立即关闭菜单、禁止新任务，已有任务继续；重新开启无需刷新。
- 配置共用读写、默认值与变更订阅；不顺带改造历史清理。
- 独立 downloads 记录模块；本次记录现有视频任务，图片维持既有下载行为。Popup 标题 Downloads，标明 Telegram 来源，只展示文件名、进度和结果。
- 最近 200 条终态记录自动保留，活动任务不淘汰；重复下载为独立任务，重名由另存为处理。
- Popup 复用 extension 全局 Token、字体、官方组件与 Light/Dark/System 偏好，随 Newtab 设置和系统主题同步，不保留旧独立样式。Token 归整个 extension 所有，Newtab 只是使用方；网页下载菜单也复用现有组件与 Token。
- 2026-10-21 用户补充：参照 Newtab 以全新内部模块融入 Exts。删除迁入目录中的旧 ohmy-dl 消息/清理接口及对应废弃测试；通用记录协议归 downloads，TG 适配负责页面来源验证，WXT 入口只注册模块；工具栏品牌恢复 Exts。保留 Exts 产品统一发布工作流，不创建 TG 独立 package/版本/发布；归档源码不在本次删除范围。旧全局包体积门禁暂不修改。
- 用户最新要求再拆两个主 Issue：全局体积检查与 workflow-change 分别独立建档、排队及提交，不再混入 TG 实际交付。三份 Issue 分别对应同名前缀 Commit 记录；用户已明确批准 TG 本地提交；后两项仍排队。
- 刷新、关闭页面或重启浏览器后，未结束任务如实标记中断；不提供续传。
- 核对另存为默认定位 ~/Downloads/Exts Downloads/Telegram/ 的可行性与限制；不改变保存机制。

### 排除项

desktop、X 实现、旧数据兼容或迁移、目录授权新流程、免另存为、取消/重试/清理/打开目录按钮、归档项目删除、推送或发布。

## Todo

- [x] 建立独立配置与下载记录，保留和调整既有纯逻辑测试。
- [x] 迁入 Telegram 图片/视频取流、右键下载、状态桥接及即时开关。
- [x] 接入 Newtab Features 与只读 Popup，复用主题和官方组件。
- [x] 完成旧协议/清理接口移除、统一记录边界、薄入口及 Exts 工具栏品牌核对。
- [x] 已执行逻辑测试、类型检查、构建与包体积检查并记录目录限制；旧预算失败已披露，用户批准先保存并本地提交。
- [x] 提供 Chrome/Edge 加载路径与可复现验收步骤，停在待验收。

## 验收标准

默认开启时仅 Telegram Web 的图片/视频支持 Exts 右键下载。系统另存为可取消、可保存；视频完成以文件关闭成功为准，Popup 关闭不影响任务，重开显示记录。开关关闭后不拦截右键、不能新建任务，已有下载继续；跨 Newtab 页面同步。只读 Popup 无操作按钮，终态记录限制与中断标记符合上述规则。代理不执行视觉或交互验收。

## 唯一下一步

无。

## 交付记录

### 阶段结果与停止点

- 清理后的全量扩展逻辑测试 16 文件 / 71 项通过（移除 1 项仅验证旧消息名的废弃测试）；最终类型检查、生产构建、Manifest 品牌及入口文件存在性检查、git diff --check 通过。
- 首轮 Vitest 因沙箱 spawn EPERM 未运行，停止后使用获准的单 worker 执行；没有并行任务或浏览器交互验收。
- 包体积门禁未通过：最初 JS gzip 增量 280708 B，修正内容脚本字体内联后为 140714 B，仍超过现有 30720 B 上限；字体仍为单文件 69652 B。剩余主因是网页菜单独立打包 React 与官方 UI 运行时。保留原预算，已停止优化与重试；不能宣称全部验证通过；用户知情批准先保存并本地提交。
- 模块清理后的只读统计为 JS gzip 253152 B、CSS gzip 6855 B、字体 1 份 69652 B、总产物 1506447 B；JS 相对原基线增量 140789 B。未重复失败门禁，超限条件仍在。
- 最新实现不再含 ohmy-dl 消息、清理接口及反向协议依赖；WXT 入口只注册模块，构建 Manifest name/action.default_title 均为 Exts，无 TG 独立包或发布工作流。
- 固定目录结论：现有 API 不接受任意绝对路径；保持 startIn: downloads 与固定 picker id，不增加目录授权或 desktop 流程。实际系统窗口及上次目录记忆由用户验收。
- 构建产物：根 dist/build/chrome-mv3/，未更新开发稳定目录，未启动 dev/watch。
- 体积检查与 Skill 改进按最新指令分别移入队列，文档建档变化与 TG 产品代码分组展示，不在 TG 最终 Commit 中认领其实施结果。

### 历史交付记录

- Issue：[迁入 Telegram Web 下载与统一记录](2026-10-21-extension-telegram-download-issue.md)
- 状态：已完成（已披露旧包体积门禁失败）
- 用户验收：用户查看交付后明确要求本地提交，按仓库规则视为验收通过；浏览器实测细节未提供
- 最终提交批准：已批准，仅本地，不推送

#### 预期交付边界
独立 Telegram Download、Newtab 配置与 Tooltip、只读 Downloads Popup 及本地记录；保留系统另存为，不接 desktop，不迁旧数据。

#### 实际交付
- telegram-download 保留 Telegram Web K 媒体右键、另存为与页面流式写文件；默认开启的 Newtab 开关、Tooltip 与跨页面即时生效，关闭不取消已有任务。
- downloads 统一记录视频任务、进度、完成与失败/中断，自动保留 200 条终态；只读 Popup 不提供操作按钮，不迁旧数据，不接 desktop/X。
- extension 的 Token 单独集中于 src/styles/theme.css；Popup 共用 Newtab 主题运行时、字体与组件，网页菜单复用官方 DropdownMenu 与同一 Token。
- 功能、UI 来源、模块约束与用户验收步骤同步到文档。归档目录保持不变。
- 旧 ohmy-dl 消息与废弃清理接口移除；通用任务协议归 downloads，TG 负责来源适配，入口只注册模块；工具栏标题恢复 Exts。

#### 验证结果
- 定向配置/下载迁入测试 34 项通过，记录后台与进度节流定向检查 7 项通过。
- 最新模块清理后完整扩展测试：16 个文件、71 项通过（单 worker）；类型检查通过。只移除验证废弃事件名的 1 项测试，原下载行为测试保留。
- 最终 pnpm ext:build 成功，产物位于根 dist/build/chrome-mv3/；Manifest 可解析，Popup/Newtab/后台/内容脚本入口文件存在；git diff --check 通过。
- 旧包体积检查此前失败，修正字体内联并重试一次后停止，没有提高预算。最新构建只读统计 JS gzip 253152 B、CSS gzip 6855 B、字体 1 份 69652 B，JS 相对旧基线增量 140789 B，仍超过 30720 B 上限；没有重复执行已知失败门禁。

#### 未验证与限制
- 代理未独立验证 Chrome/Edge 实际加载、媒体取流、保存窗口、菜单/焦点、开关、主题及刷新中断；用户要求先保存提交，不据此宣称实测已通过。
- startIn 不能直接传入固定绝对路径，当前仍从 downloads 建议位置打开，由浏览器决定上次位置；未增加目录句柄授权流程。
- 仍只识别旧版支持的 Telegram Web K 媒体查看器，图片维持原行为、不建视频任务记录，不承诺刷新续传。
- 包体积门禁未通过，需用户决定后续处理；既有 theme-init.js 的经典脚本构建提示仍在，Newtab 与 Popup 均实际生成该脚本，没有放宽 CSP。
- 用户已批准本地提交，不推送、不发布，未运行长期后台服务。按用户最新拆分要求，体积规则与 Skill 各有独立 Issue/Commit 记录，目前均排队；Skill 源已恢复，无提前混入的规则修改。

#### 提交拆分与文件边界

三项各对应独立最终提交，不把队列事项实施结果写入 TG 提交：

1. 本 Issue：apps/extension 中的模块、入口、配置与测试，docs/extension 与 docs/web-ui-sources.md 的产品说明，以及本 Issue/Commit 的终态字段和工作台当前项。
2. 体积 Issue：预算脚本/配置、package 命令、WXT 体积 hook、CI 步骤、相关测试与现行规范；具体变更待方案批准。对应 [独立交付记录](2026-10-21-extension-bundle-report-issue.md#交付记录)。
3. Skill Issue：skills/workflow-change/SKILL.md 与对应记录；不夹带 TG 或体积代码。对应 [独立交付记录](2026-10-21-repo-workflow-issue-preview-issue.md#交付记录)。

两份排队 Issue/Commit 已因本次拆分创建，目前只是建档，尚无独立实施结果。用户已查看文件边界、验证限制及完整消息，明确批准先保存并本地提交；终态随本次提交保存。

#### 最终 Commit message
已向用户展示并获本地提交批准：

```text
feat(extension): 迁入 Telegram 下载与统一记录

- 增加默认开启且即时生效的 Telegram Web 下载配置
- 使用只读 Popup 统一展示视频进度和历史状态
- 统一扩展主题 Token 并记录保存位置的能力边界
```

## 关联文档

- [扩展功能文档](../../../extension/README.md)
- [后续体积规则](2026-10-21-extension-bundle-report-issue.md)
- [后续 Skill 展示规则](2026-10-21-repo-workflow-issue-preview-issue.md)

## 历史补充

### 元信息

- 日期：2026-10-21
- 规模：小型；迁入既有功能，增加配置与本地记录，不改下载协议
- 用户批准：2026-10-21 明确要求开始

### 历史后续事项

本地提交保存；后续按工作台队列处理体积规则与 Skill，不推送。
