---
date: "2026-09-26"
scope: [build, extension]
status: completed
type: task
---

# 收敛 TG Download 与根目录命令职责

## 当前阶段

已完成。

## 目标与范围

### 背景

根目录目前同时提供各项目的开发和构建快捷命令，项目自身也保留了相同职责的脚本，导致命令入口重复。TG Download 还没有统一的检查和发布包命令。

### 目标

让根目录只承担跨项目开发入口，TG Download 在项目目录内提供职责清晰且最少的日常命令，为后续 GitHub Release 自动化保留可复现的项目级打包入口。

### 范围

- 根目录保留 `dev:all` 及各项目的 `*:dev` 快捷命令。
- 根目录移除各项目的 `build` 快捷命令。
- TG Download 保留 `dev`、`build`、`postinstall`，增加 `check` 和 `package`。
- `check` 串行执行 TypeScript 类型检查与 Vitest 测试。
- `package` 调用 WXT 生成生产发布包。
- 更新本 Issue、Commit 记录和工作台当前 Issue 状态。

### 排除项

- 不修改 X Download Helper 的脚本、Xcode 工程或验证流程。
- 不修改 VitePress 项目脚本或网站内容。
- 不创建 GitHub Actions、Tag、Release 或插件市场发布流程。
- 不修改扩展业务代码、Manifest 权限、版本号或测试用例。
- 不删除 WXT `postinstall` 生命周期脚本。

## Todo

- [x] 更新根目录脚本，只保留开发入口。
- [x] 更新 TG Download 项目脚本，增加 `check` 与 `package`。
- [x] 检查 JSON、脚本映射和文档状态，完成必要的自动化验证。
- [x] 用户验收通过并创建本地 Git Commit。

## 验收标准

- 根目录只剩开发相关脚本，不再提供 `tabs:build`、`tg:build`、`x:build`、`x-helper:build` 或 `vitepress:build`。
- TG Download 项目提供 `dev`、`check`、`build`、`package` 和 `postinstall`。
- `postinstall` 仍执行 `wxt prepare`，安装依赖后可生成 WXT TypeScript 配置。
- `check` 的命令链包含 `tsc --noEmit` 和 `vitest run`。
- `package` 的命令为 `wxt zip`，不新增商店发布命令。
- 不涉及 Helper、VitePress 和业务代码变更。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-26-tg-download-command-scope`
- 对应 Issue：[收敛 TG Download 与根目录命令职责](2026-09-26-tg-download-command-scope-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已批准
- 创建日期：2026-09-26
- 最近更新：2026-09-26

#### 预期交付边界

- 根目录只保留各项目开发入口。
- TG Download 提供 `dev`、`check`、`build`、`package` 和 `postinstall`。
- 不修改 Helper、VitePress、扩展业务代码和发布 workflow。

#### 实际完成内容

- 根目录移除各项目构建快捷命令，仅保留跨项目开发入口。
- TG Download 脚本收敛为 `dev`、`check`、`build`、`package` 和 `postinstall`。
- 保留 `postinstall: wxt prepare`，新增 `check: tsc --noEmit && vitest run` 与 `package: wxt zip`。

#### 验证结果

- 两个 `package.json` 通过 JSON 解析检查。
- 根目录与 TG Download 脚本契约检查通过。
- TG Download TypeScript 检查通过。
- TG Download `wxt build` 通过，`dist/chrome-mv3/manifest.json` 与稳定产物 manifest 均存在。
- TG Download `wxt zip` 通过，生成 `dist/my-extensionstg-download-1.0.0-chrome.zip`。
- `git diff --check` 通过。

#### 未验证事项与限制

- 通过 `pnpm --filter @my-extensions/tg-download check` 启动时无输出并被终止；直接运行项目可执行文件时，TypeScript 检查通过，但 Vitest 因当前环境无法为 localhost 获取随机端口而在启动阶段失败。这是环境限制，不是本次脚本调整引入的业务失败。
- 未进行 Chrome/Edge 加载和视觉交互验收，等待用户按仓库规范实际验收。
- 未创建 GitHub Actions、Tag、Release，也未推送远端。

#### 用户验收

- 结果：通过
- 说明：用户明确要求“提交”，按仓库规范视为验收通过并批准本地 Git Commit。

#### 最终 Commit message

`chore(tg-download): 收敛项目与根目录命令职责`

#### 最终提交批准

- 状态：已批准并已提交
- 说明：仅提交本 Issue、Commit 记录、工作台状态及命令配置变更；未推送远端。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 类型：小型任务
- 当前阶段：用户已验收并完成本地 Git Commit
- 最近更新：2026-09-26

### 历史后续事项

### 唯一下步

当前交付已完成；后续如需 GitHub Release 自动化，另行创建新的 Issue。
