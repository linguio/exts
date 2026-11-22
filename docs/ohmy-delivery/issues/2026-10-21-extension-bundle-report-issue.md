# 删除扩展体积统计与门禁

## 元信息
- 日期：2026-10-21
- 项目：extension
- 状态：已完成
- 规模：小型，移除现有体积检查工具及调用
- 批准边界：用户已明确将目标改为删除体积统计与门禁；用户随后明确要求开始，按既定删除范围实施

## 背景
现有体积检查包含历史增量预算、字体限制、统计脚本及开发和 CI 调用。用户明确表示这些不适合当前项目，不需要改造成新的报告工具。模块只负责自身功能；未来如需体积或其他全局治理，由用户从 Exts 整体另行完善。

## 目标
删除现有扩展体积统计与门禁及其活动引用，不保留定制报告、字体限制或替代门禁，不在功能模块中承担 Exts 全局治理。

## 范围
- 删除 bundle-budget.json、bundle-size.mjs 及仅服务于该工具的测试。
- 删除 package 体积检查命令、WXT 体积提示 hook 和 Exts 发布流程中的体积门禁步骤。
- 清理 AGENTS、README 和当前构建文档中的对应要求及活动引用；具体文件以实施时引用核对为准。

## 排除项
不新增体积报告、预算、字体限制、替代检查或 Exts 全局治理框架；不改下载业务，不做依赖升级或性能优化，不移除 Exts 统一发布流程、正常构建和产物完整性检查，不删除构建工具自身默认输出的大小信息，不重写历史交付文档。

## 对照检查结果
- Newtab 的模块源码只包含书签、标签组、设置组合和资源等功能实现，没有体积预算、统计脚本或 CI 治理。Telegram Download、Downloads 的模块源码中也未发现这套体积工具。
- 现有体积检查实际位于扩展构建层：`apps/extension/bundle-budget.json`、`scripts/bundle-size.mjs`、`tests/config/bundle-budget.test.mjs`、`package.json` 的 `check:bundle-size`、`wxt.config.ts` 的体积 hook，以及 `.github/workflows/exts-deploy.yml` 的 `Check bundle budget` 步骤；删除时须一并处理，不能只清理 Telegram 目录。
- 活动文档引用已确认在 `apps/extension/AGENTS.md`、`apps/extension/README.md`、`docs/extension/ui.md`、`docs/build-release.md`。AGENTS 的 Newtab 验收段仍要求体积门禁，须同步去除该要求。
- Telegram 的 `task-reporter.ts` 发送下载进度，Downloads 保存 Popup 使用的任务状态；这些是已批准功能所需的数据，不是包体积统计或全局治理，保留其行为。

## Todo
- [x] 展示本 Issue 的删除范围并核对现有工具及调用点。
- [x] 删除体积预算、统计脚本、专用测试、命令和开发 hook。
- [x] 删除 CI 体积门禁并同步当前规范和文档，保留正常构建与发布流程。
- [x] 检查活动引用、配置和 diff；仅在相关配置变化确需验证时执行必要检查，不为删除工具重跑产品全量测试。
- [x] 展示改动、检查与候选消息，停在验收和提交批准。

## 阶段结果
- 已删除预算文件、统计脚本和专用测试，移除 package 命令、开发体积 hook 和 CI 门禁；稳定产物 hook 直接沿用原公共工具。
- 已同步扩展 AGENTS/README、构建规范、UI 文档和 docs/wxt.md；活动目录搜索无体积工具引用。历史 Issue 与交付文档保持原记录。
- 类型检查、生产构建、Workflow YAML 语法和 git diff --check 通过。未修改功能源码或依赖，未重跑产品全量测试。
- 产物在根 dist/build/chrome-mv3/；构建仍有既有 theme-init.js 经典脚本提示，构建成功。未启动 dev/watch，未实测浏览器或远程 Actions。
- 用户检查删除列表、WXT 中保留的稳定目录 hook 与 CI 中保留的构建发布步骤；无替代体积报告或门禁。用户明确要求完结，不再追加验证。

## 验收标准
现有定制体积统计、历史增量预算和字体限制及调用全部移除，活动配置与文档无废弃引用；开发和 CI 不再执行这套检查。正常构建、Exts 统一发布与产物完整性检查保留。没有新增报告工具或将全局治理放入功能模块；历史交付记录保留当时事实。

## 关联文档
- [Commit 记录](../commits/2026-10-21-extension-bundle-report-commit.md)
- [TG 当前 Issue](./2026-10-21-extension-telegram-download-issue.md)
- [构建与分发](../../build-release.md)

## 唯一下一步
本项按用户要求本地提交完结，不推送；后续全局治理需求另行提出。
