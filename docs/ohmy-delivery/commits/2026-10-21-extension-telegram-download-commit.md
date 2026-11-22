# Telegram Download 交付记录

- Issue：[迁入 Telegram Web 下载与统一记录](../issues/2026-10-21-extension-telegram-download-issue.md)
- 状态：已完成（已披露旧包体积门禁失败）
- 用户验收：用户查看交付后明确要求本地提交，按仓库规则视为验收通过；浏览器实测细节未提供
- 最终提交批准：已批准，仅本地，不推送

## 预期交付边界
独立 Telegram Download、Newtab 配置与 Tooltip、只读 Downloads Popup 及本地记录；保留系统另存为，不接 desktop，不迁旧数据。

## 实际交付
- telegram-download 保留 Telegram Web K 媒体右键、另存为与页面流式写文件；默认开启的 Newtab 开关、Tooltip 与跨页面即时生效，关闭不取消已有任务。
- downloads 统一记录视频任务、进度、完成与失败/中断，自动保留 200 条终态；只读 Popup 不提供操作按钮，不迁旧数据，不接 desktop/X。
- extension 的 Token 单独集中于 src/styles/theme.css；Popup 共用 Newtab 主题运行时、字体与组件，网页菜单复用官方 DropdownMenu 与同一 Token。
- 功能、UI 来源、模块约束与用户验收步骤同步到文档。归档目录保持不变。
- 旧 ohmy-dl 消息与废弃清理接口移除；通用任务协议归 downloads，TG 负责来源适配，入口只注册模块；工具栏标题恢复 Exts。

## 验证结果
- 定向配置/下载迁入测试 34 项通过，记录后台与进度节流定向检查 7 项通过。
- 最新模块清理后完整扩展测试：16 个文件、71 项通过（单 worker）；类型检查通过。只移除验证废弃事件名的 1 项测试，原下载行为测试保留。
- 最终 pnpm ext:build 成功，产物位于根 dist/build/chrome-mv3/；Manifest 可解析，Popup/Newtab/后台/内容脚本入口文件存在；git diff --check 通过。
- 旧包体积检查此前失败，修正字体内联并重试一次后停止，没有提高预算。最新构建只读统计 JS gzip 253152 B、CSS gzip 6855 B、字体 1 份 69652 B，JS 相对旧基线增量 140789 B，仍超过 30720 B 上限；没有重复执行已知失败门禁。

## 未验证与限制
- 代理未独立验证 Chrome/Edge 实际加载、媒体取流、保存窗口、菜单/焦点、开关、主题及刷新中断；用户要求先保存提交，不据此宣称实测已通过。
- startIn 不能直接传入固定绝对路径，当前仍从 downloads 建议位置打开，由浏览器决定上次位置；未增加目录句柄授权流程。
- 仍只识别旧版支持的 Telegram Web K 媒体查看器，图片维持原行为、不建视频任务记录，不承诺刷新续传。
- 包体积门禁未通过，需用户决定后续处理；既有 theme-init.js 的经典脚本构建提示仍在，Newtab 与 Popup 均实际生成该脚本，没有放宽 CSP。
- 用户已批准本地提交，不推送、不发布，未运行长期后台服务。按用户最新拆分要求，体积规则与 Skill 各有独立 Issue/Commit 记录，目前均排队；Skill 源已恢复，无提前混入的规则修改。

## 提交拆分与文件边界

三项各对应独立最终提交，不把队列事项实施结果写入 TG 提交：

1. 本 Issue：apps/extension 中的模块、入口、配置与测试，docs/extension 与 docs/web-ui-sources.md 的产品说明，以及本 Issue/Commit 的终态字段和工作台当前项。
2. 体积 Issue：预算脚本/配置、package 命令、WXT 体积 hook、CI 步骤、相关测试与现行规范；具体变更待方案批准。对应 [独立交付记录](./2026-10-21-extension-bundle-report-commit.md)。
3. Skill Issue：skills/workflow-change/SKILL.md 与对应记录；不夹带 TG 或体积代码。对应 [独立交付记录](./2026-10-21-repo-workflow-issue-preview-commit.md)。

两份排队 Issue/Commit 已因本次拆分创建，目前只是建档，尚无独立实施结果。用户已查看文件边界、验证限制及完整消息，明确批准先保存并本地提交；终态随本次提交保存。

## 最终 Commit message
已向用户展示并获本地提交批准：

```text
feat(extension): 迁入 Telegram 下载与统一记录

- 增加默认开启且即时生效的 Telegram Web 下载配置
- 使用只读 Popup 统一展示视频进度和历史状态
- 统一扩展主题 Token 并记录保存位置的能力边界
```
