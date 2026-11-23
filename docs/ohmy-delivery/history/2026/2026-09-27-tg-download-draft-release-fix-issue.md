---
date: "2026-09-27"
scope: [build, extension]
status: completed
type: bug
---

# 修复 TG Download 草稿发布工作流运行失败

## 当前阶段

已完成。

## 目标与范围

### 背景

TG Download 发布工作流在版本未升级时会跳过依赖安装，但 `setup-node` 仍配置了 pnpm 缓存，任务收尾阶段因 pnpm store 不存在而失败。同时，旧版 `pnpm/action-setup` 触发 Node 20 弃用警告；真正发布路径的 ZIP 校验脚本还存在 Node 参数偏移问题。

### 目标

让版本未升级的工作流正常跳过并成功结束，消除 Action Node 20 运行时警告，并确保手动发布路径可以正确读取 ZIP 内的 Manifest。

### 范围

- 升级 `pnpm/action-setup` 到支持 Node 24 的精确版本，并保持 pnpm 版本为 `12.4.2`。
- 移除不适用于跳过路径的 `setup-node` pnpm 缓存配置。
- 修正 ZIP 校验脚本读取 Node 参数的偏移。
- 补充针对版本不发布路径、Action 版本和 ZIP 校验参数的验证记录。

### 排除项

- 不改变版本比较、Tag、草稿 Release、ZIP 命名或发布权限设计。
- 不修改扩展业务逻辑、Manifest 权限、商店发布流程或其他项目工作流。
- 不在本地伪造 GitHub Actions、Tag 或 Release 的真实运行结果。

## Todo

- [x] 修正工作流缓存配置、pnpm Action 版本和 ZIP 校验参数。
- [x] 验证 YAML、版本未升级路径和 ZIP Manifest 校验路径。
- [x] 用户已验收修复结果并批准创建本地 Git Commit、合并到 `main`。

## 验收标准

- TG Download 版本未升级时，工作流跳过安装、检查、打包和 Release 操作，并以成功状态结束，不再出现 pnpm store 缓存路径错误。
- 工作流不再使用声明 Node 20 的 `pnpm/action-setup` 版本。
- ZIP 校验脚本读取到正确的 Manifest 路径和期望版本，不再把 `-` 当作文件路径。
- 版本升级和手动触发的原有 Tag、草稿 Release 与 ZIP 流程保持不变。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-09-27-tg-download-draft-release-fix`
- 对应 Issue：[修复 TG Download 草稿发布工作流运行失败](2026-09-27-tg-download-draft-release-fix-issue.md)
- 状态：已完成
- 用户验收：已通过（用户明确要求提交到本地并合并到 `main`）
- 最终提交批准：已批准
- 创建日期：2026-09-27
- 最近更新：2026-09-27

#### 预期交付边界

- 修复版本未升级时 pnpm 缓存收尾导致的工作流失败。
- 升级 pnpm Action 的 Node 运行时并修正 ZIP 校验脚本参数。
- 保持原有版本发布和草稿 Release 行为不变。

#### 实际完成内容

- 将 `pnpm/action-setup` 升级到 `v6.1.0`，继续使用精确的 pnpm `12.4.2`。
- 移除 `actions/setup-node` 的 `cache: pnpm`，避免版本未升级跳过安装时在收尾阶段保存不存在的 store。
- 修正 ZIP 校验脚本的 `process.argv.slice(2)` 参数读取。

#### 验证结果

- 旧配置的缓存检查和 ZIP 参数检查均按预期失败，修复后均通过。
- 工作流 YAML 可由 Ruby 解析，Action 版本、Node 版本、缓存配置和参数偏移检查通过。
- `git diff --check` 通过。

#### 未验证事项与限制

- 尚未重新运行 GitHub Actions；真实 runner 的跳过路径和 Node 24 Action 日志需推送后验证。
- 尚未执行版本升级后的真实 Tag、草稿 Release 和 Chrome/Edge 加载验收。

#### 用户验收

- 结果：已通过
- 说明：用户明确要求提交到本地并合并到 `main`。

#### 最终 Commit message

`ci(tg-download): 修复草稿发布工作流失败`

#### 最终提交批准

- 状态：已批准
- 说明：用户批准创建本地 Git Commit 并合并到本地 `main`；不推送远端。

## 关联文档

无独立关联文档。

## 历史补充

### 元信息

- 类型：构建与发布流程修复
- 当前阶段：已完成；本地验证通过，真实 GitHub Actions 复跑需在本地合并结果推送后执行
- 最近更新：2026-09-27

### 历史后续事项

### 唯一下步

无。推送本地 `main` 后重新运行 GitHub Actions，确认跳过路径和真实发布路径。
