# 删除扩展体积检查交付记录

- Issue：[删除扩展体积统计与门禁](../issues/2026-10-21-extension-bundle-report-issue.md)
- 状态：已完成
- 用户验收：用户明确要求完结，不再追加验证
- 最终提交批准：用户明确要求前序 Issue 全部完结，仅本地提交

## 预期交付边界
删除扩展现有体积统计、预算与字体门禁、专用测试、命令、开发 hook、CI 步骤及现行文档引用。不增加替代报告或全局治理能力；模块只负责自身功能，未来全局需求从 Exts 整体另行完善。保留正常构建、统一发布与产物完整性检查。

## 实际交付
- 删除 bundle-budget.json、scripts/bundle-size.mjs 和 tests/config/bundle-budget.test.mjs。
- 移除 package 体积检查命令、WXT 体积 hook 和统一发布流程的体积检查步骤；稳定产物发布继续使用公共 hook。
- 清理扩展 AGENTS/README、docs/build-release.md、docs/extension/ui.md 和 docs/wxt.md 的活动要求；未修改功能源码、依赖或历史交付事实。
- Issue 与工作台随本地提交同步至已完成；后续 Skill Issue 继续排队。

## 验证结果
- pnpm --filter @exts/extension typecheck：通过。
- pnpm ext:build：通过，产物在根 dist/build/chrome-mv3/。
- Workflow YAML 语法、活动引用搜索及 git diff --check：通过。

## 未验证与限制
- 未修改产品功能，未重跑产品全量测试；未启动 dev/watch、浏览器交互验收或远程 Actions。
- 既有 theme-init.js 经典脚本构建提示仍在，构建成功；WXT 默认文件大小输出保留，不是新增定制体积报告。
- 用户要求直接完结，本轮未重复验证；本地提交包含 Issue、交付记录及工作台完成状态，不推送或发布。

## 最终 Commit message
已展示，按用户完结要求用于本地提交：

```text
chore(extension): 删除扩展体积统计与门禁

- 删除体积预算、统计工具及开发和 CI 调用
- 清理专用测试与现行文档要求
```
