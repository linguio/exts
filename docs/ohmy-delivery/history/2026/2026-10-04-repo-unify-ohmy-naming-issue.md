---
date: "2026-10-04"
scope: [repo, extension, desktop, website]
status: completed
type: task
---

# 统一 OhMy 命名格式

## 当前阶段

已完成。

## 目标与范围

### 背景

仓库已经使用 `ohmy-tabs`、`ohmy-dl` 和 `ohmy-photos` 作为产品路径，但现行展示文本仍混用 `OmyExts` 与 `Oh My XXX`，workspace 根包和 scope 仍使用 `omyexts` 与 `@omyexts`。这些写法不符合已经确认的三种 OhMy 命名格式，需要按使用场合统一。

### 目标

将现行仓库品牌、产品展示名称、workspace 标识和代码标识统一为 `OhMy XXXX`、`ohmy-xxxx`、`OhMyXXXXX` 三种格式，消除活动代码、配置和当前文档中的 `Omy`、`omy` 与 `Oh My` 旧写法。

### 范围

- 对外展示使用 `OhMy Exts`、`OhMy Tabs`、`OhMy DL`、`OhMy Photos`。
- 目录、包、命令、资源和其他 kebab-case 标识使用 `ohmy-xxxx`。
- 类型、模块、Target 和其他连续 PascalCase 标识使用 `OhMyXXXXX`。
- 将根包 `omyexts` 和 workspace scope `@omyexts/*` 迁移为 `ohmy-exts` 和 `@ohmy-exts/*`。
- 同步根脚本、内部依赖、WXT 配置、发布工作流、lockfile、网站和当前有效文档。
- 审查 Bundle Identifier、持久化键、消息、事件、CSS/DOM ID 与发布产物，只修改不符合本次命名规则且已纳入 Spec 的现行标识。
- X Download 只允许发生 workspace scope 的机械性变化，不改变产品名、功能、通信协议或 Helper 边界。

### 排除项

- 不修改历史 Issue、Commit、Spec、Plan、复盘或文章中的事实名称。
- 不重命名本地仓库目录或远端 GitHub 仓库。
- 不修改产品功能、权限、界面设计、数据模型或图标。
- 不升级依赖，不操作远端、Release 或商店后台。
- 不修改 X Download Helper 的 Native Messaging、Bundle、Socket 或运行行为。

## Todo

### Sub-issues

#### 1. 现行名称与 workspace 身份迁移

- 统一对外展示名称、根包名、workspace scope、内部依赖和当前文档。
- 同步 lockfile、构建脚本和发布工作流。

#### 2. 平台与运行时标识审查

- 按 Spec 审查 Apple Bundle Identifier 和现行运行时标识。
- 对可能影响应用身份或既有数据的变化执行明确验证并记录限制。

#### 3. 完整验证与用户验收

- 验证 workspace 依赖图、受影响项目构建、旧标识扫描和受保护边界。
- 停在用户实际验收，不主动提交或进入后续任务。

## 验收标准

- 当前展示文本只使用 `OhMy XXXX`，不再出现活动的 `OmyXXX` 或 `Oh My XXX`。
- 当前 kebab-case 产品和仓库标识只使用 `ohmy-xxxx`，不再出现活动的 `omyexts`、`@omyexts` 或 `omy-xxxx`。
- 当前连续 PascalCase 产品标识只使用 `OhMyXXXXX`，不再出现活动的 `OmyXXXXX`。
- 所有 workspace 包、内部依赖、根命令、工作流和 lockfile 使用一致的新 scope。
- 历史管理文档仍保留当时真实名称；X Download 与 Helper 的受保护业务边界没有发生变化。
- 受影响项目的类型检查、逻辑测试和构建通过；视觉与交互由用户在 Chrome、Edge 或 macOS 中验收。

## 唯一下一步

无。

## 交付记录

### 历史交付记录

#### 元信息

- 工作项：`2026-10-04-repo-unify-ohmy-naming`
- 对应 Issue：[统一 OhMy 命名格式](2026-10-04-repo-unify-ohmy-naming-issue.md)
- 状态：已完成
- 用户验收：已通过
- 最终提交批准：已批准
- 创建日期：2026-10-04
- 最近更新：2026-10-05

#### 预期交付边界

- 将当前展示、kebab-case 和连续 PascalCase 标识统一为三套已确认的 OhMy 格式。
- 迁移根包、workspace scope、内部依赖、lockfile、网站和当前有效文档。
- 保留历史事实名称，不改变产品功能、图标或 X Download/Helper 的业务边界。

#### 实际完成内容

- 根包名、workspace scope、内部依赖、WXT 配置、发布工作流和 lockfile 已统一为 `ohmy-exts` / `@ohmy-exts/*`。
- 对外展示已统一为 `OhMy Exts`、`OhMy Tabs`、`OhMy DL`、`OhMy Photos`；连续 PascalCase 标识保持 `OhMyXXXXX`。
- OhMy Photos Bundle Identifier 已改为 `dev.kevinstack.ohmy-photos`，并同步 XcodeGen 工程。
- 当前架构、WXT、迁移、共享工具、根 README 和官网文档已同步；历史管理文档保持事实名称。

#### 验证结果

- stable-extension-dev：Vitest 7/7 通过。
- OhMy Tabs：Vitest 33/33、TypeScript、WXT build 均通过。
- OhMy DL：TypeScript、WXT build、WXT zip 均通过；Vitest 因 localhost 随机端口绑定失败，固定端口重试后仍失败。
- X Download：Vitest 54/54、TypeScript、WXT build 均通过。
- Website：VitePress build 通过。
- OhMy Photos：XcodeGen、Debug xcodebuild build 通过；构建产物 Bundle Identifier 为 `dev.kevinstack.ohmy-photos`。
- 活动代码、配置和当前文档旧标识扫描无匹配；`git diff --check` 通过；X Download/Helper diff 仅包含已批准的 scope/import 变化。

#### 未验证事项与限制

- `pnpm install --offline` 无输出运行超过 60 秒后停止；未产生 lockfile 版本变化，已将三个 workspace scope 键机械迁移并通过 diff 审查。
- OhMy DL Vitest 受当前环境 localhost 端口绑定限制，未完成逻辑测试验收。
- Xcode 构建出现 CoreSimulator 服务告警，但退出码为 0；未运行 XCTest、真实设备或 Finder/Dock 验收。
- 视觉、交互和扩展实际加载仍需用户在 Chrome、Edge、Website 和 macOS App 中验收。

#### 用户验收

- 结果：已通过。
- 说明：用户于 2026-10-05 明确要求按拆分 Commit 方式完成本地提交，视为验收通过与提交批准。

#### 最终 Commit messages

```text
chore(repo): 迁移 OhMy workspace 包标识
feat(repo): 统一 OhMy 展示名称与应用身份
docs(repo): 同步 OhMy 命名规范与工作台
```

#### 最终提交批准

- 状态：已批准。

## 关联文档

- [Spec](../../../superpowers/specs/2026-10-04-repo-unify-ohmy-naming-design.md)
- [Plan](../../../superpowers/plans/2026-10-04-repo-unify-ohmy-naming.md)

## 历史补充

### 元信息

- 类型：架构任务
- 当前阶段：已交付
- 最近更新：2026-10-04

### 历史后续事项

无；用户已确认按拆分 Commit 方式完成本地提交。
